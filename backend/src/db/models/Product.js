import mongoose from 'mongoose';

// Field names are camelCase on purpose: the frontend reads brandLine,
// packagingSizes, isFeatured, themePrimary and themeAccent straight off the
// API response (frontend/src/services/api/backend.ts), and the frontend is
// not being changed. No mapping layer exists, and none should be added.
//
// _id is a String, not an ObjectId, because the id is supplied by the app
// ("prod_1712345678901", or a slug) and POST /api/products is an upsert -
// create and update are the same request.
const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },

    // The admin UI guarantees all six of these are populated before it ever
    // calls the API, so requiring them here catches direct API misuse rather
    // than blocking a legitimate save from the dashboard.
    slug: { type: String, required: [true, 'slug is required'], trim: true },
    name: { type: String, required: [true, 'name is required'], trim: true },
    variety: { type: String, required: [true, 'variety is required'], trim: true },
    brandLine: { type: String, required: [true, 'brandLine is required'], trim: true },
    description: { type: String, required: [true, 'description is required'] },
    image: { type: String, required: [true, 'image is required'] },

    category: { type: String, default: 'Basmati', trim: true },
    features: { type: [String], default: [] },

    // Free-form on purpose: the shape is presentational (origin, grainType,
    // aroma, texture, cookingTime, bestFor[]) and the admin can extend it
    // without a migration.
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },

    packagingSizes: { type: [String], default: [] },
    culinaryUses: { type: [String], default: [] },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    themePrimary: { type: String, default: '#0D3B2E' },
    themeAccent: { type: String, default: '#C5A059' }
  },
  {
    timestamps: true,
    // Drops any key not declared above instead of persisting it, so a client
    // cannot smuggle arbitrary fields onto a product document.
    strict: true,
    versionKey: false
  }
);

// Backs the storefront's default listing order (find().sort({ createdAt: 1 }))
productSchema.index({ createdAt: 1 });
// Backs lookups by slug
productSchema.index({ slug: 1 });
// Backs active category lookups
productSchema.index({ category: 1, isActive: 1 });

// The frontend keys products off `id`, so every response carries both.
productSchema.set('toJSON', {
  virtuals: false,
  transform(_doc, ret) {
    ret.id = ret._id;
    return ret;
  }
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
