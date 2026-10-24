import bcrypt from 'bcryptjs';
import { AdminUser } from '../db/models/AdminUser.js';

export const BCRYPT_ROUNDS = 12;
export const MIN_PASSWORD_LENGTH = 10;
// Keep in sync with frontend/src/utils/passwordPolicy.ts.
export const PASSWORD_RULE_MESSAGE =
  'Password must be at least 10 characters and include an uppercase letter, a lowercase letter, a number and a special character (e.g. @ ! # $ %)';
export const MAX_PASSWORD_LENGTH = 128; // bcrypt CPU-exhaustion guard

// Until October 2026 every request body passed through an HTML-stripping
// sanitizer, so a password such as "my onload=pass" was hashed in its rewritten
// form. Reproducing that rewrite here (inputs are capped at 128 chars, so the
// quadratic regexes are harmless) lets those accounts keep logging in; the
// hash is upgraded to the real password on first success.
function legacyRewrite(value) {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/(javascript|vbscript|data\s*:\s*text\/html)\s*:/gi, 'disarmed-uri:')
    .replace(/\bon\w+\s*=/gi, 'disarmed-event=');
}

export function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function isAcceptablePassword(password) {
  if (!(typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH)) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[@!#$%^&*()_\-+=\[\]{};:'",.<>?/\\|`~]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

// `user` needs _id and passwordHash. Resolves true when the password matches,
// transparently upgrading a legacy-rewritten hash.
export async function verifyPassword(user, password) {
  if (await bcrypt.compare(password, user.passwordHash)) return true;

  const rewritten = legacyRewrite(password);
  // Compares the input with its own rewrite, not with a stored secret.
  // nosemgrep: ajinabraham.njsscan.crypto.timing_attack_node.node_timing_attack
  if (rewritten === password) return false;
  if (!(await bcrypt.compare(rewritten, user.passwordHash))) return false;

  await AdminUser.updateOne({ _id: user._id }, { $set: { passwordHash: await hashPassword(password) } });
  return true;
}
