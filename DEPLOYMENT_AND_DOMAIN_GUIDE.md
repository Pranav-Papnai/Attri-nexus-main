# 🚀 Attri Nexus — Containerization, Domain & Hosting Guide

This guide walks you through containerizing the project with **Docker**, deploying the **Frontend + Backend**, and connecting your **Custom Domain** with free HTTPS/SSL certificates.

---

## 📌 Architecture Overview

```
                        ┌──────────────────────────────────────────────┐
                        │              Custom Domain                   │
                        │           https://attrinexus.com             │
                        └──────────────────────┬───────────────────────┘
                                               │
                                       (Port 80 / 443)
                                               │
                        ┌──────────────────────▼───────────────────────┐
                        │          Frontend Container (Nginx)          │
                        │                                              │
                        │  • Serves React SPA static files             │
                        │  • Reverse proxies /api/* -> Backend:3001    │
                        └──────────────────────┬───────────────────────┘
                                               │
                                        (Internal Network)
                                               │
                        ┌──────────────────────▼───────────────────────┐
                        │          Backend Container (Node.js)         │
                        │                                              │
                        │  • Express REST API on Port 3001             │
                        │  • JWT Admin Auth & Rate-Limiting            │
                        └──────────────────────┬───────────────────────┘
                                               │
                                               ▼
                              ┌────────────────────────────────┐
                              │ MongoDB Atlas / Mongo Database │
                              └────────────────────────────────┘
```

---

## 1. 🐳 Containerization Setup (Ready Files)

All Docker files have already been created for you:

| File | Purpose |
| :--- | :--- |
| `frontend/Dockerfile` | Multi-stage build producing an ultra-lightweight Nginx container serving React SPA. |
| `frontend/nginx.conf` | Handles SPA routing, gzip compression, browser caching, and `/api/*` reverse proxying. |
| `backend/Dockerfile` | Production Node 20 Alpine container with healthchecks and security hardening. |
| `docker-compose.yml` | One-command orchestration for Frontend, Backend, and MongoDB. |

### Run Locally with Docker:
```bash
# 1. Build and start all containers
docker compose up -d --build

# 2. Check running status & health
docker compose ps

# 3. View logs
docker compose logs -f

# 4. Stop containers
docker compose down
```

The frontend will be live on `http://localhost`, automatically communicating with the backend container without CORS issues!

---

## 2. 🌐 Custom Domain & Production Hosting Options

### 🌟 OPTION A: Single VPS Deployment (Recommended for Docker)
*(DigitalOcean Droplet, Hetzner Cloud, AWS EC2, or Hostinger VPS)*

1. **Rent a VPS** (e.g. Ubuntu 22.04 / 24.04).
2. **Install Docker & Docker Compose**:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```
3. **Clone your repository**:
   ```bash
   git clone https://github.com/Pranav-Papnai/Attri_nexus.git
   cd Attri_nexus
   ```
4. **Create `.env.local`**:
   ```bash
   cp .env.example .env.local
   nano .env.local  # Enter your JWT_SECRET and MONGODB_URI
   ```
5. **Start the containers**:
   ```bash
   docker compose up -d --build
   ```
6. **Point your domain DNS**:
   - Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.).
   - Add an **A Record**:
     - **Host / Name**: `@` (or `www`)
     - **Points to / IP**: `<Your-VPS-IP-Address>`
7. **Free SSL Certificate with Certbot / Cloudflare**:
   - **Simplest**: Enable Cloudflare Proxy (Orange Cloud ☁️) for instant automatic free SSL.
   - **Direct on VPS**: Install Certbot and Nginx reverse proxy on host if needed.

---

### 🌟 OPTION B: Cloud Hosting (Frontend on Vercel + Backend on Render/Railway)

If you prefer managed cloud platforms without managing a Linux server:

#### 1. Backend on Render / Railway:
- Push the repository to GitHub.
- On [Render](https://render.com) or [Railway](https://railway.app), create a **New Web Service**.
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables:
  - `NODE_ENV`: `production`
  - `PORT`: `3001`
  - `JWT_SECRET`: `<your-jwt-secret>`
  - `MONGODB_URI`: `<your-mongodb-atlas-uri>`
  - `CORS_ORIGIN`: `https://attrinexus.com,https://www.attrinexus.com`
- Your backend will get a URL like `https://attri-nexus-api.onrender.com` (or your custom domain `https://api.attrinexus.com`).

#### 2. Frontend on Vercel / Cloudflare Pages:
- Create a new project on [Vercel](https://vercel.com).
- Root Directory: `frontend`
- Framework Preset: `Vite`
- Environment Variables:
  - `VITE_API_BASE_URL`: `https://attri-nexus-api.onrender.com` (or your backend domain)
  - `VITE_TURNSTILE_SITE_KEY`: `0x4AAAAAAEbYxH0hs9UIym6l`
- Add your custom domain `attrinexus.com` in Vercel Settings -> Domains.

---

## 3. 🔑 Environment Variables Reference

### Backend (`.env.local` / Production Env)
| Variable | Description |
| :--- | :--- |
| `JWT_SECRET` | Secret key for signing admin authentication tokens (Required). |
| `MONGODB_URI` | MongoDB Atlas or database connection string (Required). |
| `CORS_ORIGIN` | Allowed domains for direct API calls (e.g. `https://attrinexus.com`). |
| `CLOUDINARY_URL` / `CLOUDINARY_*` | Cloudinary credentials for product image uploads. |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile anti-bot verification key. |
| `RESEND_API_KEY` | Resend API key for enquiry notification emails. |
| `ADMIN_NOTIFICATION_EMAIL` | Recipient email address for new enquiries. |

### Frontend (`frontend/.env.local` / Production Env)
| Variable | Description |
| :--- | :--- |
| `VITE_API_BASE_URL` | *(Optional)* Full URL to backend (e.g. `https://api.attrinexus.com`). Leave empty if using reverse proxy. |
| `VITE_TURNSTILE_SITE_KEY` | Public Cloudflare Turnstile key for inquiry forms. |
