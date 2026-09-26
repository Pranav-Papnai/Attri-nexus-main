import { FAQItem } from '@/types';
import { BUSINESS_CONFIG } from '@/constants/business';

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "Products",
    question: "What agricultural products does Attri Nexus supply?",
    answer: "Attri Nexus supplies five core agricultural commodity divisions: (1) Premium Rice (Aged Basmati, Sona Masoori, IR 64, Swarna, Ponni, Kolam, Jaya), (2) Animal & Livestock Feed (Soybean Meal DOC, Rapeseed Meal DOC, and Corn & Rice based DDGS), (3) Wheat (Sortex Whole Wheat Grains: Sharbati Wheat, Lokwan Wheat, Malviya Wheat, and Durum Wheat), (4) Wheat Flour (100% Stone-Ground MP Sharbati Chakki Atta), and (5) Beans & Pulses (Red Kidney Bean, Peas, Black-Eyed Bean, Chickpeas, Toor, Red Lentils, Black Matpe, and Green Mung Bean)."
  },
  {
    id: "faq-feed",
    category: "Products",
    question: "What are the specifications of Attri Animal Feed products (Soybean Meal, Rapeseed Meal & DDGS)?",
    answer: "Our animal feed range focuses on 6 key nutritional benchmarks: High Protein Content, Low Moisture, Low Fiber, Healthy Fat Content, Rich in Amino Acids, and Quality Heat Processing. We supply: (1) Soybean Meal (46–48%+ CP, rich in Lysine & Methionine), (2) Rapeseed Meal (36–38%+ CP, rich in sulphur amino acids), (3) Corn DDGS (27–28%+ CP, 8–10% healthy fat/corn oil), and (4) Rice DDGS (45–50%+ CP for high-protein poultry & aqua rations)."
  },
  {
    id: "faq-flour",
    category: "Products",
    question: "What makes Attri Pure Sharbati Chakki Atta special?",
    answer: "Our chakki atta is 100% stone-ground (cold milled) exclusively from authentic Madhya Pradesh Sharbati golden wheat. It contains zero Maida, zero chemical bleaching agents, and retains 100% natural wheat germ and dietary fiber (Choker) for exceptionally soft, naturally sweet rotis."
  },
  {
    id: "faq-pulses",
    category: "Products",
    question: "What products and quality benchmarks define Attri Beans & Pulses?",
    answer: "We supply 8 core commodities: Red Kidney Bean (Rajma), Dried Peas, Black-Eyed Bean (Lobia), Chickpeas (Kabuli), Toor (Arhar), Red Lentils (Masoor), Black Matpe (Urad), and Green Mung Bean. All items adhere to our 6 core benchmarks: High Protein, Rich in Fiber, Premium Quality, Sortex Cleaned, Low Moisture, and Uniform Size & Color. They are 100% unpolished with zero artificial polishing or chemical glazes."
  },
  {
    id: "faq-2",
    category: "Bulk & Business",
    question: "Do you supply bulk truckloads and containerized export consignments?",
    answer: "Yes, we specialize in bulk B2B trade, truckload dispatches, and containerized export shipments for grain mandis, dairy cooperatives, wholesale distributors, supermarket chains, feed mills, and international food importers."
  },
  {
    id: "faq-3",
    category: "General",
    question: "How can I request custom bulk pricing or product samples?",
    answer: `You can submit your requirements via our Bulk Enquiry form, contact our commercial sales team directly on WhatsApp at ${BUSINESS_CONFIG.phonePrimary}, or email us at ${BUSINESS_CONFIG.salesEmail} for customized price quotes and technical specification sheets.`
  },
  {
    id: "faq-5",
    category: "Packaging",
    question: "What packaging options and sizes do you offer across commodities?",
    answer: "We offer 10kg, 25kg, and 50kg multi-layer BOPP, woven HDPE, and traditional jute bags. For industrial feed and bulk grain traders, we also supply bulk loose truckloads and 1-ton jumbo bags with customized private branding on request."
  },
  {
    id: "faq-7",
    category: "Quality & Storage",
    question: "How are products tested and stored before dispatch?",
    answer: "Every lot is laboratory tested for moisture percentage, grain purity, protein content, and aflatoxin levels. Consignments are stored in hygienic, pest-controlled, palletized warehouses to guarantee peak freshness."
  }
];

export const FAQ_CATEGORIES = [
  "All",
  "Products",
  "Bulk & Business",
  "Quality & Storage",
  "Packaging",
  "General"
] as const;
