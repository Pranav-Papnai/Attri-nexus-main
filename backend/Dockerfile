# =============================================================
# Attri Nexus API - Production Multi-stage Dockerfile
# Node.js 22 LTS on lightweight Alpine Linux (Hardened Non-root)
# =============================================================

# Stage 1: Dependencies builder
FROM node:22-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS deps

WORKDIR /app

# Install production dependencies only (cleans cache to reduce size)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 2: Minimal Production Runtime
FROM node:22-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS runner

# No extra OS packages: the health check uses Node's built-in fetch, and
# signal handling/zombie reaping comes from `init: true` in docker-compose.yml
# (src/index.js also handles SIGTERM itself for a graceful shutdown).
WORKDIR /app
RUN chown -R node:node /app

# Non-root: the image's built-in `node` user (UID/GID 1000)
USER 1000:1000

# Copy dependencies and application source with non-root ownership
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node src/ ./src/
COPY --chown=node:node scripts/ ./scripts/

# Expose backend port
EXPOSE 3001

# Production Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Container health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://localhost:3001/api/health').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]

CMD ["node", "src/index.js"]

