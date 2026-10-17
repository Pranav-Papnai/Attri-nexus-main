# Attri Nexus — backend

The API for the Attri Nexus storefront and admin dashboard. Express 5 + MongoDB
(Mongoose), plain ESM JavaScript, no build step.

## Run it

```bash
cp .env.example .env.local            # in the repo root, then fill it in
npm install                           # inside backend/
npm run seed:admin -- you@example.com --name "Your Name"   # prompts for the password
npm run dev                           # http://localhost:3001/api/health
```

From the repo root, `npm run dev:all` starts this server and the Vite dev
server together.

Port **3001** is not arbitrary — `frontend/vite.config.ts` proxies `/api` there.
The frontend calls relative paths (`fetch('/api/products')`), so in dev
everything stays same-origin and no CORS preflight is involved.

## The frontend is the specification

This backend was written against a frontend that does not change. Several
things that look inconsistent are load-bearing, and changing them breaks the
site with no error message:

- **Products are camelCase** (`brandLine`, `packagingSizes`, `isFeatured`,
  `themePrimary`) while **inquiries are snake_case** (`company_name`,
  `product_id`, `created_at`). Each matches what its consumer already reads.
- **Products carry a single `description`.** The client splits it into short
  and full descriptions itself.
- **Status codes carry meaning.** `409` means "duplicate enquiry"; a `400`
  whose error string contains the word *captcha* is what surfaces the
  CAPTCHA-specific message. A generic 400 shows the user nothing useful.
- **Every response is `{ success, data | error }`.** The client checks
  `body.success` separately from the HTTP status.
- **Sessions last 12 hours**, mirrored as a constant in
  `frontend/src/services/api/auth.ts`.

`test/api.test.js` asserts all of the above against a real database. If you
change a field name, that suite is what tells you.

## Routes

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/health` | public | readiness probe |
| POST | `/api/auth/login` | public | → `{ token, user }`, or `{ mfaRequired, mfaToken }` for two-factor accounts |
| POST | `/api/auth/login/mfa` | public + challenge | `{ mfaToken, code }` → `{ token, user }`; code may be a recovery code |
| POST | `/api/auth/forgot-password` | public | 5/hour per IP, 1/minute per email; answers before doing any work |
| POST | `/api/auth/reset-password` | public | 5 guesses per code; no session for two-factor accounts |
| GET | `/api/auth/me` | admin | |
| PATCH | `/api/auth/users/:id/password` | admin (self) / Super Admin | own password needs `currentPassword` |
| POST | `/api/auth/mfa/setup`, `/enable`, `/disable`, `/recovery-codes` | admin (self) | TOTP two-factor |
| GET | `/api/auth/users` | Super Admin | |
| POST | `/api/auth/register` | Super Admin | no public signup exists |
| DELETE | `/api/auth/users/:id`, `/api/auth/users/:id/mfa` | Super Admin | remove an admin / reset their two-factor |
| GET | `/api/products` | public | includes inactive ones — the dashboard needs them |
| POST | `/api/products` | Super Admin | upsert by app-supplied `id` |
| DELETE | `/api/products/:id` | Super Admin | |
| GET | `/api/inquiries` | admin | the lead list |
| POST | `/api/inquiries` | public | CAPTCHA + honeypot + 5-min duplicate guard + format checks |
| PATCH | `/api/inquiries/:id` | admin | status / notes |
| DELETE | `/api/inquiries/:id` | admin | |
| POST | `/api/upload-image` | Super Admin | base64 JSON in (up to 6 MB), public URL out |
| GET | `/api/audit` | Super Admin | security event log |
| POST | `/api/audit/lead-export` | admin | records a CSV export before the browser builds it |

Admin routes expect `Authorization: Bearer <token>`.

## Degrading rather than breaking

Only `JWT_SECRET` is mandatory; the server refuses to start without it, or
with one shorter than 32 characters. Every
other missing variable disables exactly one feature and says so at boot:

| Unset | Effect |
| --- | --- |
| `MONGODB_URI` | `/api/products`, `/api/inquiries`, `/api/auth` answer **503**. The frontend falls back to its bundled demo data, so the site still browses. |
| `CLOUDINARY_*` | Image uploads answer **503** with a message naming the variables. |
| `TURNSTILE_SECRET_KEY` | **CAPTCHA is skipped** — the public enquiry form accepts unverified submissions. |
| `RESEND_API_KEY` / `ADMIN_NOTIFICATION_EMAIL` | No notification email on a new enquiry. The lead is still saved. |

## Layout

```
backend/
├── src/
│   ├── index.js              boot: env check, connect, listen, graceful shutdown
│   ├── app.js                the Express app — middleware + route mounting
│   ├── config.js             loads .env.local, exports settings, declares required env
│   ├── db/
│   │   ├── connect.js        idempotent connection + readiness state
│   │   └── models/           Product, Inquiry, AdminUser, LoginAttempt, PasswordReset,
│   │                         RevokedToken, AuditLog, RateLimitHit
│   ├── lib/
│   │   ├── storage.js        Cloudinary uploads
│   │   ├── turnstile.js      CAPTCHA verification
│   │   ├── email.js          Resend notifications
│   │   ├── totp.js           RFC 6238 two-factor codes (node:crypto only)
│   │   ├── passwords.js      hashing, verification, legacy-hash upgrade
│   │   ├── tokens.js         session and two-factor challenge tokens
│   │   ├── revocation.js     logout revocation list (fails closed)
│   │   ├── rateLimitStore.js MongoDB-backed limiter store shared by all instances
│   │   └── audit.js          security event log
│   ├── middleware/
│   │   ├── requireAdmin.js   JWT guard
│   │   ├── requireDatabase.js 503 when the database is not ready
│   │   ├── rateLimit.js      login / forgot-password / enquiry / upload limits
│   │   ├── sanitize.js       strips $-operator, dotted and prototype keys
│   │   └── errors.js         404, validation → 400, error backstop
│   └── routes/               auth, mfa, products, inquiries, upload, audit
├── scripts/seed-admin.js     creates the first Super Admin (password prompted)
├── scripts/migrate-legacy-roles.js  renames the old 'admin' role
└── test/                     end-to-end against an in-memory MongoDB;
                              security.test.js covers every audit finding
