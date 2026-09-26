import { Router } from 'express';
import crypto from 'node:crypto';
import { Product } from '../db/models/Product.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { asyncHandler, isValidationError, validationMessage } from '../middleware/errors.js';

const router = Router();

const MAX_PRODUCTS = 1000;
const CACHE_TTL_MS = 60 * 1000; // 60-second in-memory catalog cache

let cachedPayload = null;
let cachedETag = null;
let cacheTimestamp = 0;

export function invalidateProductsCache() {
  cachedPayload = null;
  cachedETag = null;
  cacheTimestamp = 0;
}

// Only these keys are ever written. Anything else in the body is dropped
// rather than forwarded, so a client cannot set _id, createdAt, or any field
// the schema does not declare.
const WRITABLE = [
  'slug',
  'name',
  'variety',
  'brandLine',
  'category',
  'description',
  'image',
  'features',
  'specifications',
  'packagingSizes',
  'culinaryUses',
  'isFeatured',
  'isActive',
  'themePrimary',
  'themeAccent'
];

function pickWritable(body) {
  const fields = {};
  for (const key of WRITABLE) {
    if (body[key] !== undefined) fields[key] = body[key];
  }
  return fields;
}

// The frontend keys off `id`; Mongo stores it as `_id`. Both are sent so
// neither side needs a mapping step.
const toApi = (doc) => ({ ...doc, id: doc._id });

// GET /api/products - public. The storefront hits this on every page load.
//
// Inactive products are returned too: the admin dashboard needs to see and
// edit them, and the public pages already filter on isActive themselves
// (ProductsContext). Filtering here would empty the dashboard.
// Optimized with in-memory caching, ETag support, and Cache-Control headers.
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const isFresh = cachedPayload && (Date.now() - cacheTimestamp < CACHE_TTL_MS);

    if (!isFresh) {
      const rows = await Product.find().sort({ createdAt: 1 }).limit(MAX_PRODUCTS).lean();
      const data = rows.map(toApi);
      cachedPayload = { success: true, data };
      const hash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
      cachedETag = `"${hash}"`;
      cacheTimestamp = Date.now();
    }

    res.setHeader('ETag', cachedETag);
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');

    const ifNoneMatch = req.headers['if-none-match'];
    const isEtagMatch = Boolean(
      (ifNoneMatch && (
        ifNoneMatch === cachedETag ||
        ifNoneMatch.replace(/^W\//, '') === cachedETag.replace(/^W\//, '')
      )) || req.fresh
    );

    if (isEtagMatch) {
      res.status(304).end();
      return;
    }

    res.status(200).json(cachedPayload);
  })
);

// POST /api/products - admin upsert. The id is supplied by the app, so create
// and update arrive as the same request.
router.post(
  '/',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { id } = req.body || {};
    if (!id || typeof id !== 'string') {
      res.status(400).json({ success: false, error: 'Missing product id' });
      return;
    }

    const fields = pickWritable(req.body);

    try {
      // 1. Try updating in a single atomic database operation.
      // Update validators only check the paths actually being written, so a
      // partial edit stays partial and cannot be rejected for a field it
      // never touched.
      const updated = await Product.findByIdAndUpdate(
        id,
        { $set: fields },
        { returnDocument: 'after', runValidators: true }
      ).lean();

      if (updated) {
        invalidateProductsCache();
        res.status(200).json({ success: true, data: toApi(updated) });
        return;
      }

      // 2. Creating: build a real document so every `required` in the schema is
      // enforced. An upsert would silently accept a half-empty product,
      // because update validators skip paths that are absent.
      const created = await new Product({ _id: id, ...fields }).save();
      invalidateProductsCache();
      res.status(200).json({ success: true, data: toApi(created.toObject()) });
    } catch (err) {
      // A concurrent create for the same id lost the race - it is an update.
      if (err?.code === 11000) {
        const updated = await Product.findByIdAndUpdate(
          id,
          { $set: fields },
          { returnDocument: 'after', runValidators: true }
        ).lean();
        if (updated) {
          invalidateProductsCache();
          res.status(200).json({ success: true, data: toApi(updated) });
          return;
        }
      }

      // Surfaced to the admin UI verbatim: these messages name the offending
      // field, which is what makes a failed save fixable from the dashboard.
      if (isValidationError(err)) {
        res.status(400).json({ success: false, error: validationMessage(err) });
        return;
      }

      throw err;
    }
  })
);

// DELETE /api/products/:id - admin only.
router.delete(
  '/:id',
  requireAdmin,
  asyncHandler(async (req, res) => {
    const deleted = await Product.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }
    invalidateProductsCache();
    res.status(200).json({ success: true });
  })
);

export default router;
