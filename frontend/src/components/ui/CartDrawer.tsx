import React, { useRef } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getWhatsAppLink } from '@/constants/business';
import { WhatsAppIcon } from './WhatsAppIcon';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, isCartOpen);

  // Escape closes the drawer, matching the other dialogs.
  React.useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartOpen, closeCart]);

  // Lock background body scroll and stop Lenis when cart drawer is open
  React.useEffect(() => {
    if (!isCartOpen) return;

    const lenisInstance = (window as any).lenis;
    if (lenisInstance) {
      lenisInstance.stop();
    }

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      if (lenisInstance) {
        lenisInstance.start();
      }
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const buildOrderMessage = () => {
    const lines = items.map(
      (item, idx) => `${idx + 1}. ${item.productName} (${item.variety}) — ${item.packSize} x ${item.quantity}`
    );
    return `Hello Attri Nexus, I would like to place an order for:\n\n${lines.join('\n')}\n\nPlease share pricing and next steps.`;
  };

  return (
    <div
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-fade-in overscroll-contain overflow-hidden"
      onClick={closeCart}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-[#F5F6F8] shadow-2xl flex flex-col border-l border-[#E2E5EA] overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-[#E2E5EA]">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="w-5 h-5 text-[#1B2A4A]" />
            <h2 id="cart-title" className="font-serif font-bold text-lg text-[#1A1D23]">
              Your Cart {items.length > 0 && <span className="text-sm font-sans font-medium text-[#5A6170]">({items.length})</span>}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg text-[#5A6170] hover:text-gray-800 hover:bg-[#F0F2F5] transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F0F2F5] text-[#1B2A4A] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="font-serif font-bold text-[#1A1D23] text-lg">Your cart is empty</p>
                <p className="text-sm text-[#5A6170] mt-1">Add rice varieties to build your order.</p>
              </div>
              <Link
                to="/products"
                onClick={closeCart}
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-[#B22234] hover:bg-[#9A1D2C] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}__${item.packSize}`}
                className="flex items-start space-x-3.5 bg-white p-3.5 rounded-2xl border border-[#E2E5EA] shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl bg-[#FAF8F5] border border-[#E8E2D6] flex items-center justify-center flex-shrink-0 p-1.5 overflow-hidden">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-sm text-[#1A1D23] truncate">{item.productName}</h3>
                  <p className="text-xs text-[#5A6170] truncate">{item.variety}</p>
                  <p className="text-[11px] font-semibold text-[#1B2A4A] mt-1">{item.packSize}</p>

                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-[#E2E5EA] rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.packSize, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#5A6170] hover:bg-[#F0F2F5] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#1A1D23]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.packSize, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#5A6170] hover:bg-[#F0F2F5] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId, item.packSize)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 sm:px-6 py-5 border-t border-[#E2E5EA] space-y-3">
            <a
              href={getWhatsAppLink(buildOrderMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl bg-[#0E7466] hover:bg-[#075E54] text-white text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 mr-2 fill-white" />
              <span>Place Order via WhatsApp</span>
            </a>
            <button
              onClick={clearCart}
              className="w-full text-center text-xs text-[#5A6170] hover:text-rose-600 font-semibold transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
