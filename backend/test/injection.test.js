import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import querystring from 'node:querystring';
import { deepSanitize, parseQuerySafely } from '../src/middleware/sanitize.js';

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

  test('leaves string values untouched (output encoding is the XSS defence)', () => {
    const body = { message: '<script>alert(1)</script> & won=derful' };
    deepSanitize(body);
    assert.equal(body.message, '<script>alert(1)</script> & won=derful');
  });

  test('query strings are parsed flat and dangerous keys are dropped', () => {
    const parsed = parseQuerySafely('limit=5&$where=1&a.b=2&__proto__=x&email[$ne]=y', querystring.parse);
    assert.deepEqual(Object.keys(parsed).sort(), ['email[$ne]', 'limit']);
    assert.equal(typeof parsed['email[$ne]'], 'string', 'brackets never become a nested operator object');
  });
});
