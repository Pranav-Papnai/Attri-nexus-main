import { Router } from 'express';
import mongoose from 'mongoose';
import { Inquiry } from '../db/models/Inquiry.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { inquiryLimiter } from '../middleware/rateLimit.js';
import { verifyTurnstile } from '../lib/turnstile.js';
import { notifyNewInquiry } from '../lib/email.js';
import { asyncHandler, isValidationError, validationMessage } from '../middleware/errors.js';
import { audit } from '../lib/audit.js';

const router = Router();

const MAX_INQUIRIES = 2000;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;
const MAX_FIELD_LENGTH = 2000;
const MAX_NOTES_LENGTH = 5000;

// Same rules as the public forms (frontend/src/utils/validation.ts). They also
// keep quotes and formula characters out of the fields exported to CSV.
const PHONE_PATTERN = /^[\d\s\-+()]{7,40}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hasEnoughDigits = (phone) => (phone.match(/\d/g) || []).length >= 7;
const isOptionalString = (value) => value === undefined || value === null || typeof value === 'string';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/inquiries - admin only. This is the lead list in the dashboard.
router.get(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const rows = await Inquiry.find().sort({ created_at: -1 }).limit(MAX_INQUIRIES).lean();
    res.status(200).json({
      success: true,
      data: rows.map((row) => ({ ...row, id: String(row._id) }))
    });
  })
);

// POST /api/inquiries - public lead capture from the contact, bulk and modal
// enquiry forms.
router.post(
  '/',
  inquiryLimiter,
  asyncHandler(async (req, res) => {
    const body = req.body || {};
    const { name, email, phone, company_name, product_id, quantity, message, source, captcha_token, consent, consent_version } = body;

    // Honeypot. The field is hidden from real visitors by CSS, so only a bot
    // filling every input reaches this. Report success so the bot learns
    // nothing, but never persist the submission. The frontend filters this
    // too; repeating it here covers anyone calling the API directly.
    if (typeof body.website === 'string' && body.website.trim().length > 0) {
      res.status(200).json({ success: true });
      return;
    }

    if (!name || !phone || !message || !source) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }

    const textFields = { name, email, phone, company_name, product_id, quantity, message, source, consent_version };
    if (!Object.values(textFields).every(isOptionalString)) {
      res.status(400).json({ success: false, error: 'Every field must be text' });
      return;
    }

    if (!PHONE_PATTERN.test(phone.trim()) || !hasEnoughDigits(phone)) {
      res.status(400).json({ success: false, error: 'Please enter a valid phone number' });
      return;
    }

    if (email && (email.length > 200 || !EMAIL_PATTERN.test(email.trim()))) {
      res.status(400).json({ success: false, error: 'Please enter a valid email address' });
      return;
    }

    // DPDP Act 2023 s.6: no consent, no processing. The checkbox on every
    // public form sets this; anyone posting to the API directly must too.
    if (consent !== true) {
      res.status(400).json({
        success: false,
        error: 'Consent is required. Please agree to the Privacy Policy to submit an enquiry.'
      });
      return;
    }

    // Bounds every free-text field before anything is stored or emailed.
    for (const [key, value] of Object.entries({ name, email, phone, company_name, product_id, quantity, message })) {
      if (value !== undefined && String(value).length > MAX_FIELD_LENGTH) {
        res.status(400).json({ success: false, error: `${key} is too long` });
        return;
      }
    }

    // The frontend looks for the word "captcha" in a 400's error string to
    // decide whether to show the CAPTCHA-specific message, so this wording
    // matters (frontend/src/services/api/backend.ts).
    const captchaOk = await verifyTurnstile(captcha_token, req.ip);
    if (!captchaOk) {
      res.status(400).json({
        success: false,
        error: 'Captcha verification failed. Please try again.'
      });
      return;
    }

    const normalizedEmail = email ? String(email).trim().toLowerCase() : '';
    const normalizedPhone = String(phone).trim();

    // Server-side duplicate guard over the same 5-minute window the client
    // enforces in localStorage - which is trivially bypassed by anyone posting
    // here directly. Phone is the stable key now that email is optional.
    const duplicate = await Inquiry.exists({
      phone: normalizedPhone,
      created_at: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) }
    });

    if (duplicate) {
      res.status(409).json({
        success: false,
        error:
          'We already received an enquiry from this email/phone recently. Please check your inbox or contact us directly.'
      });
      return;
    }

    const VALID_SOURCES = ['contact', 'bulk', 'modal', 'quick_quote'];
    let normalizedSource = null;
    const rawSource = String(source || '').toLowerCase().trim();
    if (VALID_SOURCES.includes(rawSource)) {
      normalizedSource = rawSource;
    } else if (rawSource === 'quick' || rawSource === 'quote') {
      normalizedSource = 'quick_quote';
    } else {
      res.status(400).json({ success: false, error: 'Invalid inquiry source' });
      return;
    }

    try {
      const created = await Inquiry.create({
        name: String(name).trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        company_name: company_name ? String(company_name).trim() : undefined,
        product_id: product_id ? String(product_id).trim() : undefined,
        quantity: quantity ? String(quantity).trim() : undefined,
        message: String(message).trim(),
        source: normalizedSource,
        status: 'new',
        consent_given: true,
        consent_at: new Date(),
        consent_version: consent_version ? String(consent_version).trim().slice(0, 32) : undefined
      });

      // Fire-and-forget: a slow or failing mail provider must never delay the
      // response to the person submitting the form - their lead is already
      // saved. notifyNewInquiry logs its own failures; the .catch is a
      // backstop, since an unhandled rejection would take down this
      // long-lived process.
      notifyNewInquiry(created.toObject()).catch((err) =>
        console.error('Enquiry notification failed:', err)
      );

      res.status(200).json({ success: true });
    } catch (err) {
      if (isValidationError(err)) {
        res.status(400).json({ success: false, error: validationMessage(err) });
        return;
      }
      throw err;
    }
  })
);

