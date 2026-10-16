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
    // Not an enum: accounts created before roles existed hold 'admin', which
    // is treated as a non-super role. New accounts are limited to ADMIN_ROLES.
    role: { type: String, default: 'Commercial Admin' },
    // Any session issued before this instant is rejected by requireAdmin.
    passwordChangedAt: { type: Date }
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
    return ret;
  }
});

export const SUPER_ADMIN = 'Super Admin';
export const ADMIN_ROLES = [SUPER_ADMIN, 'Commercial Admin'];

export const AdminUser =mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);
