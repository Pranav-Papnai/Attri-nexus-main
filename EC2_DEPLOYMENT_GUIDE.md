# ☁️ AWS EC2 Complete Setup & CD Deployment Guide — Attri Nexus

Yeh guide aapko aapke **AWS EC2 Instance** ko configure karne aur **GitHub Actions CD Pipeline** se connect karne mein madad karegi.

---

## 1. 🛡️ AWS Security Group Inbound Rules

Aapke EC2 instance ke **Security Group** mein yeh Inbound rules hone chahiye:

| Type | Protocol | Port Range | Source | Description |
|---|---|---|---|---|
| **SSH** | TCP | `22` | **Aapka IP** (`<your-ip>/32`) — dekhiye neeche | Admin SSH + GitHub Actions deploy |
| **HTTP** | TCP | `80` | `0.0.0.0/0` | HTTPS certificate verification + http→https redirect |
| **HTTPS** | TCP | `443` | `0.0.0.0/0` | SSL/TLS Traffic |
| **Custom UDP** | UDP | `443` | `0.0.0.0/0` | HTTP/3 (optional) |

> ⚠️ Port `3001` (backend) aur `27017` (MongoDB) ko **kabhi bhi** public mat kholiye. Backend sirf Caddy → nginx ke through reachable hai; direct access se rate limits bypass ho sakte hain. Agar pehle se `3001` rule hai to use delete kar dijiye.

### 🔐 SSH ko internet se band rakhna

GitHub Actions ke runners ka IP har baar badalta hai, isliye SSH ko sirf aapke IP tak rakhne par automatic deploy SSH se nahi ho payega. Do safe tareeke:

1. **Recommended — SSH sirf aapke IP ke liye:** Security Group mein SSH source `<your-ip>/32` rakhiye. Deploy ke liye GitHub mein *Actions → CI/CD Pipeline → Run workflow* chalane se pehle EC2 console mein temporary rule add kijiye, ya EC2 par khud `docker compose pull && docker compose up -d` chalaiye (IMAGE_TAG ke saath, section 5 dekhiye).
2. **Agar automatic deploy zaroori hai:** SSH `0.0.0.0/0` rakhna padega — tab server par **password login band** kijiye aur brute-force rokne ke liye fail2ban lagaiye:
   ```bash
   sudo sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication no/; s/^#\?PermitRootLogin .*/PermitRootLogin no/' /etc/ssh/sshd_config
   sudo systemctl restart ssh
   sudo apt install -y fail2ban && sudo systemctl enable --now fail2ban
   ```
   Is setup mein sirf aapki private key (`EC2_SSH_KEY`) se login ho sakta hai.

---

## 2. 💻 EC2 Instance par Docker Setup (One-Time Setup)

Apne EC2 par SSH se connect karein:
```bash
ssh -i /path/to/your-key.pem ubuntu@<YOUR-EC2-PUBLIC-IP>
```

Phir yeh command run karein Docker aur Docker Compose install karne ke liye:
```bash
# Update and install Docker
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 unattended-upgrades

# Security updates automatically install hon
sudo dpkg-reconfigure -plow unattended-upgrades

# Allow non-root user (ubuntu) to run Docker
sudo usermod -aG docker $USER
newgrp docker

# Verify Docker is running
docker --version
docker compose version
```

---

## 3. 📂 EC2 par Project Directory aur `.env` Setup

EC2 par directory banayein aur `.env` file daalein:

```bash
mkdir -p ~/attri-nexus
cd ~/attri-nexus
nano .env
chmod 600 .env   # sirf aapka user is file ko padh sake
```

`.env` ke andar apne real credentials paste karein (Ctrl+O, Enter, Ctrl+X karke save karein):
```env
# Kam se kam 32 characters. Banane ke liye: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=your_jwt_secret_here
# Production ka apna database user use kijiye — development wala nahi (SECURITY_RUNBOOK.md dekhiye)
MONGODB_URI=mongodb+srv://<prod-username>:<password>@<your-cluster>.mongodb.net/attri_nexus?retryWrites=true&w=majority
PORT=3001
NODE_ENV=production
# Automatic HTTPS (Let's Encrypt). Domain ka DNS A-record is EC2 ke public IP par point hona chahiye.
SITE_ADDRESS=attrinexus.com, www.attrinexus.com
CORS_ORIGIN=https://attrinexus.com,https://www.attrinexus.com
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
RESEND_API_KEY=re_123456789_your_resend_api_key_here
ADMIN_NOTIFICATION_EMAIL=your_email@gmail.com
FROM_EMAIL=Attri Nexus <onboarding@resend.dev>
```

