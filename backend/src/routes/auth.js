import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { AdminUser, ADMIN_ROLES, SUPER_ADMIN, sessionCutoffSeconds } from '../db/models/AdminUser.js';
import { LoginAttempt } from '../db/models/LoginAttempt.js';
import { PasswordReset } from '../db/models/PasswordReset.js';
import { sendPasswordResetEmail } from '../lib/email.js';
import { JWT_SECRET, NODE_ENV } from '../config.js';
import { requireAdmin, requireSuperAdmin } from '../middleware/requireAdmin.js';
import { loginLimiter, forgotPasswordLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/errors.js';
import { revokeToken } from '../lib/revocation.js';
import { audit } from '../lib/audit.js';
import { hashPassword, isAcceptablePassword, verifyPassword, MAX_PASSWORD_LENGTH, PASSWORD_RULE_MESSAGE } from '../lib/passwords.js';
import { verifyTotp, hashRecoveryCode } from '../lib/totp.js';
import { issueToken, issueMfaChallenge, publicUser } from '../lib/tokens.js';
import mfaRoutes from './mfa.js';

const router = Router();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 maximum email address length
const MAX_RESET_ATTEMPTS = 5;
const RESET_CODE_TTL_MS = 15 * 60 * 1000;
const RESET_COOLDOWN_MS = 60 * 1000;
const DEFAULT_ROLE = 'Commercial Admin';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RESET_REQUESTED_MESSAGE = 'If an admin account matches this address, a reset code has been sent.';

const isValidEmail = (email) =>
  typeof email === 'string' && email.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(email.trim());

// Compared against when no account matches, so a request for an address that
// does not exist still spends the same time inside bcrypt. Without it the
// "no such admin" path returns measurably faster than "wrong password", which
// leaks which admin emails are real. Generated per process (same cost factor
// as real hashes) so no hash is hardcoded.
const dummyHash = hashPassword(crypto.randomBytes(32).toString('hex'));

// Lockout is scoped to email + IP together. Scoping it to the email alone
// would hand anyone a way to lock the real admin out on demand by failing
// five logins against their address. Password and two-factor failures share
// the same counter.
async function isLockedOut(email, ip) {
  const recentFailures = await LoginAttempt.countDocuments({
    email,
    ip,
    createdAt: { $gte: new Date(Date.now() - WINDOW_MS) }
  });
  return recentFailures >= MAX_ATTEMPTS;
}

const lockedOut = (res) =>
  res.status(429).json({ success: false, error: 'Too many failed login attempts. Please try again in 15 minutes.' });

// POST /api/auth/login - public. Answers with a session token, or - when the
// account has two-factor authentication - with a short-lived challenge token
// that only /login/mfa accepts.
router.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    if (!JWT_SECRET) {
      res.status(500).json({ success: false, error: 'Server not configured' });
      return;
    }

    const { email, password } = req.body || {};

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

    if (await isLockedOut(normalizedEmail, ip)) {
      lockedOut(res);
      return;
    }

    // Safe: email was checked to be a string above, and $eq makes it a literal.
    // nosemgrep: ajinabraham.njsscan.database.nosql_find_injection.node_nosqli_injection
    const user = await AdminUser.findOne({ email: { $eq: normalizedEmail } }).lean();
    const match = user ? await verifyPassword(user, password) : await bcrypt.compare(password, await dummyHash);

    if (!user || !match) {
      await LoginAttempt.create({ email: normalizedEmail, ip });
      audit(req, 'auth.login.failure', { actor: user ?? null, actorEmail: normalizedEmail });
      // One message for every rejection: never reveal whether it was the
      // address or the password that was wrong.
      res.status(401).json({ success: false, error: 'Invalid email or password' });
      return;
    }

    if (user.mfaEnabled) {
      // Failures are cleared only after the second factor succeeds, so a
      // known password cannot be used to reset the two-factor guess counter.
      audit(req, 'auth.login.mfa_challenge', { actor: user });
      res.status(200).json({ success: true, mfaRequired: true, mfaToken: issueMfaChallenge(user) });
      return;
    }

    // Clear this identity's failures so an admin who mistyped twice before
    // getting it right is not still part-way to a lockout.
    await LoginAttempt.deleteMany({ email: normalizedEmail, ip });
    audit(req, 'auth.login.success', { actor: user });

    res.status(200).json({ success: true, token: issueToken(user), user: publicUser(user) });
  })
);

