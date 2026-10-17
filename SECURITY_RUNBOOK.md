# Security Runbook — Attri Nexus

What to do, step by step, when a secret must be changed, something looks wrong, or data must be restored. Keep this file current whenever a new secret or service is added.

---

## 1. Where every secret lives

| Secret | Used by | Stored in | Rotation effect |
|---|---|---|---|
| `JWT_SECRET` | API (signs admin sessions) | Server `.env` / Vercel env / Lambda env | **Every admin is signed out** |
| `MONGODB_URI` (Atlas user + password) | API, seed scripts | Server `.env`, each developer's `.env.local` | API restarts with the new user |
| `CLOUDINARY_URL` / `CLOUDINARY_API_SECRET` | API (image upload) | Server `.env` | Uploads fail until updated |
| `RESEND_API_KEY` | API (emails) | Server `.env` | Emails fail until updated |
| `TURNSTILE_SECRET_KEY` | API (CAPTCHA check) | Server `.env` | Enquiry form fails until updated |
| `DOCKERHUB_TOKEN` (read & write) | GitHub Actions build | GitHub → Settings → Secrets | CI pushes fail until updated |
| `DOCKERHUB_PULL_TOKEN` (read-only) | EC2 deploy | GitHub → Settings → Secrets | Deploys fail until updated |
| `EC2_SSH_KEY` | GitHub Actions deploy | GitHub → Settings → Secrets, AWS key pair | Deploys fail until updated |
| Admin passwords + two-factor | People | bcrypt hashes / TOTP secrets in MongoDB | — |

`VITE_TURNSTILE_SITE_KEY` is public by design and is not a secret.

**Rule:** development, staging and production each get their **own** values for every row above. A developer laptop must never hold production credentials.

---

## 2. Rotating a secret

Do it when someone with access leaves, a laptop is lost, a secret is pasted anywhere public (chat, ticket, screenshot, git), or once a year.

1. **JWT_SECRET**
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
   Put the new value in the server `.env` (or the Vercel/Lambda settings) and restart: `docker compose up -d backend`. All sessions end; admins sign in again.
2. **Atlas database password** — Atlas → *Database Access* → edit the user → *Edit Password* → update `MONGODB_URI` everywhere it is used → restart. Prefer creating a new user first, switching to it, then deleting the old one (no downtime).
3. **Cloudinary / Resend / Turnstile** — create a new key in the provider dashboard, update `.env`, restart, then **delete the old key** in the dashboard.
4. **Docker Hub tokens** — Docker Hub → *Account settings → Personal access tokens* → generate (read & write for CI, read-only for EC2) → update the GitHub secrets → revoke the old token.
5. **EC2 SSH key** — create a new key pair, add its public key to `~/.ssh/authorized_keys` on the server, update `EC2_SSH_KEY`, run a deploy to confirm, then remove the old public key line.

After any rotation, check *Security activity* in the dashboard (Admin Team page) and the server logs for errors.

---

## 3. Incident response

### An admin account may be compromised
1. A Super Admin opens the dashboard → *Admin Team*.
2. **Delete** the account (access ends on the very next request), or **change its password** (all its sessions end immediately).
3. If the attacker may have the second factor too, use **Reset 2FA** and have the owner set it up again.
4. Review *Security activity* for what that account did (lead exports, deletes, admin changes).
5. If customer data was exported or viewed by an outsider, follow §5.

### The Super Admin's own account may be compromised
On a trusted machine with database access:
```bash
cd backend
npm run seed:admin -- you@example.com     # prompts for a new password, ends every session
```
Then rotate `JWT_SECRET` (§2.1) to end every session of every account, and review the audit log.

### A server secret leaked
Rotate it (§2) first, then work out how it leaked. If it was committed to git, rotating is mandatory — deleting the commit does not help, because clones and caches keep it.

### The site is under attack (spam, brute force, flooding)
- Rate limits and lockouts already apply per IP and are shared across instances.
- Watch *Security activity* for repeated `Failed sign-in` / `Wrong two-factor code` from one IP; block that IP in the AWS Security Group or at the CDN.
- If the enquiry form is flooded, make sure `TURNSTILE_SECRET_KEY` is set (CAPTCHA on).

---

## 4. Backups and restore

**Atlas free (M0) clusters have no automatic backups.** Either upgrade to a tier with Cloud Backup (Atlas → *Backup* → enable, choose retention), or take your own:

```bash
# Requires MongoDB Database Tools (mongodump/mongorestore) on a trusted machine.
mongodump --uri="$MONGODB_URI" --gzip --archive="attri-$(date +%F).archive.gz"
# Encrypt before storing anywhere else - the archive contains customer personal data.
gpg --symmetric --cipher-algo AES256 "attri-$(date +%F).archive.gz" && rm "attri-$(date +%F).archive.gz"
```

**Test a restore every quarter** into a separate test database — a backup that has never been restored is not a backup:
```bash
gpg -d attri-YYYY-MM-DD.archive.gz.gpg > restore.archive.gz
mongorestore --uri="mongodb+srv://<test-user>:<pass>@<cluster>/" --gzip --archive=restore.archive.gz \
  --nsFrom='attri_nexus.*' --nsTo='attri_nexus_restore_test.*'
```
Check that `inquiries`, `products` and `adminusers` counts match, then drop the test database.

---

## 5. Personal-data incidents (DPDP Act 2023)

If customer enquiry data may have reached someone unauthorised:
1. Contain it (§3), and keep the audit log entries and server logs.
2. Work out which records and fields were involved and when.
3. The DPDP Act requires notifying the Data Protection Board of India and the affected people. Take legal advice on timing and content.

---

## 6. Monitoring

Set these up once (all have free tiers):
- **Uptime check** on `https://<your-domain>/api/health` every 5 minutes (UptimeRobot, Better Stack, or AWS Route 53 health checks), alerting by email/SMS.
- **Atlas alerts** — Atlas → *Alerts*: connections spike, disk usage, and *"User login failed"* events.
- **Weekly look at Security activity** in the dashboard for unexpected exports, deletes or failed sign-ins.
- **GitHub** — keep Dependabot alerts, secret scanning and the *Security Scans* workflow enabled; treat a red scan like a failing test.

---

## 7. Separating development from production (one-time)

1. In Atlas, create a database user `attri_dev` with *readWrite* on **`attri_nexus_dev` only**.
2. In every developer's `.env.local`, point `MONGODB_URI` at `.../attri_nexus_dev` with that user.
3. Create a production user `attri_prod` with *readWrite* on `attri_nexus` only; use it only in the server's `.env`.
4. Delete any older user that has access to both, and restrict Atlas *Network Access* to the server's IP (plus your own while working).
