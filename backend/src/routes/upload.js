import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { uploadLimiter } from '../middleware/rateLimit.js';
import {
  isStorageConfigured,
  uploadProductImage,
  STORAGE_MISSING_MESSAGE,
  ALLOWED_IMAGE_TYPES
} from '../lib/storage.js';
import { MAX_IMAGE_BYTES } from '../config.js';
import { asyncHandler } from '../middleware/errors.js';

const router = Router();

// The declared content type is attacker-controlled, so it is checked against
// the file's actual leading bytes. Without this, anything at all could be
// stored under an image/* label and served from the blob host.
function sniffImageType(buffer) {
  if (buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';

  const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (PNG.every((byte, i) => buffer[i] === byte)) return 'image/png';

  const container = buffer.toString('ascii', 0, 4);
  const brand = buffer.toString('ascii', 8, 12);
  if (container === 'RIFF' && brand === 'WEBP') return 'image/webp';
  if (buffer.toString('ascii', 4, 8) === 'ftyp' && brand.startsWith('avi')) return 'image/avif';

  return null;
}

// POST /api/upload-image - an admin uploads a product photo as base64 JSON and
// gets back a public URL to store on the product record. The browser never
// talks to blob storage directly and never sees the token that makes the
// upload possible.
router.post(
  '/',
  requireAdmin,
  uploadLimiter,
  asyncHandler(async (req, res) => {
    if (!isStorageConfigured()) {
      // 503, not 500: nothing is broken, the feature just is not set up. The
      // admin UI shows this error string verbatim.
      res.status(503).json({ success: false, error: STORAGE_MISSING_MESSAGE });
      return;
    }

    const { fileBase64, fileName, contentType } = req.body || {};
    if (!fileBase64 || !fileName) {
      res.status(400).json({ success: false, error: 'Missing file data' });
      return;
    }

    if (contentType && !ALLOWED_IMAGE_TYPES.includes(contentType)) {
      res.status(400).json({
        success: false,
        error: `Unsupported image type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`
      });
      return;
    }

    let buffer;
    try {
      buffer = Buffer.from(String(fileBase64), 'base64');
    } catch {
      res.status(400).json({ success: false, error: 'File data is not valid base64' });
      return;
    }

    if (buffer.length === 0) {
      res.status(400).json({ success: false, error: 'File data is empty' });
      return;
    }

    // Checked against the decoded size, not the base64 length, so the limit
    // means what the admin UI says it means.
    if (buffer.length > MAX_IMAGE_BYTES) {
      res.status(413).json({
        success: false,
        error: 'Image too large - please upload a photo under 3MB.'
      });
      return;
    }

    const detected = sniffImageType(buffer);
    if (!detected) {
      res.status(400).json({ success: false, error: 'That file is not a valid JPG, PNG, WebP or AVIF image.' });
      return;
    }

    // The sniffed type wins over the declared one when they disagree.
    const url = await uploadProductImage({ buffer, fileName, contentType: detected });
    res.status(200).json({ success: true, url });
  })
);

export default router;
