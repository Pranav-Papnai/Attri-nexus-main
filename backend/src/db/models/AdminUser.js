import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    // Never the password itself. The field is named for what it holds so a
    // plaintext value can never be written here by accident.
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true, default: 'Admin' },
    // Not an enum: accounts created before roles existed may hold 'admin',
    // which is treated as a non-super role. New accounts are limited to
    // ADMIN_ROLES; scripts/migrate-legacy-roles.js normalises old ones.
    role: { type: String, default: 'Commercial Admin' },
    // Any session issued before either instant is rejected by requireAdmin:
    // passwordChangedAt on password change/reset, sessionsRevokedAt on
    // security changes such as enabling two-factor authentication.
    passwordChangedAt: { type: Date },
    sessionsRevokedAt: { type: Date },

    // Two-factor authentication (TOTP). Secrets and recovery-code hashes are
    // never selected unless a route asks for them explicitly.
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, select: false },
    mfaPendingSecret: { type: String, select: false },
    mfaRecoveryCodes: { type: [String], select: false, default: undefined },
    // Last accepted TOTP time step; codes at or before it are replays.
    mfaLastStep: { type: Number, select: false, default: -1 }
  },
  { timestamps: true, versionKey: false }
);

// select:false is not used on passwordHash because the login path needs it;
// instead every route builds its own response object and never spreads a raw
// user document into JSON.
adminUserSchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret.passwordHash;
    delete ret.mfaSecret;
    delete ret.mfaPendingSecret;
    delete ret.mfaRecoveryCodes;
    return ret;
  }
});

export const SUPER_ADMIN = 'Super Admin';
export const ADMIN_ROLES = [SUPER_ADMIN, 'Commercial Admin'];

// Latest instant before which a session token is no longer accepted, in whole
// seconds to match JWT iat resolution.
export function sessionCutoffSeconds(user) {
  const times = [user?.passwordChangedAt, user?.sessionsRevokedAt]
    .filter(Boolean)
    .map((d) => new Date(d).getTime());
  return times.length ? Math.floor(Math.max(...times) / 1000) : 0;
}

export const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);
