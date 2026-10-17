import mongoose from 'mongoose';

// Security-relevant actions: who did what, when, from where. Never holds
// passwords, codes, tokens or customer enquiry content - only identifiers.
const auditLogSchema = new mongoose.Schema(
  {
    at: { type: Date, default: Date.now },
    action: { type: String, required: true },
    actorId: { type: String },
    actorEmail: { type: String },
    targetType: { type: String },
    targetId: { type: String },
    ip: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed }
  },
  { versionKey: false }
);

// One year of history, then MongoDB removes entries on its own.
auditLogSchema.index({ at: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });
auditLogSchema.index({ action: 1, at: -1 });

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
