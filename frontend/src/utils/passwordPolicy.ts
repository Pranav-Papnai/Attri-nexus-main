// Mirrors isAcceptablePassword in backend/src/lib/passwords.js; keep the two in sync.
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_RULE_TEXT =
  'At least 10 characters, with an uppercase letter, a lowercase letter, a number and a special character (e.g. @ ! # $ %).';

const SPECIAL_CHAR = /[@!#$%^&*()_\-+=[\]{};:'",.<>?/\\|`~]/;

/** Returns what is missing, or null when the password meets the policy. */
export function passwordProblem(password: string): string | null {
  const missing: string[] = [];
  if (password.length < PASSWORD_MIN_LENGTH) missing.push(`at least ${PASSWORD_MIN_LENGTH} characters`);
  if (!/[A-Z]/.test(password)) missing.push('an uppercase letter');
  if (!/[a-z]/.test(password)) missing.push('a lowercase letter');
  if (!/[0-9]/.test(password)) missing.push('a number');
  if (!SPECIAL_CHAR.test(password)) missing.push('a special character (e.g. @ ! # $ %)');
  return missing.length ? `Password needs ${missing.join(', ')}.` : null;
}
