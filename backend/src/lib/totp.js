// RFC 6238 TOTP (HMAC-SHA1, 6 digits, 30 s steps) - the variant every
// authenticator app (Google Authenticator, Microsoft Authenticator, Authy,
// 1Password) supports. Built on node:crypto so no third-party code sits on
// the login path.
import crypto from 'node:crypto';

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const STEP_SECONDS = 30;
const DIGITS = 6;

export function base32Encode(buffer) {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(text) {
  const clean = String(text).toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const out = [];
  for (const char of clean) {
    const index = BASE32.indexOf(char);
    if (index === -1) throw new Error('Invalid base32 character');
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export function generateSecret() {
  return base32Encode(crypto.randomBytes(20)); // 160 bits, as RFC 4226 recommends
}

export function currentStep(nowMs = Date.now()) {
  return Math.floor(nowMs / 1000 / STEP_SECONDS);
}

export function codeForStep(secret, step) {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const hmac = crypto.createHmac('sha1', base32Decode(secret)).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary = hmac.readUInt32BE(offset) & 0x7fffffff;
  return String(binary % 10 ** DIGITS).padStart(DIGITS, '0');
}

// Returns the matched time step, or null. Accepts one step of clock drift each
// way. `afterStep` rejects codes at or before the last accepted step so an
// observed code cannot be replayed.
export function verifyTotp(secret, code, { afterStep = -1, nowMs = Date.now() } = {}) {
  const candidate = String(code ?? '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(candidate)) return null;

  const now = currentStep(nowMs);
  for (const step of [now - 1, now, now + 1]) {
    if (step <= afterStep) continue;
    const expected = codeForStep(secret, step);
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(candidate))) return step;
  }
  return null;
}

export function otpauthUrl({ secret, accountName, issuer }) {
  const label = encodeURIComponent(`${issuer}:${accountName}`);
  const params = new URLSearchParams({ secret, issuer, algorithm: 'SHA1', digits: String(DIGITS), period: String(STEP_SECONDS) });
  return `otpauth://totp/${label}?${params}`;
}

// One-time recovery codes for a lost phone. Only their hashes are stored.
export function generateRecoveryCodes(count = 8) {
  return Array.from({ length: count }, () => {
    const hex = crypto.randomBytes(5).toString('hex');
    return `${hex.slice(0, 5)}-${hex.slice(5)}`;
  });
}

export function hashRecoveryCode(code) {
  return crypto.createHash('sha256').update(String(code).trim().toLowerCase()).digest('hex');
}
