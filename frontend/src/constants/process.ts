import { ProcessStep } from '@/types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    stepNumber: "01",
    title: "Direct Farm & Mandi Sourcing",
    shortDesc: "Carefully selected raw commodities from prime agricultural belts.",
    fullDesc: "Our supply chain begins at prime Indian agricultural hubs. We carefully inspect raw paddy, Sharbati wheat, whole pulses, and feed grains for moisture balance, purity, and grade before procurement.",
    highlights: [
      "Origin-verified direct procurement",
      "Moisture, protein & purity laboratory tests",
      "Zero tolerance for low-grade adulterants"
    ],
    icon: "Wheat"
  },
  {
    stepNumber: "02",
    title: "Milling, Compounding & Cold Grinding",
    shortDesc: "Specialized processing lines for Rice, Feed, Atta & Pulses.",
    fullDesc: "Rice undergoes multi-stage destoning and gentle polishing; Sharbati wheat is traditional stone-ground (cold milled); pulses are de-husked without polish; and cattle feed is precision compounded and pelletized.",
    highlights: [
      "Dedicated state-of-the-art processing lines",
      "Traditional cold stone-milling for Chakki Atta",
      "Steam sterilization for Rice Bran DOC & Feed Pellets"
    ],
    icon: "Cog"
  },
  {
    stepNumber: "03",
    title: "Optical Laser Sorting & Quality Testing",
    shortDesc: "Stringent optical sorting and nutritional batch analysis.",
    fullDesc: "Every production batch passes through high-precision optical color sorting and laboratory testing to guarantee uniform grain length, absence of impurities, and accurate nutritional values (Protein/SNF).",
    highlights: [
      "Advanced Japanese optical camera sorting",
      "Batch-tested nutritional & aflatoxin parameters",
      "Zero unpolished grain/pulse discoloration"
    ],
    icon: "ShieldCheck"
  },
  {
    stepNumber: "04",
    title: "Tamper-Evident & Moisture-Lock Packaging",
    shortDesc: "Durable food-grade and heavy-duty commercial bags.",
    fullDesc: "Products are weighed and packed into multi-layer BOPP, woven HDPE, and breathable food-grade bags that seal in natural aroma, protect from moisture, and withstand long-haul cargo transport.",
    highlights: [
      "Moisture-barrier multi-layer BOPP & HDPE bags",
      "Accurate automated computerized bag weighing",
      "Clear batch numbering, barcode & export labels"
    ],
    icon: "PackageCheck"
  },
  {
    stepNumber: "05",
    title: "Prompt Dispatch & Trade Distribution",
    shortDesc: "Efficient logistics across domestic mandis and international ports.",
    fullDesc: "Stored on sanitary pallets in climate-controlled warehouses, our consignments are dispatched on dedicated trucks and containerized vessels for on-time delivery to distributors, mills, and global buyers.",
    highlights: [
      "Palletized, rodent-free warehouse storage",
      "Full container load (FCL) & truckload dispatch",
      "End-to-end consignment tracking and dispatch support"
    ],
    icon: "Truck"
  }
];
