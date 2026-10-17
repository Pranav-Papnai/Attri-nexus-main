import { Router } from 'express';
import { AdminUser } from '../db/models/AdminUser.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../middleware/errors.js';
import { audit } from '../lib/audit.js';
import { verifyPassword, MAX_PASSWORD_LENGTH } from '../lib/passwords.js';
import { generateSecret, verifyTotp, otpauthUrl, generateRecoveryCodes, hashRecoveryCode } from '../lib/totp.js';
import { issueToken } from '../lib/tokens.js';

// Mounted at /api/auth/mfa. Every route acts on the signed-in admin's own
// account; a Super Admin resets someone else's via DELETE /users/:id/mfa.
const router = Router();
const ISSUER = 'Attri Nexus';

const withSecrets = (id) =>
  AdminUser.findById(id).select('+mfaSecret +mfaPendingSecret +mfaRecoveryCodes +mfaLastStep');

function newRecoveryCodes() {
  const codes = generateRecoveryCodes();
  return { codes, hashes: codes.map(hashRecoveryCode) };
}

// Accepts a current authenticator code or an unused recovery code, and
// consumes whichever matched. Used to confirm sensitive changes.
async function consumeSecondFactor(user, code) {
  const submitted = String(code ?? '').trim();
  const step = verifyTotp(user.mfaSecret, submitted, { afterStep: user.mfaLastStep ?? -1 });
  if (step !== null) {
    const claimed = await AdminUser.updateOne(
      { _id: user._id, mfaLastStep: { $lt: step } },
      { $set: { mfaLastStep: step } }
    );
    return claimed.modifiedCount === 1;
  }
  if (submitted.length < 8) return false;
  const hash = hashRecoveryCode(submitted);
  const consumed = await AdminUser.updateOne({ _id: user._id, mfaRecoveryCodes: hash }, { $pull: { mfaRecoveryCodes: hash } });
  return consumed.modifiedCount === 1;
}

// POST /api/auth/mfa/setup - starts enrolment. The secret is held as pending
// until /enable proves the authenticator app produces matching codes.
router.post(
  '/setup',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const user = await withSecrets(req.adminUser._id);
    if (user.mfaEnabled) {
      res.status(409).json({ success: false, error: 'Two-factor authentication is already on.' });
      return;
    }

    const secret = generateSecret();
    user.mfaPendingSecret = secret;
    await user.save();

    res.status(200).json({
      success: true,
      secret,
      otpauthUrl: otpauthUrl({ secret, accountName: user.email, issuer: ISSUER })
    });
  })
);

// POST /api/auth/mfa/enable { code } - finishes enrolment. Returns recovery
// codes exactly once, ends every other session, and returns a fresh token.
router.post(
  '/enable',
  loginLimiter,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const user = await withSecrets(req.adminUser._id);
    if (user.mfaEnabled) {
      res.status(409).json({ success: false, error: 'Two-factor authentication is already on.' });
      return;
    }
    if (!user.mfaPendingSecret) {
      res.status(400).json({ success: false, error: 'Start the setup first.' });
      return;
    }

    const step = verifyTotp(user.mfaPendingSecret, req.body?.code);
    if (step === null) {
      res.status(400).json({ success: false, error: 'That code does not match. Check the time on your phone and try again.' });
      return;
    }

    const { codes, hashes } = newRecoveryCodes();
    user.mfaSecret = user.mfaPendingSecret;
    user.mfaPendingSecret = undefined;
    user.mfaEnabled = true;
    user.mfaLastStep = step;
    user.mfaRecoveryCodes = hashes;
    user.sessionsRevokedAt = new Date();
    await user.save();

    audit(req, 'mfa.enabled', { targetType: 'admin', targetId: user._id });
    res.status(200).json({ success: true, recoveryCodes: codes, token: issueToken(user) });
  })
);

// POST /api/auth/mfa/disable { password, code } - needs both factors, so a
// stolen session alone cannot remove the protection.
router.post(
  '/disable',
  loginLimiter,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { password, code } = req.body || {};
    const user = await withSecrets(req.adminUser._id);
    if (!user.mfaEnabled) {
      res.status(400).json({ success: false, error: 'Two-factor authentication is not on.' });
      return;
    }

    const passwordOk =
      typeof password === 'string' && password.length <= MAX_PASSWORD_LENGTH && (await verifyPassword(user, password));
    if (!passwordOk || !(await consumeSecondFactor(user, code))) {
      audit(req, 'mfa.disable_failed', { targetType: 'admin', targetId: user._id });
      res.status(400).json({ success: false, error: 'Password or authentication code is incorrect.' });
      return;
    }

    await AdminUser.updateOne(
      { _id: user._id },
      { $set: { mfaEnabled: false, mfaLastStep: -1 }, $unset: { mfaSecret: 1, mfaPendingSecret: 1, mfaRecoveryCodes: 1 } }
    );
    audit(req, 'mfa.disabled', { targetType: 'admin', targetId: user._id });
    res.status(200).json({ success: true, message: 'Two-factor authentication is now off.' });
  })
);

// POST /api/auth/mfa/recovery-codes { code } - replaces all recovery codes.
router.post(
  '/recovery-codes',
  loginLimiter,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const user = await withSecrets(req.adminUser._id);
    if (!user.mfaEnabled) {
      res.status(400).json({ success: false, error: 'Two-factor authentication is not on.' });
      return;
    }
    if (!(await consumeSecondFactor(user, req.body?.code))) {
      res.status(400).json({ success: false, error: 'Authentication code is incorrect.' });
      return;
    }

    const { codes, hashes } = newRecoveryCodes();
    await AdminUser.updateOne({ _id: user._id }, { $set: { mfaRecoveryCodes: hashes } });
    audit(req, 'mfa.recovery_codes_regenerated', { targetType: 'admin', targetId: user._id });
    res.status(200).json({ success: true, recoveryCodes: codes });
  })
);

export default router;
