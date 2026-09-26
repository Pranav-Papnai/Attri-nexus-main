/**
 * Comprehensive Request Sanitization & Injection Defense Middleware
 * 
 * Protects against:
 * 1. NoSQL / MongoDB Operator Injection ($where, $regex, $gt, $ne, $expr, etc.)
 * 2. MongoDB Property Traversal (. in keys)
 * 3. Prototype Pollution (__proto__, constructor, prototype)
 * 4. Stored XSS / Script Injection (<script>, javascript:, inline event handlers)
 */

const PROHIBITED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

// Disarm script tags, iframe, object, embed, javascript: URIs and dangerous on* event handlers
export function sanitizeString(val) {
  if (typeof val !== 'string') return val;

  return val
    // Remove <script>...</script> tags entirely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove <iframe>...</iframe>, <object>, <embed>
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Disarm javascript:, vbscript:, data:text/html URIs
    .replace(/(javascript|vbscript|data\s*:\s*text\/html)\s*:/gi, 'disarmed-uri:')
    // Disarm inline event handlers like onerror=, onload=, onclick=
    .replace(/\bon\w+\s*=/gi, 'disarmed-event=');
}

export function deepSanitize(target, options = { stripNoSql: true, sanitizeHtml: true }) {
  if (!target || typeof target !== 'object') {
    return typeof target === 'string' && options.sanitizeHtml ? sanitizeString(target) : target;
  }

  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      target[i] = deepSanitize(target[i], options);
    }
    return target;
  }

  for (const key of Object.keys(target)) {
    // 1. Defend against Prototype Pollution
    if (PROHIBITED_KEYS.has(key)) {
      delete target[key];
      continue;
    }

    // 2. Defend against NoSQL Operator Injection ($gt, $ne, $where, $regex)
    // and Property Traversal (key containing '.')
    if (options.stripNoSql && (key.startsWith('$') || key.includes('.'))) {
      delete target[key];
      continue;
    }

    const value = target[key];

    if (typeof value === 'string') {
      target[key] = options.sanitizeHtml ? sanitizeString(value) : value;
    } else if (value && typeof value === 'object') {
      target[key] = deepSanitize(value, options);
    }
  }

  return target;
}

/**
 * Express middleware to sanitize body, query, and params
 */
export function sanitizeRequest(req, res, next) {
  try {
    if (req.body && typeof req.body === 'object') {
      deepSanitize(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      deepSanitize(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      deepSanitize(req.params);
    }
    next();
  } catch (err) {
    next(err);
  }
}
