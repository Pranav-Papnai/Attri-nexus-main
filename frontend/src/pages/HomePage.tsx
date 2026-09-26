import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Building2,
  Wheat,
  Boxes,
  Layers,
  ChevronRight,
  Check,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Globe2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BUSINESS_CONFIG, getWhatsAppLink } from '@/constants/business';
import { useProducts } from '../context/ProductsContext';
import { WHY_US_PILLARS } from '@/constants/whyUs';
import { FAQS } from '@/constants/faqs';
import { TrustStrip } from '../components/ui/TrustStrip';
import { ProductCard } from '../components/ui/ProductCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useEnquiryModal } from '../context/EnquiryModalContext';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { PRODUCT_CATEGORIES } from '@/constants/products';


interface HeroSlide {
  image: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    image: '/images/branding/hero-sunset-harvest.jpg',
    alt: 'Golden Wheat Harvest, Silos & Farm Belts at Sunset'
  },
  {
    image: '/images/branding/hero-cinematic-silos.jpg',
    alt: 'Attri Nexus Agricultural Silos & Storage'
  },
  {
    image: '/images/branding/hero-slide-rice.jpg',
    alt: 'Premium Rice Sourcing & Exports'
  },
  {
    image: '/images/branding/hero-slide-wheat.jpg',
    alt: 'Pure Whole Wheat & Sharbati Atta'
  },
  {
    image: '/images/branding/hero-slide-feed.jpg',
    alt: 'High-Protein Livestock Cattle Feed'
  },
  {
    image: '/images/branding/hero-slide-pulses.jpg',
    alt: 'Unpolished Desi Beans & Pulses'
  },
  {
    image: '/images/branding/hero-slide-harvest.jpg',
    alt: 'Direct Farm Harvest Mechanization'
  },
  {
    image: '/images/branding/hero-slide-logistics.jpg',
    alt: 'Global Trade Logistics & Shipping'
  }
];