> 🔒 **HTTPS:** `SITE_ADDRESS` set hone par Caddy container khud certificate leta hai, renew karta hai, aur `http://` ko `https://` par redirect karta hai. Domain abhi nahi hai to `SITE_ADDRESS` hata dijiye — site plain HTTP par chalegi (sirf testing ke liye; admin password HTTP par unencrypted jaata hai). Tab `CORS_ORIGIN=http://<YOUR-EC2-PUBLIC-IP>` rakhiye.

> 🗄️ **Atlas ke bina local MongoDB:** `.env` mein `MONGO_ROOT_USERNAME` aur kam se kam 16 characters ka `MONGO_ROOT_PASSWORD` daaliye, `MONGODB_URI=mongodb://<user>:<pass>@mongodb:27017/attri_nexus?authSource=admin` rakhiye, aur `docker compose --profile local-db up -d` chalaiye. Bina password ke MongoDB start hi nahi hoga.

### Pehla Super Admin banana

Deploy ke baad EC2 par (password type karte waqt screen par nahi dikhega, aur shell history mein bhi nahi jayega):
```bash
docker exec -it attri-nexus-backend node scripts/seed-admin.js you@example.com --name "Your Name"
```
Phir dashboard → Admin Team mein **Two-factor authentication** on kar dijiye.

---

## 4. 🔑 GitHub Secrets Configuration

GitHub Repo: [Settings ➔ Secrets and variables ➔ Actions](https://github.com/Pranav-Papnai/Attri-nexus-main/settings/secrets/actions) par jayein aur yeh Secrets add karein:

| Secret Name | Example Value | Description |
|---|---|---|
| `EC2_HOST` | `3.110.xxx.xxx` | Aapke EC2 ka Public IPv4 Address |
| `EC2_USER` | `ubuntu` | EC2 ka default user (Ubuntu ke liye `ubuntu`) |
| `EC2_SSH_KEY` | *(.pem file ka content)* | Aapki `.pem` file ka poora text content |
| `DOCKERHUB_USERNAME` | `akashiseijuro23` | Docker Hub username |
| `DOCKERHUB_TOKEN` | `dckr_pat_...` | Docker Hub token — **Read & Write** (sirf CI build ke liye) |
| `DOCKERHUB_PULL_TOKEN` | `dckr_pat_...` | Docker Hub token — **Read-only**, EC2 par pull ke liye (recommended) |

> **Tip for EC2_SSH_KEY**:
> Apni `.pem` file ko Notepad ya VS Code mein open karein aur pehli line (`BEGIN ... KEY`) se lekar aakhri line (`END ... KEY`) tak poora text copy karke secret value mein paste karein.

### 🛑 Deploy se pehle approval (strongly recommended)

1. *Settings → Environments → **production*** (pehle deploy ke baad yeh apne aap ban jata hai, ya "New environment" se banaiye).
2. **Required reviewers** mein khud ko add kijiye. Ab har deploy aapke "Approve" ke baad hi chalega.
3. *Settings → Branches → Add rule* `main` ke liye: **Require a pull request before merging** + **Require status checks** (`Test, Audit & Build`, `Security Scans`) on kijiye.

---

## 5. 🚀 Kaise Deploy Hoga?

Jab aap `main` par merge karenge:
1. GitHub Actions tests, `npm audit` aur security scans chalayega — fail hone par aage kuch nahi hoga.
2. Docker images build hokar Docker Hub par **commit SHA tag** ke saath push hongi (jaise `akashiseijuro23/attri-backend:<40-char-sha>`).
3. `deploy-ec2` job (approval ke baad):
   - EC2 se connect karega aur naya `docker-compose.yml` + `Caddyfile` copy karega.
   - **Bilkul wahi commit** pull karega jo test hua tha (`IMAGE_TAG=<sha>`), `latest` nahi.
   - `docker compose up -d` chalayega, phir `docker logout` — Docker Hub token server par save nahi rehta.

Haath se kisi specific version par deploy/rollback karna ho to EC2 par:
```bash
cd ~/attri-nexus
IMAGE_TAG=<commit-sha> docker compose pull && IMAGE_TAG=<commit-sha> docker compose up -d
```
