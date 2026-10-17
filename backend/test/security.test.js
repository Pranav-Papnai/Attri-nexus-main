// Regression tests for every finding in SECURITY_AUDIT_REPORT.md that is
// fixable in code. Runs against an in-memory MongoDB like api.test.js.
import test, { before, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;
let server;
let base;
let models;
let totp;

const SUPER_EMAIL = 'super@attri.test';
const SUPER_PASSWORD = 'super-secret-password-1';
const COMMERCIAL_EMAIL = 'commercial@attri.test';
const COMMERCIAL_PASSWORD = 'commercial-password-1';

const api = async (path, options = {}) => {
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body, headers: res.headers };
};
const post = (path, body, token) =>
  api(path, { method: 'POST', body: JSON.stringify(body), headers: token ? { Authorization: `Bearer ${token}` } : {} });
const asAdmin = (token) => ({ Authorization: `Bearer ${token}` });

const login = async (email, password) => {
  const res = await post('/api/auth/login', { email, password });
  assert.equal(res.status, 200, `login for ${email}`);
  return res.body;
};

const resetLimits = () => models.RateLimitHit.deleteMany({});

before(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri('attri_security_test');
  process.env.JWT_SECRET = 'security-test-secret-at-least-32-characters';
  process.env.NODE_ENV = 'test';
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.CLOUDINARY_URL;
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;

  const { connectDB } = await import('../src/db/connect.js');
  const { createApp } = await import('../src/app.js');
  models = {
    ...(await import('../src/db/models/AdminUser.js')),
    ...(await import('../src/db/models/AuditLog.js')),
    ...(await import('../src/db/models/RateLimitHit.js')),
    ...(await import('../src/db/models/PasswordReset.js')),
    ...(await import('../src/db/models/RevokedToken.js'))
  };
  totp = await import('../src/lib/totp.js');

  await connectDB();
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;

  const { hashPassword } = await import('../src/lib/passwords.js');
  await models.AdminUser.create({ email: SUPER_EMAIL, passwordHash: await hashPassword(SUPER_PASSWORD), role: 'Super Admin' });
  await models.AdminUser.create({
    email: COMMERCIAL_EMAIL,
    passwordHash: await hashPassword(COMMERCIAL_PASSWORD),
    role: 'Commercial Admin'
  });
});

after(async () => {
  const { disconnectDB } = await import('../src/db/connect.js');
  await new Promise((resolve) => server.close(resolve));
  await disconnectDB();
  await mongo.stop();
});

beforeEach(resetLimits);

describe('H-1: request sanitizer is not a denial-of-service vector', () => {
  test('a large public body is refused immediately instead of being parsed', async () => {
    const started = Date.now();
    const res = await api('/api/this-route-does-not-exist', {
      method: 'POST',
      body: JSON.stringify({ x: '<script'.repeat(150_000) })
    });
    assert.equal(res.status, 413);
    assert.ok(Date.now() - started < 2000, `answered in ${Date.now() - started} ms`);
  });

  test('a pathological string under the limit is processed in linear time', async () => {
    const started = Date.now();
    const res = await api('/api/this-route-does-not-exist', {
      method: 'POST',
      body: JSON.stringify({ x: '<script'.repeat(13_000) }) // ~91 KB, previously ~1.5 s of blocked CPU
    });
    assert.equal(res.status, 404);
    assert.ok(Date.now() - started < 500, `answered in ${Date.now() - started} ms`);
  });

  test('the image upload route still accepts large bodies', async () => {
    const { token } = await login(SUPER_EMAIL, SUPER_PASSWORD);
    const res = await post('/api/upload-image', { fileBase64: 'A'.repeat(300_000), fileName: 'x.png' }, token);
    // 503 = parsed and reached the handler (storage is not configured in tests), not 413.
    assert.equal(res.status, 503);
  });
});

