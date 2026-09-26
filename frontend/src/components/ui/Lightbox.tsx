import React, { useEffect, useRef } from 'react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { X, ZoomIn, Info } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  imageSrc: string;
  title: string;
  description?: string;
  category?: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  imageSrc,
  title,
  description,
  category,
  onClose
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(cardRef, isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    aria-labelledby="lightbox-title"
    >
      <div
        ref={cardRef}
        className="relative max-w-5xl max-h-[90vh] w-full bg-[#11161B] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-colors border border-white/10"
          aria-label="Close image lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Display Area */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#090D10] overflow-hidden min-h-[350px] md:min-h-[500px]">
          <img
            src={imageSrc}
            alt={title}
            className="max-h-[75vh] w-auto max-w-full object-contain filter drop-shadow-2xl transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Sidebar Metadata */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 bg-[#161C22]">
          <div>
            {category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C5A059]/20 text-[#DFD1BA] border border-[#C5A059]/30 mb-3">
                {category}
              </span>
            )}
            <h3 id="lightbox-title" className="text-xl font-serif font-bold text-white mb-2">
              {title}
            </h3>
            {description && (
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                {description}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-gray-400 space-y-2">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-[#C5A059]" />
              <span>Official Brand Packaging & Grain Asset</span>
            </div>
            <p className="text-[11px] text-gray-500">
              © Attri Nexus. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
