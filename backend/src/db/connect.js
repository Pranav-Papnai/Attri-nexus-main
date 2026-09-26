import mongoose from 'mongoose';
import { MONGODB_URI, IS_PROD } from '../config.js';

// Whether a URI was supplied at all. Routes that need the database are fronted
// by requireDatabase, which turns "not configured" into a 503 rather than
// letting a query hang or throw deep inside a handler.
export const isConfigured = Boolean(MONGODB_URI);

let connecting = null;

// Attach connection lifecycle listeners once
mongoose.connection.on('connected', () => {
  console.log('[db] MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('[db] MongoDB connection error:', err.message);
  connecting = null;
});

mongoose.connection.on('disconnected', () => {
  console.warn('[db] MongoDB disconnected. Ready state:', mongoose.connection.readyState);
  connecting = null;
});

export function isConnected() {
  return mongoose.connection.readyState === 1;
}

// Idempotent & Auto-reconnecting: ensures that if a connection drops,
// a new connection attempt is cleanly initiated.
export async function connectDB() {
  if (!isConfigured) {
    throw new Error('MONGODB_URI is not set');
  }

  // If already connected, return immediately
  if (isConnected()) {
    return mongoose.connection;
  }

  // If currently connecting, wait for it
  if (connecting && mongoose.connection.readyState === 2) {
    return connecting;
  }

  // Reset memo to initiate fresh connection
  connecting = mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 2,
      autoIndex: true
    })
    .catch((err) => {
      connecting = null;
      throw err;
    });

  return connecting;
}

export async function disconnectDB() {
  connecting = null;
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
