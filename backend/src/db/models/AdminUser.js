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
    role: { type: String, default: 'admin' }
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

export const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);
