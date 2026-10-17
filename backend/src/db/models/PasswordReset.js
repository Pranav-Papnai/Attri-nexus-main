import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    otpHash: {
      type: String,
      required: true
    },
    // Wrong guesses against this code. A 6-digit code is only safe while the
    // number of guesses per code stays tiny, independent of per-IP limits.
    attempts: { type: Number, default: 0 },
    // Documents automatically expire and delete 15 minutes after creation
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    }
  },
  { timestamps: true, versionKey: false }
);

export const PasswordReset =
  mongoose.models.PasswordReset || mongoose.model('PasswordReset', passwordResetSchema);
