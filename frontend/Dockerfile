# =============================================================
# Attri Nexus Frontend - Multi-stage Production Dockerfile
# Hardened non-root unprivileged Nginx image
# =============================================================

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (utilize layer caching)
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve with Non-Root Nginx (Official Unprivileged Image)
FROM nginxinc/nginx-unprivileged:alpine AS runner

# Copy built assets with non-root ownership (nginx user UID 101)
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Expose unprivileged HTTP port
EXPOSE 8080

# Health check using built-in /healthz endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

# Ensure container runs as non-root user
USER nginx

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