// POST /api/auth/login/mfa - public, but needs the challenge token from
// /login plus a current authenticator code or an unused recovery code.
router.post(
  '/login/mfa',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { mfaToken, code } = req.body || {};
    const expired = () =>
      res.status(401).json({ success: false, error: 'Your sign-in has expired. Please enter your password again.' });

    let challenge;
    try {
      challenge = jwt.verify(String(mfaToken || ''), JWT_SECRET, { algorithms: ['HS256'] });
    } catch {
      expired();
      return;
    }
    if (challenge.purpose !== 'mfa' || !mongoose.isValidObjectId(challenge.sub)) {
      expired();
      return;
    }

    const user = await AdminUser.findById(challenge.sub)
      .select('+mfaSecret +mfaRecoveryCodes +mfaLastStep')
      .lean();
    // A password change after the challenge was issued voids it.
    if (!user || !user.mfaEnabled || (challenge.iat ?? 0) < sessionCutoffSeconds(user)) {
      expired();
      return;
    }

    const ip = req.ip || '';
    if (await isLockedOut(user.email, ip)) {
      lockedOut(res);
      return;
    }

    const submitted = String(code ?? '').trim();
    let accepted = false;
    let usedRecoveryCode = false;

    const step = verifyTotp(user.mfaSecret, submitted, { afterStep: user.mfaLastStep ?? -1 });
    if (step !== null) {
      // Conditional write: two requests racing with the same code cannot both win.
      const claimed = await AdminUser.updateOne(
        { _id: user._id, mfaLastStep: { $lt: step } },
        { $set: { mfaLastStep: step } }
      );
      accepted = claimed.modifiedCount === 1;
    } else if (submitted.length >= 8) {
      const hash = hashRecoveryCode(submitted);
      const consumed = await AdminUser.updateOne(
        { _id: user._id, mfaRecoveryCodes: hash },
        { $pull: { mfaRecoveryCodes: hash } }
      );
      accepted = consumed.modifiedCount === 1;
      usedRecoveryCode = accepted;
    }

    if (!accepted) {
      await LoginAttempt.create({ email: user.email, ip });
      audit(req, 'auth.mfa.failure', { actor: user });
      res.status(401).json({ success: false, error: 'Invalid authentication code' });
      return;
    }

    await LoginAttempt.deleteMany({ email: user.email, ip });
    audit(req, usedRecoveryCode ? 'auth.mfa.recovery_code_used' : 'auth.login.success', {
      actor: user,
      meta: usedRecoveryCode ? { remainingRecoveryCodes: (user.mfaRecoveryCodes?.length ?? 1) - 1 } : { mfa: true }
    });

    res.status(200).json({ success: true, token: issueToken(user), user: publicUser(user) });
  })
);

// POST /api/auth/logout - revokes the active token server-side so it cannot be reused
router.post(
  '/logout',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const expMs = req.admin?.exp ? req.admin.exp * 1000 : Date.now() + WINDOW_MS;
    await revokeToken(req.token, new Date(expMs));
    audit(req, 'auth.logout');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  })
);

// GET /api/auth/me - returns the current authenticated admin user's profile
router.get('/me', requireAdmin, (req, res) => {
  res.status(200).json({ success: true, user: { id: String(req.adminUser._id), ...publicUser(req.adminUser) } });
});

router.use('/mfa', mfaRoutes);

// GET /api/auth/users - list all admin accounts (Super Admin only)
router.get(
  '/users',
  requireAdmin,
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const users = await AdminUser.find({}, 'email name role mfaEnabled createdAt updatedAt').sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      users: users.map((u) => ({
        id: String(u._id),
        email: u.email,
        name: u.name || 'Admin',
        role: u.role || DEFAULT_ROLE,
        mfaEnabled: Boolean(u.mfaEnabled),
        createdAt: u.createdAt
      }))
    });
  })
);

