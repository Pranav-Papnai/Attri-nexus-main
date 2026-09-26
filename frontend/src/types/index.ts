export interface Product {
  id: string;
  name: string;
  slug: string;
  brandLine: string;
  variety: string;
  category: 'Basmati' | 'Sona Masoori' | 'Non-Basmati' | 'Rice' | 'Animal Feed' | 'Beans and Pulses' | 'Wheat' | 'Wheat Flour' | 'Wheat and Wheat Flour' | 'Premium' | 'Everyday' | 'Bulk / Commercial' | string;
  subCategory?: 'Basmati' | 'Non-Basmati' | string;
  processingTypes?: ('Creamy Sella' | 'Golden Sella' | 'Steamed' | string)[];
  shortDescription: string;
  fullDescription: string;
  image: string;
  themeColor: {
    primary: string;
    dark: string;
    light: string;
    accent: string;
    border: string;
    badgeBg: string;
    badgeText: string;
  };
  packSizes: string[];
  features: string[];
  exportName?: string;
  tradeAliases?: string[];
  demandMarkets?: string[];
  specifications: {
    origin: string;
    grainType: string;
    aroma: string;
    texture: string;
    elongation?: string;
    cookingTime: string;
    bestFor: string[];
  };
  cookingInstructions: {
    step: number;
    title: string;
    desc: string;
  }[];
  isPopular?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  enquiryEnabled: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  variety: string;
  processingType?: string;
  image: string;
  packSize: string;
  quantity: number;
}

export interface BusinessConfig {
  brandName: string;
  legalEntityName?: string;
  tagline: string;
  subTagline: string;
  logo: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  email: string;
  salesEmail: string;
  address: {
    line1: string;
    area: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  businessHours: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    linkedin: string;
    youtube: string;
  };
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  highlights: string[];
  icon: string;
}

export interface WhyUsPillar {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  keyPoints: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Products' | 'Bulk & Business' | 'Quality & Storage' | 'Packaging';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Products' | 'Packaging' | 'Grain Quality' | 'Culinary';
  image: string;
  description: string;
  tag?: string;
}

export interface BusinessEnquiryFormState {
  fullName: string;
  companyName: string;
  mobileNumber: string;
  email: string;
  city: string;
  state: string;
  businessType: string;
  productInterested: string;
  estimatedQuantity: string;
  preferredPackSize: string;
  message: string;
}
