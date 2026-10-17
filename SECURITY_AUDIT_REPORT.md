# Security Audit Report — Attri Nexus

| | |
|---|---|
| **Audit date** | 16 October 2026 |
| **Scope** | Full repository at branch `security-fixes` (commit `54099e1`), plus notes on what is still live on `main` |
| **Method** | Manual code review, `npm audit`, offline proof-of-concept tests against throwaway local instances, read-only database queries |
| **Rules followed** | Read-only (this report is the only file written); no production endpoints contacted; secrets redacted to ≤ 4 characters |
| **Remediation** | 17 October 2026, on branch `security-fixes`. Status of every finding is in §0. Sections 1–10 are the original audit, kept unchanged as the record |

---

## 0. Remediation status (17 October 2026)

**Result:** every finding that can be fixed in code is fixed and tested. What remains needs the owner, because it sits in an outside console (GitHub, Atlas, Docker Hub) or writes to the live database.

**How the fixes were verified**
- Backend test suite: **90/90 pass**, up from 63. The new `backend/test/security.test.js` covers the ReDoS regression, MFA, audit log, rate limits, password rules and validation.
- `npm audit` on the repo root, `backend` and `frontend`: **0 vulnerabilities**.
- gitleaks (files to be committed): no leaks. semgrep (`p/javascript`, `p/typescript`, `p/nodejsscan`, `p/owasp-top-ten`, `p/secrets`): 0 findings. hadolint: clean. trivy: 0 HIGH or CRITICAL.
- ReDoS proof-of-concept rerun: a 6 MB body is now refused with 413 in 0.02 s. A 95 KB `<script` body is answered in 0.018 s. `/api/health` is unaffected.
- Browser test in Microsoft Edge, against the production build with the production CSP and a throwaway in-memory database: **14/14 checks pass**. It covers enquiry failure and success, 2FA setup and login, wrong-code rejection, the audit log, CSV export, and no console or CSP errors.

