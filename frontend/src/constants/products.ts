import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: "attri-pusa-1121-basmati",
    name: "Pusa 1121 Basmati Rice",
    slug: "pusa-1121-basmati-rice",
    brandLine: "Attri Heritage Basmati",
    variety: "Pusa 1121 Extra Long Grain",
    category: "Rice",
    subCategory: "Basmati",
    processingTypes: ["Creamy Sella", "Golden Sella", "Steamed"],
    shortDescription: "World-famous extra long grain Basmati with 8.35mm+ raw grain length, exceptional elongation, and sweet aroma. Available in Creamy Sella, Golden Sella, and Steamed finishes.",
    fullDescription: "Pusa 1121 Basmati Rice holds the global benchmark for grain length and post-cooking elongation. Meticulously aged and sortex-cleaned, our 1121 Basmati elongates up to 2.5 times its raw length while maintaining exceptional grain integrity and non-sticky fluffiness. Available in Creamy (White Sella), Golden Sella, and Steam variants for premium dining and international bulk exports.",
    image: "/images/products/attri-traditional-basmati.jpg",
    themeColor: {
      primary: "#0D3B2E",
      dark: "#061F18",
      light: "#E7F3EE",
      accent: "#D4AF37",
      border: "#1B5E4A",
      badgeBg: "bg-emerald-900/90 text-emerald-100 border-emerald-700",
      badgeText: "text-emerald-700"
    },
    exportName: "1121 Extra Long Grain Basmati Rice",
    tradeAliases: [
      "1121 Sella Basmati",
      "1121 Golden Sella",
      "1121 Steam Rice",
      "Extra Long Grain Indian Basmati"
    ],
    demandMarkets: [
      "Middle East / GCC (Saudi Arabia, UAE, Iran, Iraq, Kuwait)",
      "United Kingdom & European Union",
      "North America (USA & Canada HoReCa)",
      "Domestic Indian Fine Dining & Banquets"
    ],
    packSizes: ["10kg Poly/Woven Bag", "25kg Commercial Bag", "50kg Master Bag", "Custom Export Containers"],
    features: [
      "Extra long 8.35mm+ raw grain length",
      "Available in Creamy Sella, Golden Sella & Steamed",
      "Expands to 2.5x length without breaking",
      "Rich royal aroma & non-sticky fluffiness",
      "Naturally aged for maximum volume & aroma",
      "100% Sortex double-polished pure batch"
    ],
    specifications: {
      origin: "Punjab / Haryana / MP, India",
      grainType: "Extra Long Slender Basmati Grain",
      aroma: "Rich Authentic Natural Basmati Aroma",
      texture: "Fluffy, Tender, Non-Sticky",
      elongation: "2.5x+ Post-Cooking Elongation (Up to 20mm+ cooked)",
      cookingTime: "15–18 Minutes",
      bestFor: ["Royal Biryani & Pulao", "Fine Dining Restaurants", "Catering & Banquets", "Global Export Markets"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Select Processing Finish",
        desc: "Choose between Creamy Sella, Golden Sella, or Steamed based on your recipe preference."
      },
      {
        step: 2,
        title: "Soak for Max Elongation",
        desc: "Soak Steamed grains for 30 mins (Sella/Golden for 45-60 mins) in cool water before cooking."
      },
      {
        step: 3,
        title: "Boil & Simmer",
        desc: "Cook with 1.75 to 2 cups of fresh water per cup of rice until tender and separate."
      },
      {
        step: 4,
        title: "Rest & Fluff",
        desc: "Rest covered for 5 minutes and fluff gently with a fork to reveal magnificent grain length."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-pusa-1509-basmati",
    name: "Pusa 1509 Basmati Rice",
    slug: "pusa-1509-basmati-rice",
    brandLine: "Attri Heritage Basmati",
    variety: "Pusa 1509 Quick-Cook Basmati",
    category: "Rice",
    subCategory: "Basmati",
    processingTypes: ["Creamy Sella", "Golden Sella", "Steamed"],
    shortDescription: "Slender, quick-cooking premium Basmati offering delicate aroma, tender texture, and high volume expansion in Creamy, Golden, and Steamed varieties.",
    fullDescription: "Pusa 1509 Basmati is an early-maturing, highly economical long-grain Basmati variety. It features tender, slender grains with rapid cooking times and impressive post-cooking elongation. Available in Creamy Sella, Golden Sella, and Steamed finishes, making it an exceptional choice for modern kitchens, commercial catering, and retail packaging.",
    image: "/images/products/attri-traditional-basmati.jpg",
    themeColor: {
      primary: "#1A4D2E",
      dark: "#0F2E1B",
      light: "#EDF5F0",
      accent: "#C5A059",
      border: "#286D44",
      badgeBg: "bg-emerald-950/90 text-emerald-100 border-emerald-800",
      badgeText: "text-emerald-800"
    },
    exportName: "1509 Long Grain Basmati Rice",
    tradeAliases: [
      "1509 Sella Basmati",
      "1509 Golden Sella",
      "1509 Steamed Rice",
      "Quick-Cook Indian Basmati"
    ],
    demandMarkets: [
      "Middle East / GCC Markets",
      "Modern Trade Retail Packaging",
      "Commercial Catering & HoReCa",
      "Domestic Restaurant Chains"
    ],
    packSizes: ["10kg Bag", "25kg Bag", "50kg Bulk Dispatch"],
    features: [
      "Slender long grain with 8.40mm+ average length",
      "Available in Creamy Sella, Golden Sella & Steamed",
      "Cooks quickly while retaining individual grain separation",
      "Mild sweet fragrance and pleasant mouthfeel",
      "Cost-effective alternative to traditional Basmati",
      "Hygienically sorted and moisture-controlled"
    ],
    specifications: {
      origin: "India",
      grainType: "Long Slender Milled Basmati",
      aroma: "Delicate Sweet Basmati Aroma",
      texture: "Soft, Tender, Fluffy",
      elongation: "2x+ Elongation on cooking",
      cookingTime: "12–15 Minutes",
      bestFor: ["Daily Premium Meals", "Jeera Rice & Fried Rice", "Commercial Kitchens", "Export Grade Rice"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Wash Gently",
        desc: "Rinse grains in cold water twice until water is clear."
      },
      {
        step: 2,
        title: "Soak",
        desc: "Soak in freshwater for 20-30 minutes for optimum softness."
      },
      {
        step: 3,
        title: "Cook",
        desc: "Simmer covered on low heat with 1.75 cups water per cup of rice for 12-14 minutes."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-pusa-1718-1885-basmati",
    name: "Pusa 1718 & 1885 Basmati Rice",
    slug: "pusa-1718-1885-basmati-rice",
    brandLine: "Attri Heritage Basmati",
    variety: "Pusa 1718 & 1885 Advanced Basmati",
    category: "Rice",
    subCategory: "Basmati",
    processingTypes: ["Creamy Sella", "Golden Sella", "Steamed"],
    shortDescription: "Advanced long-grain Basmati engineered for superior resilience, extraordinary elongation, and sweet aroma. Available in Creamy Sella, Golden Sella, and Steamed finishes.",
    fullDescription: "Pusa 1718 and Pusa 1885 represent the elite evolution of Indian Basmati, combining enhanced grain tensile strength and natural purity. Bred to resist cooking breakage during heavy parboiling and commercial dum preparation, this variety yields long, pristine grains that stay separate and fluffy. Offered in Creamy (White Sella), Golden Sella, and Steamed finishes for premium hotels, caterers, and export markets.",
    image: "/images/products/attri-traditional-basmati.jpg",
    themeColor: {
      primary: "#283618",
      dark: "#141C0C",
      light: "#F0F4EC",
      accent: "#D4AF37",
      border: "#435B28",
      badgeBg: "bg-lime-950/90 text-lime-100 border-lime-800",
      badgeText: "text-lime-800"
    },
    exportName: "Pusa Basmati Rice 1718 / 1885",
    tradeAliases: [
      "1718 Steamed Basmati",
      "1718 Sella Rice",
      "Pusa 1885 Long Grain",
      "Aromatic Elite Basmati"
    ],
    demandMarkets: [
      "Iran & Middle East Trade",
      "European Union (Low pesticide MRL compliant)",
      "United Kingdom & North America",
      "Premium Export Retail Packs"
    ],
    packSizes: ["10kg Bag", "25kg Heavy Duty Bag", "50kg Bulk Jute/PP"],
    features: [
      "Extra long kernel with heavy grain weight & zero curling",
      "Available in Creamy Sella, Golden Sella & Steamed finishes",
      "Superior cooking resilience for commercial chefs & biryanis",
      "Deep natural fragrance and pearlescent shine",
      "High yield per kilogram when cooked",
      "Rigorously sorted for zero chalky or discolored grains"
    ],
    specifications: {
      origin: "Punjab / Haryana / MP, India",
      grainType: "Extra Long Slender Kernel (8.35mm+)",
      aroma: "Prominent Natural Basmati Fragrance",
      texture: "Firm, Fluffy, Individual Grains",
      elongation: "2.3x+ Post-Cook Grain Elongation",
      cookingTime: "15–18 Minutes",
      bestFor: ["Dum Biryani & Pulao", "Hotel & Banquet Buffets", "Luxury Dining", "Middle East & European Exports"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Cleanse & Soak",
        desc: "Rinse and soak for 30 minutes in ambient temperature water."
      },
      {
        step: 2,
        title: "Boil & Steam",
        desc: "Cook with 1.8 cups water per cup of rice until moisture is absorbed."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-ir64-rice",
    name: "IR 64 Non-Basmati Rice",
    slug: "ir-64-rice",
    brandLine: "Attri Commercial & Export Grain",
    variety: "IR 64 Long Grain (5%, 15%, 25% Broken)",
    category: "Rice",
    subCategory: "Non-Basmati",
    processingTypes: ["5% Broken", "15% Broken", "25% Broken"],
    shortDescription: "Globally popular Indian long-grain Non-Basmati rice available in 5%, 15%, and 25% broken grades for commercial dining, canteens, and bulk export.",
    fullDescription: "IR 64 Non-Basmati Rice is the global benchmark for international rice export and commercial food service. Known for its high cooking yield, firm non-sticky texture, and consistent grain length. Available in precision-graded 5% broken (premium sortex), 15% broken (commercial grade), and 25% broken (budget/institutional grade) to match any catering or export requirement.",
    image: "/images/products/attri-classic-ir64.jpg",
    themeColor: {
      primary: "#0F2C4C",
      dark: "#081B30",
      light: "#EEF4FA",
      accent: "#C5A059",
      border: "#1F4875",
      badgeBg: "bg-blue-950/90 text-blue-100 border-blue-800",
      badgeText: "text-blue-800"
    },
    exportName: "IR64 Long Grain Rice / IR64 Parboiled Rice",
    tradeAliases: [
      "IR-64 Raw White 5% Broken",
      "IR-64 Parboiled (Sella) 25% Broken",
      "Long Grain Non-Basmati White"
    ],
    demandMarkets: [
      "West & East Africa (Benin, Togo, Senegal, Ivory Coast, Nigeria)",
      "Southeast Asia & South Africa",
      "Mass Institutional Catering & Government Supplies"
    ],
    packSizes: ["25kg Durable Bag", "50kg Wholesale Bulk Bag", "Custom Container Loads"],
    features: [
      "Available in 5% Broken, 15% Broken & 25% Broken grades",
      "High volume expansion and firm texture after cooking",
      "Holds shape perfectly in hot buffets & commercial canteens",
      "Double Sortex cleaned and moisture-controlled",
      "Top choice for domestic bulk catering and African/Middle East exports"
    ],
    specifications: {
      origin: "Andhra Pradesh / Maharashtra / Chhattisgarh, India",
      grainType: "Long / Medium Milled Non-Basmati Kernel",
      aroma: "Clean Neutral Aroma",
      texture: "Firm, Uniform, Non-Sticky",
      cookingTime: "15–18 Minutes",
      bestFor: ["Commercial Catering & Buffets", "Hotel & Restaurant Kitchens", "Fried Rice & Canteens", "International Bulk Export"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Wash",
        desc: "Rinse thoroughly to remove surface starch."
      },
      {
        step: 2,
        title: "Cook",
        desc: "Use 2 cups of water per cup of IR 64 for optimal firmness."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-swarna-rice",
    name: "Swarna Non-Basmati Rice",
    slug: "swarna-rice",
    brandLine: "Attri Commercial Staples",
    variety: "Swarna Medium Grain (5%, 15%, 25% Broken)",
    category: "Rice",
    subCategory: "Non-Basmati",
    processingTypes: ["5% Broken", "15% Broken", "25% Broken"],
    shortDescription: "Economical short-to-medium grain Non-Basmati rice with high nutritional starch, available in 5%, 15%, and 25% broken grades.",
    fullDescription: "Swarna Rice (Mansuri / MTU 7029) is a widely consumed Indian Non-Basmati rice variety characterized by its hearty, slightly thick medium grains and rich natural starch. It provides superb satiety and value for money, offered in 5% Broken, 15% Broken, and 25% Broken specifications for commercial mills, institutional food supply, and bulk export.",
    image: "/images/products/attri-classic-ir64.jpg",
    themeColor: {
      primary: "#2C3E50",
      dark: "#1A252F",
      light: "#EDF2F7",
      accent: "#C5A059",
      border: "#34495E",
      badgeBg: "bg-slate-900/90 text-slate-100 border-slate-700",
      badgeText: "text-slate-700"
    },
    exportName: "Swarna Rice / Swarna Non-Basmati Rice",
    tradeAliases: [
      "Swarna Mansuri",
      "Swarna Parboiled Rice",
      "Swarna Raw White"
    ],
    demandMarkets: [
      "Bangladesh & Nepal Bilateral Trade",
      "Eastern India (West Bengal, Odisha, Bihar)",
      "African Export Cargo",
      "Daily Household & Canteen Supplies"
    ],
    packSizes: ["25kg Poly Bags", "50kg Bulk Bags"],
    features: [
      "Available in 5% Broken, 15% Broken & 25% Broken grades",
      "High starch & natural carbohydrate energy content",
      "Wholesome taste and high volume expansion",
      "Widely sourced from West Bengal, Odisha, and Eastern India",
      "Ideal for bulk institutional supply and daily meals"
    ],
    specifications: {
      origin: "West Bengal / Odisha / Bihar, India",
      grainType: "Medium Short Milled Rice",
      aroma: "Natural Grain Fragrance",
      texture: "Soft, Wholesome, High Starch",
      cookingTime: "14–16 Minutes",
      bestFor: ["Institutional Kitchens", "Daily Staple Meals", "Food Processing & Puffed Rice", "Bulk Export"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Wash",
        desc: "Rinse gently in cold water."
      },
      {
        step: 2,
        title: "Cook",
        desc: "Cook with 2.2 cups water per cup of Swarna rice."
      }
    ],
    isPopular: false,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-sona-masoori",
    name: "Sona Masoori Rice",
    slug: "attri-sona-masoori",
    brandLine: "Attri Everyday Staples",
    variety: "Sona Masoori (Steam, Raw & Boiled)",
    category: "Rice",
    subCategory: "Non-Basmati",
    processingTypes: ["Steam", "Raw", "Boiled"],
    shortDescription: "Lightweight, aromatic medium-grain rice available in Steam, Raw, and Boiled variants for easy digestion and daily meals.",
    fullDescription: "Sona Masoori is an iconic South Indian medium-grain rice grown along the fertile river basins of Andhra Pradesh and Karnataka. Renowned for being low in starch, light on the stomach, and delightfully soft when cooked. Available in Steam (fluffy and firm), Raw (pure un-steamed white), and Boiled (single-boiled/parboiled) finishes.",
    image: "/images/products/attri-sona-masoori.jpg",
    themeColor: {
      primary: "#5C131D",
      dark: "#3B0A11",
      light: "#FBF0F2",
      accent: "#D4AF37",
      border: "#872433",
      badgeBg: "bg-rose-950/90 text-rose-100 border-rose-800",
      badgeText: "text-rose-800"
    },
    exportName: "Sona Masoori Rice",
    tradeAliases: [
      "Aged Sona Masoori",
      "Sona Masoori Steam Rice",
      "Jeerakasala / BPT 5204 Grade"
    ],
    demandMarkets: [
      "USA, Canada & UK (Indian Diaspora)",
      "UAE & GCC Supermarket Chains",
      "South India (Andhra Pradesh, Telangana, Karnataka)",
      "Australia & Singapore"
    ],
    packSizes: ["10kg Poly Pack", "25kg Net Weight Bag", "50kg Commercial Pack"],
    features: [
      "Available in Steam, Raw, and Boiled processing finishes",
      "Delicate, lightweight medium grain with low starch",
      "Highly digestible — ideal for daily home cooking",
      "Cooks soft, fluffy, and tender without becoming sticky",
      "100% Sortex clean and pesticide tested"
    ],
    specifications: {
      origin: "Andhra Pradesh / Karnataka / Telangana, India",
      grainType: "Medium Slender White Grain",
      aroma: "Subtle Pleasant Fragrance",
      texture: "Soft, Tender, Light",
      cookingTime: "12–15 Minutes",
      bestFor: ["Daily Family Meals", "Sambar & Rasam Rice", "Jeera Rice", "Curd Rice"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Wash",
        desc: "Wash the rice gently twice in cool water."
      },
      {
        step: 2,
        title: "Cook",
        desc: "Cook with 2 to 2.25 cups water per cup of rice until soft and tender."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-ponni-rice",
    name: "Ponni Rice",
    slug: "attri-ponni-rice",
    brandLine: "Attri South Heritage",
    variety: "Premium Ponni Rice (<5% Broken)",
    category: "Rice",
    subCategory: "Non-Basmati",
    processingTypes: ["Steamed", "Boiled"],
    shortDescription: "Premium aged South Indian rice always under 5% broken, available in Steamed and Boiled finishes for traditional cuisine.",
    fullDescription: "Ponni Rice is the signature variety of Tamil Nadu and the Kaveri delta, famous for its slender, resilient grains and rich culinary heritage. Our Ponni Rice strictly maintains below 5% broken grain content, ensuring unmatched grain uniformity and aesthetic perfection. Available in Steamed (white, separate grains) and Boiled (traditional parboiled, nutrient-rich) types.",
    image: "/images/products/attri-sona-masoori.jpg",
    themeColor: {
      primary: "#1E4D2B",
      dark: "#0F2817",
      light: "#EFF7F1",
      accent: "#C5A059",
      border: "#2C7541",
      badgeBg: "bg-emerald-950/90 text-emerald-100 border-emerald-800",
      badgeText: "text-emerald-800"
    },
    exportName: "Ponni Boiled Rice / Ponni Rice",
    tradeAliases: [
      "Thanjavur Ponni",
      "Ponni Steam Rice",
      "Single Boiled Ponni",
      "Low GI South Indian Rice"
    ],
    demandMarkets: [
      "Malaysia, Singapore & Sri Lanka",
      "Gulf Countries (Tamil & South Indian expat community)",
      "Tamil Nadu & Kerala Domestic Trade"
    ],
    packSizes: ["10kg Bag", "25kg Bag", "50kg Master Pack"],
    features: [
      "Strictly below 5% broken grains guaranteed (<5% Broken)",
      "Available in Steamed and Boiled processing types",
      "High fiber and superior nutritional value",
      "Aged grains for fluffy separation and non-sticky cooking",
      "Authentic choice for South Indian meals, Pongal, and thalis"
    ],
    specifications: {
      origin: "Tamil Nadu / Kaveri River Basin, India",
      grainType: "Medium Slender Premium Grain (<5% Broken)",
      aroma: "Rich Traditional Grain Aroma",
      texture: "Separate, Soft, Fluffy",
      cookingTime: "15–18 Minutes",
      bestFor: ["South Indian Full Meals", "Pongal & Variety Rice", "Daily Healthy Cooking", "Export Grade Ponni"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Soak",
        desc: "Soak for 20-30 minutes for optimum softness."
      },
      {
        step: 2,
        title: "Cook",
        desc: "Cook with 2.5 cups water per cup of Ponni rice on medium heat."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-kolam-rice",
    name: "Kolam Rice",
    slug: "attri-kolam-rice",
    brandLine: "Attri Western Heritage",
    variety: "Kolam Fine Slender Grain (Thinner than Sona Masoori)",
    category: "Rice",
    subCategory: "Non-Basmati",
    processingTypes: ["Steam", "Raw", "Boiled"],
    shortDescription: "Fine, tiny slender grains noticeably thinner than Sona Masoori, available in Steam, Raw, and Boiled finishes.",
    fullDescription: "Kolam Rice (Wada Kolam / Gujarat 17) is an elite medium/short grain Non-Basmati rice grown across Maharashtra and Gujarat. It is distinctly thinner and more delicate than Sona Masoori, producing a smooth, melt-in-the-mouth texture and pleasant floral aroma. Available in Steam, Raw, and Boiled variants for gourmet everyday dining, khichdi, and festive sweets.",
    image: "/images/products/attri-sona-masoori.jpg",
    themeColor: {
      primary: "#5A3825",
      dark: "#331E13",
      light: "#F7F2EE",
      accent: "#D4AF37",
      border: "#825237",
      badgeBg: "bg-amber-950/90 text-amber-100 border-amber-800",
      badgeText: "text-amber-800"
    },
    exportName: "Kolam Rice / Indian Kolam Rice",
    tradeAliases: [
      "Lachkari Kolam",
      "Gujarat 17 Kolam",
      "Wada Kolam Grade",
      "Aged Soft White Kolam"
    ],
    demandMarkets: [
      "Maharashtra (Mumbai, Pune) & Gujarat",
      "Western India Daily Household Dining",
      "Gulf & UK Indian Specialty Grocery Outlets"
    ],
    packSizes: ["10kg Bag", "25kg Bag", "50kg Jute Bag"],
    features: [
      "Thinner, more slender delicate grain than Sona Masoori",
      "Available in Steam, Raw, and Boiled finishes",
      "Silky smooth texture with subtle natural fragrance",
      "Easily digestible with fast cooking time",
      "Popular staple in Western India and fine dining"
    ],
    specifications: {
      origin: "Maharashtra / Gujarat, India",
      grainType: "Fine Slender Short Grain (Ultra-Thin)",
      aroma: "Delicate Floral Aroma",
      texture: "Silky, Soft, Non-Sticky",
      cookingTime: "12–14 Minutes",
      bestFor: ["Daily Premium Home Meals", "Khichdi & Rice Porridge", "Curd Rice", "Gourmet Rice Bowls"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Wash",
        desc: "Wash gently once in cool water."
      },
      {
        step: 2,
        title: "Cook",
        desc: "Cook with 1.75 cups water per cup of Kolam rice for fluffy individual grains."
      }
    ],
    isPopular: false,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-jaya-boiled-rice",
    name: "Jaya Boiled Rice",
    slug: "attri-jaya-boiled-rice",
    brandLine: "Attri Coastal Heritage",
    variety: "Jaya Bold Grain (Boiled)",
    category: "Rice",
    subCategory: "Non-Basmati",
    processingTypes: ["Boiled"],
    shortDescription: "Classic nutrient-rich bold grain rice, traditionally single-boiled/parboiled for hearty Kerala and coastal meals.",
    fullDescription: "Jaya Boiled Rice (Matta/Jaya lineage) is widely celebrated across Kerala, Karnataka, and coastal India for its bold, thick grain structure and high carbohydrate endurance. Processed exclusively as Boiled (parboiled) to seal in vital B-vitamins and minerals inside the endosperm, it cooks into plump, filling grains ideal for traditional curries, fish meals, and daily energy.",
    image: "/images/products/attri-classic-ir64.jpg",
    themeColor: {
      primary: "#6B3E26",
      dark: "#3D2214",
      light: "#FAF2EE",
      accent: "#C5A059",
      border: "#9E5C38",
      badgeBg: "bg-orange-950/90 text-orange-100 border-orange-800",
      badgeText: "text-orange-800"
    },
    exportName: "Jaya Parboiled Rice / Jaya Boiled Rice",
    tradeAliases: [
      "Jaya Red / White Parboiled",
      "Kerala Matta Alternative",
      "Coarse Long Grain Boiled"
    ],
    demandMarkets: [
      "Kerala State Commercial Wholesale",
      "UAE, Saudi Arabia & Oman (Kerala Diaspora)",
      "Sri Lanka & Maldives Sea Freight"
    ],
    packSizes: ["25kg Net Weight Bag", "50kg Wholesale Pack"],
    features: [
      "Exclusively processed as traditional Boiled (Parboiled)",
      "Bold, thick grain structure with rich satiety",
      "High vitamin B retention and slow-digesting complex carbs",
      "Firm wholesome bite that absorbs gravies wonderfully",
      "Number 1 choice for Kerala Sadya, coastal dining, and heavy labor nutrition"
    ],
    specifications: {
      origin: "Kerala / Andhra Pradesh / Karnataka, India",
      grainType: "Bold Thick Parboiled Grain",
      aroma: "Rich Traditional Parboiled Aroma",
      texture: "Plump, Chewy, Hearty",
      cookingTime: "20–25 Minutes",
      bestFor: ["Kerala Meals & Fish Curry", "Traditional Coastal Sadya", "Wholesome Daily Energy Meals", "South Indian Catering"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Wash",
        desc: "Rinse well in cold water."
      },
      {
        step: 2,
        title: "Cook",
        desc: "Boil with 3 cups of water per cup of Jaya Boiled rice until grains are plump and soft."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-soybean-meal",
    name: "Attri High-Protein Soybean Meal (Soy DOC)",
    slug: "soybean-meal-doc",
    brandLine: "Attri AgroFeed Solutions",
    variety: "Solvent Extracted Coarse Meal / De-Hulled Flakes (46%–48%+ CP)",
    category: "Animal Feed",
    subCategory: "Soybean Meal",
    processingTypes: ["Standard Grade (46% CP)", "Hi-Pro Export Grade (48%+ CP)"],
    shortDescription: "Premium solvent-extracted de-hulled soybean meal delivering guaranteed 46%–48%+ crude protein, optimal amino acid profile, and <10% moisture for poultry, dairy, and aqua diets.",
    fullDescription: "Attri High-Protein Soybean Meal (Soy DOC) is a premium defatted protein concentrate processed from prime non-GMO Indian soybeans. Commercial supplies are available in Standard Grade (46% CP) and Hi-Pro Export Grade (48%+ CP). Available in uniform Coarse Meal, De-Hulled Flakes, and Steam Conditioned Pellets upon request.",
    image: "/images/products/attri-soybean-meal.jpg",
    themeColor: {
      primary: "#1A4D2E",
      dark: "#0E2B1A",
      light: "#EEF5F0",
      accent: "#C5A059",
      border: "#2A6E43",
      badgeBg: "bg-emerald-950/90 text-emerald-100 border-emerald-800",
      badgeText: "text-emerald-800"
    },
    exportName: "Hi-Pro Soybean Meal / Soybean DOC",
    tradeAliases: [
      "De-hulled Soybean Meal 48% CP",
      "Soybean Extraction Meal",
      "Non-GMO Indian Soy DOC",
      "Solvent Extracted Soybean Meal"
    ],
    demandMarkets: [
      "Southeast Asia (Vietnam, Indonesia, Thailand)",
      "Middle East & GCC (UAE, Saudi Arabia)",
      "Bangladesh & Nepal Commercial Feed Mills",
      "Domestic Indian Poultry & High-Yield Dairy Belts"
    ],
    packSizes: ["50kg Moisture-Proof HDPE Bags", "1 Metric Ton Jumbo Bags", "Bulk Loose Dispatches / Container Cargo"],
    features: [
      "High Protein Content: 46% - 48%+ Crude Protein minimum guarantee",
      "Low Moisture: Strictly controlled <10% - 11% for long-term storage & zero fungal risk",
      "Low Fiber: Maximum 5.5% - 6.0% crude fiber for maximum nutrient absorption",
      "Healthy Fat Content: 1.0% - 1.5% natural residual vegetable oil"
    ],
    specifications: {
      origin: "Madhya Pradesh / Maharashtra, India",
      grainType: "Granular Meal / Fine Flakes",
      aroma: "Fresh Roasted Nutty Soya Scent",
      texture: "Uniform Free-Flowing Coarse Meal",
      cookingTime: "Ready for compound feed formulation",
      bestFor: ["Commercial Broiler & Layer Poultry Diets", "High-Yield Dairy Cattle & Buffalo Rations", "Aquaculture (Fish & Shrimp) Feeds", "Swine & Piglet Formulations"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Dietary Inclusion",
        desc: "Incorporate at 15% to 35% inclusion rates in poultry, dairy, or aquaculture compound feeds per nutritionist targets."
      },
      {
        step: 2,
        title: "Storage",
        desc: "Store in a well-ventilated dry warehouse away from direct moisture to protect low moisture and protein bioavailability."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-rapeseed-meal",
    name: "Attri Pure Rapeseed Meal (Mustard DOC)",
    slug: "rapeseed-meal-doc",
    brandLine: "Attri AgroFeed Solutions",
    variety: "Solvent Extracted Rapeseed / Mustard Meal",
    category: "Animal Feed",
    subCategory: "Rapeseed Meal",
    processingTypes: ["Standard Feed Grade (36% CP)", "High-Protein Grade (38%+ CP)"],
    shortDescription: "Nutrient-dense Rapeseed Meal delivering 36–38%+ Crude Protein, rich sulphur amino acids, low moisture, and controlled fiber for dairy and aqua diets.",
    fullDescription: "Attri Pure Rapeseed Meal (Mustard DOC) is a high-value protein supplement produced from high-grade mustard and rapeseed oilseeds. Through advanced thermal conditioning and gentle desolventizing-toasting, it eliminates pungent glucosinolates while retaining high biological value proteins. Especially rich in sulphur-containing amino acids (Methionine and Cystine), it offers dairy farmers an economical feed supplement that boosts butterfat content and daily milk production while serving as an exceptional compound in aquaculture feeds.",
    image: "/images/products/attri-rapeseed-meal.jpg",
    themeColor: {
      primary: "#704214",
      dark: "#3D230B",
      light: "#FAF2EB",
      accent: "#C5A059",
      border: "#8B531B",
      badgeBg: "bg-amber-950/90 text-amber-100 border-amber-800",
      badgeText: "text-amber-800"
    },
    exportName: "Rapeseed Meal / Canola Meal",
    tradeAliases: [
      "Mustard Extraction Meal",
      "Solvent Extracted Rapeseed DOC",
      "Toasted Canola Feed Meal",
      "High-Bypass Ruminant Meal"
    ],
    demandMarkets: [
      "South Korea, Taiwan & Vietnam (Aqua & Ruminant)",
      "Middle East Cattle & Dairy Formulators",
      "Bangladesh & Regional Feed Mills",
      "Gujarat, Rajasthan & Punjab Dairy Cooperatives"
    ],
    packSizes: ["50kg Standard Moisture-Proof PP Bags", "1 Metric Ton Jumbo Bags", "Containerized Bulk Cargo"],
    features: [
      "High Protein Content: 36% - 38%+ crude protein with excellent rumen bypass fraction",
      "Low Moisture: Maintained strictly under 9.5% - 10% to prevent fungal spoilage",
      "Low Fiber: Balanced crude fiber (9% - 11% max) ensuring gut health and digestibility",
      "Healthy Fat Content: 1.5% - 2.5% natural residual vegetable lipids",
      "Rich in Amino Acids: Exceptional source of Methionine, Cystine & Organic Phosphorus",
      "Quality Heat Processing: Specialized steam-toasting destroys glucosinolates and enhances palatability"
    ],
    specifications: {
      origin: "Rajasthan / Haryana / MP, India",
      grainType: "Coarse Meal / Granular Pellets",
      aroma: "Mild Toasted Nutty Scent",
      texture: "Uniform Granular Texture",
      cookingTime: "Ready for feed compounding",
      bestFor: ["Dairy Cattle & Buffalo Compound Feeds", "Carp & Aquaculture Feed Manufacturing", "Commercial Poultry Formulations (controlled inclusion)", "Sheep & Goat Feeds"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Feed Blending",
        desc: "Combine with grains, soybean meal, and mineral premixes at 10% to 20% inclusion in ruminant diets for optimal milk SNF."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-corn-ddgs",
    name: "Attri Golden Corn DDGS (Maize Distillers Grains)",
    slug: "corn-ddgs-distillers-grains",
    brandLine: "Attri AgroFeed Solutions",
    variety: "100% Yellow Corn (Maize) Based DDGS",
    category: "Animal Feed",
    subCategory: "DDGS (Distillers Grains)",
    processingTypes: ["Standard Distillers (27% CP)", "High-Energy Grade (28%+ CP / 10% Oil)"],
    shortDescription: "High-energy, high-protein Corn DDGS (27–28%+ CP) with 8–10% healthy fat, low moisture, low fiber, rich amino acids, and gentle flash heat processing.",
    fullDescription: "Attri Golden Corn DDGS (Distillers Dried Grains with Solubles) is produced from the modern bio-fermentation of select whole yellow maize grains. Retaining the concentrated protein, healthy corn oil, and water-soluble nutrients of the original grain, it provides an exceptional combination of 27–28% crude protein and 8–10% healthy fat (corn oil). The gentle, controlled drying and heat processing preserves vital amino acids and gives it a vibrant golden hue with a pleasant sweet-fermented aroma, highly relished by dairy herds and poultry flocks.",
    image: "/images/products/attri-corn-ddgs.jpg",
    themeColor: {
      primary: "#B8860B",
      dark: "#5A4205",
      light: "#FEF9E7",
      accent: "#D4AF37",
      border: "#C5A059",
      badgeBg: "bg-amber-900/90 text-amber-100 border-amber-700",
      badgeText: "text-amber-700"
    },
    exportName: "Maize DDGS / Corn DDGS",
    tradeAliases: [
      "Corn Distillers Dried Grains with Solubles",
      "Golden Yellow Corn DDGS 27%+",
      "High-Energy Distillers Grain",
      "Bio-Fermented Maize Feed"
    ],
    demandMarkets: [
      "Vietnam & Southeast Asia Broiler Sector",
      "Middle East Dairy Herds & Camel Nutrition",
      "Commercial Compound Feed Plants Across India",
      "Aquafeed Manufacturers (Pangasius & Tilapia)"
    ],
    packSizes: ["50kg Heavy-Duty HDPE/PP Bags", "1 Metric Ton Bulk Jumbo Bags", "Bulk Tankers / Box Containers"],
    features: [
      "High Protein Content: 27% - 28%+ Crude Protein with high rumen undegradable protein (RUP)",
      "Healthy Fat Content: 8% - 10% concentrated corn oil providing high metabolizable energy",
      "Low Moisture: Controlled strictly below 9% - 10% for prolonged storage without caking",
      "Low Fiber: 7% - 8% highly digestible neutral detergent fiber",
      "Rich in Amino Acids: Readily bioavailable amino acid profile and organic phosphorus",
      "Quality Heat Processing: Low-temperature flash drying ensures rich golden color & zero scorching"
    ],
    specifications: {
      origin: "India",
      grainType: "Corn-Based Distillers Grains (DDGS)",
      aroma: "Sweet Fresh Fermented Bakery Aroma",
      texture: "Golden Yellow Granular Meal",
      cookingTime: "Ready for feed ration mixing",
      bestFor: ["High-Producing Dairy Cattle & Milking Rations", "Broiler & Layer Poultry Feeds", "Feed Mill Concentrate Formulations", "Swine Growing-Finishing Rations"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Dietary Inclusion",
        desc: "Substitute for cereal grains and supplemental protein at 10% to 25% inclusion rates in dairy and poultry feed rations."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-rice-ddgs",
    name: "Attri High-Protein Rice DDGS (Rice Distillers Grains)",
    slug: "rice-ddgs-distillers-grains",
    brandLine: "Attri AgroFeed Solutions",
    variety: "100% Broken Rice Grain Based DDGS",
    category: "Animal Feed",
    subCategory: "DDGS (Distillers Grains)",
    processingTypes: ["Commercial Grade (45% CP)", "Super Concentrate (50% CP)"],
    shortDescription: "Concentrated 45–50%+ Crude Protein Rice DDGS with low moisture, low fiber, healthy fat, and rich amino acids for poultry, cattle, and aquaculture.",
    fullDescription: "Attri High-Protein Rice DDGS (Distillers Dried Grains with Solubles) is a breakthrough, cost-effective protein concentrate derived from the bio-fermentation of pure broken rice. Boasting an extraordinary 45% to 50% crude protein content, it serves as an ideal high-protein alternative to expensive animal and plant proteins. Featuring low moisture (<10%), low fiber (<5%), healthy fat (3–5%), and an exceptional amino acid composition, our Rice DDGS undergoes advanced quality heat drying to guarantee maximum digestibility, zero scorched particles, and consistent batch-to-batch nutritional density.",
    image: "/images/products/attri-rice-ddgs.jpg",
    themeColor: {
      primary: "#1C2541",
      dark: "#0B132B",
      light: "#EEF2F6",
      accent: "#C5A059",
      border: "#2C3E6B",
      badgeBg: "bg-slate-900/90 text-slate-100 border-slate-700",
      badgeText: "text-slate-700"
    },
    exportName: "High-Protein Rice DDGS",
    tradeAliases: [
      "Rice Distillers Dried Grains 45-50% CP",
      "Concentrated Rice Protein Meal",
      "De-oiled Rice Distillers Grain",
      "High-Potency Aqua Protein Concentrate"
    ],
    demandMarkets: [
      "Commercial Shrimp & Fish Hatcheries (Aquafeeds)",
      "High-Density Broiler Starter & Layer Diets",
      "Southeast Asian Aquaculture Importers",
      "High-Yield Dairy Rations Across India"
    ],
    packSizes: ["50kg Moisture-Proof Woven Bags", "1 Metric Ton Jumbo Bags", "Bulk Freight Dispatches"],
    features: [
      "High Protein Content: 45% - 50%+ Crude Protein — top-tier plant protein concentration",
      "Low Moisture: <9.5% - 10% moisture content ensuring long shelf life and free flow",
      "Low Fiber: <4.5% - 5.5% crude fiber, drastically improving digestive absorption",
      "Healthy Fat Content: 3.5% - 5.0% digestible lipids for balanced energy",
      "Rich in Amino Acids: Abundant in essential bypass amino acids, Methionine & Lysine",
      "Quality Heat Processing: Modern indirect thermal drying avoids overheating, preserving protein solubility"
    ],
    specifications: {
      origin: "India",
      grainType: "Rice-Based Distillers Grains (DDGS)",
      aroma: "Pleasant Toasted Cereal Aroma",
      texture: "Light Tan / Golden-Brown Fine Granular Meal",
      cookingTime: "Ready for feed compounding",
      bestFor: ["Commercial Poultry Rations (Broiler & Layer)", "Fish & Shrimp Aquaculture Feeds", "High-Yield Dairy Cattle Rations", "Commercial Feed Mill Blends"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Ration Formulation",
        desc: "Use as a primary or secondary protein source at 8% to 20% inclusion to lower feed formulation costs while elevating crude protein."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-red-kidney-bean",
    name: "Attri Premium Red Kidney Beans (Rajma)",
    slug: "red-kidney-beans-rajma",
    brandLine: "Attri Pulses & Legumes",
    variety: "Selected Bold Red Kidney Beans (Chitra & Sharmili Grade)",
    category: "Beans and Pulses",
    subCategory: "Red Kidney Bean",
    processingTypes: ["Premium Domestic Grade", "Certified Export Grade"],
    shortDescription: "Premium bold Red Kidney Beans (Rajma) featuring high protein, rich fiber, low moisture, and uniform size and deep ruby color.",
    fullDescription: "Attri Premium Red Kidney Beans (Rajma) are selected from prime pulse-growing valleys known for producing the finest large-seeded kidney beans. Unpolished and completely free from artificial dyes or moisture treatments, each batch undergoes dual-channel computer optical sortex cleaning to ensure uniform bold size, spotless integrity, and velvety post-cooking creaminess.",
    image: "/images/products/attri-red-kidney-bean.jpg",
    themeColor: {
      primary: "#801B2B",
      dark: "#4A0D17",
      light: "#FDF2F4",
      accent: "#C5A059",
      border: "#A52A3F",
      badgeBg: "bg-rose-950/90 text-rose-100 border-rose-800",
      badgeText: "text-rose-800"
    },
    exportName: "Red Kidney Beans / Kidney Beans",
    tradeAliases: [
      "Chitra Rajma",
      "Sharmili Red Kidney Beans",
      "Dark Red Kidney Beans",
      "Light Speckled Kidney Beans"
    ],
    demandMarkets: [
      "North India (Punjab, Delhi, Haryana, Jammu) HoReCa",
      "United Kingdom & European Union",
      "Middle East & GCC Countries",
      "North America (Indian & Mexican Cuisine)"
    ],
    packSizes: ["1kg & 2kg Retail Zipper Pouches", "25kg Heavy-Duty Poly Bags", "50kg Master Export Bags", "Container Bulk Cargo"],
    features: [
      "High Protein: 22% - 24%+ natural vegetarian protein for wholesome muscle nourishment",
      "Rich in Fiber: Rich in soluble dietary fiber promoting gut health and metabolic balance",
      "Premium Quality: 100% natural unpolished Grade-A whole beans with natural luster",
      "Sortex Cleaned: Double computer optical sortex cleaned — zero stones, dirt, or discolored seeds",
      "Low Moisture: Strictly held under 10.5% moisture ensuring extended shelf life without mold",
      "Uniform Size & Color: Calibrated bold seed caliber and uniform natural crimson-red coloration"
    ],
    specifications: {
      origin: "Himachal Pradesh / Jammu / MP, India",
      grainType: "Large Bold Kidney Beans (Rajma)",
      aroma: "Natural Earthy Legume Scent",
      texture: "Plump & Tender with Smooth Skin",
      cookingTime: "30–35 Minutes (Post 6-8 hrs soaking)",
      bestFor: ["Authentic Punjabi Rajma Masala", "Continental Bean Salads & Soups", "High-Protein Vegetarian Meal Bowls", "Commercial Restaurant Chains"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Cold Water Soak",
        desc: "Soak 1 cup of Red Kidney Beans in 4 cups of cool water for 6 to 8 hours (or overnight) to allow complete seed hydration."
      },
      {
        step: 2,
        title: "Pressure Cooking",
        desc: "Drain and pressure cook in 3.5 cups fresh water with a pinch of rock salt for 5-6 whistles until soft and meltingly tender."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-dry-peas",
    name: "Attri Premium Dried Peas (Green & Yellow Peas)",
    slug: "dried-peas-green-yellow",
    brandLine: "Attri Pulses & Legumes",
    variety: "Grade-A Whole Green & Yellow Field Peas (Matar)",
    category: "Beans and Pulses",
    subCategory: "Peas",
    processingTypes: ["Premium Domestic Grade", "Certified Export Grade"],
    shortDescription: "Nutrient-dense dried field peas delivering high protein, abundant dietary fiber, low moisture, sortex purity, and uniform spherical grading.",
    fullDescription: "Attri Premium Dried Peas are harvested at optimal maturity to ensure peak starch-to-protein conversion. Sorted with high-speed color sorters to eliminate wrinkled, discolored, or broken seeds, these whole dried peas deliver a clean sweet taste, high dietary fiber, and smooth boiling consistency for curries, snack processing, and street-food gravies.",
    image: "/images/products/attri-peas.jpg",
    themeColor: {
      primary: "#2E6F40",
      dark: "#173B22",
      light: "#EFF7F1",
      accent: "#C5A059",
      border: "#3F8F56",
      badgeBg: "bg-emerald-950/90 text-emerald-100 border-emerald-800",
      badgeText: "text-emerald-800"
    },
    exportName: "Dried Green Peas / Yellow Peas",
    tradeAliases: [
      "Whole Green Field Peas",
      "Yellow Split / Whole Peas",
      "Vatana / Matar",
      "Sortex Dried Field Peas"
    ],
    demandMarkets: [
      "Indian Street Food & Snack Manufacturers (Namkeen, Ragda, Chaat)",
      "Southeast Asia & South Asia",
      "Middle East & North Africa (Canned & Dried Foods)",
      "European Processing Plants"
    ],
    packSizes: ["25kg Moisture-Proof Bags", "50kg Master Cargo Sacks", "Bulk Container Dispatches"],
    features: [
      "High Protein: 21% - 23%+ digestible vegetable protein content",
      "Rich in Fiber: Abundant dietary fiber supporting healthy digestion and slow carbohydrate release",
      "Premium Quality: 100% unpolished field peas harvested at peak botanical maturity",
      "Sortex Cleaned: High-precision laser sortex cleaned, removing defective grains and field debris",
      "Low Moisture: Maintained strictly under 10% moisture to guarantee long warehouse storage stability",
      "Uniform Size & Color: Calibrated spherical diameter with uniform, bright natural pea color"
    ],
    specifications: {
      origin: "Madhya Pradesh / Uttar Pradesh, India",
      grainType: "Spherical Whole Dried Field Peas",
      aroma: "Mild Sweet Legume Aroma",
      texture: "Firm Intact Skin, Soft Interior Upon Cooking",
      cookingTime: "25–30 Minutes (Post 4-6 hrs soaking)",
      bestFor: ["Matar Kulcha & Ragda Gravies", "Dehydrated Snacks & Namkeen Roasting", "Wholesale Milling & Commercial Soups"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Soak",
        desc: "Soak in water for 5 to 6 hours until peas expand to full plumpness."
      },
      {
        step: 2,
        title: "Cook",
        desc: "Boil or pressure cook until tender for flavorful street-style chaats, gravies, and soups."
      }
    ],
    isPopular: false,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-black-eyed-bean",
    name: "Attri Select Black-Eyed Beans (Lobia / Cowpeas)",
    slug: "black-eyed-beans-lobia",
    brandLine: "Attri Pulses & Legumes",
    variety: "Bold White Black-Eyed Beans (Lobia / Chawli / Cowpeas)",
    category: "Beans and Pulses",
    subCategory: "Black-Eyed Bean",
    processingTypes: ["Premium Domestic Grade", "Certified Export Grade"],
    shortDescription: "Export-quality Black-Eyed Beans (Lobia) packed with high protein, rich fiber, low moisture, sortex purity, and signature bold eye contrast.",
    fullDescription: "Attri Select Black-Eyed Beans (Lobia) feature plump, ivory-cream seeds with the characteristic sharp black eye mark. Naturally grown without artificial glazes, these beans are carefully sun-dried to low moisture and run through multi-channel optical sorters to ensure uniform seed count, zero insect damage, and rapid cooking time without prolonged pre-soaking.",
    image: "/images/products/attri-black-eyed-bean.jpg",
    themeColor: {
      primary: "#443C3A",
      dark: "#262120",
      light: "#F6F4F3",
      accent: "#C5A059",
      border: "#645A57",
      badgeBg: "bg-stone-950/90 text-stone-100 border-stone-800",
      badgeText: "text-stone-800"
    },
    exportName: "Black-Eyed Beans / Black-Eyed Peas / Cowpeas",
    tradeAliases: [
      "White Lobia",
      "Chawli Beans",
      "Black-Eyed Cowpeas",
      "Sortex White Cowpea"
    ],
    demandMarkets: [
      "United States & Caribbean (Soul Food & Stews)",
      "West Africa (Nigeria, Ghana - Akara & Moin-moin)",
      "Middle East & Mediterranean Markets",
      "Domestic Indian Wholesale & Modern Trade"
    ],
    packSizes: ["1kg Retail Pouches", "25kg Trade Bags", "50kg Master Sacks", "Bulk Containerized Export"],
    features: [
      "High Protein: 23% - 25%+ plant protein delivering an outstanding amino acid profile",
      "Rich in Fiber: High natural dietary fiber and micronutrients (Folate, Iron & Potassium)",
      "Premium Quality: Chemical-free, 100% natural whole unpolished beans",
      "Sortex Cleaned: Dual optical sortex cleaning ensures zero chaff, weed seeds, or splits",
      "Low Moisture: Moisture controlled below 10% to prevent weevils and ensure prolonged shelf life",
      "Uniform Size & Color: Pristine creamy-white seeds with uniform, distinct black eye markings"
    ],
    specifications: {
      origin: "Maharashtra / Gujarat / MP, India",
      grainType: "Medium-Bold Oval Cowpea Seeds",
      aroma: "Clean Earthy Aroma",
      texture: "Smooth, Tender & Quick-Cooking",
      cookingTime: "20–25 Minutes (Short 1-2 hrs soak)",
      bestFor: ["Traditional Lobia Masala Curries", "Protein Salad Tosses", "Southern US & Afro-Caribbean Stews", "Catering & Retail Packets"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Short Soak",
        desc: "Requires only 1 to 2 hours of gentle soaking before cooking due to thin, tender seed coats."
      },
      {
        step: 2,
        title: "Boil & Simmer",
        desc: "Simmer in water or broth until tender, retaining shape without disintegrating."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-chickpeas",
    name: "Attri Bold Kabuli Chickpeas (Garbanzo Beans)",
    slug: "bold-kabuli-chickpeas",
    brandLine: "Attri Pulses & Legumes",
    variety: "Export-Grade Extra Bold Kabuli Chickpeas (8mm / 9mm / 10mm+ Count)",
    category: "Beans and Pulses",
    subCategory: "Chickpeas",
    processingTypes: ["Premium Domestic Grade", "Certified Export Grade"],
    shortDescription: "Jumbo-count Kabuli Chickpeas delivering high protein, dense fiber, low moisture, sortex purity, and uniform golden-cream caliber.",
    fullDescription: "Attri Bold Kabuli Chickpeas are internationally acclaimed for their large diameter (8mm to 10mm+), smooth hazelnut-shaped contours, and pale golden-cream color. Meticulously sortex-graded to eliminate defective or undersized kernels, these chickpeas hydrate uniformly to double their volume, yielding a melt-in-mouth nutty texture that is prized for authentic Chole, Mediterranean Hummus, and export distribution.",
    image: "/images/products/attri-chickpeas.jpg",
    themeColor: {
      primary: "#996B1F",
      dark: "#573C0C",
      light: "#FDF7EE",
      accent: "#D4AF37",
      border: "#C2892A",
      badgeBg: "bg-amber-950/90 text-amber-100 border-amber-800",
      badgeText: "text-amber-800"
    },
    exportName: "Kabuli Chickpeas / Garbanzo Beans",
    tradeAliases: [
      "Extra Bold Kabuli Chana (8mm / 9mm / 10mm+)",
      "White Chickpeas",
      "Garbanzo Beans",
      "Export Grade Indian Kabuli"
    ],
    demandMarkets: [
      "Middle East & Mediterranean (Hummus, Falafel)",
      "Spain, Italy & European HoReCa",
      "North America & Latin America",
      "Domestic Indian Restaurant Chains (Amritsari Chole)"
    ],
    packSizes: ["1kg / 2kg Poly Pouches", "25kg Heavy PP Bags", "50kg Master Jute Bags", "Bulk Ocean Freight Containers"],
    features: [
      "High Protein: 20% - 22%+ complete vegetarian protein density",
      "Rich in Fiber: High complex prebiotic fiber and low glycemic index for sustained energy",
      "Premium Quality: Hand-selected extra bold export count from prime black soils",
      "Sortex Cleaned: Dual optical sortex cleaning ensures spotless, smooth seeds free of grit",
      "Low Moisture: Strictly controlled moisture under 9.8% for crisp cooking and long storage life",
      "Uniform Size & Color: Calibrated millimeter grading and uniform light golden-cream hue"
    ],
    specifications: {
      origin: "Madhya Pradesh / Maharashtra, India",
      grainType: "Jumbo Kabuli Chickpeas (8mm - 10mm+)",
      aroma: "Nutty, Wholesome Chickpea Aroma",
      texture: "Firm, Meaty & Velvety Soft When Boiled",
      cookingTime: "35–40 Minutes (Post 8 hrs soak)",
      bestFor: ["Amritsari Chole & Pindi Chana", "Creamy Artisanal Hummus & Falafel", "Commercial Canning & Supermarket Packs"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Overnight Soak",
        desc: "Soak in plenty of water for 8-10 hours with a pinch of salt to achieve maximum seed expansion."
      },
      {
        step: 2,
        title: "Pressure Cook",
        desc: "Cook with whole spices (cinnamon, tea bag for dark color, cardamom) for 5-6 whistles until buttery soft."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-select-toor-dal",
    name: "Attri Select Toor (Unpolished Pigeon Pea / Arhar)",
    slug: "attri-select-toor-dal",
    brandLine: "Attri Pulses & Legumes",
    variety: "100% Unpolished Desi Yellow Pigeon Peas (Arhar Dal / Toor)",
    category: "Beans and Pulses",
    subCategory: "Toor",
    processingTypes: ["Premium Domestic Grade", "Certified Export Grade"],
    shortDescription: "Naturally sorted, 100% unpolished Toor Dal loaded with high protein, rich fiber, low moisture, sortex purity, and uniform golden lentils.",
    fullDescription: "Attri Select Toor is harvested directly from the premier pulse belts of central India. Graded without water, oil, or chemical polishing to safeguard natural vitamins and authentic aroma, this unpolished toor dal dissolves smoothly into a rich, velvety yellow dal with superior digestive ease and rich natural protein.",
    image: "/images/products/attri-toor-dal.jpg",
    themeColor: {
      primary: "#B3541E",
      dark: "#6B2E0A",
      light: "#FDF4EE",
      accent: "#D4AF37",
      border: "#D46D31",
      badgeBg: "bg-orange-950/90 text-orange-100 border-orange-800",
      badgeText: "text-orange-800"
    },
    exportName: "Pigeon Peas / Toor Dal",
    tradeAliases: [
      "Unpolished Arhar Dal",
      "Yellow Split Pigeon Peas",
      "Desi Toor Dal",
      "Indian Split Yellow Pulses"
    ],
    demandMarkets: [
      "South India (Sambar & Rasam Staple)",
      "Western India (Gujarat & Maharashtra)",
      "UAE, GCC & Middle East Indian Supermarkets",
      "UK, USA & Canada (Indian Diaspora)"
    ],
    packSizes: ["1kg / 2kg Retail Packs", "25kg Trade Bags", "50kg Bulk Bags", "Custom Consumer Packs"],
    features: [
      "High Protein: 22% - 24% essential plant protein for daily nutritional balance",
      "Rich in Fiber: Rich dietary fiber assisting healthy digestion and sustained satiety",
      "Premium Quality: 100% unpolished with zero artificial colors, water polish, or oil additives",
      "Sortex Cleaned: Laser sortex processed to guarantee spotless purity and zero stones or dirt",
      "Low Moisture: Monitored <10% moisture content for uniform boiling and extended shelf life",
      "Uniform Size & Color: Perfectly calibrated bright golden-yellow lentils of uniform caliber"
    ],
    specifications: {
      origin: "Maharashtra / Karnataka / MP, India",
      grainType: "Split De-husked Yellow Pigeon Peas (Toor / Arhar)",
      aroma: "Rich, Earthy Lentil Aroma",
      texture: "Smooth, Creamy & Velvety Upon Cooking",
      cookingTime: "20–25 Minutes (Pressure Cooker: 3–4 Whistles)",
      bestFor: ["Daily Dal Tadka & Dal Fry", "Traditional Sambar & Rasam", "Restaurant & Banquet Catering", "Wholesale Distribution"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Rinse Twice",
        desc: "Rinse 1 cup of Toor Dal in cool water twice."
      },
      {
        step: 2,
        title: "Pressure Cook",
        desc: "Add 3 cups of water with a pinch of turmeric. Cook for 3-4 whistles until velvety soft."
      },
      {
        step: 3,
        title: "Tempering (Tadka)",
        desc: "Temper with pure desi ghee, cumin seeds, mustard, crushed garlic, and fresh curry leaves."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-red-lentils",
    name: "Attri Select Red Lentils (Masoor / Split Red Lentils)",
    slug: "red-lentils-masoor-dal",
    brandLine: "Attri Pulses & Legumes",
    variety: "Premium Football & Split Red Lentils (Masoor Dal)",
    category: "Beans and Pulses",
    subCategory: "Red Lentils",
    processingTypes: ["Premium Domestic Grade", "Certified Export Grade"],
    shortDescription: "Quick-cooking Red Lentils (Masoor) boasting high protein, rich fiber, low moisture, sortex purity, and radiant salmon-orange color.",
    fullDescription: "Attri Select Red Lentils (Masoor) are prized across worldwide cuisines for their delicate earthy flavor and rapid cooking without pre-soaking. De-hulled and split under gentle mechanical friction, these unpolished lentils retain their natural micronutrients (Iron, Zinc, and Folate) while delivering a vibrant salmon-orange color and silk-smooth consistency.",
    image: "/images/products/attri-red-lentils.jpg",
    themeColor: {
      primary: "#C0392B",
      dark: "#6F1C14",
      light: "#FDF1F0",
      accent: "#C5A059",
      border: "#D9534F",
      badgeBg: "bg-red-950/90 text-red-100 border-red-800",
      badgeText: "text-red-800"
    },
    exportName: "Red Lentils / Red Split Lentils",
    tradeAliases: [
      "Masoor Dal",
      "Split Red Lentils",
      "Football Red Lentils",
      "Egyptian Lentils"
    ],
    demandMarkets: [
      "Middle East & Turkey (Mercimek Çorbası / Lentil Soups)",
      "Bangladesh & Sri Lanka",
      "Europe & North America (Plant-Based Soups & Purees)",
      "Domestic Indian Dals"
    ],
    packSizes: ["1kg Retail Pouches", "25kg Trade Bags", "50kg Master Sacks", "Bulk Containerized Cargo"],
    features: [
      "High Protein: 24% - 26%+ concentrated plant protein for rapid muscle recovery",
      "Rich in Fiber: High soluble fiber and natural minerals (Iron, Zinc, and Folate)",
      "Premium Quality: 100% natural, unpolished lentils with pure nutritional integrity",
      "Sortex Cleaned: Advanced color-sortex cleaned to eliminate dust, chaff, and discolored seeds",
      "Low Moisture: Maintained strictly below 9.8% moisture for quick cooking and fresh aroma",
      "Uniform Size & Color: Brilliant natural salmon-orange color with impeccably uniform split grading"
    ],
    specifications: {
      origin: "Madhya Pradesh / Uttar Pradesh, India",
      grainType: "Split De-husked Red Lentils (Masoor)",
      aroma: "Delicate Earthy Sweet Aroma",
      texture: "Silky, Fast-Dissolving & Smooth",
      cookingTime: "15–18 Minutes (Zero Pre-Soak Needed)",
      bestFor: ["Red Lentil Soup & Curries", "Continental Dals & Purees", "Healthy High-Protein Baby & Geriatric Blends"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Rinse & Simmer",
        desc: "No soaking required. Rinse in fresh water and simmer with water (1:3 ratio) for 15 minutes."
      },
      {
        step: 2,
        title: "Season",
        desc: "Whisk into a smooth soup or temper with cumin, chili, and lemon juice."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-black-matpe",
    name: "Attri Premium Black Matpe (Whole Urad / Black Gram)",
    slug: "black-matpe-urad-bean",
    brandLine: "Attri Pulses & Legumes",
    variety: "Export-Grade Whole & Split Black Matpe (Black Gram / Urad)",
    category: "Beans and Pulses",
    subCategory: "Black Matpe",
    processingTypes: ["Premium Domestic Grade", "Certified Export Grade"],
    shortDescription: "Dense, earthy Black Matpe (Urad) featuring high protein, rich fiber, sortex purity, low moisture, and uniform jet-black seed caliber.",
    fullDescription: "Attri Premium Black Matpe (Black Gram / Whole Urad) is the essential ingredient for authentic Dal Makhani, South Indian Idli-Dosa fermentation, and Ayurvedic formulations. Harvested from nutrient-rich fertile soils and cleaned using multi-spectrum optical sorters, these beans feature jet-black seed coats, immaculate purity, high mucilage quality, and rich natural iron.",
    image: "/images/products/attri-black-matpe.jpg",
    themeColor: {
      primary: "#25282A",
      dark: "#141518",
      light: "#F4F5F6",
      accent: "#C5A059",
      border: "#484D51",
      badgeBg: "bg-slate-950/90 text-slate-100 border-slate-700",
      badgeText: "text-slate-700"
    },
    exportName: "Black Matpe / Black Gram / Urad",
    tradeAliases: [
      "Whole Black Urad",
      "Black Lentils",
      "Dal Makhani Grade Matpe",
      "Urad Dal Gota / Split"
    ],
    demandMarkets: [
      "North Indian HoReCa & Banquets (Dal Makhani)",
      "South India (Idli & Dosa Batter Fermentation Mills)",
      "Myanmar-India Bilateral Pulse Trade",
      "UK & UAE Indian Grocery Chains"
    ],
    packSizes: ["1kg / 2kg Poly Pouches", "25kg Heavy Bags", "50kg Master Sacks", "Bulk Container Freight"],
    features: [
      "High Protein: 24% - 25%+ exceptional protein density with essential amino acids",
      "Rich in Fiber: Dense soluble dietary fiber ideal for traditional culinary fermentations",
      "Premium Quality: Unpolished farm-fresh crop preserving natural mineral riches and iron",
      "Sortex Cleaned: High-speed infrared and optical sortex cleaning for zero foreign matter",
      "Low Moisture: Controlled <10.5% moisture guaranteeing high storage viability and freshness",
      "Uniform Size & Color: Deep jet-black cylindrical seeds with calibrated uniform grading"
    ],
    specifications: {
      origin: "Madhya Pradesh / Andhra Pradesh, India",
      grainType: "Cylindrical Whole Black Gram (Urad)",
      aroma: "Deep Earthy, Fermentation-Rich Aroma",
      texture: "Hearty, Velvety & Creamy When Slow-Cooked",
      cookingTime: "35–45 Minutes (Post 6-8 hrs soak)",
      bestFor: ["Iconic Dal Makhani & Bukhara Dals", "Idli & Dosa Batter Fermentation", "Medu Vada & Traditional Savories"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Slow Hydration",
        desc: "Soak in water for 6 to 8 hours for maximum fermentation power and seed tenderness."
      },
      {
        step: 2,
        title: "Slow Cook",
        desc: "Slow cook on gentle heat with butter and cream for signature restaurant-style Dal Makhani."
      }
    ],
    isPopular: false,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-green-mung-bean",
    name: "Attri High-Purity Green Mung Beans (Moong / Green Gram)",
    slug: "green-mung-beans-whole",
    brandLine: "Attri Pulses & Legumes",
    variety: "Whole Shiny Green Mung Beans & Split Moong Dal",
    category: "Beans and Pulses",
    subCategory: "Green Mung Bean",
    processingTypes: ["Premium Domestic Grade", "Certified Export Grade"],
    shortDescription: "Easy-to-digest Green Mung Beans packed with high protein, rich fiber, low moisture, sortex purity, and uniform lustrous green grains.",
    fullDescription: "Attri High-Purity Green Mung Beans are globally revered as the most easily digestible of all legumes. Featuring bright emerald-green, unpolished whole seeds with high germination and sprouting vitality, our Green Mung is triple-screened and sortex-cleaned to remove hollow grains and field impurities, making it the supreme choice for healthy salads, khichdi, sprouts, and Asian desserts.",
    image: "/images/products/attri-green-mung-bean.jpg",
    themeColor: {
      primary: "#2C5E2E",
      dark: "#163318",
      light: "#EFF5F0",
      accent: "#C5A059",
      border: "#3F7C42",
      badgeBg: "bg-emerald-950/90 text-emerald-100 border-emerald-800",
      badgeText: "text-emerald-800"
    },
    exportName: "Green Mung Beans / Green Gram",
    tradeAliases: [
      "Whole Moong",
      "Moong Dal Split",
      "Shiny Green Mung",
      "Sprouting Grade Green Gram"
    ],
    demandMarkets: [
      "East Asia & Southeast Asia (Sprouts, Noodles, Sweet Pastes)",
      "Europe & USA (Health Foods & Microgreen Sprouting)",
      "Middle East & GCC Indian Diaspora",
      "All-India Household & Ayurvedic Diet Staple"
    ],
    packSizes: ["1kg / 2kg Retail Packs", "25kg Trade Bags", "50kg Master Sacks", "Bulk Container Dispatches"],
    features: [
      "High Protein: 23% - 24%+ readily digestible light vegetarian protein",
      "Rich in Fiber: High prebiotic dietary fiber promoting digestive ease and light gut feel",
      "Premium Quality: 100% natural, unpolished whole beans with >95% sprouting viability",
      "Sortex Cleaned: Computerized sortex cleaned, removing discolored seeds, husks, and grit",
      "Low Moisture: Carefully dehydrated to <9.8% moisture for crisp, uniform soaking",
      "Uniform Size & Color: Lustrous emerald-green color and exceptionally uniform seed diameter"
    ],
    specifications: {
      origin: "Rajasthan / MP / Maharashtra, India",
      grainType: "Small Oval Whole Green Gram (Moong)",
      aroma: "Fresh Green, Sweet Legume Scent",
      texture: "Delicate, Tender & Quick to Digest",
      cookingTime: "20–25 Minutes (Short 2 hrs soak, or instant boil)",
      bestFor: ["Fresh Sprout Salads", "Ayurvedic Moong Khichdi", "Wholesale Milling into Moong Dal", "Asian Sweet & Savory Pastes"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Sprouting / Cooking",
        desc: "Soak for 4 hours and cook directly, or wrap in a damp cheesecloth for 24 hours to create crisp nutritious live sprouts."
      },
      {
        step: 2,
        title: "Simmer",
        desc: "Simmer with cumin, turmeric, and ginger for a soothing, light and restorative soup."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-pure-sharbati-flour",
    name: "Attri Pure Sharbati Wheat Flour",
    slug: "attri-pure-sharbati-flour",
    brandLine: "Attri Flour Milling",
    variety: "100% Whole Wheat MP Sharbati Flour",
    category: "Wheat Flour",
    subCategory: "Sharbati Flour",
    processingTypes: [
      "Stone Ground (Chakki Grinding)",
      "Roller Milling",
      "Impact / Hammer Milling",
      "Pin Milling"
    ],
    shortDescription: "Traditional chakki-ground 100% whole wheat atta milled from MP Sharbati grains for soft, golden rotis.",
    fullDescription: "Attri Pure Sharbati Wheat Flour is milled exclusively from our premium MP Sharbati golden grains. Buyers can choose their preferred milling technique — traditional stone chakki, high-speed roller, hammer, or pin milling — locking in natural wheat bran, dietary fibers, and inherent sweetness for rotis that stay soft for hours.",
    image: "/images/products/attri-sharbati-atta.jpg",
    themeColor: {
      primary: "#9C6B1F",
      dark: "#5A3C0C",
      light: "#FDF8F0",
      accent: "#D4AF37",
      border: "#C78D32",
      badgeBg: "bg-amber-950/90 text-amber-100 border-amber-800",
      badgeText: "text-amber-800"
    },
    exportName: "Indian Sharbati Whole Wheat Flour / 100% Chakki Atta",
    tradeAliases: [
      "100% MP Sharbati Atta",
      "Stone-Ground Sharbati Flour",
      "Pure Whole Wheat Chakki Atta (0% Maida)",
      "Golden Sweet Chapati Flour"
    ],
    demandMarkets: [
      "Premium Indian Households & Modern Trade Retail",
      "UAE, Saudi Arabia & GCC Export Markets",
      "USA, UK & Canada Indian Grocery Chains",
      "Five-Star Hotels & Luxury Catering"
    ],
    packSizes: ["10kg Poly Packs", "25kg / 50kg Bags", "Commercial Bakery Packs"],
    features: [
      "Milled from 100% genuine MP Sharbati golden wheat",
      "Choice of 4 custom milling finishes (Stone Chakki, Roller, Hammer, Pin Milling)",
      "High water absorption capacity for fluffy rotis that stay soft 8-10 hours",
      "Naturally sweet taste with 0% added maida or chemical bleaches",
      "100% natural wheat germ and dietary fiber (Choker) retained"
    ],
    specifications: {
      origin: "Madhya Pradesh, India",
      grainType: "100% Whole Wheat Sharbati Flour",
      aroma: "Sweet, Earthy Fresh Flour Aroma",
      texture: "Fine Granular with Wholesome Bran",
      cookingTime: "Instant Kneading",
      bestFor: ["Soft Rotis, Phulkas & Parathas", "Puri & Naan", "Artisanal Breads & Bakery"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Knead with Warm Water",
        desc: "Mix atta with lukewarm water and knead to a soft, pliable dough. Rest for 15 minutes."
      },
      {
        step: 2,
        title: "Roll & Roast",
        desc: "Roll into thin rotis and roast on hot tawa until puffed and golden."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-lokwan-flour",
    name: "Attri Select Lokwan Wheat Flour",
    slug: "attri-lokwan-flour",
    brandLine: "Attri Flour Milling",
    variety: "High-Gluten Lokwan Whole Wheat Flour",
    category: "Wheat Flour",
    subCategory: "Lokwan Flour",
    processingTypes: [
      "Stone Ground (Chakki Grinding)",
      "Roller Milling",
      "Impact / Hammer Milling",
      "Pin Milling"
    ],
    shortDescription: "High-yield, strong-gluten wheat flour milled from Lokwan grains, ideal for bakeries and commercial atta.",
    fullDescription: "Milled directly from our uniform, high-protein Lokwan wheat grains, Attri Select Lokwan Flour provides an exceptional gluten network and dough extensibility. Available in all 4 custom milling finishes, it is the premier choice for commercial bakeries, food service, and large-scale chapati production.",
    image: "/images/products/attri-lokwan-flour.jpg",
    themeColor: {
      primary: "#7A4E1D",
      dark: "#442A0D",
      light: "#F9F4EC",
      accent: "#D49B43",
      border: "#9E682A",
      badgeBg: "bg-amber-950/90 text-amber-100 border-amber-800",
      badgeText: "text-amber-800"
    },
    exportName: "Lokwan Whole Wheat Flour / High-Gluten Commercial Atta",
    tradeAliases: [
      "Commercial Bakery Atta",
      "High-Extensibility Chapati Flour",
      "Industrial Rotis & Paratha Flour",
      "Fine Roller Milled Lokwan Atta"
    ],
    demandMarkets: [
      "Automated Chapati Plants & Large Scale Caterers",
      "Commercial Bakeries & Bread Mills",
      "Institutional Messes & Corporate Canteens",
      "Middle East Food Service Providers"
    ],
    packSizes: ["10kg Bags", "25kg Heavy Bags", "50kg Master Sacks", "Bulk FTL Dispatch"],
    features: [
      "Milled from premium high-protein Lokwan wheat kernels",
      "Choice of 4 custom milling finishes (Stone Chakki, Roller, Hammer, Pin Milling)",
      "Robust gluten quality ensuring superior dough elasticity and stretch",
      "High flour extraction rate with uniform commercial texture",
      "Ideal for commercial bakeries, institutional catering & wholesale"
    ],
    specifications: {
      origin: "Maharashtra / Madhya Pradesh, India",
      grainType: "High-Gluten Lokwan Flour",
      aroma: "Wholesome Fresh Cereal Aroma",
      texture: "Smooth, Consistent Particle Size",
      cookingTime: "Standard Kneading",
      bestFor: ["Commercial Atta Mills", "Bakery Breads & Buns", "Institutional Canteens & Catering"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Dough Kneading",
        desc: "Knead thoroughly to develop gluten network for high-volume elasticity."
      }
    ],
    isPopular: false,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-malviya-flour",
    name: "Attri Malviya Wheat Flour",
    slug: "attri-malviya-flour",
    brandLine: "Attri Flour Milling",
    variety: "Nutritional Malviya Whole Wheat Flour",
    category: "Wheat Flour",
    subCategory: "Malviya Flour",
    processingTypes: [
      "Stone Ground (Chakki Grinding)",
      "Roller Milling",
      "Impact / Hammer Milling",
      "Pin Milling"
    ],
    shortDescription: "Nutritious, easy-to-digest daily wheat flour milled from clean, uniform Malviya grains.",
    fullDescription: "Produced by milling our clean, sortexed Malviya plateau wheat, this whole wheat flour is rich in natural dietary fiber, iron, and essential B-vitamins. Available across traditional stone chakki or modern roller/pin milling, it produces wholesome, easily digestible rotis perfect for everyday family meals.",
    image: "/images/products/attri-malviya-flour.jpg",
    themeColor: {
      primary: "#6B4226",
      dark: "#3B2213",
      light: "#F8F1EA",
      accent: "#B87333",
      border: "#8C5832",
      badgeBg: "bg-amber-950/90 text-amber-100 border-amber-800",
      badgeText: "text-amber-800"
    },
    exportName: "Malviya Whole Wheat Flour / Indian Chakki Atta",
    tradeAliases: [
      "Everyday Wholesome Atta",
      "Stone Ground Malviya Flour",
      "High-Fiber Whole Wheat Flour",
      "Traditional Household Atta"
    ],
    demandMarkets: [
      "Everyday Household Consumption Across India",
      "Regional Wholesale Flour Distributors",
      "Catering & Community Food Kitchens",
      "Middle East Retail Packaging"
    ],
    packSizes: ["10kg Bags", "25kg Bags", "50kg Bags"],
    features: [
      "Milled from clean, uniform Malviya plateau wheat",
      "Choice of 4 custom milling finishes (Stone Chakki, Roller, Hammer, Pin Milling)",
      "Rich in dietary fiber, iron, and natural B-complex vitamins",
      "Light, balanced texture that is easy to knead and gentle on digestion",
      "Perfect for healthy everyday household meals and regional flatbreads"
    ],
    specifications: {
      origin: "Malwa Region, Madhya Pradesh / UP, India",
      grainType: "Nutritional Whole Wheat Malviya Flour",
      aroma: "Fresh Natural Cereal Fragrance",
      texture: "Fine to Medium Granular Flour",
      cookingTime: "Easy Kneading",
      bestFor: ["Daily Family Rotis & Flatbreads", "Tandoori Rotis", "Wholesale Flour Distribution"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Daily Dough Preparation",
        desc: "Knead with room temperature water for 3-4 minutes to achieve smooth consistency."
      }
    ],
    isPopular: false,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-durum-flour",
    name: "Attri Durum Wheat Semolina & Flour",
    slug: "attri-durum-flour",
    brandLine: "Attri Flour Milling",
    variety: "Amber Durum Semolina (Suji/Rawa) & Vitreous Flour",
    category: "Wheat Flour",
    subCategory: "Durum Flour",
    processingTypes: [
      "Roller Milling",
      "Pin Milling",
      "Stone Ground (Chakki Grinding)",
      "Impact / Hammer Milling"
    ],
    shortDescription: "High-protein, carotenoid-rich amber durum semolina & flour, ideal for pasta, suji, and Mediterranean breads.",
    fullDescription: "Milled directly from our hard amber vitreous Durum wheat (Kathia), this specialty flour and semolina features 13.5%+ high protein density, resilient wet gluten, and natural bright yellow carotenoid pigmentation. Available in roller, pin, or stone milling, it is the international standard for premium pasta, suji halwa, upma, and couscous.",
    image: "/images/products/attri-durum-flour.jpg",
    themeColor: {
      primary: "#85581A",
      dark: "#4B300B",
      light: "#FDF6EB",
      accent: "#E5A93C",
      border: "#AC7527",
      badgeBg: "bg-yellow-950/90 text-yellow-100 border-yellow-800",
      badgeText: "text-yellow-800"
    },
    exportName: "Durum Wheat Semolina & Flour (Suji / Rawa / Pasta Flour)",
    tradeAliases: [
      "Amber Durum Suji / Rawa",
      "Coarse & Fine Semolina",
      "Durum Vitreous Pasta Flour",
      "Kathia Suji"
    ],
    demandMarkets: [
      "Industrial Pasta, Macaroni & Spaghetti Plants",
      "Indian Halwa, Upma & South Indian Tiffin Centers",
      "Mediterranean Bakery & Couscous Formulators",
      "Export Bulk Container Shipments"
    ],
    packSizes: ["10kg Food-Grade Bags", "25kg Bags", "50kg Export Sacks", "Bulk Container Load"],
    features: [
      "Milled from 100% hard amber vitreous Durum wheat",
      "Choice of 4 custom milling finishes (Roller, Pin, Stone Chakki, Hammer Milling)",
      "13.5% - 14.5%+ very high protein density with resilient wet gluten",
      "Rich in natural golden carotenoid pigments for vivid amber color",
      "Available as coarse/fine Suji (Rawa) or fine durum pasta flour"
    ],
    specifications: {
      origin: "Central & Western India (MP / Gujarat / Rajasthan)",
      grainType: "Amber Durum Semolina & Vitreous Flour",
      aroma: "Rich Nutty Cereal Aroma",
      texture: "Granular Semolina or Ultra-Fine Flour",
      cookingTime: "Pasta Extrusion & Semolina Cooking",
      bestFor: ["Pasta, Macaroni & Spaghetti", "Suji Halwa, Upma & Rawa Batters", "Mediterranean Breads & Couscous"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Pasta & Semolina Preparation",
        desc: "Mix with water or eggs for firm al dente pasta dough, or roast with ghee for traditional suji dishes."
      }
    ],
    isPopular: false,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-mp-sharbati-wheat-grain",
    name: "Attri Premium Sharbati Wheat",
    slug: "attri-mp-sharbati-wheat-grain",
    brandLine: "Attri Wheat Harvest",
    variety: "MP Sharbati Golden Whole Grain",
    category: "Wheat",
    subCategory: "Sharbati Wheat",
    processingTypes: ["Premium Domestic Grade", "Certified Export Grade"],
    shortDescription: "Plump, sun-ripened Sharbati wheat grains from Madhya Pradesh black soils with natural sweetness and high protein.",
    fullDescription: "Known as the king of wheat, Attri Premium Sharbati Wheat is harvested from the mineral-rich black soils of Sehore and Vidisha in Madhya Pradesh. These heavy golden grains possess high protein density and natural sweetness, making them the preferred choice for soft, aromatic chapatis and artisanal flour milling.",
    image: "/images/products/attri-wheat-grain.jpg",
    themeColor: {
      primary: "#593E1A",
      dark: "#33220E",
      light: "#F7F2EA",
      accent: "#C5A059",
      border: "#7D5927",
      badgeBg: "bg-orange-950/90 text-orange-100 border-orange-800",
      badgeText: "text-orange-800"
    },
    exportName: "Indian Sharbati Wheat",
    tradeAliases: [
      "MP Sehore Sharbati Wheat",
      "Golden Sharbati Grain",
      "King of Wheat Grains",
      "Naturally Sweet Indian Wheat"
    ],
    demandMarkets: [
      "Premium Domestic Atta Brands & Artisanal Flour Mills",
      "UAE & GCC Supermarket Bulk Wheat Sections",
      "North America & UK (Premium Indian Grocery Distribution)",
      "Luxury Food Service & Fine Dining Bakeries"
    ],
    packSizes: ["50kg Food-Grade Sacks", "1 MT Jumbo Bags", "Bulk Commercial Truckload"],
    features: [
      "Premium Quality: 100% genuine MP Sharbati golden grains",
      "Naturally Sweet Taste: Inherent natural sweetness in flour",
      "High Protein: 12.5% - 13.5%+ balanced protein density",
      "Soft & Fine Flour: Cold-mills easily into velvet-textured chakki flour",
      "Rich in Nutrition: Retains essential minerals, magnesium & dietary fiber",
      "Excellent Chapati Quality: Chapatis puff fully and stay soft for hours"
    ],
    specifications: {
      origin: "Sehore & Vidisha, MP, India",
      grainType: "Bold Golden Hard Sharbati Grain",
      aroma: "Naturally Sweet Earthy Wheat Aroma",
      texture: "Hard, Vitreous Golden Kernels",
      cookingTime: "Milling Grade",
      bestFor: ["Premium Soft Chapatis & Phulkas", "Artisanal Stone-Milling", "High-End Retail Atta Brands"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Stone Chakki Milling",
        desc: "Grind slowly in traditional stone chakkis under 40°C to retain natural sweetness and delicate germ oil."
      }
    ],
    isPopular: true,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-lokwan-wheat",
    name: "Attri Select Lokwan Wheat",
    slug: "attri-lokwan-wheat",
    brandLine: "Attri Wheat Harvest",
    variety: "Lokwan Whole Wheat Grain",
    category: "Wheat",
    subCategory: "Lokwan Wheat",
    processingTypes: ["High-Yield Milling Grade", "Certified Export Grade"],
    shortDescription: "High-protein, superior-gluten uniform wheat grain ideal for commercial atta milling and bakeries.",
    fullDescription: "Attri Select Lokwan Wheat is a celebrated semi-hard golden grain known across India for its excellent milling yield, robust gluten network, and high protein content. Double sortex cleaned to ensure uniform grain size and spotless purity, Lokwan is the commercial millers' top choice for producing high-yield, elastic dough and wholesome everyday atta.",
    image: "/images/products/attri-lokwan-wheat.jpg",
    themeColor: {
      primary: "#7A4E1D",
      dark: "#442A0D",
      light: "#F9F4EC",
      accent: "#D49B43",
      border: "#9E682A",
      badgeBg: "bg-amber-950/90 text-amber-100 border-amber-800",
      badgeText: "text-amber-800"
    },
    exportName: "Indian Lokwan Wheat",
    tradeAliases: [
      "Lokwan Semi-Hard Wheat",
      "High-Gluten Milling Wheat",
      "Maharashtra & MP Lokwan Grain",
      "Commercial Chapati Grade Wheat"
    ],
    demandMarkets: [
      "Commercial Atta Mills Across Western & Southern India",
      "Industrial Bakery & Chapati Production Facilities",
      "Middle East Food Processors",
      "Institutional Food Supply & Government Wholesale"
    ],
    packSizes: ["50kg PP Woven Bags", "1 MT Jumbo Bags", "Full Truckload (FTL) Grain Dispatch"],
    features: [
      "High Protein: 12.0% - 12.8%+ plant protein content",
      "Good Gluten Quality: Elastic gluten network for superior dough stretch",
      "Premium Grain: Carefully sorted, plump semi-hard kernels",
      "Uniform Grains: Machine-graded seed caliber for smooth mill hopper flow",
      "Excellent Milling Quality: High flour extraction rate with low bran speckle",
      "Ideal for Atta Production: Perfect for commercial flour mills and bakery doughs"
    ],
    specifications: {
      origin: "Maharashtra / Madhya Pradesh, India",
      grainType: "Semi-Hard Uniform Amber Grain",
      aroma: "Wholesome Fresh Grain Aroma",
      texture: "Even, Semi-Hard Vitreous Texture",
      cookingTime: "Commercial Milling",
      bestFor: ["Commercial Atta Mills", "Bulk Bread & Bakery Flours", "Food Service & Canteens"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Commercial Grinding",
        desc: "Suitable for both traditional chakki mills and modern roller mills with high yield extraction."
      }
    ],
    isPopular: false,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-malviya-wheat",
    name: "Attri Malviya Wheat",
    slug: "attri-malviya-wheat",
    brandLine: "Attri Wheat Harvest",
    variety: "Malviya Whole Grain Wheat",
    category: "Wheat",
    subCategory: "Malviya Wheat",
    processingTypes: ["Premium Domestic Grade", "Certified Export Grade"],
    shortDescription: "Clean, uniform premium wheat grains rich in protein and nutrition for wholesome daily consumption.",
    fullDescription: "Grown in the renowned Malwa plateau and fertile central plains, Attri Malviya Wheat is recognized for its high nutritional density, balanced protein profile, and exceptionally clean, uniform kernel structure. Extensively tested for low moisture and sortex-cleaned, it delivers consistent milling performance and delicious, digestible everyday rotis.",
    image: "/images/products/attri-malviya-wheat.jpg",
    themeColor: {
      primary: "#6B4226",
      dark: "#3B2213",
      light: "#F8F1EA",
      accent: "#B87333",
      border: "#8C5832",
      badgeBg: "bg-amber-950/90 text-amber-100 border-amber-800",
      badgeText: "text-amber-800"
    },
    exportName: "Malviya Wheat / Indian Wheat",
    tradeAliases: [
      "Malwa Plateau Wheat",
      "Nutritional Whole Grain Wheat",
      "Sortex Indian Milling Wheat",
      "Standard Food-Grade Wheat"
    ],
    demandMarkets: [
      "Central & Northern India Regional Flour Packers",
      "Institutional Canteens & Community Kitchens",
      "Middle East & African Commercial Grain Trade",
      "Everyday Household Staple Supplies"
    ],
    packSizes: ["25kg Bags", "50kg Heavy Sacks", "Bulk Containerized Export"],
    features: [
      "Premium Grain Quality: Clean, lustrous, high test-weight kernels",
      "Good Protein Content: 11.8% - 12.5%+ balanced protein composition",
      "Rich in Nutrition: Abundant natural B-vitamins, iron, and dietary fiber",
      "Clean & Uniform Grains: 99.8% laser-sortexed with zero foreign seeds or stones",
      "Excellent Milling Quality: Easy break release and fine granulation",
      "Ideal for Daily Consumption: Light on the stomach, nourishing everyday staple"
    ],
    specifications: {
      origin: "Malwa Region, Madhya Pradesh / UP, India",
      grainType: "Medium-Bold Golden Amber Kernel",
      aroma: "Fresh Natural Cereal Aroma",
      texture: "Even, Medium-Hard Structure",
      cookingTime: "Daily Milling Grade",
      bestFor: ["Everyday Household Rotis", "Regional Flour Packers", "Institutional Kitchens"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Whole Wheat Milling",
        desc: "Milled into fine or medium-coarse flour for daily whole wheat baking and flatbreads."
      }
    ],
    isPopular: false,
    isFeatured: true,
    enquiryEnabled: true
  },
  {
    id: "attri-durum-wheat",
    name: "Attri Premium Durum Wheat",
    slug: "attri-durum-wheat",
    brandLine: "Attri Wheat Harvest",
    variety: "Amber Durum Whole Grain (Kathia / Semolina Wheat)",
    category: "Wheat",
    subCategory: "Durum Wheat",
    processingTypes: ["Semolina & Pasta Grade", "Certified Export Grade"],
    shortDescription: "Hard amber vitreous durum grain rich in carotenoids and strong gluten, ideal for pasta and semolina.",
    fullDescription: "Attri Premium Durum Wheat (also known in India as Kathia Wheat) is a hard, vitreous amber kernel characterized by exceptional protein density, strong resilient gluten, and vibrant yellow carotenoid pigments. Sourced from optimal dryland farming belts, this durum grain delivers the highest semolina (Suji/Rawa) recovery and is globally prized for high-grade pasta, macaroni, couscous, and Mediterranean flatbread production.",
    image: "/images/products/attri-durum-wheat.jpg",
    themeColor: {
      primary: "#85581A",
      dark: "#4B300B",
      light: "#FDF6EB",
      accent: "#E5A93C",
      border: "#AC7527",
      badgeBg: "bg-yellow-950/90 text-yellow-100 border-yellow-800",
      badgeText: "text-yellow-800"
    },
    exportName: "Amber Durum Wheat / Durum Wheat",
    tradeAliases: [
      "Kathia Wheat",
      "Hard Vitreous Durum Grain",
      "Semolina / Suji Grade Wheat",
      "High-Protein Pasta Wheat (13.5%+ CP)"
    ],
    demandMarkets: [
      "Mediterranean & European Pasta & Macaroni Manufacturers",
      "North Africa (Couscous Mills)",
      "Middle East Semolina Extruders",
      "Domestic Indian Suji & Rawa Processing Plants"
    ],
    packSizes: ["50kg Export Woven Bags", "1 MT Jumbo Sacks", "Bulk Containerized Port Dispatch"],
    features: [
      "High Protein: 13.5% - 14.5%+ very high protein density",
      "Hard Grain Quality: Heavy vitreous endosperm with superior bulk density",
      "Strong Gluten: High wet gluten index providing firm al dente texture",
      "Rich in Carotenoids: Natural bright golden-amber pigment for appealing color",
      "Excellent Semolina Quality: Maximum recovery of coarse and fine Suji / Semolina",
      "Ideal for Pasta Production: Gold standard for macaroni, spaghetti, noodles & couscous"
    ],
    specifications: {
      origin: "Central & Western India (MP / Gujarat / Rajasthan)",
      grainType: "Hard Vitreous Amber Durum Kernel",
      aroma: "Rich Nutty Cereal Aroma",
      texture: "Very Hard, Translucent Vitreous Grain",
      cookingTime: "Semolina Milling & Pasta Processing",
      bestFor: ["Pasta, Macaroni & Spaghetti", "Suji & Rawa Extraction", "Couscous & Mediterranean Breads"]
    },
    cookingInstructions: [
      {
        step: 1,
        title: "Semolina Milling",
        desc: "Pass through break roller passes to extract bright yellow semolina (Suji) with minimal starch damage."
      }
    ],
    isPopular: false,
    isFeatured: true,
    enquiryEnabled: true
  }
];

export const PRODUCT_CATEGORIES = [
  "All",
  "Rice",
  "Animal Feed",
  "Beans and Pulses",
  "Wheat",
  "Wheat Flour"
] as const;

export const getProductBySlug = (slug: string): Product | undefined => {
  return PRODUCTS.find(p => p.slug === slug);
};

export const getRelatedProducts = (currentSlug: string, limit = 3): Product[] => {
  const current = PRODUCTS.find(p => p.slug === currentSlug || p.id === currentSlug);
  if (!current) return PRODUCTS.filter(p => p.slug !== currentSlug && p.id !== currentSlug).slice(0, limit);
  const sameCat = PRODUCTS.filter(
    p => p.slug !== current.slug && p.id !== current.id && p.category?.trim().toLowerCase() === current.category?.trim().toLowerCase()
  );
  return sameCat.length > 0 ? sameCat.slice(0, limit) : PRODUCTS.filter(p => p.slug !== current.slug && p.id !== current.id).slice(0, limit);
};
