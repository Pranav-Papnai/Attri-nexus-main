import { useEffect } from 'react';
import { generateProductSchema, breadcrumbSchema, faqSchema } from '@/utils/schemaMarkup';

const SITE_URL = 'https://attri-nexus-web.vercel.app';

/**
 * Hook to inject JSON-LD schema markups into the page
 * Useful for Product pages, Detail pages, etc.
 */
export const useSchemaMarkup = (schema: object) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    // Cleanup: remove the script when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, [schema]);
};

/**
 * Hook to inject Product schema for product pages
 */
export const useProductSchema = (product: {
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  brandLine?: string;
  category?: string;
  variety?: string;
}) => {
  const schema = generateProductSchema(product);
  useSchemaMarkup(schema);
};

/**
 * Hook to inject Breadcrumb schema for navigation
 */
export const useBreadcrumbSchema = (path: Array<{ name: string; slug: string }>) => {
  const breadcrumbs = [
    { name: 'Home', url: SITE_URL },
    ...path.map(item => ({
      name: item.name,
      url: `${SITE_URL}/${item.slug}`
    }))
  ];

  const schema = breadcrumbSchema(breadcrumbs);
  useSchemaMarkup(schema);
};

/**
 * Hook to inject FAQ schema for FAQ pages
 */
export const useFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  const schema = faqSchema(faqs);
  useSchemaMarkup(schema);
};

/**
 * Hook to set page meta tags (title, description) for SEO
 */
export const usePageMeta = (config: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}) => {
  useEffect(() => {
    // Set page title
    document.title = config.title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      let element = document.querySelector(
        isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
      ) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        isProperty ? element.setAttribute('property', name) : element.setAttribute('name', name);
        document.head.appendChild(element);
      }

      element.content = content;
    };

    // Update standard meta tags
    updateMetaTag('title', config.title);
    updateMetaTag('description', config.description);
    if (config.keywords) {
      updateMetaTag('keywords', config.keywords);
    }

    // Update OG tags
    updateMetaTag('og:title', config.title, true);
    updateMetaTag('og:description', config.description, true);
    if (config.image) {
      updateMetaTag('og:image', config.image, true);
    }
    if (config.url) {
      updateMetaTag('og:url', config.url, true);
    }

    // Update Twitter tags
    updateMetaTag('twitter:title', config.title, true);
    updateMetaTag('twitter:description', config.description, true);
    if (config.image) {
      updateMetaTag('twitter:image', config.image, true);
    }

    // Cleanup: restore original title on unmount
    return () => {
      document.title = 'Attri Nexus | Premium Agro Commodities & Trade Platform';
    };
  }, [config]);
};

/**
 * Hook to update canonical URL for duplicate content prevention
 */
export const useCanonicalURL = (url: string) => {
  useEffect(() => {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }

    canonical.href = url;

    return () => {
      if (canonical.parentNode) {
        canonical.parentNode.removeChild(canonical);
      }
    };
  }, [url]);
};

export default {
  useSchemaMarkup,
  useProductSchema,
  useBreadcrumbSchema,
  useFAQSchema,
  usePageMeta,
  useCanonicalURL
};
