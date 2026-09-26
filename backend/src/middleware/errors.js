import mongoose from 'mongoose';
import { IS_PROD } from '../config.js';

export function notFound(req, res) {
  res.status(404).json({ success: false, error: `No route for ${req.method} ${req.originalUrl}` });
}

// Turns a Mongoose ValidationError into one readable sentence naming the
// offending fields. The admin dashboard shows this string verbatim in its
// "Failed to save product" alert, which is what makes a rejected save fixable
// without opening the network tab.
export function validationMessage(err) {
  return Object.values(err.errors || {})
    .map((e) => e.message)
    .join('; ');
}

export function isValidationError(err) {
  return err instanceof mongoose.Error.ValidationError;
}

// Backstop only - every route handles its own expected failures and returns a
// route-specific message. Anything arriving here is unplanned, so the real
// error goes to the log and the client gets a generic message, except in
// development where seeing it in the response is worth more.
//
// eslint-disable-next-line no-unused-vars -- Express identifies error
// middleware by arity; dropping `next` turns this back into a normal handler.
export function errorHandler(err, req, res, next) {
  // Raised by express.json() when the body exceeds JSON_BODY_LIMIT.
  if (err?.type === 'entity.too.large') {
    res.status(413).json({ success: false, error: 'Payload too large' });
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ success: false, error: 'Malformed JSON body' });
    return;
  }

  if (isValidationError(err)) {
    res.status(400).json({ success: false, error: validationMessage(err) || 'Validation failed' });
    return;
  }

  // Thrown by the CORS origin callback. Without this it would surface as a
  // 500, which reads as "the server is broken" rather than "this origin is
  // not on the allowlist".
  if (err?.message?.includes('is not allowed by CORS')) {
    res.status(403).json({ success: false, error: err.message });
    return;
  }

  console.error(`Unhandled error on ${req.method} ${req.originalUrl}:`, err);

  // Express may already have started streaming a response; writing a second
  // status would throw on top of the original error.
  if (res.headersSent) return;

  res.status(500).json({
    success: false,
    error: IS_PROD ? 'Internal server error' : String(err?.message || err)
  });
}

// Express 5 forwards a rejected promise from an async handler to the error
// middleware automatically, but only for handlers it awaits. Wrapping keeps
// that behaviour explicit and identical across route styles.
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
