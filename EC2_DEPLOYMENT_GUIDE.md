# ☁️ AWS EC2 Complete Setup & CD Deployment Guide — Attri Nexus

Yeh guide aapko aapke **AWS EC2 Instance** ko configure karne aur **GitHub Actions CD Pipeline** se connect karne mein madad karegi.

---

## 1. 🛡️ AWS Security Group Inbound Rules

Aapke EC2 instance ke **Security Group** mein yeh Inbound rules hone chahiye:

| Type | Protocol | Port Range | Source | Description |
|---|---|---|---|---|
| **SSH** | TCP | `22` | `0.0.0.0/0` (ya aapka IP) | GitHub Actions SSH access |
| **HTTP** | TCP | `80` | `0.0.0.0/0` | HTTPS certificate verification + http→https redirect |
| **HTTPS** | TCP | `443` | `0.0.0.0/0` | SSL/TLS Traffic |
| **Custom UDP** | UDP | `443` | `0.0.0.0/0` | HTTP/3 (optional) |

> ⚠️ Port `3001` (backend) ko **kabhi bhi** public mat kholiye. Backend sirf Caddy → nginx ke through reachable hai; direct access se rate limits bypass ho sakte hain. Agar pehle se `3001` rule hai to use delete kar dijiye.

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
sudo apt install -y docker.io docker-compose-v2

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
```

`.env` ke andar apne real credentials paste karein (Ctrl+O, Enter, Ctrl+X karke save karein):
```env
JWT_SECRET=your_jwt_secret_here
MONGODB_URI=mongodb+srv://<username>:<password>@<your-cluster>.mongodb.net/attri_nexus?retryWrites=true&w=majority
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

---

## 4. 🔑 GitHub Secrets Configuration

GitHub Repo: [Settings ➔ Secrets and variables ➔ Actions](https://github.com/Pranav-Papnai/Attri-nexus-main/settings/secrets/actions) par jayein aur yeh Secrets add karein:

| Secret Name | Example Value | Description |
|---|---|---|
| `EC2_HOST` | `3.110.xxx.xxx` | Aapke EC2 ka Public IPv4 Address |
| `EC2_USER` | `ubuntu` | EC2 ka default user (Ubuntu ke liye `ubuntu`) |
| `EC2_SSH_KEY` | `-----BEGIN RSA PRIVATE KEY-----...` | Aapki `.pem` file ka poora text content |
| `DOCKERHUB_USERNAME` | `akashiseijuro23` | Docker Hub username |
| `DOCKERHUB_TOKEN` | `dckr_pat_...` | Docker Hub Personal Access Token |

> **Tip for EC2_SSH_KEY**:
> Apni `.pem` file ko Notepad ya VS Code mein open karein aur `-----BEGIN RSA PRIVATE KEY-----` se lekar `-----END RSA PRIVATE KEY-----` tak poora text copy karke secret value mein paste karein.

---

## 5. 🚀 Kaise Deploy Hoga?

Jab aap GitHub par push karenge:
1. GitHub Actions automatically Docker images build karke Docker Hub par push karega.
2. `deploy-ec2` job automatically:
   - Aapke EC2 instance se connect karega.
   - Naya `docker-compose.yml` transfer karega.
   - Latest Docker images (`akashiseijuro23/attri-...`) pull karega.
   - `docker compose up -d` run karke zero-downtime containers update kar dega!
