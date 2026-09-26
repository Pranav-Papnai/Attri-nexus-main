import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  Wheat,
  Layers,
  Boxes,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BUSINESS_CONFIG } from '@/constants/business';
import { useEnquiryModal } from '../../context/EnquiryModalContext';

interface ProductCategoryItem {
  name: string;
  href: string;
  tagline: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}


const PRODUCT_DROPDOWN_ITEMS: ProductCategoryItem[] = [
  {
    name: "Rice",
    href: "/products?category=Rice",
    tagline: "Basmati, Sona Masoori & Long Grain",
    badge: "Premium Aged",
    icon: Wheat,
  },
  {
    name: "Animal Feed",
    href: "/products?category=Animal+Feed",
    tagline: "Soybean Meal, Rapeseed Meal & DDGS",
    badge: "High Protein",
    icon: Boxes,
  },
  {
    name: "Beans and Pulses",
    href: "/products?category=Beans+and+Pulses",
    tagline: "Kidney Beans, Peas, Chickpeas & Dals",
    badge: "Sortex Clean",
    icon: Layers,
  },
  {
    name: "Wheat",
    href: "/products?category=Wheat",
    tagline: "Sharbati, Lokwan, Malviya & Durum",
    badge: "4 Varieties",
    icon: Wheat,
  },
  {
    name: "Wheat Flour",
    href: "/products?category=Wheat+Flour",
    tagline: "100% Stone-Ground Chakki Atta",
    badge: "Stone Ground",
    icon: Wheat,
  },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(true);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const location = useLocation();
  const { openEnquiryModal } = useEnquiryModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setProductsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setProductsDropdownOpen(false);
    }, 180);
  };

  // Keyboard parity for the hover menu: Escape closes it and returns focus
  // to the trigger; tabbing out of the panel closes it too (WCAG 2.1.1).
  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && productsDropdownOpen) {
      e.preventDefault();
      setProductsDropdownOpen(false);
      dropdownRef.current?.querySelector('button')?.focus();
    }
  };

  const handleDropdownBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!dropdownRef.current?.contains(e.relatedTarget as Node | null)) {
      setProductsDropdownOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products", isDropdown: true },
    { name: "Quality", href: "/quality" },
    { name: "Why Us", href: "/why-us" },
    { name: "Bulk Enquiry", href: "/bulk-enquiry" },
    { name: "Gallery", href: "/gallery" },
  ];

  const isProductsActive = location.pathname.startsWith('/products');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-200/80 ${
          isScrolled ? 'py-3 shadow-sm' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            
            {/* Left: Brand Logo & Title */}
            <Link 
              to="/" 
              className="flex items-center space-x-2.5 sm:space-x-3.5 group focus:outline-none shrink-0 min-w-0"
              aria-label="Attri Nexus Home"
            >
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full overflow-hidden flex items-center justify-center border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-200 bg-white p-0.5 shrink-0">
                <img
                  src={BUSINESS_CONFIG.logo}
                  alt="Attri Nexus Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-lg sm:text-2xl tracking-tight text-slate-900 group-hover:text-[#B22234] transition-colors leading-none font-serif">
                  ATTRI NEXUS
                </span>
                <span className="text-[9px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-500 mt-0.5 sm:mt-1 truncate max-w-[140px] sm:max-w-none">
                  Agro Commodities & Exports
                </span>
              </div>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                if (link.isDropdown) {
                  return (
                    <div
                      key={link.name}
                      ref={dropdownRef}
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onKeyDown={handleDropdownKeyDown}
                      onBlur={handleDropdownBlur}
                    >
                      <button
                        type="button"
                        onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                        className={`inline-flex items-center px-4 py-2.5 text-[15px] xl:text-base font-semibold transition-colors cursor-pointer relative group rounded-xl ${
                          isProductsActive || productsDropdownOpen
                            ? 'text-[#B22234] font-bold bg-rose-50/70'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
                        }`}
                        aria-expanded={productsDropdownOpen}
                        aria-haspopup="true"
                        aria-controls="products-menu"
                      >
                        <span>{link.name}</span>
                        <ChevronDown 
                          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                            productsDropdownOpen ? 'rotate-180 text-[#B22234]' : 'text-slate-500 group-hover:text-slate-700'
                          }`} 
                        />
                      </button>

                      {/* Dropdown Menu Panel with Motion */}
                      <AnimatePresence>
                        {productsDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            id="products-menu"
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 origin-top"
                          >
                            <div className="space-y-0.5">
                              {PRODUCT_DROPDOWN_ITEMS.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                  <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setProductsDropdownOpen(false)}
                                    className="flex items-center p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                                  >
                                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-[#B22234]/10 group-hover:text-[#B22234] transition-colors mr-3 shrink-0">
                                      <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm font-semibold text-slate-900 group-hover:text-[#B22234] transition-colors block truncate">
                                        {item.name}
                                      </span>
                                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                        {item.tagline}
                                      </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 ml-1 text-slate-300 group-hover:text-[#B22234] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
                                  </Link>
                                );
                              })}
                            </div>

                            {/* Quick CTA Bottom */}
                            <div className="mt-1 pt-2 border-t border-slate-100 px-2.5 py-1.5 flex items-center justify-between text-xs text-slate-500 bg-slate-50 rounded-xl">
                              <span>Institutional supply</span>
                              <Link
                                to="/bulk-enquiry"
                                onClick={() => setProductsDropdownOpen(false)}
                                className="font-semibold text-[#B22234] hover:text-[#931B2A] flex items-center"
                              >
                                <span>Bulk Quote</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }


                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`px-4 py-2.5 text-[15px] xl:text-base transition-colors rounded-xl ${
                      isActive
                        ? 'text-[#B22234] font-bold bg-rose-50/70'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 font-semibold'
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Action Button Desktop */}
            <div className="hidden lg:flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-200" />
                <span>Enquire Now</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 lg:hidden shrink-0">
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="hidden sm:inline-flex px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#B22234] text-white text-xs font-semibold uppercase tracking-wider shadow-sm mr-1 cursor-pointer"
              >
                Enquire
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-800 hover:bg-slate-100 focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop with Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 w-full max-w-[290px] sm:max-w-xs bg-white shadow-2xl p-4 sm:p-6 flex flex-col justify-between overflow-y-auto border-l border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Drawer Top Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-white p-0.5">
                      <img
                        src={BUSINESS_CONFIG.logo}
                        alt="Attri Nexus Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-bold text-base text-slate-900">
                      ATTRI NEXUS
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Links */}
                <nav className="mt-5 space-y-1.5">
                  {navLinks.map((link) => {
                    if (link.isDropdown) {
                      return (
                        <div key={link.name} className="space-y-1">
                          <div className="flex items-center justify-between rounded-xl px-4 py-3 bg-slate-50 border border-slate-200/80">
                            <Link
                              to={link.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`text-sm font-bold ${
                                isProductsActive ? 'text-[#B22234]' : 'text-slate-900'
                              }`}
                            >
                              {link.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                              className="p-1.5 text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
                              aria-label="Toggle Products Submenu"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  mobileProductsOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          </div>

                          {/* Mobile Accordion Submenu */}
                          {mobileProductsOpen && (
                            <div className="pl-2 pr-1 py-1 space-y-1 bg-slate-50/70 rounded-xl border border-slate-100">
                              <Link
                                to="/products"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold text-slate-900 hover:bg-slate-100"
                              >
                                <span>All Commodities (Full Catalogue)</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                              </Link>
                              {PRODUCT_DROPDOWN_ITEMS.map((sub) => {
                                const IconComponent = sub.icon;
                                const isSubActive = location.search.includes(encodeURIComponent(sub.name)) || location.search.includes(sub.name.replace(/ /g, '+'));
                                return (
                                  <Link
                                    key={sub.name}
                                    to={sub.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs transition-colors ${
                                      isSubActive
                                        ? 'bg-[#B22234]/10 text-[#B22234] font-bold'
                                        : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2.5 truncate">
                                      <IconComponent className="w-4 h-4 text-slate-500 shrink-0" />
                                      <span className="truncate font-medium">{sub.name}</span>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    const isActive = location.pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-rose-50 text-[#B22234] font-bold border border-rose-100'
                            : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-5 border-t border-slate-100 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openEnquiryModal();
                  }}
                  className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl bg-[#B22234] text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer hover:bg-[#931B2A] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-200" />
                  <span>Enquire Now</span>
                </button>

                <div className="text-center text-xs text-slate-500 space-y-0.5">
                  <p>Helpline: <a href={`tel:${BUSINESS_CONFIG.phonePrimary.replace(/\s+/g, '')}`} className="font-semibold text-slate-800">{BUSINESS_CONFIG.phonePrimary}</a></p>
                  <p>{BUSINESS_CONFIG.email}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
