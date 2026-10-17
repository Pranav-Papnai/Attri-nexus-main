import { AuditLog } from '../db/models/AuditLog.js';

// Fire-and-forget: a failed audit write is logged but never fails or delays
// the request it describes.
export function audit(req, action, { actor, actorEmail, targetType, targetId, meta } = {}) {
  const who = actor ?? req?.adminUser;
  const entry = {
    action,
    actorId: who?._id ? String(who._id) : undefined,
    actorEmail: actorEmail ?? who?.email,
    targetType,
    targetId: targetId === undefined ? undefined : String(targetId),
    ip: req?.ip,
    meta
  };
  AuditLog.create(entry).catch((err) => console.error(`[audit] could not record ${action}:`, err.message));
}
