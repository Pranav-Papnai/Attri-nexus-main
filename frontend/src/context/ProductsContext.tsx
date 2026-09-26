import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Product } from '../types';
import { getProductsFromDb } from '@/services/api/backend';
import { PRODUCTS as STATIC_PRODUCTS_FALLBACK } from '@/constants/products';

interface ProductsContextType {
  // Active products only — every public-facing page should read from this.
  products: Product[];
  isLoading: boolean;
  refresh: () => void;
  getBySlug: (slug: string) => Product | undefined;
  getRelated: (slug: string, limit?: number) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// In-flight request deduplication memo
let inFlightProductsPromise: Promise<Product[]> | null = null;

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Seeded with the bundled static catalog so the first paint (and any page
  // load before the API fetch resolves) still has products to show.
  const [allProducts, setAllProducts] = useState<Product[]>(STATIC_PRODUCTS_FALLBACK);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    if (!inFlightProductsPromise) {
      inFlightProductsPromise = getProductsFromDb().finally(() => {
        inFlightProductsPromise = null;
      });
    }

    inFlightProductsPromise
      .then((prods) => {
        if (prods && prods.length > 0) {
          const cleanProds = prods
            .filter(
              (p) =>
                p.id !== 'attri-nutricattle-feed' &&
                p.id !== 'attri-de-oiled-rice-bran' &&
                !p.id.includes('idea1') &&
                !p.slug.includes('idea1')
            )
            .map((p) => {
              if (p.id === 'attri-soybean-meal') {
                const staticBase = STATIC_PRODUCTS_FALLBACK.find((s) => s.id === p.id);
                if (staticBase) {
                  return {
                    ...p,
                    name: staticBase.name,
                    variety: staticBase.variety,
                    shortDescription: staticBase.shortDescription,
                    fullDescription: staticBase.fullDescription,
                    processingTypes: staticBase.processingTypes
                  };
                }
              }
              return p;
            });
          setAllProducts(cleanProds);
        } else {
          setAllProducts(STATIC_PRODUCTS_FALLBACK);
        }
      })
      .catch(() => {
        setAllProducts(STATIC_PRODUCTS_FALLBACK);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // The public site must never show a product an admin has marked inactive.
  const products = allProducts.filter((p) => p.isActive !== false);

  const getBySlug = (slug: string) => {
    if (!slug) return undefined;
    const clean = slug.trim().toLowerCase();
    
    // 1. Direct match on slug or id
    let found = products.find((p) => (p.slug && p.slug.toLowerCase() === clean) || (p.id && p.id.toLowerCase() === clean));
    if (found) return found;

    // 2. Normalized alphanumeric match (handles slug variations)
    const cleanNorm = clean.replace(/[^a-z0-9]/g, '');
    found = products.find((p) => {
      const pSlug = (p.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const pId = (p.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return (pSlug && pSlug === cleanNorm) || (pId && pId === cleanNorm);
    });
    if (found) return found;

    // 3. Name match fallback
    found = products.find((p) => p.name && p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanNorm);
    if (found) return found;

    // 4. Fallback: check static catalog if DB is still syncing
    found = STATIC_PRODUCTS_FALLBACK.find((p) => 
      (p.slug && p.slug.toLowerCase() === clean) || 
      (p.id && p.id.toLowerCase() === clean) ||
      (p.slug && p.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanNorm) ||
      (p.id && p.id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanNorm)
    );

    return found;
  };
  const getRelated = (slug: string, limit = 3) => {
    const current = getBySlug(slug);
    if (!current) {
      return products.filter((p) => p.slug !== slug && p.id !== slug).slice(0, limit);
    }
    const sameCategory = products.filter(
      (p) =>
        p.slug !== current.slug &&
        p.id !== current.id &&
        p.category?.trim().toLowerCase() === current.category?.trim().toLowerCase()
    );
    if (sameCategory.length > 0) {
      return sameCategory.slice(0, limit);
    }
    return products.filter((p) => p.slug !== current.slug && p.id !== current.id).slice(0, limit);
  };

  return (
    <ProductsContext.Provider value={{ products, isLoading, refresh: load, getBySlug, getRelated }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
};
