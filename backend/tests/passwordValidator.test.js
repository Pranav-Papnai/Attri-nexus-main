/**
 * Password Validator Tests
 * Tests: Weak password rejection, strong password acceptance
 */

import { describe, it, expect } from '@jest/globals';
import { validatePassword, getPasswordStrength } from '../src/middleware/passwordValidator.js';

describe('Password Validator', () => {
  describe('validatePassword()', () => {
    // ❌ WEAK - Should reject
    it('should reject password with less than 12 characters', () => {
      expect(() => validatePassword('Pass1@abc')).toThrow(/minimum 12 characters/);
    });

    it('should reject password without uppercase letter', () => {
      expect(() => validatePassword('password123@abc')).toThrow(/uppercase letter/);
    });

    it('should reject password without lowercase letter', () => {
      expect(() => validatePassword('PASSWORD123@ABC')).toThrow(/lowercase letter/);
    });

    it('should reject password without number', () => {
      expect(() => validatePassword('Password@abcdef')).toThrow(/number/);
    });

    it('should reject password without special character', () => {
      expect(() => validatePassword('Password123abcd')).toThrow(/special character/);
    });

    it('should reject common weak passwords', () => {
      const weakPasswords = [
        '123456789',          // numbers only
        'password',           // common word
        '12345678',           // too short
        'Aa1@bcde',          // too short
        'abc123def',         // no uppercase
        'ABC123DEF',         // no lowercase
      ];

      weakPasswords.forEach(pass => {
        expect(() => validatePassword(pass)).toThrow();
      });
    });

    // ✅ STRONG - Should accept
    it('should accept strong password with all requirements', () => {
      const strongPasswords = [
        'MyPassword123@',
        'SecureP@ss2024',
        'Admin#2024Work',
        'C0mpl3x!Pass',
        'Str0ng#Secure@Pass123',
      ];

      strongPasswords.forEach(pass => {
        expect(() => validatePassword(pass)).not.toThrow();
      });
    });

    it('should accept password with various special characters', () => {
      const specialChars = '@!#$%^&*()_-+=[]{};\':",".<>?/\\|`~';
      specialChars.split('').forEach(char => {
        if (char === '\\') return; // Skip backslash in loop
        const password = `MyPassword1${char}`;
        expect(() => validatePassword(password)).not.toThrow();
      });
    });
  });

  describe('getPasswordStrength()', () => {
    it('should return correct strength score for weak password', () => {
      const result = getPasswordStrength('Pass1@');
      expect(result.score).toBeLessThan(5);
      expect(result.isValid).toBe(false);
    });

    it('should return "Very strong" for excellent password', () => {
      const result = getPasswordStrength('MySecurePassword123!@#');
      expect(result.score).toBe(5);
      expect(result.level).toBe('Very strong');
      expect(result.isValid).toBe(true);
    });

    it('should provide feedback on password strength', () => {
      const result = getPasswordStrength('MyPassword123@');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('level');
      expect(result).toHaveProperty('isValid');
    });

    it('should identify which requirements are met', () => {
      const weak = getPasswordStrength('weak');
      const strong = getPasswordStrength('MyPassword123@');
      expect(weak.score).toBeLessThan(strong.score);
    });
  });
});

/**
 * Integration Tests - Auth API
 */
describe('Auth API - Password Strength', () => {
  describe('POST /api/auth/register', () => {
    it('should reject registration with weak password', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: '123456'  // ❌ too weak
        })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('uppercase');
    });

    it('should accept registration with strong password', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'strong@example.com',
          password: 'MyPassword123@'  // ✅ strong
        })
      });

      expect(response.status).toBeLessThan(400) || expect(response.status).toBe(409); // 409 if user exists
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reject password reset with weak password', async () => {
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@example.com',
          code: 'resetcode123',
          newPassword: 'weak'  // ❌ too weak
        })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('12 characters');
    });
  });
});

/**
 * Security Test Cases
 * These test that common weak passwords are properly rejected
 */
describe('Security - Common Weak Passwords', () => {
  const commonWeakPasswords = [
    '123456',
    '123456789',
    'password',
    'qwerty',
    'abc123',
    '12345678',
    '111111',
    'letmein',
    'welcome',
    'monkey'
  ];

  commonWeakPasswords.forEach(password => {
    it(`should reject common weak password: "${password}"`, () => {
      expect(() => validatePassword(password)).toThrow();
    });
  });
});
