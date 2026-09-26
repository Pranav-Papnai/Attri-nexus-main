import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EnquiryModalProvider } from './context/EnquiryModalContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ProductsProvider } from './context/ProductsContext';
import { CartProvider } from './context/CartContext';
import { Preloader } from './components/ui/Preloader';
import { AppRoutes } from './routes';
import Lenis from 'lenis';

export function App() {
  useEffect(() => {
    // Initialize buttery smooth momentum scrolling with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.5,
      infinite: false,
    });

    (window as any).lenis = lenis;

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  return (
    <AdminAuthProvider>
      <ProductsProvider>
      <CartProvider>
      <EnquiryModalProvider>
        <Preloader />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </EnquiryModalProvider>
      </CartProvider>
      </ProductsProvider>
    </AdminAuthProvider>
  );
}

export default App;
