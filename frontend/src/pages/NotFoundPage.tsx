import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ShoppingBag, ArrowLeft } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/constants/business';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-[#E2E5EA] shadow-xl space-y-6">
        
        {/* Logo Emblem Icon */}
        <div className="w-20 h-20 rounded-full bg-[#F0F2F5] border-2 border-[#C5A059] p-1 mx-auto flex items-center justify-center shadow-md">
          <img
            src={BUSINESS_CONFIG.logo}
            alt="Attri Nexus Emblem"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-serif font-black text-[#8C6D2B] block">
            404
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1D23]">
            “Looks like this grain took a wrong turn.”
          </h1>
          <p className="text-sm text-[#5A6170] leading-relaxed max-w-sm mx-auto">
            The page you're looking for could not be found or may have been relocated.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#B22234] hover:bg-[#9A1D2C] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#F5F6F8] hover:bg-[#F0F2F5] text-[#1A1D23] border border-[#E2E5EA] text-xs font-bold uppercase tracking-wider transition-all"
          >
            <ShoppingBag className="w-4 h-4 mr-2 text-[#1B2A4A]" />
            <span>Explore Products</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
