import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { validatePassword, getPasswordStrength } from '../src/middleware/passwordValidator.js';
import { isAcceptablePassword } from '../src/lib/passwords.js';

const STRONG = ['Attri@2024', 'MyPassword123@', 'SecureP@ss2024', 'Admin#2024Work', 'C0mpl3x!Pass', 'Str0ng#Secure@Pass123'];
const COMMON_WEAK = ['123456', '123456789', 'password', 'qwerty', 'abc123', '12345678', '111111', 'letmein', 'welcome', 'monkey'];

describe('validatePassword()', () => {
  test('rejects passwords shorter than 10 characters', () => {
    assert.throws(() => validatePassword('Pass1@abc'), /minimum 10 characters/);
  });

  test('rejects a password missing an uppercase letter', () => {
    assert.throws(() => validatePassword('password123@abc'), /uppercase letter/);
  });

  test('rejects a password missing a lowercase letter', () => {
    assert.throws(() => validatePassword('PASSWORD123@ABC'), /lowercase letter/);
  });

  test('rejects a password missing a number', () => {
    assert.throws(() => validatePassword('Password@abcdef'), /number/);
  });

  test('rejects a password missing a special character', () => {
    assert.throws(() => validatePassword('Password123abcd'), /special character/);
  });

  test('sets a 400 WEAK_PASSWORD error', () => {
    assert.throws(() => validatePassword('weak'), { statusCode: 400, code: 'WEAK_PASSWORD' });
  });

  test('rejects common weak passwords', () => {
    for (const pass of COMMON_WEAK) {
      assert.throws(() => validatePassword(pass), undefined, pass);
    }
  });

  test('accepts strong passwords', () => {
    for (const pass of STRONG) {
      assert.doesNotThrow(() => validatePassword(pass), pass);
    }
  });

  test('accepts each supported special character', () => {
    for (const char of '@!#$%^&*()_-+=[]{};:\'",.<>?/\\|`~') {
      assert.doesNotThrow(() => validatePassword(`MyPassword1${char}`), char);
    }
  });
});

describe('getPasswordStrength()', () => {
  test('marks a short password as invalid', () => {
    const result = getPasswordStrength('Pass1@');
    assert.ok(result.score < 5);
    assert.equal(result.isValid, false);
  });

  test('rates a long complex password as Very strong', () => {
    assert.deepEqual(getPasswordStrength('MySecurePassword123!@#'), { score: 5, level: 'Very strong', isValid: true });
  });

  test('scores a weak password below a strong one', () => {
    assert.ok(getPasswordStrength('weak').score < getPasswordStrength('MyPassword123@').score);
  });
});

describe('isAcceptablePassword()', () => {
  test('rejects common weak passwords', () => {
    for (const pass of COMMON_WEAK) {
      assert.equal(isAcceptablePassword(pass), false, pass);
    }
  });

  test('rejects non-strings and passwords over 128 characters', () => {
    assert.equal(isAcceptablePassword(undefined), false);
    assert.equal(isAcceptablePassword({ $gt: '' }), false);
    assert.equal(isAcceptablePassword(`Aa1@${'x'.repeat(125)}`), false);
  });

  test('accepts strong passwords', () => {
    for (const pass of STRONG) {
      assert.equal(isAcceptablePassword(pass), true, pass);
    }
  });
});