| ID | Status | What was done |
|---|---|---|
| H-1 | ✅ Fixed | The regex HTML stripping was removed; the sanitizer now only strips `$`, `.` and `__proto__`-style keys (`middleware/sanitize.js`). Body limit is 100 KB everywhere, and 6 MB only on the admin upload route (`app.js`). Regression test added |
| H-2 | ✅ Fixed in code | All `localStorage` fallbacks were removed (`services/api/backend.ts`). A failed enquiry shows a real error with the phone number, and the visitor can retry. Admin update and delete report failure honestly. Old local lead copies are purged from visitors' browsers. Backend now hosted on Render for staging (`attri-nexus-main-1.onrender.com`). Checked on 17 October: database connected, `NODE_ENV=production`, API docs off, CORS allows only the Vercel site, admin routes return 401 without a token |
| H-3 | ✅ Merged | Merged to `main` as PR #1 on 17 October. See V-2: the public Vercel project was still building from an older repository |
| M-1 | ✅ Fixed | A dedicated limiter counts every forgot-password request (5 per hour per IP). Per-email 60 s cooldown. The response is sent before any work is done |
| M-2 | ✅ Fixed | Changing your own password requires `currentPassword`, and the endpoint is rate-limited |
| M-3 | ✅ Fixed | TOTP two-factor (RFC 6238, verified against the RFC test vectors) with 8 one-time recovery codes and replay protection. A Super Admin can reset another admin's 2FA. Password reset no longer signs in an account that has 2FA. **Owner:** turn on 2FA for every admin under Dashboard → Admin Access |
| M-4 | ✅ Fixed | New `auditlogs` collection with a 1-year TTL. Records sign-ins (including failures), 2FA changes, admin create and delete, password changes, lead edits and deletes, product changes, uploads and CSV exports. Super Admins can view it in the dashboard |
| M-5 | ✅ Fixed in code | All actions pinned by commit SHA. `permissions: contents: read`. Images tagged with the immutable `github.sha`. Deploy job gated by the `production` environment. `docker logout` after each pull. Tests and audits must pass before build. New `security.yml` (gitleaks, npm audit, semgrep, hadolint, trivy) and Dependabot with a 7-day cooldown. Done on 17 October: `main` is protected by a ruleset that requires a pull request and the 5 CI and security checks (GitHub Actions only), and the `production` environment requires a reviewer. **Owner:** use a read-only Docker Hub token on EC2 (L-9) |
| M-6 | ✅ Fixed | Done on 17 October. `attri-prod` has `readWrite` on `attri_nexus` only and is stored only in Render. `attri-dev` has `readWrite` on `attri_nexus_dev` only and is used on the laptop; it was confirmed to be refused on the production database. The old `atlasAdmin` user that was on the laptop was deleted, and Atlas was confirmed to refuse its login. Its password is no longer anywhere on the laptop |
| M-7 | ✅ Fixed | Node 22 in both Dockerfiles, CI, `serverless.yml` (`nodejs22.x`) and `engines` |
| M-8 | ✅ Fixed | `frontend/src/utils/csv.ts` quotes every cell and neutralises formulas. The server validates phone and email formats |
| L-1 | ✅ Fixed | forgot-password answers immediately; lookup and email happen in the background |
| L-2 | ✅ Fixed | `shell-quote` is now 1.12.0; `npm audit` is clean |
| L-3 | ✅ Fixed | The revocation check fails closed (treats the token as revoked) on a database error |
| L-4 | ✅ Fixed | Rate-limit counters are stored in MongoDB (`ratelimithits`, TTL), shared across instances and kept across restarts. Per-account lockout and the per-email reset cooldown still apply across IPs |
| L-5 | ✅ Mitigated | Token lifetime cut from 7 days to 12 hours. 2FA, revocation and the strict CSP reduce what a stolen token is worth. Moving to an `HttpOnly` cookie is left until the backend has its final domain, because it needs a same-site setup and CSRF protection |
| L-6 | ✅ Fixed | Images pinned by `sha256` digest: `node:22-alpine`, `nginx-unprivileged:1.28-alpine`, `caddy:2.10-alpine`, `mongo:7.0`. Dependabot keeps them updated |
| L-7 | ✅ Fixed | The API and the Lambda handler refuse to start if `JWT_SECRET` is shorter than 32 characters |
| L-8 | ✅ Fixed | `api-testing.txt` uses `<YOUR_JWT_TOKEN>` placeholders. Git history was not rewritten; the values in it are dead (expired token, old secret and password no longer used) |
| L-9 | ⏳ Owner action | **Owner:** make the Docker Hub repositories private. New images built from this branch don't contain the pre-fix bundle |
| L-10 | ✅ Fixed | The bundled MongoDB is opt-in (`--profile local-db`), starts with `--auth`, and refuses to run without a root password of at least 16 characters. Every container has memory and CPU limits |
| L-11 | ✅ Fixed | The EC2 guide now limits SSH to the admin's IP by default. If automatic deploys need port 22 open, it requires disabling password and root login and running fail2ban |
| L-12 | ✅ Fixed | `seed-admin` reads the password from a hidden prompt or stdin, never from arguments |
| L-13 | ✅ Fixed | Vercel CSP `connect-src` is `'self'`, the Render API origin and Turnstile only (PR #19). When the backend moves to EC2, replace the Render origin with the new one |
| L-14 | ✅ Fixed | Product writes and image uploads now require Super Admin, matching the UI's description of Commercial Admin |
| L-15 | ✅ Fixed | Enquiry fields are type-checked and phone and email formats validated; bad input returns 400, not 500 |
| I-1 | ✅ Fixed | The query string is parsed once with a safe parser, which strips dangerous keys |
| I-2 | ✅ Fixed | Stored data is no longer rewritten. Old passwords hashed through the old rewrite still work and are re-hashed on the next login |
| I-3 | ✅ Fixed | The dead `frontend/.github` workflow was removed; CI runs the backend tests and the security scans |
| I-4 | ✅ Fixed | Scarf telemetry disabled through `scarfSettings` in `backend/package.json` |
| I-5 | ✅ Fixed | `.pyc` removed from git; Playwright pinned to stable 1.64.1; `load-tests/requirements.txt` pins `locust` |
| I-6 | ⏳ Owner action | `npm run migrate:roles` (in `backend`) was added. It does a dry run by default; `--apply` writes. **Owner:** run the dry run, then `--apply`, against the database |
| V-1 (new) | ✅ Fixed | Found during the browser test: the CSP blocked the confetti animation's background worker, so it fell back to the main thread and logged a console error. `worker-src 'self' blob:` added in `nginx.conf` and both `vercel.json` files. This adds no outside source |
| V-2 (new) | ⏳ In progress | Found on 17 October: the public site `attri-nexus-web.vercel.app` was building from an older repository (`Pranav-Papnai/Attri_nexus`), so it still served the pre-fix code. Commits to this repository went to a second Vercel project with no public domain. The public project is being reconnected to `Pranav-Papnai/Attri-nexus-main`. **Owner:** after it serves the new build, delete the second Vercel project |
| V-3 (new) | ✅ Fixed | Found on 17 October: when the admin list failed to load, the dashboard showed a placeholder `master-admin` row whose buttons targeted a non-existent account. It now shows the real error (PR #18) |

**Owner checklist (cannot be done from the code)**
1. ~~Merge `security-fixes` into `main` (H-3).~~ Done.
2. ~~Host the backend, with production-only secrets (H-2), and add its origin to the CSP `connect-src` (L-13).~~ Done (Render, staging). Remaining: finish reconnecting the public Vercel project (V-2).
3. ~~Separate the dev and production databases, and rotate the Atlas password (M-6).~~ Done.
4. ~~GitHub: protect `main`, and add required reviewers to the `production` environment (M-5).~~ Done.
5. Docker Hub: make the repositories private, and use a read-only token on EC2 (L-9, M-5).
6. Turn on 2FA for every admin (M-3), and run `npm run migrate:roles` (I-6).
7. Check the Atlas tier for backups, and set up uptime monitoring (§9; see `SECURITY_RUNBOOK.md`).

---

## 1. Executive summary

Attri Nexus is a lead-capture marketing site with an admin dashboard. Its most valuable asset is customer enquiry data (names, phone numbers, emails, company details), which is personal data under India's DPDP Act 2023. An earlier pass on this branch already closed four critical admin-takeover paths: a hardcoded admin password, a browser-side login bypass, a leaked password-reset code and a guessable default JWT secret. Authentication, authorization, uploads and injection defences are now generally solid.

This audit found **no remaining critical issues on the branch**. It did find **one serious, newly confirmed vulnerability**: the request-sanitising middleware's regular expressions take quadratic time. A single unauthenticated 300 KB request froze the whole API for 15.6 seconds in testing; at the 6 MB body limit, extrapolation gives a freeze of hours. Two other high-priority problems are not about code on this branch:

- The live site (`main` on Vercel) has no backend, so it **silently loses every customer enquiry** while telling the visitor it was sent.
- None of the fixes on this branch have been merged or deployed yet.

The remaining findings are defence-in-depth and process gaps: no MFA, no audit trail, unpinned CI actions, end-of-life Node.js 20, and dev and production apparently sharing one database.

| Severity | Count |
|---|---|
| Critical | 0 (4 fixed earlier on this branch, see §5.0) |
| High | 3 |
| Medium | 8 |
| Low | 15 |
| Info | 6 |

---

## 2. Top 5 priorities

1. **Fix the sanitizer ReDoS (H-1).** Remove the regex HTML stripping, and cap request bodies at about 100 KB everywhere except the upload route. This is a one-request outage today.
2. **Stop losing leads on the live site (H-2).** Either host the backend, or make the form fail loudly. It must never fake success.
3. **Merge and deploy `security-fixes` (H-3)** once H-1 is fixed, so the hardened code is what actually runs.
4. **Rate-limit the forgot-password endpoint, and require the current password when changing your own password (M-1, M-2).** These close the remaining account-abuse paths.
5. **Separate the dev and production databases (M-6), and harden CI/CD (M-5):** pin actions to commit SHAs, set least-privilege permissions, use immutable image tags, and add a deploy approval step.

---

## 3. Architecture and data flow

**Components**
- **Frontend:** a React 19 + Vite + TypeScript single-page app, served as static files by Vercel (live) or by nginx in Docker.
- **API:** Express 5 on Node 20 (`backend/src/index.js`, port 3001). There is also a Lambda handler (`backend/src/lambda.js`, `serverless.yml`) that isn't deployed.
- **Database:** MongoDB Atlas via Mongoose (`mongodb+srv`, TLS). Collections:
  - `adminusers`
  - `products`
  - `inquiries`, which holds personal data
  - `loginattempts`
  - `passwordresets`
  - `revokedtokens`
- **Third parties:**
  - Cloudinary: product images, publicly readable
  - Resend: email
  - Cloudflare Turnstile: CAPTCHA
  - Docker Hub: public images
  - GitHub Actions: CI/CD
  - an EC2 deploy path: prepared, not in use

**HTTP surface**

| Access | Endpoints |
|---|---|
| Public | `GET /api/health`, `GET /api/products`, `POST /api/inquiries`, `POST /api/auth/login`, `/forgot-password`, `/reset-password` |
| Any admin (JWT) | `/api/auth/me`, `/logout`, `PATCH /users/:id/password` (self), products create/update/delete, inquiries list/update/delete, `POST /api/upload-image` |
| Super Admin | `GET /api/auth/users`, `POST /register`, `DELETE /users/:id`, setting another admin's password |
| Non-production only | `/api/docs`, `/api/docs.json` |

**Data flow**
- **Untrusted input comes in through:** the enquiry forms, the login and reset endpoints, admin-supplied product content and base64 images, and the `X-Forwarded-For` header.
- **Personal data is stored in:**
  - MongoDB `inquiries`
  - transient copies in the visitor's `localStorage` when the API is unreachable
- **Data leaves the system through:**
  - Resend emails: lead details to the admin, reset codes to admins
  - the admin's CSV export
  - WhatsApp deep links
  - Cloudinary uploads
  - the Turnstile check: token plus visitor IP

---

## 4. Threat model

**Trust boundaries**
1. Internet → edge (Vercel, or Caddy and nginx) → API.
2. Admin browser ↔ API, using a bearer token stored in `localStorage`.
3. API → Atlas, Cloudinary, Resend and Turnstile.
4. GitHub Actions → public Docker Hub → EC2 over SSH.
5. Developer laptop (`.env.local`, seed scripts) → the Atlas database.

**Likely attackers**
- Unauthenticated bots: spam, credential stuffing, denial of service. This is the most likely.
- A low-privilege admin trying to escalate.
- Someone who has stolen an admin session.
- A malicious npm dependency or a compromised CI account.
- A lost or compromised developer laptop.

**Top risks for this system**
1. Bulk theft of lead personal data through admin takeover.
2. Loss of leads and business. This is happening today; see H-2.
3. Service outage caused by unauthenticated requests (H-1).
4. A CI or Docker Hub compromise ending in a malicious image deployed.
5. A leaked developer `.env.local` exposing the production database.

---

## 5. Detailed findings

### 5.0 Previously fixed on this branch (for coverage)

These were found and fixed earlier in this engagement (commit `54099e1`). They are **still present on `main`**; see H-3.

| Original severity | Issue | Fix |
|---|---|---|
| Critical | Hardcoded admin password in the frontend bundle, in docs and in Swagger | Removed; the password in the database was changed |
| Critical | Browser-side login fallback that created fake sessions | Removed; only the backend can grant a session |
| Critical | Password-reset code returned in the API response | Removed; 5 wrong guesses allowed per code |
| Critical | Default JWT secret in `serverless.yml` | Removed; the deploy now fails if the secret is unset |
| High | Port 3001 published, allowing `X-Forwarded-For` spoofing | Port closed; Caddy overwrites the header (tested) |
| High | Plaintext admin passwords stored in `localStorage` | Removed, and old entries are purged |
| Medium | No roles, no session invalidation, no CSP, no HTTPS, Swagger public | All fixed and tested |

---

### HIGH

#### H-1 — Quadratic ReDoS in the request sanitizer: one unauthenticated request freezes the whole API
- **Severity:** High
- **Category:** Denial of service / input handling
- **Location:**
  - `backend/src/middleware/sanitize.js:19-23`, function `sanitizeString`
  - applied app-wide in `backend/src/app.js:49`
  - body limit set in `backend/src/config.js:59` (`JSON_BODY_LIMIT = '6mb'`)
- **Status:** Confirmed (reproduced locally)
- **Description:** The tag-stripping regex
  `/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi` (and its `iframe`, `object` and `embed` copies) backtracks quadratically on input that contains many opening tags and no closing tag. The middleware runs on every request, before routing and before any rate limiter, against any JSON body up to 6 MB. Node runs on a single thread, so while one request is being sanitized, every other request waits.
- **Evidence (measured on a throwaway local instance):**

  | Body | Time to answer one request |
  |---|---|
  | 49 KB of `<script` | 0.44 s |
  | 195 KB | 6.7 s |
  | 300 KB | 15.6 s; an innocent `/api/health` sent meanwhile waited **14.1 s**, against 0.003 s normally |
  | 391 KB | 27.1 s |
  | 6 MB (extrapolated) | roughly hours |

  The request went to an unknown URL (`POST /api/nope`), so no authentication, CAPTCHA or valid route is needed.
- **Impact:** Any anonymous person can take the API down repeatedly: no enquiries, no admin panel. On Lambda or Vercel functions this would also run up compute cost.
- **Remediation (Small):**
  1. Delete the HTML-stripping half of the sanitizer. It isn't the real XSS defence, because React escapes output and the email template escapes HTML (`email.js:7`). Keep the `$` / `.` / `__proto__` key stripping.
  2. Cap body size per route:
     ```js
     // app.js
     app.use('/api/upload-image', express.json({ limit: JSON_BODY_LIMIT })); // 6mb, admin-only
     app.use(express.json({ limit: '100kb' }));                               // everything else
     ```
  3. Add a regression test that posts a 1 MB string of `<script` and asserts a quick response.

#### H-2 — Live site silently discards customer enquiries
- **Severity:** High
- **Category:** Business logic / data integrity
- **Location:** `frontend/src/services/api/backend.ts`, functions `saveInquiry` (around lines 116-127), `updateInquiryStatus`, `deleteInquiry` and `deleteProductFromDb` (around lines 356-365)
- **Status:**
  - Code behaviour: Confirmed.
  - Live impact: Confirmed by the owner's statement that no backend is hosted.
- **Description:** If the API call fails for any reason (network error, 5xx, rate limit, or no backend at all), `saveInquiry` stores the lead in the *visitor's own* `localStorage` and returns `{ success: true }`. The visitor sees "sent", but nobody ever receives the lead. Admin update and delete calls likewise fall back to `localStorage` and report success when the API is unreachable.
- **Evidence:**
  ```ts
  if (!res.ok) {
    console.warn('Inquiry API failed, saving to local store');
    saveLocalInquiry(newRecord);
    return { success: true, data: newRecord };
  }
  ```
- **Impact:** Every enquiry on the live Vercel site is lost today. The admin can also believe a lead was deleted when it wasn't, which is a DPDP deletion-request risk.
- **Remediation (Small):** Return `{ success: false, error: 'Could not send. Please call or WhatsApp us.' }` on failure, and show the phone and WhatsApp fallback. Remove the `localStorage` fallbacks for admin writes. Host the backend before relying on the form.

#### H-3 — Security fixes are not merged or deployed; `main` still contains the critical flaws
- **Severity:** High (it becomes Critical as soon as a backend is deployed from `main`)
- **Category:** Deployment / change management
- **Location:** branch `main` (commit `6122d30`, the live Vercel source), compared with `security-fixes`
- **Status:** Confirmed (git)
- **Description:** Everything in §5.0 exists only on the `security-fixes` branch.
  - On `main`, the frontend bundle still contains the old admin credentials and the fake-login fallback. The database password was changed, so that path now only opens a fake local dashboard.
  - `serverless.yml` on `main` still carries the default JWT secret.
- **Impact:** If a backend is deployed from `main` (for example `serverless deploy` without `JWT_SECRET`), anyone can forge admin tokens and read every lead.
- **Remediation (Small):** Fix H-1 on the branch, open the PR, review it, and merge it before hosting any backend.

---

### MEDIUM

#### M-1 — Forgot-password endpoint has no effective rate limit (email flooding and reset denial of service)
- **Category:** Authentication
- **Location:**
  - `backend/src/middleware/rateLimit.js:14` (`skipSuccessfulRequests: true`)
  - `backend/src/routes/auth.js`, the `/forgot-password` handler
- **Status:** Confirmed (code)
- **Description:** `forgot-password` always answers 200, and the shared `loginLimiter` skips successful responses, so these requests are never counted. Each request also deletes the previous code.
- **Impact:** An attacker who knows an admin email can:
  - flood that inbox with reset emails, using up Resend quota and sender reputation
  - keep invalidating the admin's legitimate reset code, so the admin can never finish a reset
- **Remediation (Small):** Use a dedicated limiter that counts every request, for example 5 per hour per IP. Add a per-email cooldown in the database, for example ignoring new requests if a code was issued in the last 60 s.

#### M-2 — Changing your own password does not require the current password
- **Category:** Authentication
- **Location:** `backend/src/routes/auth.js`, `PATCH /users/:id/password` (the `isSelf` branch)
- **Status:** Confirmed (code)
- **Description:** With only a valid token, a user can set a new password for their own account. The response hands back a fresh token, and every other session for that account is ended.
- **Impact:** A stolen session (shared PC, XSS) becomes permanent account takeover, and the real owner is logged out and locked out.
- **Remediation (Small):** When `isSelf`, require `currentPassword` and check it with `bcrypt.compare` before changing anything. Super-admin resets of *other* accounts can stay as they are.

#### M-3 — No multi-factor authentication on admin accounts
- **Category:** Authentication
- **Location:** `backend/src/routes/auth.js`, `/login`
- **Status:** Confirmed
- **Impact:** A single phished or reused password exposes all lead personal data.
- **Remediation (Medium):** Add TOTP for at least Super Admins (for example with `otplib`), plus recovery codes.

#### M-4 — No audit log of security-relevant actions
- **Category:** Logging
- **Location:**
  - all admin routes
  - `backend/src/routes/auth.js`, `inquiries.js`, `products.js`
- **Status:** Confirmed
- **Description:** None of these are recorded:
  - logins and failed logins
  - admin creation and deletion
  - password changes
  - lead deletion
  - CSV exports
- **Impact:** You can't detect or investigate misuse, and it is hard to show DPDP accountability.
- **Remediation (Medium):** Add an `AuditLog` collection: `{ at, actorId, action, targetId, ip }`, written from each handler, with a TTL of about 1 year.

#### M-5 — CI/CD supply-chain weaknesses
- **Category:** CI/CD
- **Location:** `.github/workflows/ci-cd.yml`, `docker-compose.yml`
- **Status:**
  - Confirmed (code): unpinned actions, missing permissions block, mutable tags, token stored on EC2.
  - **Needs Verification:** branch protection rules and whether a GitHub Environment gates the deploy.
- **Description:**
  - Third-party actions are pinned to tags, not commit SHAs: `appleboy/ssh-action@v1.0.3`, `appleboy/scp-action@v0.1.7` and the `docker/*` actions. A moved tag would run attacker code with the EC2 SSH key and the Docker Hub token.
  - There's no `permissions:` block, so `GITHUB_TOKEN` gets the repository default, which may include write access.
  - Images are pushed to a **public** Docker Hub repository (`akashiseijuro23/attri-backend`, 48 pulls) under the mutable tags `v1` and `latest`, and EC2 deploys `:v1`.
  - Every push to `main` deploys straight to production with no approval step.
  - The deploy runs `docker login` on EC2, which saves the Docker Hub token to the server's disk (`~/.docker/config.json`).
- **Impact:** A compromised action, tag or Docker Hub account leads straight to code execution in production.
- **Remediation (Small):**
  ```yaml
  permissions:
    contents: read
  # pin by SHA, e.g.
  - uses: appleboy/ssh-action@<full-40-char-commit-sha> # v1.x
  ```
  Also:
  - deploy the immutable `${{ github.sha }}` tag
  - add an `environment: production` with required reviewers
  - use a read-only Docker Hub token on EC2, or make the repository private
  - enable branch protection on `main`

#### M-6 — Development appears to use the production database
- **Category:** Secrets / environment separation
- **Location:**
  - `.env.local` (local, gitignored): `mongodb+srv://…@clus…atrloli.mongodb.net/attri_nexus`
  - the production deployment guide on `main` (`EC2_DEPLOYMENT_GUIDE.md:57`), which names the same cluster and database (`cluster0.atrl…`, `attri_nexus`). This branch replaces it with a placeholder.
- **Status:** **Needs Verification.** The owner should confirm whether the Atlas database `attri_nexus` is the production one.
- **Description:** The local dev server, seed scripts and tests run with full read/write credentials to what appears to be the production cluster and database.
- **Impact:**
  - A local mistake, such as running a seed script or deleting during testing, changes real data.
  - A stolen laptop or `.env.local` exposes all leads.
- **Remediation (Small):**
  - Create a separate `attri_nexus_dev` database, or a free dev cluster, with its own database user.
  - Give production its own user with the minimum role it needs.
  - Restrict Atlas Network Access.

#### M-7 — Node.js 20 is end-of-life
- **Category:** Infrastructure / dependencies
- **Location:**
  - `backend/Dockerfile:7,16`
  - `frontend/Dockerfile:7`
  - `.github/workflows/ci-cd.yml:32`
  - `backend/serverless.yml:7` (`nodejs20.x`)
- **Status:** Confirmed. Node 20 reached end-of-life on 30 April 2026.
- **Impact:** No more security patches for the runtime.
- **Remediation (Small):** Move to Node 22 LTS (`node:22-alpine`, `nodejs22.x`, `node-version: 22`) and rerun the tests.

#### M-8 — CSV formula injection in the lead export
- **Category:** Injection
- **Location:** `frontend/src/pages/admin/AdminDashboardPage.tsx:879-897`, export handler
- **Status:** Confirmed (code)
- **Description:** `csvSafe` neutralises formulas at the *start* of a field. However, `phone` and `email`, which come from the public form with no format validation, are not quote-escaped. A value such as `x","=HYPERLINK("http://evil","Click")` closes the cell and starts a new one with `=`.
- **Impact:** When an admin opens the export in Excel or Sheets, an attacker-planted formula can phish the admin or, with an `IMPORTXML`-style formula, leak other cells.
- **Remediation (Small):** Apply quote-escaping and `csvSafe` to **every** field through one helper:
  ```ts
  const cell = (v: unknown) => `"${csvSafe(String(v ?? '')).replace(/"/g, '""')}"`;
  ```
  Also validate phone and email formats on the server.

---

### LOW

| ID | Title | Location | Status | Remediation |
|---|---|---|---|---|
| L-1 | User enumeration through forgot-password timing: existing accounts wait for the Resend call, unknown ones return at once | `routes/auth.js`, `/forgot-password` | Confirmed (code) | Answer immediately, and send the email in the background without awaiting it |
| L-2 | Root dev dependency `concurrently` pulls in `shell-quote` 1.8.4–1.10.0 (GHSA-pqg4-j6r4-53mv, rated critical upstream). Dev-only and not currently installed | `package.json`, `package-lock.json` | Confirmed (`npm audit`) | `npm audit fix` in the repo root |
| L-3 | The token-revocation lookup fails *open* on a database error, so a logged-out token could pass | `lib/revocation.js:64-66` | Confirmed (code) | Return `true` (treat as revoked) on error; `requireAdmin` already returns 503 when the DB is down |
| L-4 | Rate limits use in-memory storage (per instance, reset on restart, weak on serverless) and count per IP only, with no per-account limit across IPs | `middleware/rateLimit.js` | Confirmed | Store counters in MongoDB or Redis; add a per-email cap |
| L-5 | Admin token in `localStorage` with a 7-day lifetime | `frontend/src/services/api/auth.ts` | Confirmed | Shorten to 8–24 h, or move to an `HttpOnly` cookie; CSP already reduces the risk |
| L-6 | Base images not pinned by digest (`node:20-alpine`, `nginx-unprivileged:alpine`, `caddy:2.8-alpine`, `mongo:7.0`); Caddy 2.8 is behind the current release | Dockerfiles, compose | Confirmed | Pin `image@sha256:…`; let Dependabot or Renovate bump them |
| L-7 | No minimum strength check on `JWT_SECRET` at startup | `backend/src/config.js` | Confirmed | Refuse to start if it is shorter than 32 characters |
| L-8 | A real (expired) admin token with its account ID is committed; git history holds the old default JWT secret, the old admin password and the Atlas cluster hostname | `backend/api-testing.txt:451` (`eyJh…`), git history | Confirmed. The token isn't signed with any known secret and expired on 2026-09-09; no account still uses the old password (read-only check) | Replace with `<YOUR_JWT_TOKEN>`; rewriting history is optional |
| L-9 | Public Docker Hub images contain the full backend source and the pre-fix frontend bundle | Docker Hub `akashiseijuro23/*` | Confirmed (public metadata) | Make the repositories private, or accept that the code is public |
| L-10 | Compose: MongoDB authentication off by default; no CPU or memory limits on containers | `docker-compose.yml` | Confirmed | Require `MONGO_ROOT_*` when the bundled database is used; add `mem_limit` and `cpus` |
| L-11 | The EC2 guide allows SSH from `0.0.0.0/0` | `EC2_DEPLOYMENT_GUIDE.md:13` | Confirmed (doc) | Restrict to the admin IP, or use SSM Session Manager |
| L-12 | `seed-admin` takes the password as a command-line argument, which lands in shell history and the process list | `backend/scripts/seed-admin.js:17` | Confirmed | Read it from a hidden prompt or from stdin |
| L-13 | The Vercel CSP allows API calls to any `https:` origin | `vercel.json`, `frontend/vercel.json` | Confirmed | Narrow to the real API origin once the backend is hosted |
| L-14 | The "Commercial Admin" role can create, edit and delete products and upload images, though the UI describes it as "Inquiries & Quotes" | `routes/products.js`, `routes/upload.js` | Needs owner decision | If intended, update the UI label; if not, require Super Admin for product writes |
| L-15 | Enquiry `phone` and `email` have no format validation; a non-string `notes` value causes a 500 instead of a 400 | `routes/inquiries.js` | Confirmed (code) | Validate formats and types and return 400 |

---

### INFO

| ID | Observation |
|---|---|
| I-1 | Express 5 re-parses `req.query` each time it is read, so sanitising it in place has no lasting effect. Tested: a deleted key reappeared. No impact today, because the default "simple" query parser doesn't create nested objects and no route reads `req.query`. Don't rely on that sanitiser for query strings in future. |
| I-2 | The HTML-stripping sanitizer silently changes stored data, including passwords: for example, text containing `onclick=` is rewritten. It works only because the same change happens at signup and at login. It goes away with the H-1 fix. |
| I-3 | `frontend/.github/workflows/playwright.yml` never runs, because GitHub only reads the repo-root `.github`. CI runs no security scanning and doesn't run the backend test suite (only `node -c`). |
| I-4 | `@scarf/scarf`, pulled in by `swagger-ui-dist`, runs an install-time telemetry script. Opt out with `SCARF_ANALYTICS=false`. |
| I-5 | A Python bytecode file is committed (`load-tests/__pycache__/…pyc`). `playwright` is pinned to an alpha build (legitimate Microsoft package; the latest stable is 1.64.1). |
| I-6 | The account `ma***@attrinexus.com` still has the legacy role `admin`, which works but can't manage admins. Its password isn't publicly known (read-only check). |

---

## 6. Categories checked with no issues found

| Area | Result |
|---|---|
| Password hashing | Checked, no issues. bcrypt, cost 12, per-hash salt, 128-character maximum against bcrypt denial of service, constant-time dummy compare for unknown emails |
| JWT | Checked, no issues. HS256 pinned for both signing and verifying (rejects `none` and algorithm confusion), 7-day expiry, server-side revocation, account re-checked on every request, sessions ended on password change |
| Reset codes | Checked, no issues. `crypto.randomInt`, stored hashed, 15-minute expiry, at most 5 guesses (atomic), never returned in responses |
| Authorization | Checked, no issues. Every admin route has `requireAdmin`; Super Admin routes enforced on the server; no role is accepted from the client; product writes use an allowlist and a strict schema (no mass assignment). Single-tenant, so object-level access checks don't apply |
| NoSQL injection and prototype pollution | Checked, no issues. String type checks on auth inputs; `$`, `.` and `__proto__` keys stripped from bodies; IDs validated |
| Command injection, deserialization, XXE | Checked, no issues. No `child_process`, `eval`, YAML or XML in runtime code (only Vercel's build command uses `execSync`, with fixed strings) |
| XSS | Checked, no issues. No `dangerouslySetInnerHTML` or `innerHTML`; React escapes output; the email template escapes HTML; `tel:` and `wa.me` links are built with fixed schemes and `encodeURIComponent` |
| Path traversal and SSRF | Checked, no issues. Upload filenames are generated on the server; the server never fetches a user-supplied URL |
| Cryptography | Checked, no issues. `crypto.randomUUID`, `randomInt` and `getRandomValues` for secrets; MD5 used only for ETags; TLS verification is never disabled |
| CORS | Checked, no issues. Explicit allowlist, `credentials: false`, no wildcard |
| Security headers | Checked, no issues. helmet on the API; CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` and `Permissions-Policy` on nginx, Vercel and Caddy (tested in a browser and with curl) |
| Swagger | Checked, no issues. Off in production unless `ENABLE_API_DOCS=true` |
| Uploads | Checked, no issues. Admin-only, rate-limited, 3 MB decoded limit, magic-byte check (JPEG, PNG, WebP, AVIF), no SVG, generated filename. No temporary files |
| Error handling | Checked, no issues. Generic 500 message in production; no secrets or personal data in logs (the reset code is logged only when `NODE_ENV=development`) |
| Webhooks | Not applicable (none) |
| Containers | Checked, no issues. Both images run as non-root users; `.dockerignore` excludes `.env*`; no privileged mode or host mounts; database and API ports not published |
| CI triggers | Checked, no issues. No `pull_request_target`; pull requests from forks get no deploy secrets |
| Dependencies | `backend` and `frontend`: `npm audit` reports 0 issues (dev dependencies included). All packages come from `registry.npmjs.org` (no git URLs); lockfiles present |
| Transport | Checked, no issues. Atlas over `mongodb+srv` (TLS); Caddy automatic HTTPS with redirect and HSTS (tested locally) |

---

## 7. Remediation roadmap

**Immediate (24–48 hours)**
1. H-1: remove the regex HTML stripping and add per-route body limits, with a regression test.
2. H-2: make enquiry submission fail visibly and show phone and WhatsApp alternatives.
3. H-3: open, review and merge the `security-fixes` PR, which will include the H-1 and H-2 fixes.
4. M-6: confirm whether dev uses the production database. If it does, create a dev database and user, and rotate the Atlas password that is on the laptop.
5. L-8: replace the committed token in `backend/api-testing.txt`.

**Short term (1–2 weeks)**
- M-1: forgot-password limiter and cooldown.
- M-2: current password required for self-service changes.
- M-8: CSV escaping helper, plus server-side phone and email validation (L-15).
- M-5: pin actions by SHA, add a `permissions` block, deploy immutable tags, add an approval environment, enable branch protection, use a private or read-only image registry setup.
- M-7: upgrade to Node 22.
- L-3, L-7, L-1, L-2: small one-line fixes.
- Host the backend (Vercel functions, Render or EC2) with production-only secrets.

**Long term (hardening, process, tooling)**
- M-3: TOTP MFA for admins.
- M-4: audit log collection plus an admin view.
- L-4: shared rate-limit store.
- L-5: shorter token lifetime, or an `HttpOnly` cookie session.
- L-6: base images pinned by digest, with Renovate or Dependabot.
- A documented secret-rotation runbook (§9) and a backup restore test.

---

## 8. Recommended CI security gates (run on every pull request)

```yaml
# .github/workflows/security.yml
name: security
on: [pull_request]
permissions: { contents: read }
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>        # pin
        with: { fetch-depth: 0 }
      - uses: gitleaks/gitleaks-action@<sha>   # secrets, including history
      - uses: actions/setup-node@<sha>
        with: { node-version: 22 }
      - run: npm ci --prefix backend && npm --prefix backend test   # 63 tests incl. auth/security
      - run: npm audit --audit-level=high --prefix backend && npm audit --audit-level=high --prefix frontend && npm audit --audit-level=high
      - uses: returntocorp/semgrep-action@<sha>   # p/javascript, p/nodejsscan, p/owasp-top-ten
      - uses: aquasecurity/trivy-action@<sha>     # fs + config scan of Dockerfiles/compose
        with: { scan-type: fs, scanners: 'vuln,misconfig,secret' }
      - uses: hadolint/hadolint-action@<sha>
        with: { dockerfile: backend/Dockerfile }
```

Also enable GitHub secret scanning with push protection, and Dependabot alerts and updates.

---

## 9. Operational resilience

| Item | Status |
|---|---|
| Backups | **Needs Verification.** Nothing in the repo. Check the Atlas tier: free M0 clusters have no automated backups. |
| Monitoring and alerting | Not present. Recommended: uptime checks on `/api/health`, and alerts on 5xx rate and failed-login spikes. |
| Secret rotation | No documented process. Keep a runbook that says where each secret lives and how to rotate it: JWT (logs everyone out), Atlas user, Cloudinary, Resend, Turnstile, Docker Hub token, EC2 key. |
| Incident response | Current abilities: a Super Admin can delete an admin, which locks them out at once; changing `JWT_SECRET` ends all sessions. Not documented. |

---

## 10. Limitations

- **No automated scanners were run** (gitleaks, trufflehog, semgrep, trivy, grype, hadolint, osv-scanner, checkov). None were installed, and permission to download them wasn't given. The secret search of git history used manual pattern matching, which is less thorough than gitleaks.
- **Docker images could not be built, pulled or scanned:** Docker Hub authentication fails on this network (a TLS/proxy error).
- **nginx could not be run on this machine** (Windows socket permission error 10013). Its config passed syntax validation, and its CSP was tested separately in a browser.
- **No access** to the Vercel, MongoDB Atlas, AWS, GitHub repository settings or Docker Hub consoles. As a result, the following were not verified:
  - branch protection
  - Atlas network access, users, tier and backups
  - Vercel environment variables
  - IAM
- **No production endpoints were contacted.** Behaviour on live Vercel is inferred from the code and the owner's statement.
- The Turnstile widget and Let's Encrypt issuance can only be tested on a deployed domain with real keys.
- Database checks were read-only: listing admin accounts and comparing password hashes locally against known-public passwords. Only yes/no results were printed.
