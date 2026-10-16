import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { isTokenRevoked } from '../lib/revocation.js';
import { isConnected } from '../db/connect.js';
import { AdminUser, SUPER_ADMIN } from '../db/models/AdminUser.js';

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

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    // Expired and forged tokens are deliberately indistinguishable to the
    // client; the frontend treats any 401 the same way.
    res.status(401).json({ success: false, error: 'Invalid or expired session' });
    return;
  }

  // The account is re-read on every request so a deleted admin, a changed
  // role or a changed password takes effect immediately rather than when the
  // 7-day token expires. Without a live connection that check cannot run, and
  // Mongoose would otherwise buffer the query for seconds before failing.
  if (!isConnected()) {
    res.status(503).json({ success: false, error: 'Database temporarily unavailable' });
    return;
  }

  if (await isTokenRevoked(token)) {
    res.status(401).json({ success: false, error: 'Session has been revoked. Please log in again.' });
    return;
  }

  const user = await AdminUser.findById(decoded.sub)
    .select('email name role passwordChangedAt')
    .lean()
    .catch(() => null);

  // JWT iat has one-second resolution, so compare in whole seconds: a token
  // issued in the same second as the change (the one handed back by the
  // change itself) stays valid.
  const changedAtSec = user?.passwordChangedAt ? Math.floor(new Date(user.passwordChangedAt).getTime() / 1000) : 0;

  if (!user || (decoded.iat ?? 0) < changedAtSec) {
    res.status(401).json({ success: false, error: 'Invalid or expired session' });
    return;
  }

  req.admin = decoded;
  req.adminUser = user;
  req.token = token;
  next();
}

// Must run after requireAdmin.
export function requireSuperAdmin(req, res, next) {
  if (req.adminUser?.role !== SUPER_ADMIN) {
    res.status(403).json({ success: false, error: 'Only a Super Admin can manage admin accounts.' });
    return;
  }
  next();
}
