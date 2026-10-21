/**
 * Password strength validator
 * Requirements: Min 12 chars, uppercase, lowercase, number, special char
 */

function validatePassword(password) {
  const rules = [
    {
      regex: /^.{12,}$/,
      message: 'minimum 12 characters'
    },
    {
      regex: /[a-z]/,
      message: 'at least one lowercase letter (a-z)'
    },
    {
      regex: /[A-Z]/,
      message: 'at least one uppercase letter (A-Z)'
    },
    {
      regex: /[0-9]/,
      message: 'at least one number (0-9)'
    },
    {
      regex: /[@!#$%^&*()_\-+=\[\]{};:'",.<>?/\\|`~]/,
      message: 'at least one special character (@!#$%^&*)'
    }
  ];

  const failed = rules.filter(rule => !rule.regex.test(password));

  if (failed.length > 0) {
    const failedMessages = failed.map(f => f.message).join(', ');
    const error = new Error(`Password must have: ${failedMessages}`);
    error.statusCode = 400;
    error.code = 'WEAK_PASSWORD';
    throw error;
  }

  return true;
}

/**
 * Get password strength score (for frontend feedback)
 * Returns: { score: 0-5, feedback: string }
 */
function getPasswordStrength(password) {
  let score = 0;
  const feedback = [];

  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[@!#$%^&*()_\-+=\[\]{};:'",.<>?/\\|`~]/.test(password)) score++;

  const levels = {
    0: 'Very weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
    5: 'Very strong',
    6: 'Excellent'
  };

  return {
    score: Math.min(score, 5),
    level: levels[Math.min(score, 5)],
    isValid: score >= 5
  };
}

module.exports = {
  validatePassword,
  getPasswordStrength
};