// PATCH /api/inquiries/:id or /api/inquiries/:id/status - admin updates a lead's status and notes.
router.patch(
  ['/:id', '/:id/status'],
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      res.status(404).json({ success: false, error: 'Inquiry not found' });
      return;
    }

    const { status, notes } = req.body || {};

    if ((status !== undefined && typeof status !== 'string') || !isOptionalString(notes)) {
      res.status(400).json({ success: false, error: 'status and notes must be text' });
      return;
    }
    if (typeof notes === 'string' && notes.length > MAX_NOTES_LENGTH) {
      res.status(400).json({ success: false, error: 'notes is too long' });
      return;
    }

    // Only fields actually supplied are written. Building the payload
    // unconditionally would send `status: undefined` on a notes-only edit and
    // issue an empty update.
    const patch = {};
    if (status !== undefined) patch.status = status;
    if (notes !== undefined) patch.notes = notes;

    if (Object.keys(patch).length === 0) {
      res.status(400).json({ success: false, error: 'Nothing to update' });
      return;
    }

    try {
      const updated = await Inquiry.findByIdAndUpdate(
        req.params.id,
        { $set: patch },
        { returnDocument: 'after', runValidators: true }
      ).lean();

      if (!updated) {
        res.status(404).json({ success: false, error: 'Inquiry not found' });
        return;
      }

      audit(req, 'inquiry.updated', { targetType: 'inquiry', targetId: updated._id, meta: { fields: Object.keys(patch), status: patch.status } });
      res.status(200).json({ success: true, data: { ...updated, id: String(updated._id) } });
    } catch (err) {
      if (isValidationError(err)) {
        res.status(400).json({ success: false, error: validationMessage(err) });
        return;
      }
      throw err;
    }
  })
);

// DELETE /api/inquiries/:id - admin only.
router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      res.status(404).json({ success: false, error: 'Inquiry not found' });
      return;
    }

    const deleted = await Inquiry.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Inquiry not found' });
      return;
    }

    audit(req, 'inquiry.deleted', { targetType: 'inquiry', targetId: req.params.id });
    res.status(200).json({ success: true });
  })
);

export default router;
