// End-to-end tests against a real MongoDB (an in-memory instance), exercising
// the HTTP surface the frontend actually calls. These assert the response
// *contract* - status codes, envelope shape, field names - because the
// frontend is frozen and depends on all three.
import test, { before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;
let server;
let base;
let Product;
let Inquiry;
let AdminUser;
let LoginAttempt;
let adminToken;

const ADMIN_EMAIL = 'admin@attri.test';
const ADMIN_PASSWORD = 'correct-horse-battery';

const api = async (path, options = {}) => {
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
};

const asAdmin = (token = adminToken) => ({ Authorization: `Bearer ${token}` });

before(async () => {
  mongo = await MongoMemoryServer.create();

  // Must be set before config.js is imported - it reads process.env once, at
  // module load.
  process.env.MONGODB_URI = mongo.getUri('attri_test');
  process.env.JWT_SECRET = 'test-secret-not-used-anywhere-real';
  process.env.NODE_ENV = 'test';
  delete process.env.TURNSTILE_SECRET_KEY;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.CLOUDINARY_URL;
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;

  const { connectDB } = await import('../src/db/connect.js');
  const { createApp } = await import('../src/app.js');
  ({ Product } = await import('../src/db/models/Product.js'));
  ({ Inquiry } = await import('../src/db/models/Inquiry.js'));
  ({ AdminUser } = await import('../src/db/models/AdminUser.js'));
  ({ LoginAttempt } = await import('../src/db/models/LoginAttempt.js'));

  await connectDB();

  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;

  // Seed the first admin exactly the way scripts/seed-admin.js does.
  const bcrypt = (await import('bcryptjs')).default;
  await AdminUser.create({
    email: ADMIN_EMAIL,
    passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
    name: 'Test Admin'
  });
});

after(async () => {
  const { disconnectDB } = await import('../src/db/connect.js');
  await new Promise((resolve) => server.close(resolve));
  await disconnectDB();
  await mongo.stop();
});

describe('health', () => {
  test('reports a live database', async () => {
    const { status, body } = await api('/api/health');
    assert.equal(status, 200);
    assert.equal(body.dbConfigured, true);
    assert.equal(body.dbConnected, true);
  });
});

describe('auth', () => {
  test('rejects a missing body with 400', async () => {
    const { status } = await api('/api/auth/login', { method: 'POST', body: '{}' });
    assert.equal(status, 400);
  });

  test('rejects a wrong password with 401 and no detail', async () => {
    const { status, body } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: ADMIN_EMAIL, password: 'wrong' })
    });
    assert.equal(status, 401);
    assert.equal(body.error, 'Invalid email or password');
  });

  test('gives an unknown email the identical 401', async () => {
    const { status, body } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'nobody@attri.test', password: 'wrong' })
    });
    assert.equal(status, 401);
    // Identical wording is the point: the response must not reveal which
    // admin addresses exist.
    assert.equal(body.error, 'Invalid email or password');
  });

  test('logs in and returns the shape the frontend stores', async () => {
    const { status, body } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });
    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.ok(body.token, 'a token is returned');
    assert.deepEqual(Object.keys(body.user).sort(), ['email', 'name', 'role']);
    assert.equal(body.user.email, ADMIN_EMAIL);
    adminToken = body.token;
  });

  test('a successful login clears earlier failures', async () => {
    assert.equal(await LoginAttempt.countDocuments({ email: ADMIN_EMAIL }), 0);
  });

  test('locks out after 5 failures, then 429s', async () => {
    const email = 'lockme@attri.test';
    for (let i = 0; i < 5; i += 1) {
      const { status } = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: 'bad' })
      });
      assert.equal(status, 401, `attempt ${i + 1} should still be a 401`);
    }

    const { status, body } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: 'bad' })
    });
    assert.equal(status, 429);
    assert.match(body.error, /15 minutes/);
    await LoginAttempt.deleteMany({});
  });

  test('register requires an existing admin token', async () => {
    const { status } = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'x@attri.test', password: 'longenough1' })
    });
    assert.equal(status, 401);
  });

  test('register rejects a short password', async () => {
    const { status } = await api('/api/auth/register', {
      method: 'POST',
      headers: asAdmin(),
      body: JSON.stringify({ email: 'x@attri.test', password: 'short' })
    });
    assert.equal(status, 400);
  });

  test('rejects excessively long password to prevent Long Password DoS', async () => {
    const longPassword = 'A'.repeat(5000);
    const loginRes = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: ADMIN_EMAIL, password: longPassword })
    });
    assert.equal(loginRes.status, 400);

    const regRes = await api('/api/auth/register', {
      method: 'POST',
      headers: asAdmin(),
      body: JSON.stringify({ email: 'longpass@attri.test', password: longPassword })
    });
    assert.equal(regRes.status, 400);
  });

  test('an admin can create another admin, and never twice', async () => {
    const payload = JSON.stringify({
      email: 'second@attri.test',
      password: 'another-good-password',
      name: 'Second'
    });

    const first = await api('/api/auth/register', { method: 'POST', headers: asAdmin(), body: payload });
    assert.equal(first.status, 200);
    assert.equal(first.body.user.email, 'second@attri.test');

    const again = await api('/api/auth/register', { method: 'POST', headers: asAdmin(), body: payload });
    assert.equal(again.status, 409);
  });

  test('the stored password is hashed, never plaintext', async () => {
    const user = await AdminUser.findOne({ email: 'second@attri.test' }).lean();
    assert.ok(user.passwordHash.startsWith('$2'));
    assert.ok(!JSON.stringify(user).includes('another-good-password'));
  });

  test('forgot-password generates an OTP and allows resetting password', async () => {
    // 1. Request reset code
    const forgotRes = await api('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@attri.test' })
    });
    assert.equal(forgotRes.status, 200);
    assert.equal(forgotRes.body.success, true);
    assert.ok(forgotRes.body.devOtp, 'Should return devOtp in test environment');
    const otp = forgotRes.body.devOtp;

    // 2. Reject short password
    const shortRes = await api('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@attri.test', otp, newPassword: 'short' })
    });
    assert.equal(shortRes.status, 400);

    // 3. Reject invalid OTP
    const wrongOtpRes = await api('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@attri.test', otp: '000000', newPassword: 'new-secure-password' })
    });
    assert.equal(wrongOtpRes.status, 400);

    // 4. Successful password reset
    const resetRes = await api('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@attri.test', otp, newPassword: 'new-secure-password' })
    });
    assert.equal(resetRes.status, 200);
    assert.equal(resetRes.body.success, true);
    assert.ok(resetRes.body.token, 'Should return authenticated token');

    // 5. Verify can now log in with the new password
    const newLoginRes = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@attri.test', password: 'new-secure-password' })
    });
    assert.equal(newLoginRes.status, 200);
    assert.equal(newLoginRes.body.success, true);

    // 6. Reset back to original password for test consistency
    const resetBack = await api('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@attri.test' })
    });
    await api('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@attri.test', otp: resetBack.body.devOtp, newPassword: 'good-password-1' })
    });
  });
});

