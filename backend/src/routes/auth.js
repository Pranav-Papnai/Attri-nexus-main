import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../db/models/AdminUser.js';
import { LoginAttempt } from '../db/models/LoginAttempt.js';
import { PasswordReset } from '../db/models/PasswordReset.js';
import { sendPasswordResetEmail } from '../lib/email.js';
import { JWT_SECRET, TOKEN_TTL } from '../config.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/errors.js';
import { revokeToken } from '../lib/revocation.js';

const router = Router();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128; // Defend against Long Password DoS (bcrypt CPU exhaustion)
const MAX_EMAIL_LENGTH = 254; // RFC 5321 maximum email address length

// Compared against when no account matches, so a request for an address that
// does not exist still spends the same time inside bcrypt. Without it the
// "no such admin" path returns measurably faster than "wrong password", which
// leaks which admin emails are real.
const DUMMY_HASH = '$2b$12$JZi/HnosdSlfBMhwnWjlTeA/99KCmkfXcD4CpV0Gc6ab6UhDPDTV.';

// POST /api/auth/login - public.
router.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    if (!JWT_SECRET) {
      res.status(500).json({ success: false, error: 'Server not configured' });
      return;
    }

    const { email, password } = req.body || {};

    // One message for every rejection below: never reveal whether it was the
    // address or the password that was wrong.
    const reject = () => res.status(401).json({ success: false, error: 'Invalid email or password' });

    if (
      !email ||
      !password ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      password.length > MAX_PASSWORD_LENGTH ||
      email.length > MAX_EMAIL_LENGTH
    ) {
      res.status(400).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const ip = req.ip || '';
    const since = new Date(Date.now() - WINDOW_MS);

    // Lockout is scoped to email + IP together. Scoping it to the email alone
    // would hand anyone a way to lock the real admin out on demand by failing
    // five logins against their address.
    const recentFailures = await LoginAttempt.countDocuments({
      email: normalizedEmail,
      ip,
      createdAt: { $gte: since }
    });

    if (recentFailures >= MAX_ATTEMPTS) {
      res.status(429).json({
        success: false,
        error: 'Too many failed login attempts. Please try again in 15 minutes.'
      });
      return;
    }

    const user = await AdminUser.findOne({ email: normalizedEmail }).lean();
    const match = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);

    if (!user || !match) {
      await LoginAttempt.create({ email: normalizedEmail, ip });
      reject();
      return;
    }

    // Clear this identity's failures so an admin who mistyped twice before
    // getting it right is not still part-way to a lockout.
    await LoginAttempt.deleteMany({ email: normalizedEmail, ip });

    const token = jwt.sign({ sub: String(user._id), email: user.email, jti: crypto.randomUUID() }, JWT_SECRET, {
      expiresIn: TOKEN_TTL
    });

    res.status(200).json({
      success: true,
      token,
      user: { email: user.email, name: user.name, role: user.role }
    });
  })
);

// POST /api/auth/logout - revokes the active token server-side so it cannot be reused
router.post(
  '/logout',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const token = req.token;
    const expMs = req.admin?.exp ? req.admin.exp * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000;
    await revokeToken(token, new Date(expMs));

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  })
);

// GET /api/auth/me - returns the current authenticated admin user's profile
router.get(
  '/me',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const user = await AdminUser.findById(req.admin.sub).lean();
    if (!user) {
      res.status(404).json({ success: false, error: 'Admin user not found' });
      return;
    }
    res.status(200).json({
      success: true,
      user: { email: user.email, name: user.name, role: user.role }
    });
  })
);

// GET /api/auth/users - list all admin accounts (requires authenticated admin)
router.get(
  '/users',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const users = await AdminUser.find({}, 'email name role createdAt updatedAt').sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      users: users.map((u) => ({
        id: String(u._id),
        email: u.email,
        name: u.name || 'Admin',
        role: u.role || 'admin',
        createdAt: u.createdAt
      }))
    });
  })
);

