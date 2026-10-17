import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_TTL, MFA_CHALLENGE_TTL } from '../config.js';

export const issueToken = (user) =>
  jwt.sign({ sub: String(user._id), email: user.email, jti: crypto.randomUUID() }, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: TOKEN_TTL
  });

// Proves only the password step of a two-factor login. requireAdmin rejects
// any token carrying a `purpose`, so this can never act as a session.
export const issueMfaChallenge = (user) =>
  jwt.sign({ sub: String(user._id), purpose: 'mfa', jti: crypto.randomUUID() }, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: MFA_CHALLENGE_TTL
  });

export const publicUser = (user) => ({
  email: user.email,
  name: user.name,
  role: user.role,
  mfaEnabled: Boolean(user.mfaEnabled)
});
