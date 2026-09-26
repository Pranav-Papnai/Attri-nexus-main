import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { deepSanitize, sanitizeString } from '../src/middleware/sanitize.js';

describe('Security & Injection Defense Suite', () => {
  test('strips NoSQL operator injection keys ($gt, $ne, $where, $regex, $expr)', () => {
    const maliciousPayload = {
      email: { $gt: '' },
      password: 'password123',
      $where: 'sleep(5000)',
      nested: {
        filter: {
          $regex: '^admin'
        }
      }
    };

    deepSanitize(maliciousPayload);

    assert.equal(maliciousPayload.$where, undefined);
    assert.deepEqual(maliciousPayload.email, {});
    assert.deepEqual(maliciousPayload.nested.filter, {});
    assert.equal(maliciousPayload.password, 'password123');
  });

  test('strips MongoDB property path traversal keys containing dot (.)', () => {
    const maliciousPayload = {
      'admin.role': 'superuser',
      'settings.auth.bypass': true,
      safeKey: 'cleanValue'
    };

    deepSanitize(maliciousPayload);

    assert.equal(maliciousPayload['admin.role'], undefined);
    assert.equal(maliciousPayload['settings.auth.bypass'], undefined);
    assert.equal(maliciousPayload.safeKey, 'cleanValue');
  });

  test('strips prototype pollution keys (__proto__, constructor, prototype)', () => {
    const maliciousPayload = JSON.parse(
      '{"__proto__": {"isAdmin": true}, "constructor": {"hacked": true}, "prototype": {"evil": true}, "normalField": "test"}'
    );

    deepSanitize(maliciousPayload);

    assert.equal(Object.prototype.hasOwnProperty.call(maliciousPayload, '__proto__'), false);
    assert.equal(maliciousPayload.constructor?.hacked, undefined);
    assert.equal(maliciousPayload.prototype, undefined);
    assert.equal(maliciousPayload.normalField, 'test');
    assert.equal({}.isAdmin, undefined, 'global Object prototype is completely unpolluted');
  });

  test('disarms script tags and executable HTML injections', () => {
    const xssScript = '<script>alert("XSS")</script>Hello World';
    const sanitized = sanitizeString(xssScript);
    assert.equal(sanitized, 'Hello World');

    const iframeXss = '<iframe src="https://evil.com"></iframe>Check this';
    assert.equal(sanitizeString(iframeXss), 'Check this');

    const jsUri = '<a href="javascript:alert(1)">Click</a>';
    assert.ok(!sanitizeString(jsUri).includes('javascript:'));
    assert.ok(sanitizeString(jsUri).includes('disarmed-uri:'));

    const eventHandler = '<img src=x onerror=alert(document.cookie)>';
    assert.ok(!sanitizeString(eventHandler).includes('onerror='));
    assert.ok(sanitizeString(eventHandler).includes('disarmed-event='));
  });
});
