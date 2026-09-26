import '../src/config.js';
import { connectDB, disconnectDB, isConfigured } from '../src/db/connect.js';
import { Product } from '../src/db/models/Product.js';

const INITIAL_PRODUCTS = [
  {
    _id: "attri-pusa-1121-basmati",
    id: "attri-pusa-1121-basmati",
    slug: "pusa-1121-basmati-rice",
    name: "Pusa 1121 Basmati Rice",
    variety: "Pusa 1121 Extra Long Grain (Aged 2+ Years)",
    brandLine: "Attri Heritage Basmati",
    category: "Rice",
    description: "World-famous extra long grain Basmati with 8.35mm+ raw grain length, exceptional elongation, and sweet royal aroma. Available in Creamy Sella, Golden Sella, and Steamed finishes.",
    image: "/images/products/attri_1121_basmati.jpg",
    features: [
      "Extra long 8.35mm+ raw grain length",
      "Available in Creamy Sella, Golden Sella & Steamed",
      "Expands to 2.5x length without breaking",
      "Rich royal aroma & non-sticky fluffiness",
      "100% Sortex double-polished pure batch"
    ],
    specifications: {
      origin: "Punjab / Haryana, India",
      grainType: "Extra Long Slender Basmati Grain",
      aroma: "Rich Authentic Natural Basmati Aroma",
      texture: "Fluffy, Tender, Non-Sticky",
      elongation: "2.5x+ Post-Cooking Elongation"
    },
    packagingSizes: ["10kg Poly Pack", "25kg Commercial Bag", "50kg Master Bag", "Custom Export Containers"],
    culinaryUses: ["Royal Hyderabadi Dum Biryani", "Mughlai Pulao", "Gourmet Dining"],
    isFeatured: true,
    isActive: true,
    themePrimary: "#0D3B2E",
    themeAccent: "#C5A059"
  },
  {
    _id: "attri-sharbati-chakki-atta",
    id: "attri-sharbati-chakki-atta",
    slug: "sharbati-chakki-atta",
    name: "MP Sharbati Pure Chakki Atta",
    variety: "100% Whole Wheat Grain (Sehore MP)",
    brandLine: "Attri Nexus Gold Grain",
    category: "Wheat and Wheat Flour",
    description: "Traditional cold slow stone-ground whole wheat atta made from MP Sharbati grains. High fiber, zero maida, naturally sweet roti texture.",
    image: "/images/products/attri_sharbati_atta.jpg",
    features: [
      "100% MP Sharbati Whole Grain",
      "Cold Slow Stone Ground",
      "High Dietary Fiber & Protein",
      "Zero Preservatives or Additives"
    ],
    specifications: {
      origin: "Sehore / Vidisha, Madhya Pradesh",
      grainType: "Sharbati Heavy Golden Grain",
      texture: "Fine Stone Ground Whole Wheat",
      moisture: "Max 11.5%",
      protein: "Min 12.8%"
    },
    packagingSizes: ["10kg Poly Pack", "25kg Laminated Woven Bag", "50kg Commercial Sack"],
    culinaryUses: ["Soft Fluffy Rotis", "Stuffed Parathas", "Artisanal Flatbreads"],
    isFeatured: true,
    isActive: true,
    themePrimary: "#C5A059",
    themeAccent: "#B22234"
  },
  {
    _id: "attri-cattle-feed-pellets",
    id: "attri-cattle-feed-pellets",
    slug: "premium-cattle-feed-pellets",
    name: "High-Yield Dairy Cattle Feed Pellets",
    variety: "Balanced Nutrient Formula (20% Min Crude Protein)",
    brandLine: "Attri Nexus NutriFeed",
    category: "Animal Feed",
    description: "Scientifically formulated cattle feed enriched with bypass protein, chelated minerals, vitamins, and high-energy grains for superior milk yield and herd health.",
    image: "/images/products/attri_cattle_feed.jpg",
    features: [
      "20% Min Crude Protein & 3.5% Min Fat",
      "Enriched with Chelated Minerals & Vitamins",
      "Steam-pelleted for maximum digestibility",
      "Increases daily milk fat & SNF yield"
    ],
    specifications: {
      protein: "Min 20.0%",
      fat: "Min 3.5%",
      fiber: "Max 10.0%",
      moisture: "Max 10.0%"
    },
    packagingSizes: ["50kg HDPE Moisture-Proof Bags", "1 MT Jumbo Bulk Bags"],
    culinaryUses: ["Daily Dairy Lactating Cattle Nutrition"],
    isFeatured: true,
    isActive: true,
    themePrimary: "#1B365D",
    themeAccent: "#C5A059"
  },
  {
    _id: "attri-toor-dal-premium",
    id: "attri-toor-dal-premium",
    slug: "premium-unpolished-toor-dal",
    name: "Desi Unpolished Toor Dal (Arhar Dal)",
    variety: "Latur / Gulbarga Desi Bold Grain",
    brandLine: "Attri Nexus Pure Pulses",
    category: "Beans and Pulses",
    description: "100% naturally unpolished Toor Dal with zero water, oil, or chemical polishing. Retains natural dietary fiber, rich protein, and authentic village aroma.",
    image: "/images/products/attri_toor_dal.jpg",
    features: [
      "100% Unpolished & Chemical Free",
      "High Natural Protein (22g per 100g)",
      "Fast cooking with uniform texture",
      "Sortex laser-cleaned pure batch"
    ],
    specifications: {
      origin: "Latur / Gulbarga, India",
      purity: "99.8% Sortex Cleaned",
      moisture: "Max 11.0%",
      protein: "Min 22.0%"
    },
    packagingSizes: ["25kg Commercial Bag", "50kg Master Sack", "Custom Bulk Container"],
    culinaryUses: ["Traditional Dal Tadka", "South Indian Sambar", "Protein Soups"],
    isFeatured: true,
    isActive: true,
    themePrimary: "#B22234",
    themeAccent: "#C5A059"
  }
];

async function seedProducts() {
  if (!isConfigured) {
    throw new Error('MONGODB_URI not configured');
  }

  await connectDB();
  console.log('[seed] Connected to MongoDB');

  for (const item of INITIAL_PRODUCTS) {
    const { id, ...fields } = item;
    await Product.findByIdAndUpdate(
      id,
      { $set: fields },
      { upsert: true, new: true, runValidators: true }
    );
    console.log(`[seed] Product seeded: ${item.name}`);
  }

  console.log(`[seed] Successfully seeded ${INITIAL_PRODUCTS.length} products!`);
  await disconnectDB();
  process.exit(0);
}

seedProducts().catch((err) => {
  console.error('[seed] Error seeding products:', err);
  process.exit(1);
});
