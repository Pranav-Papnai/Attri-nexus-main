import { Router } from 'express';
import { AuditLog } from '../db/models/AuditLog.js';
import { requireAdmin, requireSuperAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler } from '../middleware/errors.js';
import { audit } from '../lib/audit.js';

const router = Router();
const MAX_ENTRIES = 500;

// GET /api/audit?limit=200 - most recent security events (Super Admin only).
router.get(
  '/',
  requireAdmin,
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 200, 1), MAX_ENTRIES);
    const rows = await AuditLog.find().sort({ at: -1 }).limit(limit).lean();
    res.status(200).json({
      success: true,
      data: rows.map(({ _id, ...row }) => ({ id: String(_id), ...row }))
    });
  })
);

// POST /api/audit/lead-export { count, range } - the dashboard builds lead CSVs
// in the browser, so it reports each export here before downloading.
router.post('/lead-export', requireAdmin, (req, res) => {
  const count = Number.parseInt(req.body?.count, 10);
  const range = typeof req.body?.range === 'string' ? req.body.range.slice(0, 80) : undefined;
  audit(req, 'inquiries.exported', { meta: { count: Number.isFinite(count) ? count : undefined, range } });
  res.status(200).json({ success: true });
});

export default router;
