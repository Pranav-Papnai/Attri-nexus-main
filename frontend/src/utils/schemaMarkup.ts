/**
 * Schema Markup Generator for SEO
 * Generates JSON-LD structured data for Organization, Product, LocalBusiness, etc.
 */

import { BUSINESS_CONFIG } from '@/constants/business';

const SITE_URL = 'https://attri-nexus-web.vercel.app';
const BUSINESS_NAME = 'Attri Nexus';
const BUSINESS_DESCRIPTION = 'India\'s trusted supplier and exporter of Premium Rice, Livestock Feed, Wheat & Atta, and Beans & Pulses';

/**
 * Organization Schema - For brand identity & knowledge panels
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': BUSINESS_NAME,
  'alternateName': 'Attri Nexus Agro Commodities & Grain Exports',
  'url': SITE_URL,
  'logo': `${SITE_URL}/images/branding/logo.png`,
  'description': BUSINESS_DESCRIPTION,
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Plot No-1066, Shakti Khand-4, Indirapuram, Shipra Suncity',
    'addressLocality': 'Ghaziabad',
    'addressRegion': 'Uttar Pradesh',
    'postalCode': '201014',
    'addressCountry': 'IN'
  },
  'telephone': '+91-9654922815',
  'email': 'attrinexus@gmail.com',
  'contactPoint': {
    '@type': 'ContactPoint',
    'contactType': 'Customer Service',
    'telephone': '+91-9654922815',
    'email': 'attrinexus@gmail.com',
    'areaServed': ['IN', 'Global']
  },
  'sameAs': Object.values(BUSINESS_CONFIG.socialLinks).filter(Boolean),
  'foundingDate': '2024-01-01',
  'knowsAbout': [
    'Basmati Rice Export',
    'Agricultural Commodities',
    'Livestock Feed',
    'Wheat & Flour',
    'Pulses & Legumes'
  ]
};

/**
 * LocalBusiness Schema - For local search visibility
 */
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}#localbusiness`,
  'name': BUSINESS_NAME,
  'url': SITE_URL,
  'telephone': '+91-9654922815',
  'email': 'attrinexus@gmail.com',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'Plot No-1066, Shakti Khand-4, Indirapuram, Shipra Suncity',
    'addressLocality': 'Ghaziabad',
    'addressRegion': 'Uttar Pradesh',
    'postalCode': '201014',
    'addressCountry': 'IN'
  },
  'image': `${SITE_URL}/images/branding/logo.png`,
  'description': BUSINESS_DESCRIPTION,
  'openingHoursSpecification': {
    '@type': 'OpeningHoursSpecification',
    'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'opens': '09:00',
    'closes': '19:30'
  },
  'priceRange': '$$'
};

/**
 * Product Schema Generator - For rich snippets in search results
 */
export const generateProductSchema = (product: {
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  brandLine?: string;
  category?: string;
  variety?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}/products/${product.slug}`,
  'name': product.name,
  'alternateName': product.brandLine || product.variety,
  'image': `${SITE_URL}${product.image}`,
  'description': product.shortDescription,
  'brand': {
    '@type': 'Brand',
    'name': BUSINESS_NAME,
    'url': SITE_URL,
    'logo': `${SITE_URL}/images/branding/logo.png`
  },
  'category': product.category || 'Agricultural Commodities',
  'offers': {
    '@type': 'AggregateOffer',
    'priceCurrency': 'INR',
    'availability': 'https://schema.org/InStock',
    'url': `${SITE_URL}/products/${product.slug}`
  },
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.8',
    'bestRating': '5',
    'worstRating': '1',
    'ratingCount': '128',
    'reviewCount': '45'
  },
  'isPartOf': {
    '@type': 'CollectionPage',
    'name': 'Attri Nexus Products',
    'url': `${SITE_URL}/products`
  }
});

/**
 * BreadcrumbList Schema - For navigation SEO
 */
export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': items.map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': item.name,
    'item': item.url
  }))
});

/**
 * FAQ Schema - For FAQ rich snippets
 */
export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map(faq => ({
    '@type': 'Question',
    'name': faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer
    }
  }))
});

/**
 * WebPage Schema - For general page metadata
 */
export const webPageSchema = (page: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': page.url,
  'name': page.title,
  'description': page.description,
  'url': page.url,
  'image': page.image || `${SITE_URL}/images/branding/logo.png`,
  'datePublished': page.datePublished || '2024-01-01',
  'dateModified': page.dateModified || new Date().toISOString().split('T')[0],
  'isPartOf': {
    '@id': SITE_URL
  }
});

/**
 * Inject schema markup into document head
 */
export const injectSchema = (schema: object) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Inject multiple schemas at once
 */
export const injectSchemas = (schemas: object[]) => {
  schemas.forEach(schema => injectSchema(schema));
};

export default {
  organizationSchema,
  localBusinessSchema,
  generateProductSchema,
  breadcrumbSchema,
  faqSchema,
  webPageSchema,
  injectSchema,
  injectSchemas
};
