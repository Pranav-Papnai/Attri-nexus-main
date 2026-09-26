import '../src/config.js';
import { connectDB, disconnectDB, isConfigured } from '../src/db/connect.js';
import { Product } from '../src/db/models/Product.js';
import { PRODUCTS } from '../../frontend/src/constants/products.ts';

async function seedAllProducts() {
  if (!isConfigured) {
    throw new Error('MONGODB_URI not configured');
  }

  await connectDB();
  console.log('[seed] Connected to MongoDB');
  console.log(`[seed] Starting seed of all ${PRODUCTS.length} commercial products from website catalog...`);

  let count = 0;
  for (const item of PRODUCTS) {
    const doc = {
      _id: item.id,
      slug: item.slug,
      name: item.name,
      variety: item.variety || 'Commercial Grade',
      brandLine: item.brandLine || 'Attri Nexus',
      category: item.category || 'Rice',
      description: item.shortDescription || item.fullDescription || `${item.name} - Premium export quality from Attri Nexus.`,
      image: item.image || '/images/products/attri-traditional-basmati.jpg',
      features: item.features || ['100% Export Quality', 'Laboratory Tested'],
      specifications: item.specifications || {},
      packagingSizes: item.packSizes || ['25kg', '50kg', 'Bulk Container'],
      culinaryUses: (item.specifications && (item.specifications as any).bestFor) || [],
      isFeatured: Boolean(item.isFeatured),
      isActive: item.isActive !== false,
      themePrimary: (item.themeColor && item.themeColor.primary) || '#0D3B2E',
      themeAccent: (item.themeColor && item.themeColor.accent) || '#C5A059'
    };

    await Product.findByIdAndUpdate(
      item.id,
      { $set: doc },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );
    count++;
    console.log(`[seed] [${count}/${PRODUCTS.length}] (${item.category}) ${item.name}`);
  }

  // Remove obsolete test mock products that aren't in the official 30 products catalog
  const validIds = Array.from(new Set(PRODUCTS.map((p) => p.id)));
  const delRes = await Product.deleteMany({ _id: { $nin: validIds } });
  console.log(`[seed] Cleaned up ${delRes.deletedCount} legacy/test items not in official catalog.`);

  console.log(`[seed] Successfully synchronized all ${count} products into MongoDB database!`);
  await disconnectDB();
  process.exit(0);
}

seedAllProducts().catch((err) => {
  console.error('[seed] Error seeding products:', err);
  process.exit(1);
});