describe('products', () => {
  const fullProduct = {
    id: 'prod_test_1',
    slug: 'attri-classic',
    name: 'Attri Classic',
    variety: 'IR64',
    brandLine: 'Flagship Collection',
    category: 'Basmati',
    description: 'Aged long grain rice.',
    image: '/images/products/attri-classic-ir64.jpg',
    features: ['Quality graded'],
    specifications: { origin: 'Punjab', bestFor: ['Biryani'] },
    packagingSizes: ['1kg', '25kg'],
    culinaryUses: ['Biryani'],
    isFeatured: true,
    isActive: true,
    themePrimary: '#0D3B2E',
    themeAccent: '#C5A059'
  };

  test('GET is public and returns an envelope', async () => {
    const { status, body } = await api('/api/products');
    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  test('POST requires a token', async () => {
    const { status } = await api('/api/products', { method: 'POST', body: JSON.stringify(fullProduct) });
    assert.equal(status, 401);
  });

  test('POST requires an id', async () => {
    const { status, body } = await api('/api/products', {
      method: 'POST',
      headers: asAdmin(),
      body: JSON.stringify({ name: 'No id' })
    });
    assert.equal(status, 400);
    assert.match(body.error, /id/i);
  });

  test('creating a half-empty product is rejected, naming the fields', async () => {
    const { status, body } = await api('/api/products', {
      method: 'POST',
      headers: asAdmin(),
      body: JSON.stringify({ id: 'prod_partial', slug: 'partial' })
    });
    assert.equal(status, 400);
    // The dashboard shows this string verbatim, so it has to name what to fix.
    assert.match(body.error, /name is required/);
    assert.match(body.error, /image is required/);
  });

  test('creates a product and returns it in camelCase', async () => {
    const { status, body } = await api('/api/products', {
      method: 'POST',
      headers: asAdmin(),
      body: JSON.stringify(fullProduct)
    });
    assert.equal(status, 200);
    assert.equal(body.success, true);

    const list = await api('/api/products');
    const saved = list.body.data.find((p) => p.id === 'prod_test_1');
    assert.ok(saved, 'the new product appears in the public list');
    assert.equal(saved.brandLine, 'Flagship Collection');
    assert.deepEqual(saved.packagingSizes, ['1kg', '25kg']);
    assert.equal(saved.themePrimary, '#0D3B2E');
    assert.equal(saved.isFeatured, true);
    assert.deepEqual(saved.specifications.bestFor, ['Biryani']);
  });

  test('the same id updates instead of duplicating', async () => {
    const { status } = await api('/api/products', {
      method: 'POST',
      headers: asAdmin(),
      body: JSON.stringify({ ...fullProduct, name: 'Attri Classic Renamed' })
    });
    assert.equal(status, 200);

    const list = await api('/api/products');
    const matches = list.body.data.filter((p) => p.id === 'prod_test_1');
    assert.equal(matches.length, 1, 'no duplicate document was created');
    assert.equal(matches[0].name, 'Attri Classic Renamed');
  });

  test('a partial edit does not require untouched fields', async () => {
    const { status } = await api('/api/products', {
      method: 'POST',
      headers: asAdmin(),
      body: JSON.stringify({ id: 'prod_test_1', isFeatured: false })
    });
    assert.equal(status, 200);

    const saved = await Product.findById('prod_test_1').lean();
    assert.equal(saved.isFeatured, false);
    assert.equal(saved.name, 'Attri Classic Renamed', 'other fields survive');
  });

  test('unknown keys are dropped, not persisted', async () => {
    await api('/api/products', {
      method: 'POST',
      headers: asAdmin(),
      body: JSON.stringify({ id: 'prod_test_1', hacked: true, createdAt: '1999-01-01' })
    });
    const saved = await Product.findById('prod_test_1').lean();
    assert.equal(saved.hacked, undefined);
    assert.notEqual(new Date(saved.createdAt).getFullYear(), 1999);
  });

  test('inactive products stay visible to the dashboard', async () => {
    await api('/api/products', {
      method: 'POST',
      headers: asAdmin(),
      body: JSON.stringify({ id: 'prod_test_1', isActive: false })
    });
    const { body } = await api('/api/products');
    assert.ok(body.data.some((p) => p.id === 'prod_test_1'), 'still returned by the API');
  });

  test('DELETE requires a token, then removes it', async () => {
    const noAuth = await api('/api/products/prod_test_1', { method: 'DELETE' });
    assert.equal(noAuth.status, 401);

    const { status } = await api('/api/products/prod_test_1', { method: 'DELETE', headers: asAdmin() });
    assert.equal(status, 200);
    assert.equal(await Product.countDocuments({ _id: 'prod_test_1' }), 0);
  });

  test('deleting something already gone is a 404', async () => {
    const { status } = await api('/api/products/prod_test_1', { method: 'DELETE', headers: asAdmin() });
    assert.equal(status, 404);
  });
});

describe('inquiries', () => {
  const lead = {
    name: 'Rajesh Sharma',
    email: 'Rajesh@Example.com',
    phone: '+91 98112 34567',
    company_name: 'Taj Palace',
    product_id: 'attri-classic',
    quantity: '5 MT',
    message: 'Annual contract enquiry.',
    source: 'bulk',
    consent: true,
    consent_version: '2026-09'
  };

  test('GET is admin-only', async () => {
    const { status } = await api('/api/inquiries');
    assert.equal(status, 401);
  });

  test('rejects a submission missing required fields', async () => {
    const { status, body } = await api('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify({ name: 'Only a name' })
    });
    assert.equal(status, 400);
    assert.match(body.error, /required/i);
  });

  test('rejects a submission without consent', async () => {
    const { status, body } = await api('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify({ ...lead, phone: '+91 90000 00001', consent: false })
    });
    assert.equal(status, 400);
    assert.match(body.error, /consent/i);
  });

  test('accepts a lead with no email when a phone is given', async () => {
    const { email: _omitted, ...noEmail } = lead;
    const { status } = await api('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify({ ...noEmail, phone: '+91 90000 00002' })
    });
    assert.equal(status, 200);
    const saved = await Inquiry.findOne({ phone: '+91 90000 00002' }).lean();
    assert.equal(saved.consent_given, true);
    assert.ok(saved.consent_at instanceof Date);
  });

  test('rejects an unknown source value', async () => {
    const { status } = await api('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify({ ...lead, email: 'src@example.com', source: 'not-a-real-source' })
    });
    assert.equal(status, 400);
  });

  test('accepts a valid lead and normalises the email', async () => {
    const { status, body } = await api('/api/inquiries', { method: 'POST', body: JSON.stringify(lead) });
    assert.equal(status, 200);
    assert.equal(body.success, true);

    const saved = await Inquiry.findOne({ phone: lead.phone }).lean();
    assert.equal(saved.email, 'rajesh@example.com');
    assert.equal(saved.status, 'new', 'status defaults to new');
    assert.ok(saved.created_at instanceof Date, 'stored as created_at, not createdAt');
  });

  test('a repeat within 5 minutes is a 409', async () => {
    const { status, body } = await api('/api/inquiries', { method: 'POST', body: JSON.stringify(lead) });
    assert.equal(status, 409);
    assert.match(body.error, /already received/i);
  });

  test('the honeypot fakes success without storing anything', async () => {
    const before = await Inquiry.countDocuments();
    const { status, body } = await api('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify({ ...lead, email: 'bot@spam.test', phone: '+91 00000 00000', website: 'http://spam' })
    });
    assert.equal(status, 200);
    assert.equal(body.success, true, 'the bot is told it worked');
    assert.equal(await Inquiry.countDocuments(), before, 'but nothing was saved');
  });

  test('the admin list returns snake_case plus a string id', async () => {
    const { status, body } = await api('/api/inquiries', { headers: asAdmin() });
    assert.equal(status, 200);
    const row = body.data[0];
    assert.equal(typeof row.id, 'string');
    assert.equal(row.company_name, 'Taj Palace');
    assert.equal(row.product_id, 'attri-classic');
    assert.ok(row.created_at, 'created_at is present for the dashboard');
  });

  test('PATCH updates status and notes', async () => {
    const { body } = await api('/api/inquiries', { headers: asAdmin() });
    const { id } = body.data[0];

    const res = await api(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: asAdmin(),
      body: JSON.stringify({ status: 'contacted', notes: 'Called back.' })
    });
    assert.equal(res.status, 200);

    const saved = await Inquiry.findById(id).lean();
    assert.equal(saved.status, 'contacted');
    assert.equal(saved.notes, 'Called back.');
  });

  test('a notes-only PATCH leaves status alone', async () => {
    const { body } = await api('/api/inquiries', { headers: asAdmin() });
    const { id } = body.data[0];

    const res = await api(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: asAdmin(),
      body: JSON.stringify({ notes: 'Second note.' })
    });
    assert.equal(res.status, 200);

    const saved = await Inquiry.findById(id).lean();
    assert.equal(saved.status, 'contacted', 'status was not blanked');
    assert.equal(saved.notes, 'Second note.');
  });

  test('PATCH rejects an invalid status', async () => {
    const { body } = await api('/api/inquiries', { headers: asAdmin() });
    const { id } = body.data[0];
    const res = await api(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: asAdmin(),
      body: JSON.stringify({ status: 'invented' })
    });
    assert.equal(res.status, 400);
  });

  test('a malformed id is a 404, not a 500', async () => {
    const res = await api('/api/inquiries/not-an-object-id', {
      method: 'PATCH',
      headers: asAdmin(),
      body: JSON.stringify({ status: 'new' })
    });
    assert.equal(res.status, 404);
  });

  test('DELETE removes the lead', async () => {
    const { body } = await api('/api/inquiries', { headers: asAdmin() });
    const { id } = body.data[0];

    const noAuth = await api(`/api/inquiries/${id}`, { method: 'DELETE' });
    assert.equal(noAuth.status, 401);

    const res = await api(`/api/inquiries/${id}`, { method: 'DELETE', headers: asAdmin() });
    assert.equal(res.status, 200);
    assert.equal(await Inquiry.countDocuments({ _id: id }), 0);
  });
});

describe('upload', () => {
  test('requires a token', async () => {
    const { status } = await api('/api/upload-image', { method: 'POST', body: JSON.stringify({}) });
    assert.equal(status, 401);
  });

  test('reports unconfigured storage as 503 with a fixable message', async () => {
    const { status, body } = await api('/api/upload-image', {
      method: 'POST',
      headers: asAdmin(),
      body: JSON.stringify({ fileBase64: 'AAAA', fileName: 'x.jpg' })
    });
    assert.equal(status, 503);
    assert.match(body.error, /CLOUDINARY_(CLOUD_NAME|API_KEY|API_SECRET)/);
  });
});