export const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeShowcaseCategory, setActiveShowcaseCategory] = useState<string>('All');
  const { products } = useProducts();
  const { openEnquiryModal } = useEnquiryModal();

  // Carousel timer - 5 seconds per slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter products for interactive showcase
  const displayedProducts = useMemo(() => {
    if (activeShowcaseCategory === 'All') {
      return products.slice(0, 6);
    }
    const cat = activeShowcaseCategory.toLowerCase();
    return products.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      if (cat === 'rice') {
        return pCat === 'rice' || pCat === 'basmati' || pCat === 'non-basmati';
      }
      if (cat === 'animal feed') {
        return pCat === 'animal feed' || pCat.includes('feed');
      }
      if (cat === 'wheat') {
        return pCat === 'wheat';
      }
      if (cat === 'wheat flour' || cat === 'flour' || cat === 'atta') {
        return pCat === 'wheat flour' || pCat.includes('flour') || pCat.includes('atta');
      }
      if (cat === 'wheat and wheat flour' || cat === 'wheat & atta') {
        return pCat.includes('wheat') || pCat.includes('atta') || pCat.includes('flour');
      }
      if (cat === 'beans and pulses' || cat === 'pulses' || cat.includes('pulse')) {
        return pCat.includes('pulse') || pCat.includes('bean') || pCat.includes('dal');
      }
      return false;
    }).slice(0, 6);
  }, [activeShowcaseCategory, products]);

  return (
    <div className="relative overflow-hidden">
      
      {/* 1. HERO CAROUSEL BANNER */}
      <section className="relative min-h-[580px] sm:min-h-[640px] md:min-h-[700px] flex items-center justify-center bg-[#0B132B] text-white overflow-hidden">
        
        {/* Background Slides with Ken Burns & Smooth Fade */}
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                decoding="async"
                className={`w-full h-full object-cover object-center brightness-[0.48] contrast-[1.08] ${
                  isActive ? 'animate-cinematic-pan' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Clean High-Contrast Scrim Gradient Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0B132B]/95 via-[#0B132B]/60 to-[#0B132B]/30" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0B132B] via-transparent to-[#0B132B]/60" />

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 relative z-20 w-full">
          <div className="max-w-3xl space-y-6 text-left">
            
            {/* Tagline Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 rounded-full border border-amber-400/40 bg-black/40 text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.08em] sm:tracking-[0.16em] backdrop-blur-md shadow-lg max-w-full truncate"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Attri Nexus • Export-Grade Infrastructure</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]"
            >
              Pure Commodities. <br />
              <span className="font-serif italic font-normal text-[#C5A059]">
                Exceptional Quality.
              </span> <br />
              Bulk Scale.
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="border-l-2 border-[#B22234] pl-4 py-1 max-w-2xl"
            >
              <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed font-light">
                India’s trusted supplier and exporter across 5 core divisions: <strong className="text-white font-medium">Premium Rice</strong>, <strong className="text-white font-medium">Animal Feed</strong>, <strong className="text-white font-medium">Wheat Grains</strong>, <strong className="text-white font-medium">Wheat Flour (Chakki Atta)</strong>, and <strong className="text-white font-medium">Beans & Pulses</strong>. Direct farm sourcing with certified lab purity.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/bulk-enquiry"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/40 text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-md transition-colors cursor-pointer"
                >
                  <Building2 className="w-4 h-4 mr-2 text-amber-300" />
                  <span>Bulk Commercial Desk</span>
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <TrustStrip />

      {/* 3. CORE COMMODITIES (BENTO GRID) */}
      <section className="py-20 sm:py-24 bg-white text-slate-900 relative border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 pb-5 border-b border-slate-100">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#B22234]">Core Portfolio</span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Our Core Commodities
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                Curated agricultural commodities sourced directly from prime farm belts to meet exacting institutional standards.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#B22234] hover:text-[#931B2A] transition-colors group shrink-0"
            >
              <span>Explore All Products</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Clean 5-Card Grid with Motion (Row 1: 7+5, Row 2: 4+4+4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
            
            {/* 1. RICE RANGE (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="lg:col-span-7 rounded-2xl overflow-hidden"
            >
              <Link
                to="/products?category=Rice"
                className="group relative h-96 sm:h-[420px] w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-end p-6 sm:p-8 block"
              >
                <img
                  src="/images/products/rice_macro_dark.jpg"
                  alt="Rice Markets - Long Grain Basmati"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-amber-200 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur-md">
                    <Wheat className="w-3.5 h-3.5 text-amber-300" />
                    <span>Aged Basmati & Non-Basmati</span>
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-200 transition-colors tracking-tight">
                    Rice Range
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg font-light">
                    Aged Pusa 1121, 1509 & 1718 Basmati, Sona Masoori, Ponni, IR 64, and Swarna varieties sourced from certified sustainable producers.
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* 2. ANIMAL & LIVESTOCK FEED (5 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="lg:col-span-5 rounded-2xl overflow-hidden"
            >
              <Link
                to="/products?category=Animal+Feed"
                className="group relative h-96 sm:h-[420px] w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-end p-6 sm:p-8 block"
              >
                <img
                  src="/images/products/feed_nutrition_dark.jpg"
                  alt="Animal Feed - Soybean Meal, Rapeseed Meal, Corn DDGS & Rice DDGS"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-emerald-200 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur-md">
                    <Boxes className="w-3.5 h-3.5 text-emerald-300" />
                    <span>High Protein • DOC & DDGS Nutrition</span>
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-200 transition-colors tracking-tight">
                    Animal Feed
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                    Soybean Meal DOC, Rapeseed Meal DOC & Distillers Dried Grains (Corn & Rice DDGS). Rich in protein & bypass amino acids.
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* 3. WHEAT (WHOLE GRAINS) (4 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="lg:col-span-4 rounded-2xl overflow-hidden"
            >
              <Link
                to="/products?category=Wheat"
                className="group relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-end p-6 sm:p-8 block"
              >
                <img
                  src="/images/products/wheat_hand_macro.jpg"
                  alt="MP Sharbati Wheat - Whole Grain Selection"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-amber-200 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur-md">
                    <Wheat className="w-3.5 h-3.5 text-amber-300" />
                    <span>4 Core Varieties • Sortex Cleaned</span>
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-200 transition-colors tracking-tight">
                    Wheat Grains
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                    Sharbati, Lokwan, Malviya, and Durum Wheat. High-protein whole grains for commercial milling, atta & pasta production.
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* 4. WHEAT FLOUR (CHAKKI ATTA) (4 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="lg:col-span-4 rounded-2xl overflow-hidden"
            >
              <Link
                to="/products?category=Wheat+Flour"
                className="group relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-end p-6 sm:p-8 block"
              >
                <img
                  src="/images/products/attri-sharbati-atta.jpg"
                  alt="Attri Pure Sharbati Chakki Atta - Stone Ground"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-rose-200 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur-md">
                    <Wheat className="w-3.5 h-3.5 text-rose-300" />
                    <span>Stone-Ground • Cold Milled</span>
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-200 transition-colors tracking-tight">
                    Wheat Flour
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                    100% stone-ground Chakki Atta with 0% Maida and natural wheat germ & bran retained.
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* 5. BEANS & PULSES (4 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="lg:col-span-4 rounded-2xl overflow-hidden"
            >
              <Link
                to="/products?category=Beans+and+Pulses"
                className="group relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col justify-end p-6 sm:p-8 block"
              >
                <img
                  src="/images/products/pulses_grid_dark.jpg"
                  alt="Beans & Pulses Sampling Grid"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-amber-200 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur-md">
                    <Layers className="w-3.5 h-3.5 text-amber-300" />
                    <span>8 Core Commodities • Sortex Cleaned</span>
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-200 transition-colors tracking-tight">
                    Beans & Pulses
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                    Red Kidney Bean, Peas, Black-Eyed Bean, Chickpeas, Toor, Red Lentils, Black Matpe & Green Mung Bean.
                  </p>
                </div>
              </Link>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3.5 ENTERPRISE AGRO METRICS STRIP */}
      <section className="py-14 sm:py-16 bg-[#0B132B] text-white relative overflow-hidden border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              { number: "50,000+ MT", label: "Annual Commodity Volume", detail: "Containerized Port Shipments", icon: TrendingUp },
              { number: "99.8%", label: "Sortex Optical Clean", detail: "Certified Laboratory Purity", icon: ShieldCheck },
              { number: "5 Divisions", label: "Integrated Agro Supply", detail: "Rice, Feed, Wheat, Flour & Pulses", icon: Layers },
              { number: "24-48 Hrs", label: "Quick Dispatch Window", detail: "Direct Farm Belt Logistics", icon: Globe2 },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                  whileHover={{ y: -4 }}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 text-center hover:border-amber-400/40 hover:bg-slate-900 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-1 group-hover:text-amber-300 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-200 mb-0.5">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-light">
                    {stat.detail}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* 4. ABOUT STORY SPLIT */}
      <section className="py-20 sm:py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Image Showcase */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-6 order-2 lg:order-1"
            >
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#141518] p-5 sm:p-6 text-white">
                <div className="relative rounded-2xl overflow-hidden border border-white/20 mb-5">
                  <img
                    src="/images/products/agro_commodities_showcase.jpg"
                    alt="Attri Nexus 5 Core Commodity Divisions"
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Rice • Feed • Wheat • Flour • Pulses</span>
                  </div>
                </div>

                {/* 100% Pure Batches Full Box (Removed 4 Commodity Hubs & Replaced Blue with Neutral Charcoal & Gold Accent) */}
                <div className="w-full p-4 rounded-2xl bg-white/[0.05] border border-amber-400/30 hover:border-amber-400/60 transition-all flex items-center justify-between text-left">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <span className="block text-base sm:text-lg font-bold font-serif text-white tracking-tight">
                        100% Pure Batches
                      </span>
                      <span className="text-xs text-slate-300">
                        Lab Tested & Certified Specifications
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    Guaranteed Purity
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Story Content */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-6 order-1 lg:order-2 space-y-5 text-left"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] border border-amber-200/80 bg-amber-50/60 text-[#8C6D2B] shadow-2xs">
                <span>Our Heritage & Vision</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15]">
                Pure Quality from Prime Soils to Global Mills & Kitchens
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                Attri Nexus is founded on an institutional commitment: supplying high-grade agricultural commodities that commercial food businesses, dairy farms, grain stockists, and international trade partners can procure with complete confidence.
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
                Whether it is our flagship aged Basmati and non-basmati rice, high-protein Soybean & Rapeseed meals and Corn/Rice DDGS, 100% stone-ground MP Sharbati Chakki Atta, or unpolished laser-sorted dals, we maintain uncompromising laboratory quality checks.
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#B22234] hover:text-[#931B2A] group transition-colors"
                >
                  <span>Discover Our Story & Infrastructure</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PRODUCT SHOWCASE */}
      <section className="py-20 sm:py-24 bg-white relative border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionHeader
            badge="Comprehensive Catalogue"
            title="Our Product Range"
            subtitle="Explore our full collection across aged rice, livestock feeds, whole wheat grains, stone-ground wheat flour, and unpolished pulses."
            align="center"
          />

          {/* Structured Category Tab Cards */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs max-w-5xl xl:max-w-6xl mx-auto mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 xl:gap-3">
              {PRODUCT_CATEGORIES.map((cat) => {
                const isSelected = activeShowcaseCategory === cat;
                return (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveShowcaseCategory(cat)}
                    className={`flex items-center justify-center py-3 sm:py-3.5 px-2 sm:px-2.5 xl:px-4 rounded-xl text-xs sm:text-[13px] xl:text-sm font-semibold transition-colors cursor-pointer text-center ${
                      isSelected
                        ? 'bg-[#0B132B] text-white shadow-md ring-2 ring-slate-800'
                        : 'bg-white text-slate-700 hover:bg-slate-100/90 border border-slate-200/90 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    <span className="whitespace-nowrap">{cat === 'Beans and Pulses' ? 'Beans & Pulses' : cat}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Animated Filtered Product Grid */}
          <motion.div
            key={activeShowcaseCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>

          {/* Single Action Button */}
          <div className="mt-12 text-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center py-4 px-8 sm:px-10 rounded-xl bg-[#0B132B] hover:bg-slate-900 text-white text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>View Full Catalogue with Advanced Filters</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2.5 text-amber-400 group-hover:translate-x-1.5 transition-transform duration-200" />
              </Link>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 6. WHY ATTRI NEXUS */}
      <section className="py-20 sm:py-24 bg-[#0B132B] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <SectionHeader
            badge="The Attri Nexus Standard"
            title="Why Choose Attri Nexus"
            subtitle="Six core commitments driving purity, consistency, and institutional excellence across every commodity."
            align="center"
            light={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US_PILLARS.map((pillar, idx) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:bg-slate-900 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mb-1 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-2.5">
                    {pillar.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-3.5 border-t border-slate-800">
                  {pillar.keyPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-center text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-amber-400 mr-2 flex-shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>


          <div className="mt-12 text-center">
            <Link
              to="/why-us"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Learn More About Our Trade Advantage</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

        </div>
      </section>

      {/* 7. B2B PROCUREMENT BANNER */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#3A506B] text-white relative overflow-hidden border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-slate-200 text-[11px] font-bold uppercase tracking-[0.16em] backdrop-blur-md">
                <Building2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Commercial & Institutional Procurement Desk</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Built for Agro Business & Global Exports
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-light">
                Looking for a dependable partner for bulk supply of <strong className="text-white font-medium">Rice</strong>, <strong className="text-white font-medium">Cattle Feed</strong>, <strong className="text-white font-medium">Wheat Flour</strong>, or <strong className="text-white font-medium">Pulses</strong>? Connect with Attri Nexus for wholesale pricing, distributor dealerships, and containerized export supply.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center lg:items-end gap-3">
              <Link
                to="/bulk-enquiry"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                <span>Submit Bulk Enquiry</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <a
                href={getWhatsAppLink("Hello Attri Nexus, I am looking for a bulk B2B quotation for Rice / Animal Feed / Wheat / Pulses.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-md transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 mr-2 fill-[#25D366]" />
                <span>Quick WhatsApp Quote</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FAQ HIGHLIGHT SECTION */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionHeader
            badge="Frequently Asked Questions"
            title="Questions & Answers"
            subtitle="Find quick answers regarding our 4-commodity range, packaging options, and commercial partnership terms."
            align="center"
          />

          <div className="space-y-3.5">
            {FAQS.slice(0, 4).map((faq) => (
              <div 
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs"
              >
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mb-1.5 tracking-tight">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#B22234] hover:text-[#931B2A]"
            >
              <span>View All FAQs & Guidelines</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
