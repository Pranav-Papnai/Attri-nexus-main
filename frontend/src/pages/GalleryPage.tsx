import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '@/constants/gallery';
import { GalleryItem } from '../types';
import { Lightbox } from '../components/ui/Lightbox';
import { Maximize2 } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="py-12 sm:py-16 bg-slate-50/60 min-h-screen">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <SectionHeader
          badge="Visual Archive"
          title="Packaging & Commodity Archive"
          subtitle="A visual showcase of our premium packaging designs, grain quality close-ups, and export-grade hallmarks."
          align="center"
        />

        {/* Filter Tabs */}
        <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2 scrollbar-none mt-6">
          {GALLERY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B132B] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 flex flex-col text-left"
            >
              {/* Image Container */}
              <div className="relative pt-[115%] bg-slate-50 p-6 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Top Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200 shadow-2xs">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="p-4 flex-1 flex flex-col justify-between border-t border-slate-100">
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#B22234] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
                {item.tag && (
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-bold text-[#8C6D2B]">
                    #{item.tag}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <Lightbox
          isOpen={Boolean(activeItem)}
          imageSrc={activeItem.image}
          title={activeItem.title}
          category={activeItem.category}
          description={activeItem.description}
          onClose={() => setActiveItem(null)}
        />
      )}

    </div>
  );
};
