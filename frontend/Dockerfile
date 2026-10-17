# =============================================================
# Attri Nexus Frontend - Multi-stage Production Dockerfile
# Hardened non-root unprivileged Nginx image
# =============================================================

# Stage 1: Build Frontend Assets
FROM node:22-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402 AS builder

WORKDIR /app

# Install dependencies (utilize layer caching)
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve with Non-Root Nginx (Official Unprivileged Image)
FROM nginxinc/nginx-unprivileged:1.29-alpine@sha256:0c79d56aee561a1d81c63f00eee5fb5fe29279560cdc55e91425133104c7fbe6 AS runner

# Copy built assets with non-root ownership (nginx user UID 101)
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Expose unprivileged HTTP port
EXPOSE 8080

# Health check using built-in /healthz endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/healthz"]

# Non-root: the image's built-in `nginx` user (UID/GID 101)
USER 101:101

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

