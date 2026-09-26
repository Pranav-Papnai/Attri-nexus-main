import { BusinessConfig } from '@/types';

/**
 * ATTRI NEXUS — Central Business Configuration
 * Edit company contact details, address, social links, and phone numbers in this single file.
 */
export const BUSINESS_CONFIG: BusinessConfig = {
  brandName: "Attri Nexus",
  legalEntityName: "Attri Nexus Agro Commodities & Grain Exports",
  tagline: "PURE COMMODITIES. EXCEPTIONAL QUALITY.",
  subTagline: "India's trusted exporter & supplier of Premium Rice, Livestock Animal Feed, Pure Wheat & Chakki Atta, and Nutritious Beans & Pulses.",
  logo: "/images/branding/logo.png",
  
  // Direct packaging numbers from official bag prints
  phonePrimary: "+91 9654922815",
  phoneSecondary: "+91 5884922015",
  
  // WhatsApp Configuration (Digits only with country code for api.whatsapp.com)
  whatsappNumber: "+919654922815",
  whatsappDefaultMessage: "Hello Attri Nexus, I would like to enquire about your agro commodities (Rice, Animal Feed, Wheat & Flour, Beans & Pulses).",

  // Business Emails
  email: "akashiseijuro1b@gmail.com",
  salesEmail: "akashiseijuro1b@gmail.com",

  // Business Address
  address: {
    line1: "Attri Nexus Corporate Office",
    area: "Agro Commerce Zone",
    city: "New Delhi / NCR",
    state: "Delhi",
    country: "India",
    pincode: "110001"
  },

  // Operational Hours
  businessHours: "Monday – Saturday: 9:00 AM – 7:30 PM (IST)",

  // Social Links
  socialLinks: {
    instagram: "https://instagram.com/attrinexus",
    facebook: "https://facebook.com/attrinexus",
    linkedin: "https://linkedin.com/company/attrinexus",
    youtube: "https://youtube.com/@attrinexus"
  }
};

export const getWhatsAppLink = (customText?: string) => {
  const message = encodeURIComponent(customText || BUSINESS_CONFIG.whatsappDefaultMessage);
  const cleanNumber = BUSINESS_CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${message}`;
};

export const getPhoneLink = (phoneNumber?: string) => {
  const number = phoneNumber || BUSINESS_CONFIG.phonePrimary;
  return `tel:${number.replace(/\s+/g, '')}`;
};
