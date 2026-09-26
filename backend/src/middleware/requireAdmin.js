import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { isTokenRevoked } from '../lib/revocation.js';

export async function requireAdmin(req, res, next) {
  if (!JWT_SECRET) {
    res.status(500).json({ success: false, error: 'Server not configured' });
    return;
  }

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

  if (!token) {
    res.status(401).json({ success: false, error: 'Missing authorization token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify token has not been revoked by server-side logout
    if (await isTokenRevoked(token)) {
      res.status(401).json({ success: false, error: 'Session has been revoked. Please log in again.' });
      return;
    }

    req.admin = decoded;
    req.token = token;
    next();
  } catch {
    // Expired and forged tokens are deliberately indistinguishable to the
    // client; the frontend treats any 401 the same way.
    res.status(401).json({ success: false, error: 'Invalid or expired session' });
  }
}