describe('M-1 / L-1: forgot-password abuse', () => {
  const waitForCodes = async (email, expected) => {
    for (let i = 0; i < 100; i += 1) {
      if ((await models.PasswordReset.countDocuments({ email })) >= expected) return;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };

  test('repeat requests within the cooldown do not issue new codes', async () => {
    await models.PasswordReset.deleteMany({});
    await post('/api/auth/forgot-password', { email: SUPER_EMAIL });
    await waitForCodes(SUPER_EMAIL, 1);
    const first = await models.PasswordReset.findOne({ email: SUPER_EMAIL }).lean();

    await post('/api/auth/forgot-password', { email: SUPER_EMAIL });
    await new Promise((resolve) => setTimeout(resolve, 300));
    const after = await models.PasswordReset.find({ email: SUPER_EMAIL }).lean();
    assert.equal(after.length, 1);
    assert.equal(String(after[0]._id), String(first._id), 'the original code was not voided');
  });

  test('every request counts toward the per-IP limit', async () => {
    const statuses = [];
    for (let i = 0; i < 6; i += 1) {
      statuses.push((await post('/api/auth/forgot-password', { email: `nobody${i}@attri.test` })).status);
    }
    assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
  });

  test('known and unknown addresses get an identical, immediate response', async () => {
    const known = await post('/api/auth/forgot-password', { email: SUPER_EMAIL });
    const unknown = await post('/api/auth/forgot-password', { email: 'ghost@attri.test' });
    assert.deepEqual(known.body, unknown.body);
    assert.equal(known.status, unknown.status);
  });
});

describe('M-3: two-factor authentication', () => {
  let secret;
  let recoveryCodes;
  let enabledStep;

  test('setup + enable with a valid code returns recovery codes and ends old sessions', async () => {
    const { token: oldToken } = await login(COMMERCIAL_EMAIL, COMMERCIAL_PASSWORD);
    await new Promise((resolve) => setTimeout(resolve, 1100)); // step past the iat second

    const setup = await post('/api/auth/mfa/setup', {}, oldToken);
    assert.equal(setup.status, 200);
    secret = setup.body.secret;
    assert.match(setup.body.otpauthUrl, /^otpauth:\/\/totp\//);

    const wrong = await post('/api/auth/mfa/enable', { code: '000000' }, oldToken);
    assert.equal(wrong.status, 400);

    enabledStep = totp.currentStep();
    const enable = await post('/api/auth/mfa/enable', { code: totp.codeForStep(secret, enabledStep) }, oldToken);
    assert.equal(enable.status, 200);
    assert.equal(enable.body.recoveryCodes.length, 8);
    recoveryCodes = enable.body.recoveryCodes;

    assert.equal((await api('/api/auth/me', { headers: asAdmin(oldToken) })).status, 401, 'old session ended');
    const me = await api('/api/auth/me', { headers: asAdmin(enable.body.token) });
    assert.equal(me.status, 200);
    assert.equal(me.body.user.mfaEnabled, true);

    const stored = await models.AdminUser.findOne({ email: COMMERCIAL_EMAIL }).select('+mfaRecoveryCodes').lean();
    assert.ok(stored.mfaRecoveryCodes.every((h) => /^[0-9a-f]{64}$/.test(h)), 'only hashes are stored');
  });

  test('password alone no longer yields a session, and the challenge token is not a session', async () => {
    const res = await post('/api/auth/login', { email: COMMERCIAL_EMAIL, password: COMMERCIAL_PASSWORD });
    assert.equal(res.status, 200);
    assert.equal(res.body.mfaRequired, true);
    assert.equal(res.body.token, undefined);
    assert.equal((await api('/api/auth/me', { headers: asAdmin(res.body.mfaToken) })).status, 401);
  });

  test('wrong codes fail, a valid code signs in, and the same code cannot be replayed', async () => {
    const { mfaToken } = (await post('/api/auth/login', { email: COMMERCIAL_EMAIL, password: COMMERCIAL_PASSWORD })).body;

    assert.equal((await post('/api/auth/login/mfa', { mfaToken, code: '123456' })).status, 401);

    const code = totp.codeForStep(secret, enabledStep + 1);
    const ok = await post('/api/auth/login/mfa', { mfaToken, code });
    assert.equal(ok.status, 200);
    assert.ok(ok.body.token);
    assert.equal((await api('/api/auth/me', { headers: asAdmin(ok.body.token) })).status, 200);

    const replay = await post('/api/auth/login/mfa', { mfaToken, code });
    assert.equal(replay.status, 401);

    const enableCodeAgain = await post('/api/auth/login/mfa', { mfaToken, code: totp.codeForStep(secret, enabledStep) });
    assert.equal(enableCodeAgain.status, 401, 'codes at or before the last used step are rejected');
  });

  test('a recovery code works exactly once', async () => {
    const { mfaToken } = (await post('/api/auth/login', { email: COMMERCIAL_EMAIL, password: COMMERCIAL_PASSWORD })).body;
    assert.equal((await post('/api/auth/login/mfa', { mfaToken, code: recoveryCodes[0] })).status, 200);
    assert.equal((await post('/api/auth/login/mfa', { mfaToken, code: recoveryCodes[0] })).status, 401);
  });

  test('five wrong second-factor codes lock the email+IP out', async () => {
    const { LoginAttempt } = await import('../src/db/models/LoginAttempt.js');
    await LoginAttempt.deleteMany({});
    const { mfaToken } = (await post('/api/auth/login', { email: COMMERCIAL_EMAIL, password: COMMERCIAL_PASSWORD })).body;
    for (let i = 0; i < 5; i += 1) {
      assert.equal((await post('/api/auth/login/mfa', { mfaToken, code: '11111' + i })).status, 401);
    }
    assert.equal((await post('/api/auth/login/mfa', { mfaToken, code: recoveryCodes[1] })).status, 429);
    await LoginAttempt.deleteMany({});
  });

  test('a password reset does not bypass two-factor', async () => {
    await models.PasswordReset.deleteMany({});
    await post('/api/auth/forgot-password', { email: COMMERCIAL_EMAIL });
    for (let i = 0; i < 100 && !(await models.PasswordReset.exists({ email: COMMERCIAL_EMAIL })); i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    await models.PasswordReset.updateOne(
      { email: COMMERCIAL_EMAIL },
      { $set: { otpHash: crypto.createHash('sha256').update('777777').digest('hex') } }
    );
    const res = await post('/api/auth/reset-password', { email: COMMERCIAL_EMAIL, otp: '777777', newPassword: COMMERCIAL_PASSWORD });
    assert.equal(res.status, 200);
    assert.equal(res.body.mfaRequired, true);
    assert.equal(res.body.token, undefined);
  });

  test('disabling needs both the password and a second factor', async () => {
    const { mfaToken } = (await post('/api/auth/login', { email: COMMERCIAL_EMAIL, password: COMMERCIAL_PASSWORD })).body;
    const { token } = (await post('/api/auth/login/mfa', { mfaToken, code: recoveryCodes[2] })).body;

    assert.equal((await post('/api/auth/mfa/disable', { password: COMMERCIAL_PASSWORD, code: '000000' }, token)).status, 400);
    assert.equal((await post('/api/auth/mfa/disable', { password: 'wrong-password', code: recoveryCodes[3] }, token)).status, 400);
    assert.equal((await post('/api/auth/mfa/disable', { password: COMMERCIAL_PASSWORD, code: recoveryCodes[4] }, token)).status, 200);

    const plain = await post('/api/auth/login', { email: COMMERCIAL_EMAIL, password: COMMERCIAL_PASSWORD });
    assert.ok(plain.body.token, 'password-only login works again');
  });

  test('a Super Admin can reset another admin’s two-factor; a Commercial Admin cannot', async () => {
    const { token: superToken } = await login(SUPER_EMAIL, SUPER_PASSWORD);
    const { token: commercialToken } = await login(COMMERCIAL_EMAIL, COMMERCIAL_PASSWORD);
    const commercial = await models.AdminUser.findOne({ email: COMMERCIAL_EMAIL }).lean();
    const superUser = await models.AdminUser.findOne({ email: SUPER_EMAIL }).lean();

    await models.AdminUser.updateOne({ _id: commercial._id }, { $set: { mfaEnabled: true, mfaSecret: totp.generateSecret() } });
    assert.equal(
      (await api(`/api/auth/users/${superUser._id}/mfa`, { method: 'DELETE', headers: asAdmin(commercialToken) })).status,
      403
    );
    assert.equal((await api(`/api/auth/users/${commercial._id}/mfa`, { method: 'DELETE', headers: asAdmin(superToken) })).status, 200);
    assert.equal((await models.AdminUser.findById(commercial._id).lean()).mfaEnabled, false);
  });
});

describe('M-4: audit log', () => {
  test('security events are recorded without secrets, and only Super Admins can read them', async () => {
    const { token: superToken } = await login(SUPER_EMAIL, SUPER_PASSWORD);
    await post('/api/auth/login', { email: SUPER_EMAIL, password: 'definitely-wrong' });
    await post('/api/audit/lead-export', { count: 12, range: 'last 7 days' }, superToken);
    await new Promise((resolve) => setTimeout(resolve, 200));

    const res = await api('/api/audit?limit=500', { headers: asAdmin(superToken) });
    assert.equal(res.status, 200);
    const actions = new Set(res.body.data.map((e) => e.action));
    for (const expected of ['auth.login.success', 'auth.login.failure', 'mfa.enabled', 'mfa.disabled', 'admin.mfa_reset', 'inquiries.exported']) {
      assert.ok(actions.has(expected), `audit log has ${expected}`);
    }
    const dump = JSON.stringify(res.body.data);
    for (const secretValue of [SUPER_PASSWORD, COMMERCIAL_PASSWORD, 'definitely-wrong', process.env.JWT_SECRET]) {
      assert.ok(!dump.includes(secretValue), 'no password or secret in the audit log');
    }

    const { token: commercialToken } = await login(COMMERCIAL_EMAIL, COMMERCIAL_PASSWORD);
    assert.equal((await api('/api/audit', { headers: asAdmin(commercialToken) })).status, 403);
  });
});

describe('L-3: token revocation fails closed', () => {
  test('a database error during the revocation check rejects the token', async () => {
    const { isTokenRevoked } = await import('../src/lib/revocation.js');
    const original = models.RevokedToken.findOne;
    models.RevokedToken.findOne = () => ({ lean: () => Promise.reject(new Error('simulated outage')) });
    try {
      assert.equal(await isTokenRevoked('some.token.value'), true);
    } finally {
      models.RevokedToken.findOne = original;
    }
  });
});

describe('L-4: rate limits are shared across instances', () => {
  test('two store instances with the same prefix see the same counter', async () => {
    const { MongoRateLimitStore } = await import('../src/lib/rateLimitStore.js');
    const a = new MongoRateLimitStore('shared-test');
    const b = new MongoRateLimitStore('shared-test');
    a.init({ windowMs: 60_000 });
    b.init({ windowMs: 60_000 });
    await a.increment('1.2.3.4');
    await b.increment('1.2.3.4');
    assert.equal((await a.increment('1.2.3.4')).totalHits, 3);
    await b.resetKey('1.2.3.4');
    assert.equal(await a.get('1.2.3.4'), undefined);
  });
});

describe('L-5 / L-7: session lifetime and secret strength', () => {
  test('sessions last 12 hours', async () => {
    const { token } = await login(SUPER_EMAIL, SUPER_PASSWORD);
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    assert.equal(payload.exp - payload.iat, 12 * 60 * 60);
  });

  test('a JWT secret shorter than 32 characters is refused at startup', async () => {
    const { checkEnv } = await import('../src/config.js');
    const saved = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'too-short';
    try {
      assert.ok(checkEnv().missingRequired.some(([key]) => key === 'JWT_SECRET'));
    } finally {
      process.env.JWT_SECRET = saved;
    }
    assert.ok(!checkEnv().missingRequired.some(([key]) => key === 'JWT_SECRET'));
  });
});

describe('L-14: catalogue changes need a Super Admin', () => {
  test('a Commercial Admin cannot create products or upload images', async () => {
    const { token } = await login(COMMERCIAL_EMAIL, COMMERCIAL_PASSWORD);
    const product = { id: 'p-test', slug: 'p-test', name: 'P', variety: 'V', brandLine: 'B', description: 'D', image: 'https://x/y.jpg' };
    assert.equal((await post('/api/products', product, token)).status, 403);
    assert.equal((await api('/api/products/p-test', { method: 'DELETE', headers: asAdmin(token) })).status, 403);
    assert.equal((await post('/api/upload-image', { fileBase64: 'AAAA', fileName: 'x.png' }, token)).status, 403);
  });
});

describe('L-15 / M-8: enquiry input validation', () => {
  const valid = { name: 'Test Buyer', phone: '+91 98765 43210', message: 'Need 5 tonnes', source: 'contact', consent: true };

  test('accepts a normal enquiry', async () => {
    assert.equal((await post('/api/inquiries', valid)).status, 200);
  });

  test('rejects malformed phone numbers, including CSV breakout attempts', async () => {
    for (const phone of ['abc', '12', 'x","=HYPERLINK("http://evil")', '+91 98765 43210"']) {
      const res = await post('/api/inquiries', { ...valid, phone });
      assert.equal(res.status, 400, `phone ${phone}`);
    }
  });

  test('rejects malformed emails and non-text fields', async () => {
    assert.equal((await post('/api/inquiries', { ...valid, phone: '+91 90000 11111', email: 'not-an-email' })).status, 400);
    assert.equal((await post('/api/inquiries', { ...valid, phone: '+91 90000 22222', name: { first: 'x' } })).status, 400);
  });

  test('a non-text notes value on PATCH is a 400, not a 500', async () => {
    const { token } = await login(SUPER_EMAIL, SUPER_PASSWORD);
    const { Inquiry } = await import('../src/db/models/Inquiry.js');
    const row = await Inquiry.findOne().lean();
    const res = await api(`/api/inquiries/${row._id}`, {
      method: 'PATCH',
      headers: asAdmin(token),
      body: JSON.stringify({ notes: { nested: true } })
    });
    assert.equal(res.status, 400);
  });
});

describe('I-2: passwords stored by the old rewriting sanitizer still work', () => {
  test('a legacy-rewritten hash logs in with the real password and is upgraded', async () => {
    const bcrypt = (await import('bcryptjs')).default;
    // What the old middleware did to this password before hashing it.
    const real = 'my onload=legacy-pass';
    const legacyStored = 'my disarmed-event=legacy-pass';
    await models.AdminUser.create({ email: 'legacy@attri.test', passwordHash: await bcrypt.hash(legacyStored, 4) });

    assert.ok((await login('legacy@attri.test', real)).token);
    const upgraded = await models.AdminUser.findOne({ email: 'legacy@attri.test' }).lean();
    assert.ok(await bcrypt.compare(real, upgraded.passwordHash), 'hash now matches the real password');
  });
});
