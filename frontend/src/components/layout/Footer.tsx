import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_CONFIG } from '@/constants/business';
import { Sparkles, ArrowRight, ShieldCheck, Award, FileCheck2, Globe2, Scale } from 'lucide-react';
import { useEnquiryModal } from '../../context/EnquiryModalContext';

// Clean SVG Icons for Social Channels
const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const { openEnquiryModal } = useEnquiryModal();

  return (
    <footer className="bg-[#0B132B] text-slate-300 border-t border-slate-800 relative overflow-hidden">
      
      {/* Top Value Banner */}
      <div className="border-b border-slate-800/80 py-8 sm:py-10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
            <div className="space-y-1">
              <span className="text-amber-400 text-[11px] uppercase tracking-[0.16em] font-bold flex items-center justify-center lg:justify-start space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Commercial & Institutional Procurement Desk</span>
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                Partner with Attri Nexus for Premium Agro Commodities
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-light">
                Supplying aged Basmati & non-basmati rice, high-protein Soybean & Rapeseed meals and DDGS, cold stone-ground wheat flour, and unpolished desi pulses with verified laboratory purity.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="px-5 sm:px-6 py-3 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer text-center"
              >
                Submit Trade Enquiry
              </button>
              <Link
                to="/contact"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-colors text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10">
          
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm flex items-center justify-center bg-white p-0.5">
                <img
                  src={BUSINESS_CONFIG.logo}
                  alt="Attri Nexus Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg tracking-tight text-white">
                  ATTRI NEXUS
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-amber-300/90 font-semibold">
                  {BUSINESS_CONFIG.tagline}
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-4 font-light">
              Dedicated to sourcing, processing, and supplying premium Indian Rice, Livestock Feed, Whole Wheat Grains, Stone-Ground Wheat Flour, and Unpolished Pulses. Committed to certified lab purity and lasting institutional trade partnerships.
            </p>
            <div className="pt-2 flex items-center space-x-2.5">
              <a
                href={BUSINESS_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={BUSINESS_CONFIG.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href={BUSINESS_CONFIG.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </a>
              <a
                href={BUSINESS_CONFIG.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon />
              </a>
            </div>

            {/* Global Group Ecosystem & Counsel */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <span className="block text-[10px] uppercase tracking-[0.14em] text-slate-500 font-semibold mb-1.5">
                Group Ecosystem & Counsel
              </span>
              <a
                href="https://vsasl.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-xs text-slate-300 hover:text-amber-300 transition-all group/link"
              >
                <Globe2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-medium">Group Affiliate: VSASL (Myanmar)</span>
                <span className="text-[10px] text-amber-400/80 group-hover/link:text-amber-300 transition-transform group-hover/link:translate-x-0.5 ml-auto">↗</span>
              </a>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                <Scale className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-medium">Legal Counsel: Vardaan’s Law & Associates</span>
              </div>
            </div>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] font-bold text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-light">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us & Heritage
                </Link>
              </li>
              <li>
                <Link to="/why-us" className="hover:text-white transition-colors">
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link to="/quality" className="hover:text-white transition-colors">
                  Quality & Processing
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition-colors">
                  Facilities Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Commodities */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] font-bold text-white mb-4">
              Core Range
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-light">
              <li>
                <Link to="/products?category=Rice" className="hover:text-white transition-colors">
                  Rice Varieties
                </Link>
              </li>
              <li>
                <Link to="/products?category=Animal+Feed" className="hover:text-white transition-colors">
                  Animal Feed (Soy, Rapeseed & DDGS)
                </Link>
              </li>
              <li>
                <Link to="/products?category=Wheat" className="hover:text-white transition-colors">
                  Wheat Grains (Sharbati, Lokwan, Malviya & Durum)
                </Link>
              </li>
              <li>
                <Link to="/products?category=Wheat+Flour" className="hover:text-white transition-colors">
                  Wheat Flour (Chakki Atta)
                </Link>
              </li>
              <li>
                <Link to="/products?category=Beans+and+Pulses" className="hover:text-white transition-colors">
                  Unpolished Pulses
                </Link>
              </li>
              <li className="pt-1">
                <Link to="/products" className="hover:text-amber-300 transition-colors text-amber-400 font-semibold flex items-center">
                  <span>Full Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Trade Desk */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] font-bold text-white mb-4">
              Trade Desk
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-light">
              <li>
                <Link to="/bulk-enquiry" className="hover:text-white transition-colors">
                  Bulk Procurement RFQ
                </Link>
              </li>
              <li>
                <Link to="/bulk-enquiry" className="hover:text-white transition-colors">
                  Distributor Dealerships
                </Link>
              </li>
              <li>
                <Link to="/bulk-enquiry" className="hover:text-white transition-colors">
                  Containerized Exports
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Trade FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 6: Support & Direct Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.14em] font-bold text-white mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-light">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Office
                </Link>
              </li>
              <li className="pt-1 text-xs">
                <span className="block text-slate-500 uppercase tracking-wider text-[10px] font-semibold">Direct Hotline:</span>
                <a href={`tel:${BUSINESS_CONFIG.phonePrimary.replace(/\s+/g, '')}`} className="text-amber-400 font-semibold hover:underline block mt-0.5">
                  {BUSINESS_CONFIG.phonePrimary}
                </a>
              </li>
              <li className="text-xs">
                <span className="block text-slate-500 uppercase tracking-wider text-[10px] font-semibold">Sales Email:</span>
                <span className="text-slate-300 block mt-0.5">{BUSINESS_CONFIG.salesEmail}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Institutional Compliance & Certification Strip */}
      <div className="border-t border-slate-800 py-6 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="flex items-center space-x-2.5 justify-center sm:justify-start">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-slate-400 font-medium">FSSAI Certified Purity</span>
            </div>
            <div className="flex items-center space-x-2.5 justify-center sm:justify-start">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-slate-400 font-medium">APEDA Export Quality Standards</span>
            </div>
            <div className="flex items-center space-x-2.5 justify-center sm:justify-start">
              <FileCheck2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-slate-400 font-medium">GST & Commercial Compliant</span>
            </div>
            <div className="flex items-center space-x-2.5 justify-center sm:justify-start">
              <Globe2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-slate-400 font-medium">Containerized Global Logistics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-slate-800/80 py-5 bg-black/50 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Attri Nexus. All rights reserved. Registered Commercial Entity.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a
              href="https://vsasl.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400/90 hover:text-amber-300 font-medium inline-flex items-center space-x-1 transition-colors"
            >
              <span>VSASL (Myanmar) ↗</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <span className="text-slate-400 font-medium inline-flex items-center space-x-1">
              <span>Legal: Vardaan’s Law & Associates</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/cookie-policy" className="hover:text-slate-300 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
};