```

## Security notes

- **Passwords** are bcrypt hashed at cost 12 and never returned by any route.
- **Login timing is flat.** An unknown email is compared against a dummy hash so
  it costs the same as a real one — otherwise response time reveals which admin
  addresses exist.
- **Lockout is scoped to email + IP**, not email alone. Locking by email would
  let anyone lock the real admin out on demand by failing five logins.
- **Uploads are sniffed, not trusted.** The declared content type is checked
  against the file's actual leading bytes, and the uploaded filename never
  reaches the storage path — only its extension is consulted.
- **Product writes are whitelisted.** Unknown keys are dropped rather than
  persisted, so `_id` and `createdAt` cannot be overwritten by a client.
- **The enquiry form** is rate limited per IP, honeypotted, de-duplicated and
  format-checked server-side. The client-side versions of those checks are
  bypassed by anyone posting to the API directly.
- **Two-factor authentication** (TOTP) is available to every admin, with
  single-use recovery codes. A password reset never bypasses it.
- **Request bodies are capped at 100 KB** except the admin image upload, and
  string values are never run through regexes, so no request can stall the
  event loop.
- **Rate limits live in MongoDB**, so they hold across serverless instances
  and restarts.
- **Every security-relevant action is audited** (sign-ins, failures,
  password and two-factor changes, admin changes, lead deletes and exports)
  without storing passwords, codes or enquiry content.

## Tests

```bash
npm test
```

36 end-to-end tests run against an in-memory MongoDB — no configuration, no
network, nothing to clean up afterwards.

## Deploying

This is a long-running process, so it needs a host that runs one (Render,
Railway, Fly, a VPS) — `npm start`, with the same environment variables set.
It will not work as a Vercel serverless function without being rewritten.

The frontend deploys separately as a static build. Once the two are on
different origins, set `CORS_ORIGIN` to the frontend's origin and point the
frontend at the API — note that the frontend currently assumes a same-origin
`/api`, so serving both behind one domain (or a proxy/rewrite) needs no
frontend change, while splitting them does.
