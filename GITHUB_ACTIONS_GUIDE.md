# 🚀 GitHub Actions CI/CD Setup Guide — Attri Nexus

Aapka automated CI/CD pipeline **`.github/workflows/ci-cd.yml`** configure ho chuka hai. 

Jab bhi aap code `main` branch par **push** karenge ya **pull request** create karenge, GitHub automatically:
1. **Frontend aur Backend code validate aur build karega**.
2. **Backend Docker Image** build karke Docker Hub (`akashiseijuro23/attri-backend:latest` & `:v1`) par push karega.
3. **Frontend Docker Image** build karke Docker Hub (`akashiseijuro23/attri-frontend:latest` & `:v1`) par push karega.
4. *(Optional)* Agar production VPS/Server configured hai toh SSH ke through zero-downtime deploy karega.

---

## 🔑 Required GitHub Secrets Setup

Pipeline ko Docker Hub par push karne ke liye GitHub repository mein 2 secrets add karne hain:

1. Apne GitHub repo par jayein: **`https://github.com/Pranav-Papnai/Attri-nexus-main`**
2. **Settings** -> **Secrets and variables** -> **Actions** par click karein.
3. **New repository secret** par click karke yeh add karein:

| Secret Name | Value | Description |
|---|---|---|
| `DOCKERHUB_USERNAME` | `akashiseijuro23` | Aapka Docker Hub username |
| `DOCKERHUB_TOKEN` | *(Docker Hub Personal Access Token)* | Docker Hub se generate kiya hua Access Token |

---

### 📌 Docker Hub Access Token kaise generate karein:
1. [hub.docker.com](https://hub.docker.com) par login karein.
2. Top right par **Profile icon** -> **Account Settings** par click karein.
3. Left menu se **Security** (Personal access tokens) par jayein.
4. **New Access Token** click karein:
   - Description: `github-actions-attri-nexus`
   - Permissions: `Read, Write, Delete`
5. Token copy karein aur GitHub Secrets mein `DOCKERHUB_TOKEN` naam se save kar dein.

---

## 🌐 (Optional) Production Server (VPS / EC2) Auto-Deploy Secrets

Jab aap kisi cloud server (AWS EC2, DigitalOcean, Hostinger VPS) par auto-deploy karna chahein:

| Secret Name | Value |
|---|---|
| `SERVER_HOST` | Aapke server ka Public IP address (e.g. `13.234.xx.xx`) |
| `SERVER_USER` | Server username (e.g. `ubuntu` ya `root`) |
| `SERVER_SSH_KEY` | Private SSH Key (`.pem` ya `id_rsa`) |
| `SERVER_APP_DIR` | Directory jahan repo/docker-compose rakha hai (e.g. `/home/ubuntu/attri-nexus`) |

*(Note: Agar yeh SSH secrets set nahi honge, tab bhi pipeline smoothly build aur push karegi aur deploy step skip ho jayega).*

---

## 🛠️ Kaise Test Karein:
GitHub par push karne ke liye terminal mein run karein:
```bash
git add .
git commit -m "feat: add docker-compose credentials and GitHub Actions CI/CD pipeline"
git push origin main
```

Fir GitHub par **Actions** tab mein aapko live pipeline run hoti dikh jayegi!