// POST /api/auth/register - only an already-authenticated Super Admin can
// create another admin. There is deliberately no public signup route.
router.post(
  '/register',
  requireAdmin,
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const { email, password, name, role } = req.body || {};

    if (!isValidEmail(email)) {
      res.status(400).json({ success: false, error: 'A valid email address is required' });
      return;
    }

    const assignedRole = role === undefined || role === '' ? DEFAULT_ROLE : String(role).trim();
    if (!ADMIN_ROLES.includes(assignedRole)) {
      res.status(400).json({ success: false, error: `Role must be one of: ${ADMIN_ROLES.join(', ')}` });
      return;
    }

    if (!isAcceptablePassword(password)) {
      res.status(400).json({
        success: false,
        error: PASSWORD_RULE_MESSAGE
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await AdminUser.exists({ email: { $eq: normalizedEmail } })) {
      res.status(409).json({ success: false, error: 'An admin with this email already exists' });
      return;
    }

    try {
      const user = await AdminUser.create({
        email: normalizedEmail,
        passwordHash: await hashPassword(password),
        name: name ? String(name).trim().slice(0, 100) : undefined,
        role: assignedRole
      });

      audit(req, 'admin.created', { targetType: 'admin', targetId: user._id, meta: { email: user.email, role: user.role } });
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

// DELETE /api/auth/users/:id - remove admin access (Super Admin only, cannot
// delete self). Deleted admins lose access at once: requireAdmin re-reads the
// account on every request.
router.delete(
  '/users/:id',
  requireAdmin,
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (String(req.admin.sub) === String(id)) {
      res.status(400).json({ success: false, error: 'You cannot delete your own active admin account.' });
      return;
    }

    const deleted = mongoose.isValidObjectId(id) ? await AdminUser.findByIdAndDelete(id).lean() : null;
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Admin user not found' });
      return;
    }

    audit(req, 'admin.deleted', { targetType: 'admin', targetId: id, meta: { email: deleted.email } });
    res.status(200).json({ success: true, message: 'Admin user deleted successfully.' });
  })
);

// DELETE /api/auth/users/:id/mfa - a Super Admin turns off two-factor for
// another admin who lost their phone and recovery codes. Ends their sessions.
router.delete(
  '/users/:id/mfa',
  requireAdmin,
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (String(req.admin.sub) === String(id)) {
      res.status(400).json({ success: false, error: 'Use your own security settings to change your two-factor authentication.' });
      return;
    }

    const updated = mongoose.isValidObjectId(id)
      ? await AdminUser.findByIdAndUpdate(
          id,
          {
            $set: { mfaEnabled: false, sessionsRevokedAt: new Date(), mfaLastStep: -1 },
            $unset: { mfaSecret: 1, mfaPendingSecret: 1, mfaRecoveryCodes: 1 }
          },
          { returnDocument: 'after' }
        ).lean()
      : null;
    if (!updated) {
      res.status(404).json({ success: false, error: 'Admin user not found' });
      return;
    }

    audit(req, 'admin.mfa_reset', { targetType: 'admin', targetId: id, meta: { email: updated.email } });
    res.status(200).json({ success: true, message: 'Two-factor authentication was turned off for this admin.' });
  })
);

// PATCH /api/auth/users/:id/password - any admin may change their own
// password (current password required); only a Super Admin may set someone
// else's. Every existing session of that account is ended; changing your own
// returns a fresh token.
router.patch(
  '/users/:id/password',
  loginLimiter,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { newPassword, currentPassword } = req.body || {};
    const isSelf = String(req.admin.sub) === String(id);

    if (!isSelf && req.adminUser.role !== SUPER_ADMIN) {
      res.status(403).json({ success: false, error: "Only a Super Admin can change another admin's password." });
      return;
    }

    if (!isAcceptablePassword(newPassword)) {
      res.status(400).json({
        success: false,
        error: PASSWORD_RULE_MESSAGE
      });
      return;
    }

    const user = mongoose.isValidObjectId(id) ? await AdminUser.findById(id) : null;
    if (!user) {
      res.status(404).json({ success: false, error: 'Admin user not found' });
      return;
    }

    // A stolen session alone must not be enough to take the account over.
    if (isSelf) {
      const ok =
        typeof currentPassword === 'string' &&
        currentPassword.length <= MAX_PASSWORD_LENGTH &&
        (await verifyPassword(user, currentPassword));
      if (!ok) {
        audit(req, 'auth.password.change_failed', { targetType: 'admin', targetId: id });
        res.status(400).json({ success: false, error: 'Your current password is incorrect.' });
        return;
      }
    }

    user.passwordHash = await hashPassword(newPassword);
    user.passwordChangedAt = new Date();
    await user.save();

    audit(req, 'auth.password.changed', { targetType: 'admin', targetId: id, meta: { self: isSelf } });
    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
      ...(isSelf ? { token: issueToken(user) } : {})
    });
  })
);

