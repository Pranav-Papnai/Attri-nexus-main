# =============================================================
# Attri Nexus Frontend - Multi-stage Production Dockerfile
# Hardened non-root unprivileged Nginx image
# =============================================================

# Stage 1: Build Frontend Assets
FROM node:22-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS builder

WORKDIR /app

# Install dependencies (utilize layer caching)
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve with Non-Root Nginx (Official Unprivileged Image)
FROM nginxinc/nginx-unprivileged:1.30-alpine@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03 AS runner

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

