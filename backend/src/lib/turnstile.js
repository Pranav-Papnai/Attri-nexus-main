import { TURNSTILE_SECRET_KEY, NODE_ENV } from '../config.js';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const isTurnstileConfigured = () => Boolean(TURNSTILE_SECRET_KEY);

// Returns true when the submission may proceed.
export async function verifyTurnstile(token, remoteIp) {
  if (!isTurnstileConfigured()) return true;
  if (!token) return false;

  // Allow dev / test tokens during local development & Postman testing
  if (NODE_ENV === 'development' && (String(token).startsWith('dev-') || token === 'test' || String(token).startsWith('1x0000'))) {
    return true;
  }

  try {
    const body = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: String(token) });
    if (remoteIp) body.append('remoteip', remoteIp);

    // Cloudflare going down must not hang the enquiry request forever.
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(8000)
    });

    const data = await res.json();
    if (!data.success) {
      console.warn('Turnstile rejected a submission:', data['error-codes']);
    }
    return Boolean(data.success);
  } catch (err) {
    // Network failure or timeout talking to Cloudflare. Fail closed: an
    // unverifiable token is not a verified one, and the client shows the
    // "please try again" message.
    console.error('Turnstile verification failed:', err);
    return false;
  }
}
