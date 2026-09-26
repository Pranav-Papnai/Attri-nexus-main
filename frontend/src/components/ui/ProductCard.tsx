import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useEnquiryModal } from '../../context/EnquiryModalContext';
import { ArrowRight, MessageSquare, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  selectedProcessingType?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, selectedProcessingType }) => {
  const { openEnquiryModal } = useEnquiryModal();
  const features = product.features || [];
  const targetSlug = product.slug || product.id;
  const detailUrl = selectedProcessingType && selectedProcessingType !== 'All'
    ? `/products/${targetSlug}?type=${encodeURIComponent(selectedProcessingType)}`
    : `/products/${targetSlug}`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-shadow duration-300 overflow-hidden p-4 sm:p-5 md:p-6"
    >

      {/* Category Ribbon & Tag */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200">
            {product.category || 'Commodity'} {product.subCategory ? `• ${product.subCategory}` : ''}
          </span>
        </div>
        {product.isPopular && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#B22234] text-white flex items-center space-x-1 shrink-0">
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>Featured</span>
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C6D2B]">
            {product.brandLine || 'Attri Nexus'}
          </span>
          <h3 className="font-serif text-lg sm:text-xl md:text-[22px] font-bold text-slate-900 mt-1 group-hover:text-[#B22234] transition-colors tracking-tight leading-snug">
            <Link to={detailUrl}>
              {product.name}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
            {product.variety}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3.5 leading-relaxed font-normal">
          {product.shortDescription || product.fullDescription}
        </p>

        {/* Dynamic Category-Specific Finishes & Broken Grades */}
        {product.processingTypes && product.processingTypes.length > 0 && (
          <div className="mb-3.5 pt-0.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {product.category === 'Animal Feed'
                ? 'Protein Grade & Commercial Tier:'
                : 'Available Grades & Types:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.processingTypes.map((type, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold border ${
                    type.includes('CP')
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>
            {product.category === 'Animal Feed' && (
              <p className="text-[10px] text-slate-500 mt-1.5 font-medium italic">
                * Coarse Meal, De-Hulled Flakes & Pellets available on request
              </p>
            )}
          </div>
        )}

        {/* Core Product Specifications (Balanced Selective Highlighting) */}
        {features.length > 0 && (
          <div className="space-y-1.5 mb-4 sm:mb-5 p-2 sm:p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
            {features.slice(0, 2).map((feat, idx) => {
              const colonIdx = feat.indexOf(':');
              const hasColon = colonIdx !== -1;
              const label = hasColon ? feat.substring(0, colonIdx) : '';
              const val = hasColon ? feat.substring(colonIdx + 1).trim() : feat;

              return (
                <div key={idx} className="flex items-start text-xs leading-snug">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <div className="truncate">
                    {hasColon ? (
                      <>
                        <span className="font-bold text-slate-900 mr-1">{label}:</span>
                        <span className="font-medium text-slate-600">{val}</span>
                      </>
                    ) : (
                      <span className="font-semibold text-slate-800">{feat}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-3.5 sm:pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 sm:gap-3">
          <Link
            to={detailUrl}
            className="inline-flex items-center justify-center py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl border-2 border-slate-200 text-xs sm:text-sm font-bold text-slate-800 hover:border-slate-800 hover:bg-slate-50 transition-all text-center group/btn"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-1.5 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
          </Link>

          <button
            type="button"
            onClick={() => openEnquiryModal(product.name)}
            className="inline-flex items-center justify-center py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl bg-[#B22234] hover:bg-[#931B2A] active:scale-[0.98] text-white text-xs sm:text-sm font-bold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer text-center"
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 shrink-0" />
            <span className="truncate">
              <span className="hidden min-[380px]:inline">Enquire Now</span>
              <span className="min-[380px]:hidden">Enquire</span>
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
