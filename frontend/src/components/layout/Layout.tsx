import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppFloatingBtn } from './WhatsAppFloatingBtn';
import { MobileActionBar } from './MobileActionBar';
import { ModalEnquiry } from '../ui/ModalEnquiry';

export const Layout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6F8] text-[#1A1D23] font-sans selection:bg-[#1B2A4A] selection:text-white pb-20 sm:pb-24 lg:pb-0 w-full max-w-full overflow-x-hidden">
      {/* Skip link: visually hidden until focused, lets keyboard users bypass the nav (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 pt-18 sm:pt-20 outline-none">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatingBtn />
      <MobileActionBar />
      <ModalEnquiry />
    </div>
  );
};
