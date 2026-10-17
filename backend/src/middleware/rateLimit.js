import rateLimit from 'express-rate-limit';
import { MongoRateLimitStore } from '../lib/rateLimitStore.js';

const json = (error) => (req, res) => res.status(429).json({ success: false, error });

// Counters live in MongoDB so every instance of the API shares them. Every
// route these guard already requires a database connection. If the store
// itself errors, the request fails rather than skipping the limit.
const limiter = (prefix, options) =>
  rateLimit({
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    passOnStoreError: false,
    store: new MongoRateLimitStore(prefix),
    ...options
  });

// Per-IP ceiling on failed authentication attempts (login, two-factor codes,
// reset codes, current-password checks). auth.js additionally counts failures
// per email+IP so one attacker cannot lock a legitimate admin out by burning
// through their email's allowance.
export const loginLimiter = limiter('login', {
  windowMs: 15 * 60 * 1000,
  limit: 20,
  // Only failed attempts count toward the limit.
  skipSuccessfulRequests: true,
  handler: json('Too many login attempts from this network. Please try again in 15 minutes.')
});

// forgot-password always answers 200 (so it cannot reveal which emails are
// admins), which means a failures-only limiter would never count it. Every
// request counts here; auth.js also enforces a per-email cooldown.
export const forgotPasswordLimiter = limiter('forgot', {
  windowMs: 60 * 60 * 1000,
  limit: 5,
  handler: json('Too many reset requests from this network. Please try again in an hour.')
});

// The enquiry form is public and unauthenticated, so it is the obvious spam
// target. The client already throttles itself, but that is trivially bypassed
// by calling the API directly.
export const inquiryLimiter = limiter('inquiry', {
  windowMs: 10 * 60 * 1000,
  limit: 8,
  handler: json('Too many enquiries from this network. Please try again shortly.')
});

// Uploads are admin-only but expensive (multi-MB bodies, an outbound blob
// write), so a compromised or careless session cannot hammer them.
export const uploadLimiter = limiter('upload', {
  windowMs: 10 * 60 * 1000,
  limit: 30,
  handler: json('Too many uploads. Please wait a moment and try again.')
});
