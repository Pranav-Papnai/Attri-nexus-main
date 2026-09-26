# Attri Nexus — backend

The API for the Attri Nexus storefront and admin dashboard. Express 5 + MongoDB
(Mongoose), plain ESM JavaScript, no build step.

## Run it

```bash
cp .env.example .env.local            # in the repo root, then fill it in
npm install                           # inside backend/
npm run seed:admin -- you@example.com "your-password" "Your Name"
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
- **Sessions last 7 days**, mirrored as a constant in
  `frontend/src/services/api/auth.ts`.

`test/api.test.js` asserts all of the above against a real database. If you
change a field name, that suite is what tells you.

## Routes

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/api/health` | public | readiness probe |
| POST | `/api/auth/login` | public | → `{ token, user }` |
| POST | `/api/auth/register` | admin | no public signup exists |
| GET | `/api/products` | public | includes inactive ones — the dashboard needs them |
| POST | `/api/products` | admin | upsert by app-supplied `id` |
| DELETE | `/api/products/:id` | admin | |
| GET | `/api/inquiries` | admin | the lead list |
| POST | `/api/inquiries` | public | CAPTCHA + honeypot + 5-min duplicate guard |
| PATCH | `/api/inquiries/:id` | admin | status / notes |
| DELETE | `/api/inquiries/:id` | admin | |
| POST | `/api/upload-image` | admin | base64 JSON in, public URL out |

Admin routes expect `Authorization: Bearer <token>`.

## Degrading rather than breaking

Only `JWT_SECRET` is mandatory; the server refuses to start without it. Every
other missing variable disables exactly one feature and says so at boot:

| Unset | Effect |
| --- | --- |
| `MONGODB_URI` | `/api/products`, `/api/inquiries`, `/api/auth` answer **503**. The frontend falls back to its bundled demo data, so the site still browses. |
| `BLOB_READ_WRITE_TOKEN` | Image uploads answer **503** with a message naming the variable. |
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
│   │   └── models/           Product, Inquiry, AdminUser, LoginAttempt
│   ├── lib/
│   │   ├── storage.js        Vercel Blob uploads
│   │   ├── turnstile.js      CAPTCHA verification
│   │   └── email.js          Resend notifications
│   ├── middleware/
│   │   ├── requireAdmin.js   JWT guard
│   │   ├── requireDatabase.js 503 when the database is not ready
│   │   ├── rateLimit.js      login / enquiry / upload limits
│   │   └── errors.js         404, validation → 400, error backstop
│   └── routes/               auth, products, inquiries, upload
├── scripts/seed-admin.js     creates the first admin
└── test/api.test.js          end-to-end, against an in-memory MongoDB
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
- **The enquiry form** is rate limited per IP, honeypotted, and de-duplicated
  server-side. The client-side versions of those checks are bypassed by anyone
  posting to the API directly.

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
