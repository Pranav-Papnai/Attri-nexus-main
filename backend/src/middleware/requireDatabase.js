import { isConfigured, isConnected, connectDB } from '../db/connect.js';

// Fronts every route that reads or writes the database.
//
// 503 rather than 500: "not ready yet" is the accurate status, and the
// frontend already treats a failed API call as a cue to fall back to its
// localStorage data, so the site stays browsable while this is true.
export async function requireDatabase(req, res, next) {
  if (!isConfigured) {
    res.status(503).json({
      success: false,
      error: 'Database not configured - set MONGODB_URI in .env.local and restart the server.'
    });
    return;
  }

  if (isConnected()) {
    next();
    return;
  }

  // Boot connects eagerly, so reaching here means the connection dropped.
  // One reconnect attempt beats failing a request the driver could serve.
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database unavailable:', err.message);
    res.status(503).json({ success: false, error: 'Database temporarily unavailable' });
  }
}
