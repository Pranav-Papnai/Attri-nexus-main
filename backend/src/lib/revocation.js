import crypto from 'node:crypto';
import { RevokedToken } from '../db/models/RevokedToken.js';

// Fast in-memory cache to ensure token revocation checks execute in ~0ms
// without imposing database round-trips on every authenticated request.
const memoryCache = new Map(); // tokenHash -> expiresAtMs

export function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

export function revokeTokenMemory(tokenHash, expiresAtMs) {
  memoryCache.set(tokenHash, expiresAtMs);
}

/**
 * Revokes a token by recording its hash both in-memory and in MongoDB.
 */
export async function revokeToken(token, expiresAt) {
  const tokenHash = hashToken(token);
  const expiresAtDate = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  const expiresAtMs = expiresAtDate.getTime();

  revokeTokenMemory(tokenHash, expiresAtMs);

  try {
    await RevokedToken.create({ tokenHash, expiresAt: expiresAtDate });
  } catch (err) {
    // 11000 duplicate key: token was already recorded as revoked
    if (err?.code !== 11000) {
      throw err;
    }
  }
}

/**
 * Checks whether a token has been revoked.
 */
export async function isTokenRevoked(token) {
  if (!token) return false;
  const tokenHash = hashToken(token);
  const now = Date.now();

  // 1. Check in-memory cache (< 0.05ms)
  if (memoryCache.has(tokenHash)) {
    const expiresAt = memoryCache.get(tokenHash);
    if (expiresAt > now) {
      return true;
    }
    memoryCache.delete(tokenHash);
  }

  // 2. Fallback to MongoDB check (handles serverless instances / restarts)
  try {
    const doc = await RevokedToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() }
    }).lean();

    if (doc) {
      memoryCache.set(tokenHash, new Date(doc.expiresAt).getTime());
      return true;
    }
  } catch {
    // If DB check fails, fail-safe to memoryCache
  }

  return false;
}
