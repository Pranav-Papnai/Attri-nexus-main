/**
 * Request key sanitisation.
 *
 * Protects against:
 * 1. NoSQL / MongoDB operator injection ($where, $regex, $gt, $ne, $expr, ...)
 * 2. MongoDB property traversal ('.' in keys)
 * 3. Prototype pollution (__proto__, constructor, prototype)
 *
 * String values are deliberately left untouched. XSS is prevented where data
 * is rendered (React escapes all output; the email template escapes HTML), and
 * regex-based HTML stripping on input both corrupted legitimate text and was a
 * quadratic-time denial-of-service vector on large bodies.
 */

const PROHIBITED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const isDangerousKey = (key) => PROHIBITED_KEYS.has(key) || key.startsWith('$') || key.includes('.');

export function deepSanitize(target) {
  if (!target || typeof target !== 'object') return target;

  if (Array.isArray(target)) {
    for (const item of target) deepSanitize(item);
    return target;
  }

  for (const key of Object.keys(target)) {
    if (isDangerousKey(key)) {
      delete target[key];
      continue;
    }
    const value = target[key];
    if (value && typeof value === 'object') deepSanitize(value);
  }

  return target;
}

// Express 5 recomputes req.query on every access, so mutating it in middleware
// has no lasting effect. Query strings are instead cleaned inside the query
// parser itself (see app.js); this middleware only needs to handle bodies.
export function sanitizeRequest(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    deepSanitize(req.body);
  }
  next();
}

// Installed as Express's 'query parser'. Uses the flat parser (no nested
// objects from a[b]=c) and drops dangerous keys.
export function parseQuerySafely(queryString, parse) {
  const parsed = parse(queryString || '');
  const clean = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (!isDangerousKey(key)) clean[key] = value;
  }
  return clean;
}
