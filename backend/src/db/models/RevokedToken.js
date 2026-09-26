import mongoose from 'mongoose';

// Records tokens that have been revoked via logout before their natural expiry.
// Entries are automatically deleted by MongoDB's background TTL index once
// expiresAt passes, so this collection never accumulates stale rows.
const revokedTokenSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    // Matches the token's JWT exp timestamp. MongoDB automatically removes
    // the document once this date is reached.
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    }
  },
  { timestamps: true, versionKey: false }
);

export const RevokedToken =
  mongoose.models.RevokedToken || mongoose.model('RevokedToken', revokedTokenSchema);
