import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(backendDir, '..');

// backend/.env.local first, then the repo root's — the root file is where this
// project already keeps its secrets, so a fresh clone needs no extra setup.
// dotenv never overwrites an already-set variable, so a real shell/CI
// environment always wins over both files. Tests deliberately opt out of the
// local file so they can verify the "unset env var" fallback paths without
// accidentally depending on a developer's machine-specific secrets.
if (process.env.NODE_ENV !== 'test') {
  for (const dir of [backendDir, repoRoot]) {
    for (const file of ['.env.local', '.env']) {
      dotenv.config({ path: path.join(dir, file), quiet: true });
    }
  }
}

// Unset means production: forgetting the variable on a server must never
// switch on development conveniences (CAPTCHA test tokens, detailed errors,
// public API docs). Local development sets NODE_ENV=development in .env.local.
export const NODE_ENV = process.env.NODE_ENV || 'production';
export const IS_PROD = NODE_ENV === 'production';

// How many reverse proxies sit in front of this process. req.ip, and with it
// every per-IP rate limit and lockout, is read from X-Forwarded-For this many
// hops back, so it must match the real chain exactly: too high and clients can
// forge their IP, too low and every visitor shares the proxy's IP.
// 1 = nginx only (or a PaaS router); docker-compose sets 2 (Caddy -> nginx).
export const TRUST_PROXY_HOPS = Number.parseInt(process.env.TRUST_PROXY_HOPS ?? '1', 10) || 0;

// Swagger UI maps out every admin endpoint, so production serves it only on request.
export const API_DOCS_ENABLED = !IS_PROD || process.env.ENABLE_API_DOCS === 'true';

// 3001 is not arbitrary: frontend/vite.config.ts proxies /api there by
// default, and the frontend is not being modified.
export const PORT = Number(process.env.PORT) || 3001;

// The frontend calls relative /api/* paths through the Vite proxy, so these
// only matter when a browser is pointed straight at this server's port.
export const CORS_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export const MONGODB_URI = process.env.MONGODB_URI || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';

// Admin sessions last one working day. The client mirrors this value in
// frontend/src/services/api/auth.ts (TOKEN_TTL_MS); change both together.
export const TOKEN_TTL = '12h';

// Short-lived token proving the password step of a two-factor login.
export const MFA_CHALLENGE_TTL = '5m';

// HS256 needs at least 256 bits of key material to be brute-force resistant.
export const MIN_JWT_SECRET_LENGTH = 32;

// Only the admin image upload carries a large body: the UI rejects images over
// 3MB and base64 inflates by ~33%. Every other route (all the public ones)
// gets a small limit so no anonymous request can make the server parse
// megabytes of JSON.
export const UPLOAD_BODY_LIMIT = process.env.JSON_BODY_LIMIT || '6mb';
export const JSON_BODY_LIMIT = '100kb';
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '';
export const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
export const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || '';
export const FROM_EMAIL = process.env.FROM_EMAIL || 'Attri Nexus <onboarding@resend.dev>';
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL || '';
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
export const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || '';

// Without this the server would start but every login and every admin request
// would fail at request time, which is far harder to diagnose than a refusal
// at boot. It costs nothing to supply, so it stays mandatory.
const REQUIRED = [['JWT_SECRET', 'signs and verifies admin sessions']];
const WEAK = [
  [
    'JWT_SECRET',
    `must be at least ${MIN_JWT_SECRET_LENGTH} characters - generate one with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`,
    () => Boolean(process.env.JWT_SECRET) && process.env.JWT_SECRET.length < MIN_JWT_SECRET_LENGTH
  ]
];

// Each of these degrades one feature rather than breaking the server, so they
// are reported once at boot instead of blocking startup.
const OPTIONAL = [
  ['MONGODB_URI', '/api/products, /api/inquiries and /api/auth answer 503 until it is set'],
  ['CLOUDINARY_URL', 'product image uploads are refused with a clear error'],
  ['CLOUDINARY_CLOUD_NAME', 'product image uploads are refused with a clear error'],
  ['CLOUDINARY_API_KEY', 'product image uploads are refused with a clear error'],
  ['CLOUDINARY_API_SECRET', 'product image uploads are refused with a clear error'],
  ['TURNSTILE_SECRET_KEY', 'CAPTCHA is skipped - the enquiry form accepts unverified submissions'],
  ['RESEND_API_KEY', 'no email notification is sent when an enquiry arrives'],
  ['ADMIN_NOTIFICATION_EMAIL', 'no recipient for enquiry notification emails']
];

export function checkEnv() {
  return {
    missingRequired: [
      ...REQUIRED.filter(([key]) => !process.env[key]),
      ...WEAK.filter(([, , isWeak]) => isWeak()).map(([key, why]) => [key, why])
    ],
    missingOptional: OPTIONAL.filter(([key]) => !process.env[key])
  };
}
