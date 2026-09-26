import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, LayoutGrid, CheckCircle2, ChevronRight, ShieldCheck, Scale } from 'lucide-react';
import { useEnquiryModal } from '../../context/EnquiryModalContext';

interface CommodityItem {
  key: string;
  category: string;
  name: string;
  tagline: string;
  badge: string;
  image: string;
  macroImage: string;
  accent: string;
  specs: string[];
  link: string;
  slug: string;
  highlights: string;
}

export const HeroProduct3D: React.FC = () => {
  const { openEnquiryModal } = useEnquiryModal();
  
  // 4 Core Commodity Verticals matching Attri Nexus business model
  const commodities: CommodityItem[] = [
    {
      key: 'rice',
      category: 'Rice Range',
      name: 'Aged Pusa 1121 & Non-Basmati',
      tagline: '8.35mm+ Extra Long Grain & Staples',
      badge: 'Premium Rice',
      image: '/images/products/attri-traditional-basmati.jpg',
      macroImage: '/images/products/rice_macro_dark.jpg',
      accent: '#1B365D',
      specs: ['8.35mm+ Raw Grain', 'Aged 2+ Years', 'Creamy / Golden Sella / Steam', 'IR 64, Sona Masoori, Ponni'],
      link: '/products?category=Rice',
      slug: 'pusa-1121-basmati-rice',
      highlights: '100% Sortex double-polished pure batches for royal biryani, daily meals & global exports.'
    },
    {
      key: 'feed',
      category: 'Animal Feed',
      name: 'Soybean Meal, Rapeseed Meal & DDGS',
      tagline: 'High-Protein Livestock Feed & Distillers Grains',
      badge: 'Animal Feed',
      image: '/images/products/attri-soybean-meal.jpg',
      macroImage: '/images/products/bowl_soybean_meal.jpg',
      accent: '#1B365D',
      specs: ['High Protein (46%+ Soy / 28-50% DDGS)', 'Low Moisture (<10%) & Low Fiber', 'Healthy Fat & Rich Amino Acids', 'Corn & Rice Based DDGS'],
      link: '/products?category=Animal+Feed',
      slug: 'soybean-meal-doc',
      highlights: 'Commercial high-protein meals & distillers grains engineered with low moisture, low fiber, rich amino acids & quality heat processing.'
    },
    {
      key: 'wheat',
      category: 'Wheat',
      name: 'Sharbati, Lokwan, Malviya & Durum Wheat',
      tagline: '4 Premium Whole Wheat Grain Varieties',
      badge: 'Wheat Grains',
      image: '/images/products/attri-lokwan-wheat.jpg',
      macroImage: '/images/products/bowl_wheat_grains.jpg',
      accent: '#8B5A2B',
      specs: ['Sharbati (Naturally Sweet)', 'Lokwan (High Milling Yield)', 'Malviya (Uniform Nutrition)', 'Durum (Semolina & Pasta Grade)'],
      link: '/products?category=Wheat',
      slug: 'attri-mp-sharbati-wheat-grain',
      highlights: 'Sortex cleaned premium Indian whole wheat grains for commercial flour mills, atta production, and semolina pasta manufacturing.'
    },
    {
      key: 'flour',
      category: 'Wheat Flour',
      name: 'Custom Milled Wheat Flours',
      tagline: 'Milled from 4 Wheat Varieties • 4 Custom Milling Finishes',
      badge: '4 Flour Varieties',
      image: '/images/products/attri-sharbati-atta.jpg',
      macroImage: '/images/products/wheat_hand_macro.jpg',
      accent: '#B22234',
      specs: ['Sharbati, Lokwan, Malviya & Durum Flours', 'Stone Ground (Traditional Chakki)', 'Roller Milling (Industrial Fine)', 'Hammer & Pin Milling (Ultra-Fine)'],
      link: '/products?category=Wheat+Flour',
      slug: 'attri-pure-sharbati-flour',
      highlights: 'Flours milled directly from our 4 wheat grains with your choice of Stone Ground Chakki, Roller, Impact/Hammer, or Pin Milling.'
    },
    {
      key: 'pulses',
      category: 'Beans & Pulses',
      name: 'Sortex Beans & Pulses Collection',
      tagline: '8 Core High-Protein Commodities',
      badge: 'Sortex Cleaned',
      image: '/images/products/attri-red-kidney-bean.jpg',
      macroImage: '/images/products/pulses_grid_dark.jpg',
      accent: '#C5A059',
      specs: ['High Protein & Fiber', 'Double Sortex Cleaned', 'Low Moisture Controlled', 'Uniform Size & Color'],
      link: '/products?category=Beans+and+Pulses',
      slug: 'red-kidney-beans-rajma',
      highlights: 'Red Kidney Bean, Peas, Black-Eyed Bean, Chickpeas, Toor, Red Lentils, Black Matpe & Green Mung Bean.'
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const active = commodities[activeIdx];

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {commodities.map((c, i) => (
          <button
            key={c.key}
            onClick={() => setActiveIdx(i)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
              activeIdx === i
                ? 'bg-[#0B132B] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{c.badge}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
