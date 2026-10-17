import crypto from 'node:crypto';
import { RevokedToken } from '../db/models/RevokedToken.js';

// In-memory cache so a revoked token is rejected without a database round
// trip on this instance. Bounded: expired entries are pruned when it grows.
const memoryCache = new Map(); // tokenHash -> expiresAtMs
const MAX_CACHE_ENTRIES = 10_000;

export function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

function remember(tokenHash, expiresAtMs) {
  if (memoryCache.size >= MAX_CACHE_ENTRIES) {
    const now = Date.now();
    for (const [hash, exp] of memoryCache) {
      if (exp <= now) memoryCache.delete(hash);
    }
  }
  memoryCache.set(tokenHash, expiresAtMs);
}

/**
 * Revokes a token by recording its hash both in-memory and in MongoDB.
 */
export async function revokeToken(token, expiresAt) {
  const tokenHash = hashToken(token);
  const expiresAtDate = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);

  remember(tokenHash, expiresAtDate.getTime());

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
 * Checks whether a token has been revoked. Fails closed: if the revocation
 * list cannot be read, the token is treated as revoked, because a logged-out
 * token must never slip through during a database hiccup.
 */
export async function isTokenRevoked(token) {
  if (!token) return false;
  const tokenHash = hashToken(token);
  const now = Date.now();

  if (memoryCache.has(tokenHash)) {
    if (memoryCache.get(tokenHash) > now) return true;
    memoryCache.delete(tokenHash);
  }

  try {
    const doc = await RevokedToken.findOne({ tokenHash, expiresAt: { $gt: new Date() } }).lean();
    if (doc) {
      remember(tokenHash, new Date(doc.expiresAt).getTime());
      return true;
    }
    return false;
  } catch (err) {
    console.error('Revocation check failed; rejecting token:', err.message);
    return true;
  }
}
