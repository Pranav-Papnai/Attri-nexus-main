import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_CONFIG } from '@/constants/business';
import { Sparkles, ArrowRight, Globe2, Scale } from 'lucide-react';
import { useEnquiryModal } from '../../context/EnquiryModalContext';

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
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold mb-6">
              Institutional Compliance & Certification
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {/* FSSAI Logo & License */}
              <div className="flex flex-col items-center space-y-2">
                <img
                  src="/logos/fssai.png"
                  alt="FSSAI Certified Purity"
                  className="h-16 w-auto object-contain"
                  title="FSSAI License: 12726999000516"
                />
                <span className="text-[10px] text-slate-500 text-center font-medium">
                  Lic. No: 12726999000516
                </span>
              </div>

              {/* GST Logo & ID */}
              <div className="flex flex-col items-center space-y-2">
                <img
                  src="/logos/gst.png"
                  alt="GST Compliant"
                  className="h-16 w-auto object-contain rounded-full shadow-sm"
                  title="GST ID: 09ACOFA8324M1ZS"
                />
                <span className="text-[10px] text-slate-500 text-center font-medium">
                  GST ID: 09ACOFA8324M1ZS
                </span>
              </div>
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
