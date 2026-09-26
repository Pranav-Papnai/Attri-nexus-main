import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';

const CART_STORAGE_KEY = 'attri_nexus_cart';

const lineKey = (productId: string, packSize: string) => `${productId}__${packSize}`;

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string, packSize: string) => void;
  updateQuantity: (productId: string, packSize: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable — cart just won't persist across reloads
    }
  }, [items]);

  const addToCart: CartContextType['addToCart'] = (item, quantity = 1) => {
    setItems((prev) => {
      const key = lineKey(item.productId, item.packSize);
      const existing = prev.find((p) => lineKey(p.productId, p.packSize) === key);
      if (existing) {
        return prev.map((p) =>
          lineKey(p.productId, p.packSize) === key ? { ...p, quantity: p.quantity + quantity } : p
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, packSize: string) => {
    setItems((prev) => prev.filter((p) => lineKey(p.productId, p.packSize) !== lineKey(productId, packSize)));
  };

  const updateQuantity = (productId: string, packSize: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, packSize);
      return;
    }
    setItems((prev) =>
      prev.map((p) => (lineKey(p.productId, p.packSize) === lineKey(productId, packSize) ? { ...p, quantity } : p))
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