// Runs after the response is sent, so the response time is the same whether
// or not the address belongs to an admin.
async function processResetRequest(req, normalizedEmail) {
  const user = await AdminUser.findOne({ email: { $eq: normalizedEmail } }).lean();
  if (!user) {
    audit(req, 'auth.password_reset.unknown_email', { actorEmail: normalizedEmail });
    return;
  }

  // One email per address per minute: stops inbox flooding and stops anyone
  // repeatedly voiding the code the real admin is about to type.
  const recent = await PasswordReset.exists({
    email: normalizedEmail,
    createdAt: { $gt: new Date(Date.now() - RESET_COOLDOWN_MS) }
  });
  if (recent) {
    audit(req, 'auth.password_reset.cooldown', { actor: user });
    return;
  }

  const otp = String(crypto.randomInt(100000, 1000000));
  await PasswordReset.deleteMany({ email: normalizedEmail });
  await PasswordReset.create({
    email: normalizedEmail,
    otpHash: crypto.createHash('sha256').update(otp).digest('hex'),
    expiresAt: new Date(Date.now() + RESET_CODE_TTL_MS)
  });

  const emailRes = await sendPasswordResetEmail({ email: user.email, name: user.name, otp });
  audit(req, 'auth.password_reset.requested', { actor: user, meta: { emailSent: emailRes.sent } });

  // The code must never appear in the HTTP response: anyone can call this
  // endpoint with an admin's address. Locally it goes to the server console.
  if (!emailRes.sent && NODE_ENV === 'development') {
    console.log(`[dev] Password reset code for ${normalizedEmail}: ${otp}`);
  }
}

// POST /api/auth/forgot-password - public
router.post('/forgot-password', forgotPasswordLimiter, (req, res) => {
  const { email } = req.body || {};
  if (!isValidEmail(email)) {
    res.status(400).json({ success: false, error: 'A valid email address is required' });
    return;
  }

  res.status(200).json({ success: true, message: RESET_REQUESTED_MESSAGE });

  processResetRequest(req, email.trim().toLowerCase()).catch((err) =>
    console.error('Password reset request failed:', err)
  );
});

// POST /api/auth/reset-password - public
router.post(
  '/reset-password',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body || {};

    if (!isValidEmail(email)) {
      res.status(400).json({ success: false, error: 'A valid email address is required' });
      return;
    }

    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
      res.status(400).json({ success: false, error: 'A valid 6-digit reset code is required' });
      return;
    }

    if (!isAcceptablePassword(newPassword)) {
      res.status(400).json({
        success: false,
        error: PASSWORD_RULE_MESSAGE
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpHash = crypto.createHash('sha256').update(otp.trim()).digest('hex');

    const invalidCode = () =>
      res.status(400).json({
        success: false,
        error: 'Invalid or expired reset code. Please request a new code.'
      });

    // Atomically claim one guess against the live code before comparing, so
    // parallel requests cannot squeeze in more than MAX_RESET_ATTEMPTS.
    const resetRecord = await PasswordReset.findOneAndUpdate(
      {
        email: normalizedEmail,
        expiresAt: { $gt: new Date() },
        attempts: { $lt: MAX_RESET_ATTEMPTS }
      },
      { $inc: { attempts: 1 } },
      { returnDocument: 'after' }
    );

    if (!resetRecord) {
      invalidCode();
      return;
    }

    const matches = crypto.timingSafeEqual(Buffer.from(resetRecord.otpHash, 'hex'), Buffer.from(otpHash, 'hex'));

    if (!matches) {
      if (resetRecord.attempts >= MAX_RESET_ATTEMPTS) {
        await PasswordReset.deleteOne({ _id: resetRecord._id });
      }
      audit(req, 'auth.password_reset.failure', { actorEmail: normalizedEmail });
      invalidCode();
      return;
    }

    // Safe: isValidEmail() guaranteed a string, and $eq makes it a literal.
    // nosemgrep: ajinabraham.njsscan.database.nosql_find_injection.node_nosqli_injection
    const user = await AdminUser.findOne({ email: { $eq: normalizedEmail } });
    if (!user) {
      invalidCode();
      return;
    }

    user.passwordHash = await hashPassword(newPassword);
    // Ends every session that existed before the reset, including one an
    // attacker may hold - which is often why the reset is happening.
    user.passwordChangedAt = new Date();
    await user.save();

    await PasswordReset.deleteMany({ email: normalizedEmail });
    await LoginAttempt.deleteMany({ email: normalizedEmail });
    audit(req, 'auth.password_reset.completed', { actor: user });

    // An email code proves control of the inbox, not of the authenticator:
    // accounts with two-factor must still sign in through both steps.
    if (user.mfaEnabled) {
      res.status(200).json({
        success: true,
        mfaRequired: true,
        message: 'Password reset. Please sign in with your new password and your authentication code.'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
      token: issueToken(user),
      user: publicUser(user)
    });
  })
);

export default router;