// POST /api/auth/register - only an already-authenticated admin can create
// another one. There is deliberately no public signup route.
router.post(
  '/register',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { email, password, name, role } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ success: false, error: 'A valid email address is required' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
      res.status(400).json({
        success: false,
        error: `Email and a password between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters are required`
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await AdminUser.exists({ email: normalizedEmail })) {
      res.status(409).json({ success: false, error: 'An admin with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    try {
      const user = await AdminUser.create({
        email: normalizedEmail,
        passwordHash,
        name: name ? String(name).trim() : undefined,
        role: role ? String(role).trim() : 'admin'
      });

      res.status(200).json({
        success: true,
        user: { id: String(user._id), email: user.email, name: user.name, role: user.role }
      });
    } catch (err) {
      // Two simultaneous registrations for the same address: the unique index
      // catches what the exists() check above raced past.
      if (err?.code === 11000) {
        res.status(409).json({ success: false, error: 'An admin with this email already exists' });
        return;
      }
      throw err;
    }
  })
);

// DELETE /api/auth/users/:id - remove admin access (cannot delete self)
router.delete(
  '/users/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (String(req.admin.sub) === String(id)) {
      res.status(400).json({ success: false, error: 'You cannot delete your own active admin account.' });
      return;
    }

    const deleted = await AdminUser.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Admin user not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Admin user deleted successfully.' });
  })
);

// PATCH /api/auth/users/:id/password - update/reset password for an admin user
router.patch(
  '/users/:id/password',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body || {};

    if (
      !newPassword ||
      typeof newPassword !== 'string' ||
      newPassword.length < MIN_PASSWORD_LENGTH ||
      newPassword.length > MAX_PASSWORD_LENGTH
    ) {
      res.status(400).json({
        success: false,
        error: `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters long.`
      });
      return;
    }

    const user = await AdminUser.findById(id);
    if (!user) {
      res.status(404).json({ success: false, error: 'Admin user not found' });
      return;
    }

    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  })
);

// POST /api/auth/forgot-password - public
router.post(
  '/forgot-password',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ success: false, error: 'A valid email address is required' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await AdminUser.findOne({ email: normalizedEmail }).lean();

    // Constant-time execution to prevent timing-based user enumeration
    if (!user) {
      crypto.createHash('sha256').update(normalizedEmail).digest('hex');
      res.status(200).json({
        success: true,
        message: 'If an admin account matches this address, a reset code has been sent.'
      });
      return;
    }

    // Generate random 6-digit numeric OTP
    const otp = String(crypto.randomInt(100000, 1000000));
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Invalidate existing reset requests for this email
    await PasswordReset.deleteMany({ email: normalizedEmail });

    await PasswordReset.create({
      email: normalizedEmail,
      otpHash,
      expiresAt
    });

    const emailRes = await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      otp
    });

    const isDev = process.env.NODE_ENV !== 'production';

    res.status(200).json({
      success: true,
      message: 'If an admin account matches this address, a reset code has been sent.',
      emailSent: emailRes.sent,
      // In development or when mail is not configured, provide devOtp so testing and local usage is frictionless
      ...(isDev || !emailRes.sent ? { devOtp: otp } : {})
    });
  })
);

// POST /api/auth/reset-password - public
router.post(
  '/reset-password',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ success: false, error: 'A valid email address is required' });
      return;
    }

    if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
      res.status(400).json({ success: false, error: 'A valid 6-digit reset code is required' });
      return;
    }

    if (
      !newPassword ||
      typeof newPassword !== 'string' ||
      newPassword.length < MIN_PASSWORD_LENGTH ||
      newPassword.length > MAX_PASSWORD_LENGTH
    ) {
      res.status(400).json({
        success: false,
        error: `New password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters long`
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    const otpHash = crypto.createHash('sha256').update(cleanOtp).digest('hex');

    const resetRecord = await PasswordReset.findOne({
      email: normalizedEmail,
      otpHash,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      res.status(400).json({
        success: false,
        error: 'Invalid or expired reset code. Please request a new code.'
      });
      return;
    }

    const user = await AdminUser.findOne({ email: normalizedEmail });
    if (!user) {
      res.status(404).json({ success: false, error: 'Admin account not found' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    user.passwordHash = passwordHash;
    await user.save();

    // Clean up reset token and any login lockout
    await PasswordReset.deleteMany({ email: normalizedEmail });
    await LoginAttempt.deleteMany({ email: normalizedEmail });

    const token = jwt.sign({ sub: String(user._id), email: user.email, jti: crypto.randomUUID() }, JWT_SECRET, {
      expiresIn: TOKEN_TTL
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
      token,
      user: { email: user.email, name: user.name, role: user.role }
    });
  })
);

export default router;

