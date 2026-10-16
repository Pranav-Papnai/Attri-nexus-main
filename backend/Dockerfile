# =============================================================
# Attri Nexus API - Production Multi-stage Dockerfile
# Node.js 20 on lightweight Alpine Linux (Hardened Non-root)
# =============================================================

# Stage 1: Dependencies builder
FROM node:20-alpine AS deps

WORKDIR /app

# Install production dependencies only (cleans cache to reduce size)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner

# Install dumb-init for proper signal forwarding and PID 1 zombie process reaping
# Install curl for reliable container health check
RUN apk add --no-cache dumb-init curl

# Setup workdir and non-root user ownership
WORKDIR /app
RUN chown -R node:node /app

# Switch to non-root user (node: UID 1000)
USER node

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
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start production server using dumb-init
CMD ["dumb-init", "node", "src/index.js"]

