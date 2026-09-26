import mongoose from 'mongoose';

// One row per failed login. Rows expire on their own via the TTL index below,
// so nothing has to sweep this collection.
const loginAttemptSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    // Recorded so a lockout can be scoped to email+IP rather than email alone:
    // locking purely by email would let anyone lock the real admin out at will.
    ip: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now, expires: 900 }
  },
  { versionKey: false }
);

loginAttemptSchema.index({ email: 1, ip: 1, createdAt: -1 });

export const LoginAttempt =
  mongoose.models.LoginAttempt || mongoose.model('LoginAttempt', loginAttemptSchema);
