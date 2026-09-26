import rateLimit from 'express-rate-limit';

const json = (error) => (req, res) => res.status(429).json({ success: false, error });

// Per-IP ceiling on login attempts. This is the blunt outer limit; auth.js
// additionally counts failures per email+IP so one attacker cannot lock a
// legitimate admin out by burning through their email's allowance.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  // Only failed logins should count toward the limit.
  skipSuccessfulRequests: true,
  handler: json('Too many login attempts from this network. Please try again in 15 minutes.')
});

// The enquiry form is public and unauthenticated, so it is the obvious spam
// target. The client already throttles itself, but that is trivially bypassed
// by calling the API directly.
export const inquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: json('Too many enquiries from this network. Please try again shortly.')
});

// Uploads are admin-only but expensive (multi-MB bodies, an outbound blob
// write), so a compromised or careless session cannot hammer them.
export const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: json('Too many uploads. Please wait a moment and try again.')
});
