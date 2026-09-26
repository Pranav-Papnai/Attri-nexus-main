import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, Navigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { PRODUCTS } from '@/constants/products';
import { useEnquiryModal } from '../context/EnquiryModalContext';
import { ProductCard } from '../components/ui/ProductCard';
import { Lightbox } from '../components/ui/Lightbox';
import { getWhatsAppLink, BUSINESS_CONFIG } from '@/constants/business';
import {
  Sparkles,
  Check,
  ArrowLeft,
  Phone,
  Wind,
  Layers,
  Award,
  Package,
  Share2,
  ShieldCheck,
  Info,
  Globe2,
  MapPin
} from 'lucide-react';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';

const PROCESSING_FINISH_DETAILS: Record<string, { title: string; methodType: string; desc: string }> = {
  // Wheat Flour Milling Methods (Authentic Technical Profiles)
  "Stone Ground (Chakki Grinding)": {
    title: "Stone Ground (Chakki Grinding)",
    methodType: "Traditional Method",
    desc: "Is traditional method mein wheat grains ko do bade patthron (stones) ke beech mein dheere-dheere peesa jata hai. Dheere peesne ki wajah se friction se zyada heat produce nahi hoti, jisse wheat ke natural nutrients, vitamins aur oils (germ) preserve rehte hain."
  },
  "Stone Ground": {
    title: "Stone Ground (Chakki Grinding)",
    methodType: "Traditional Method",
    desc: "Is traditional method mein wheat grains ko do bade patthron (stones) ke beech mein dheere-dheere peesa jata hai. Dheere peesne ki wajah se friction se zyada heat produce nahi hoti, jisse wheat ke natural nutrients, vitamins aur oils (germ) preserve rehte hain."
  },
  "Roller Milling": {
    title: "Roller Milling",
    methodType: "Modern Method",
    desc: "Yeh ek industrial method hai jisme wheat ko steel ke bade-bade rollers ke through guzaara jata hai. Isme grain ke alag-alag parts (bran, germ, aur endosperm) ko easily separate kiya ja sakta hai, jisse refined flour (maida) ya standard white/brown flour banaya jata hai."
  },
  "Impact / Hammer Milling": {
    title: "Impact / Hammer Milling",
    methodType: "High-Speed Mechanical Impact",
    desc: "Is method mein high-speed metal hammers ya blades ka use hota hai jo wheat grains par zor se impact daal kar unhe todte aur peeste hain. Yeh zyadatar coarse grinding ke liye ya animal feed banane mein use hota hai."
  },
  "Pin Milling": {
    title: "Pin Milling",
    methodType: "High-Speed Pin Discs",
    desc: "Is process mein high-speed rotating pins wale discs ka use hota hai jo wheat particles ko aapas mein ya pins ke saath takra kar aur baarik (fine) powder mein convert karte hain. Isse kaafi uniform aur fine flour milti hai."
  },

  // Rice Processing Finishes
  "Creamy Sella": {
    title: "Creamy Sella (Parboiled Basmati)",
    methodType: "Vacuum Conditioned",
    desc: "Paddy is parboiled with husk intact and dried under vacuum. Infuses bran nutrients into the kernel, producing golden-creamy firm grains that never stick or break in commercial cooking."
  },
  "Golden Sella": {
    title: "Golden Sella (Deep Parboiled)",
    methodType: "High-Pressure Steam",
    desc: "Deep steam-parboiled under calibrated pressure. Delivers rich amber grain color with maximum 2.5x cooked elongation, ideal for royal biryanis and banquets."
  },
  "Steamed": {
    title: "Steamed Finish",
    methodType: "Gentle Steam Conditioning",
    desc: "Raw paddy is gently steamed before milling without gelatinizing the starch core. Delivers sparkling white grains with quick cooking time and subtle natural floral fragrance."
  },
  "Raw": {
    title: "Raw / Aged Finish",
    methodType: "Traditional Dry Milling",
    desc: "Naturally aged paddy directly milled without steam or heat parboiling. Offers the classic soft, fluffy mouthfeel and intense natural basmati aroma."
  },

  // Commercial Grain Quality & Export Tiers
  "Premium Domestic Grade": {
    title: "Premium Domestic Grade",
    methodType: "Standard Domestic Quality",
    desc: "Calibrated test-weight, uniform seed caliber, and compliant moisture levels optimized for domestic wholesale mandis, flour mills, and regional packers."
  },
  "Certified Export Grade": {
    title: "Certified Export Grade",
    methodType: "Seaworthy Certified",
    desc: "Controlled low moisture (<11.5%), zero insect damage or infestation, and packed in heavy seaworthy laminated bags for containerized international transit."
  },
  "High-Yield Milling Grade": {
    title: "High-Yield Milling Grade",
    methodType: "Commercial Mill Ready",
    desc: "Calibrated grain hardness, high test-weight endosperm, and high flour extraction yield for commercial roller or stone flour mills."
  },
  "Milling Grade": {
    title: "High-Yield Milling Grade",
    methodType: "Commercial Mill Ready",
    desc: "Calibrated grain hardness, high test-weight endosperm, and high flour extraction yield for commercial roller or stone flour mills."
  },
  "Semolina & Pasta Grade": {
    title: "Vitreous Durum Semolina Grade",
    methodType: "Suji & Pasta Extraction",
    desc: "Hard vitreous amber durum grain calibrated for maximum coarse and fine semolina (Suji/Rawa) recovery and high wet gluten for pasta extrusion."
  },
  "Semolina Grade": {
    title: "Vitreous Durum Semolina Grade",
    methodType: "Suji & Pasta Extraction",
    desc: "Hard vitreous amber durum grain calibrated for maximum coarse and fine semolina (Suji/Rawa) recovery and high wet gluten for pasta extrusion."
  },
  "Sortex Clean": {
    title: "Double Laser Sortex Clean",
    methodType: "99.8% Laser Purity",
    desc: "Computerized optical color sorting eliminating foreign matter, mud balls, and discolored kernels for pure food-grade grain consistency."
  },
  "Export Grade": {
    title: "Certified Export Grade",
    methodType: "Seaworthy Certified",
    desc: "Controlled low moisture (<11.5%), zero infestation, and packed in heavy seaworthy laminated bags for containerized international transit."
  },

  // Animal Feed Protein Grades & Commercial Tiers
  "Standard Grade (46% CP)": {
    title: "Standard Feed Grade (46% CP)",
    methodType: "Commercial Compound Feed",
    desc: "Guaranteed minimum 46% crude protein, strictly controlled low moisture (<10%), and balanced amino acid profile optimized for commercial broiler, layer, and dairy rations."
  },
  "Hi-Pro Export Grade (48%+ CP)": {
    title: "Hi-Pro Certified Export Grade (48%+ CP)",
    methodType: "De-Hulled Export Purity",
    desc: "Highest biological concentration of 48%+ crude protein, precision de-hulled for ultra-low crude fiber (<5%) and maximum digestibility for high-yield rations and international cargo."
  },
  "Standard Feed Grade (36% CP)": {
    title: "Standard Feed Grade (36% CP)",
    methodType: "Ruminant & Aqua Grade",
    desc: "Rich in rumen-bypass protein and sulphur amino acids (Methionine/Cystine) with 36% crude protein, ideal for boosting milk butterfat and aqua compound feeds."
  },
  "High-Protein Grade (38%+ CP)": {
    title: "High-Protein Super Grade (38%+ CP)",
    methodType: "Premium Solvent Conditioned",
    desc: "Concentrated 38%+ crude protein with thermal deactivated glucosinolates and enhanced palatability, maximizing daily milk yield and dairy feed conversion efficiency."
  },
  "Standard Distillers (27% CP)": {
    title: "Standard Corn Distillers (27% CP)",
    methodType: "Flash Dried Granular",
    desc: "Delivers 27% crude protein and 8% healthy corn oil lipids, offering an economical energy and protein blend for poultry flocks and dairy herds."
  },
  "High-Energy Grade (28%+ CP / 10% Oil)": {
    title: "High-Energy Prime Grade (28%+ CP / 10% Oil)",
    methodType: "Concentrated Energy Lipid",
    desc: "Concentrated 28%+ crude protein and 10% natural corn lipids, delivering maximum metabolizable energy (ME) and bypass protein for peak milk production."
  },
  "Commercial Grade (45% CP)": {
    title: "Commercial Grade Rice DDGS (45% CP)",
    methodType: "Standard Bio-Fermented",
    desc: "Cost-effective 45% crude protein derived from pure broken rice, low moisture (<10%) and balanced amino acid digestibility for poultry and cattle feeds."
  },
  "Super Concentrate (50% CP)": {
    title: "Super Concentrate Rice DDGS (50% CP)",
    methodType: "Ultra-High Protein Grade",
    desc: "Breakthrough 50% concentrated plant protein with <4.5% fiber, serving as an exceptional high-potency alternative to costly animal proteins in aquaculture and chick diets."
  },

  // Animal Feed Physical Forms & Mesh Finishes (Legacy / Form Support)
  "Coarse Meal": {
    title: "Coarse Feed Meal",
    methodType: "Solvent Extracted & Toasted",
    desc: "Precision thermal-toasted coarse granular meal with neutral urease activity, preserving maximum digestible crude protein, lysine, and essential amino acids."
  },
  "Solvent Extracted Coarse Meal": {
    title: "Solvent Extracted Coarse Meal",
    methodType: "Precision Toasted 46-48% CP",
    desc: "Hexane solvent extracted and thermal toasted to deactivate anti-nutritional urease enzymes while preserving maximum digestible crude protein and essential amino acids."
  },
  "De-Hulled Flakes": {
    title: "De-Hulled Flakes",
    methodType: "Low Fiber (<5%)",
    desc: "De-hulled prior to extraction to minimize crude fiber and maximize metabolizable energy, ideal for commercial broiler, layer, and swine rations."
  },
  "Steam Pellets": {
    title: "Steam Conditioned Pellets",
    methodType: "Dust-Free Extruded Pellets",
    desc: "Conditioned under calibrated steam and extruded into durable, dust-free pellets for bulk automated silo dispensing and zero feed wastage."
  },
  "Toasted Pellets": {
    title: "Toasted Pellets",
    methodType: "Steam Conditioned Pellets",
    desc: "Conditioned under calibrated steam and extruded into durable, dust-free pellets for bulk automated silo dispensing and zero feed wastage."
  },
  "Pelletized Meal": {
    title: "Pelletized Meal",
    methodType: "Ruminant Pellet Grade",
    desc: "Steam pelletized for high density, optimal rumen-bypass protein, and enhanced palatability for dairy cattle and buffalo milk production."
  },
  "Golden Granular Meal": {
    title: "Golden Granular Corn DDGS",
    methodType: "Flash Dried 27-28% CP",
    desc: "Low-temperature indirect flash dried whole-corn distillers grain preserving 27-28% crude protein, 8-10% corn oil, and natural yeast bio-actives with vibrant golden color."
  },
  "Coarse Feed DDGS": {
    title: "Coarse Feed Grade DDGS",
    methodType: "Commercial Free-Flow Grade",
    desc: "Uniform coarse granular particles with excellent flowability, balanced fiber, and rich energy density for commercial compound feed mill blending."
  },
  "Coarse Feed Grade DDGS": {
    title: "Coarse Feed Grade DDGS",
    methodType: "Commercial Free-Flow Grade",
    desc: "Uniform coarse granular particles with excellent flowability, balanced fiber, and rich energy density for commercial compound feed mill blending."
  },
  "Ultra-Fine Meal": {
    title: "Ultra-Fine Rice DDGS Meal",
    methodType: "Micro-Pulverized 45-50% CP",
    desc: "Finely pulverized concentrated broken-rice distillers grain delivering an extraordinary 45-50% crude protein, ideal for aquafeeds (shrimp/fish) and chick starter diets."
  },
  "Granular Meal": {
    title: "Granular Rice DDGS Meal",
    methodType: "Standard Feed Grade",
    desc: "Even granular consistency with strictly controlled moisture (<10%) and low fiber (<5%), providing an economical, high-protein plant concentrate."
  }
};

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || searchParams.get('finish') || searchParams.get('grade') || searchParams.get('processingType');
  const { getBySlug, getRelated, isLoading } = useProducts();
  const product = slug ? getBySlug(slug) : undefined;
  const { openEnquiryModal } = useEnquiryModal();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPackSize, setSelectedPackSize] = useState('');
  const [showRawGrain, setShowRawGrain] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedProcessingType, setSelectedProcessingType] = useState<string>('');

  if (!product) {
    if (isLoading) return null;
    return <Navigate to="/products" replace />;
  }

  const relatedProducts = getRelated(product.slug, 3);
  const packSizes = product.packSizes && product.packSizes.length > 0 ? product.packSizes : ['5 Kg Handle Bag', '10 Kg Master Bag', '25 Kg Standard Bag', '50 Kg Heavy Commercial'];
  const staticProduct = PRODUCTS.find((p) => p.slug === product.slug || p.id === product.id);
  const rawProcessingTypes = (staticProduct?.processingTypes && staticProduct.processingTypes.length > 0)
    ? staticProduct.processingTypes
    : product.processingTypes;
  const processingTypes = (rawProcessingTypes && rawProcessingTypes.length > 0)
    ? rawProcessingTypes
    : (product.category?.toLowerCase() === 'rice')
    ? ['Creamy Sella', 'Golden Sella', 'Steamed']
    : [];

  const exportName = product.exportName || staticProduct?.exportName;
  const tradeAliases = product.tradeAliases || staticProduct?.tradeAliases || [];
  const demandMarkets = product.demandMarkets || staticProduct?.demandMarkets || [];

  // Helper to match URL param against product processing types (e.g. 'Golden' -> 'Golden Sella', 'Creamy' -> 'Creamy Sella')
  const matchedProcessingType = useMemo(() => {
    if (!typeParam || typeParam.toLowerCase() === 'all' || processingTypes.length === 0) {
      return processingTypes[0] || '';
    }
    const norm = typeParam.toLowerCase().trim();
    const found = processingTypes.find((t) => {
      const tNorm = t.toLowerCase();
      return tNorm === norm || tNorm.includes(norm) || norm.includes(tNorm);
    });
    return found || processingTypes[0] || '';
  }, [typeParam, processingTypes]);

  // Synchronize selections when navigating between products or when URL param changes
  useEffect(() => {
    setSelectedProcessingType(matchedProcessingType);
    setSelectedPackSize('');
  }, [product.slug, matchedProcessingType]);

  // Self-healing fallback: Ensure active selections strictly exist within the current product's valid options
  const activePackSize = (selectedPackSize && packSizes.includes(selectedPackSize))
    ? selectedPackSize
    : (packSizes[0] || '');

  const activeProcessingType = (selectedProcessingType && processingTypes.includes(selectedProcessingType))
    ? selectedProcessingType
    : (matchedProcessingType || processingTypes[0] || '');
  const processingSectionHeading = useMemo(() => {
    const cat = (product.category || '').toLowerCase();
    if (cat.includes('flour') || cat.includes('atta')) {
      return 'Milling & Grinding Method';
    }
    if (cat.includes('rice')) {
      return 'Available Rice Processing Finish';
    }
    if (cat.includes('feed')) {
      return 'Protein Grade & Commercial Tier';
    }
    return 'Commercial Quality & Grading Tier';
  }, [product.category]);
  const features = product.features || [];
  const specifications = (product.specifications || {}) as Record<string, any>;
  const badgeBg = product.themeColor?.badgeBg || 'bg-[#0B132B] text-white border-[#0B132B]';

  // Helper to determine the authentic raw commodity in a bowl photo for this product
  const getRawGrainImage = (): string | null => {
    const pSlug = (product.slug || '').toLowerCase();
    const pId = (product.id || '').toLowerCase();
    const cat = (product.category || '').toLowerCase();

    // Animal Feed: Authentic daylight close-up bowl images tailored for each specific feed meal
    if (pSlug.includes('soybean') || pSlug.includes('soy-doc') || pId.includes('soybean')) {
      return '/images/products/bowl_soybean_meal.jpg';
    }
    if (pSlug.includes('rapeseed') || pSlug.includes('mustard') || pId.includes('rapeseed')) {
      return '/images/products/bowl_rapeseed_meal.jpg';
    }
    if (pSlug.includes('corn-ddgs') || (pSlug.includes('ddgs') && pSlug.includes('corn')) || pId.includes('corn-ddgs')) {
      return '/images/products/bowl_corn_ddgs.jpg';
    }
    if (pSlug.includes('rice-ddgs') || (pSlug.includes('ddgs') && pSlug.includes('rice')) || pId.includes('rice-ddgs')) {
      return '/images/products/bowl_rice_ddgs.jpg';
    }
    if (cat.includes('feed')) {
      return '/images/products/bowl_feed_meals.jpg';
    }

    // Wheat & Atta: Show whole wheat grains bowl
    if (cat.includes('wheat') || pSlug.includes('wheat') || pSlug.includes('atta') || pSlug.includes('flour')) {
      return '/images/products/bowl_wheat_grains.jpg';
    }

    // Rice: Show raw basmati grains bowl
    if (cat.includes('rice') || pSlug.includes('rice') || pSlug.includes('basmati') || pSlug.includes('sella')) {
      return '/images/products/bowl_rice_grains.jpg';
    }

    // Beans and Pulses:
    // Every bean/pulse item (Rajma, Peas, Lobia, Chickpeas, Red Lentils, Black Matpe, Green Mung, Toor)
    // already has its own dedicated authentic photo.
    return null;
  };

  const rawGrainImage = getRawGrainImage();

  // One-time intro demonstration: Packet -> Raw Grains in Bowl -> Packet, only if rawGrainImage exists
  useEffect(() => {
    if (!rawGrainImage) {
      setShowRawGrain(false);
      return;
    }

    const showTimer = setTimeout(() => {
      setShowRawGrain(true);
      const hideTimer = setTimeout(() => {
        setShowRawGrain(false);
      }, 2400);
      return () => clearTimeout(hideTimer);
    }, 1800);

    return () => clearTimeout(showTimer);
  }, [product.slug, rawGrainImage]);

  const handleMouseEnterImage = () => {
    if (!rawGrainImage) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setShowRawGrain(true);
    }, 400);
  };

  const handleMouseLeaveImage = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setShowRawGrain(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50/70 min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <nav className="flex items-center space-x-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-slate-900 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{product.name}</span>
          </nav>

          <Link
            to="/products"
            className="inline-flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Products</span>
          </Link>
        </div>
      </div>

      {/* Product Hero Split Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Product Showcase Card (Sticky on desktop, natural scroll on mobile) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
              
              {/* Top Badges */}
              <div className="flex items-center justify-between">
                <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${badgeBg}`}>
                  {product.category || 'Commodity'} {product.subCategory ? `• ${product.subCategory}` : ''}
                </span>

                {product.isFeatured && (
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#B22234] text-white shadow-2xs flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              {/* Product Image Showcase with Raw Grain Crossfade */}
              <div 
                className="relative w-full h-64 sm:h-80 md:h-[400px] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 cursor-pointer group shadow-2xs flex items-center justify-center p-3 sm:p-5 select-none"
                onClick={() => setIsLightboxOpen(true)}
                onMouseEnter={handleMouseEnterImage}
                onMouseLeave={handleMouseLeaveImage}
              >
                {/* Official Bag Packet Photo / Main Showcase Photo */}
                <img
                  src={product.image || '/images/products/attri_traditional_basmati.jpg'}
                  alt={`${product.name} Packaging`}
                  loading="lazy"
                  decoding="async"
                  className={`max-w-full max-h-full w-auto h-auto object-contain object-center drop-shadow-md transition-all duration-500 ease-in-out group-hover:scale-105 ${
                    rawGrainImage && showRawGrain ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                  }`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/products/attri_traditional_basmati.jpg';
                  }}
                />

                {/* Raw Grain in Bowl Photo (Only rendered when authentic secondary image exists) */}
                {rawGrainImage && (
                  <img
                    src={rawGrainImage}
                    alt={`${product.name} Raw Grain in Bowl`}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover object-center shadow-inner transition-all duration-700 ease-in-out ${
                      showRawGrain ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                  />
                )}
              </div>

              {/* Structured Metric Spec Cards (2x2 Grid) */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 block">
                  Key Quality Metrics
                </span>
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-slate-200/90 hover:border-slate-300 transition-colors">
                    <span className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Origin</span>
                    <span className="text-[11px] sm:text-sm font-bold text-slate-900 truncate block mt-0.5">{specifications.origin || 'India'}</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-slate-200/90 hover:border-slate-300 transition-colors">
                    <span className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Grain / Form</span>
                    <span className="text-[11px] sm:text-sm font-bold text-slate-900 truncate block mt-0.5">{specifications.grainType || product.variety || 'Commercial'}</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-slate-200/90 hover:border-slate-300 transition-colors">
                    <span className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Purity Standard</span>
                    <span className="text-[11px] sm:text-sm font-bold text-slate-900 truncate block mt-0.5">{specifications.aroma || '100% Pure Certified'}</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-slate-200/90 hover:border-slate-300 transition-colors">
                    <span className="block text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sorting</span>
                    <span className="text-[11px] sm:text-sm font-bold text-slate-900 truncate block mt-0.5">{specifications.cookingTime || 'Laser Sortex Checked'}</span>
                  </div>
                </div>
              </div>

              {/* Standard Export Packaging Tag */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-[#8C6D2B]" />
                  <span className="font-semibold">Standard Export Packing:</span>
                </div>
                <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {packSizes[0]}
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: Product Information & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8C6D2B]">
                {product.brandLine || 'Attri Nexus Pure Commodities'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-[42px] font-bold text-slate-900 mt-1.5 tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 mt-2">
                <p className="text-base sm:text-lg font-medium text-slate-600">
                  {product.variety}
                </p>
                {exportName && (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300/80 shadow-2xs">
                    <Globe2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Export Name: <span className="text-slate-900 font-extrabold">{exportName}</span></span>
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal border-y border-slate-200/80 py-5">
              <p>{product.fullDescription || product.shortDescription}</p>
            </div>

            {/* Global Trade & Export Profile Card (Option 1: Ivory & Gold) */}
            {(exportName || demandMarkets.length > 0) && (
              <div className="rounded-2xl p-5 sm:p-6 border border-[#C5A059]/40 bg-gradient-to-br from-[#FAF8F5] via-[#F6F2EA] to-[#F2EDE2] text-slate-900 shadow-sm relative overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 bg-[#C5A059]/15" />

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-300/70">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg shrink-0 bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#8C6D2B]">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-900">
                        Global Trade & Export Profile
                      </h3>
                      <span className="text-[10px] font-normal text-slate-600">
                        International Nomenclature & Primary Consumption Markets
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs bg-[#C5A059] text-slate-950 font-bold">
                    Export Ready
                  </span>
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Box: Popular Trade / Export Names */}
                  <div className="space-y-2.5 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                    <span className="text-[10px] uppercase tracking-wider font-bold flex items-center space-x-1.5 text-[#8C6D2B]">
                      <span>🏷️ Popular Trade & Export Names</span>
                    </span>
                    <p className="text-sm font-bold text-slate-900">
                      {exportName || product.name}
                    </p>
                    {tradeAliases.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tradeAliases.map((alias, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors bg-slate-50 text-slate-800 border border-slate-200/90 hover:border-[#C5A059]/60"
                          >
                            {alias}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Box: Major Demand Markets */}
                  {demandMarkets.length > 0 && (
                    <div className="space-y-2.5 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] uppercase tracking-wider font-bold flex items-center space-x-1.5 text-emerald-800">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                        <span>Major Demand Markets (Where it Sells Most)</span>
                      </span>
                      <ul className="space-y-1.5">
                        {demandMarkets.map((market, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 bg-[#C5A059]" />
                            <span className="leading-snug">{market}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key Features List (Balanced Selective Highlighting) */}
            {features.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Grain Attributes & Key Specifications</span>
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Verified Quality
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {features.map((feat, idx) => {
                    const colonIdx = feat.indexOf(':');
                    const hasColon = colonIdx !== -1;
                    const label = hasColon ? feat.substring(0, colonIdx) : '';
                    const val = hasColon ? feat.substring(colonIdx + 1).trim() : feat;

                    return (
                      <div key={idx} className="flex items-start bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-colors">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0 mr-2.5 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <div className="text-xs sm:text-sm leading-relaxed">
                          {hasColon ? (
                            <>
                              <span className="font-bold text-slate-900 mr-1">{label}:</span>
                              <span className="text-slate-600 font-normal">{val}</span>
                            </>
                          ) : (
                            <span className="text-slate-800 font-medium">{feat}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Processing / Finish Type Selector */}
            {processingTypes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900">
                    {processingSectionHeading}
                  </h3>
                  <span className="text-xs sm:text-sm font-extrabold text-[#B22234]">
                    Selected: {activeProcessingType}
                  </span>
                </div>
                <div className={`grid gap-1.5 sm:gap-2.5 ${
                  processingTypes.length === 1
                    ? 'grid-cols-1'
                    : processingTypes.length === 2
                    ? 'grid-cols-2'
                    : processingTypes.length === 4
                    ? 'grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-3'
                }`}>
                  {processingTypes.map((type, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedProcessingType(type)}
                      className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold shadow-2xs border-2 transition-all cursor-pointer text-center leading-snug ${
                        activeProcessingType === type
                          ? 'bg-[#0B132B] border-[#0B132B] text-white ring-2 ring-slate-800 scale-[1.01]'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Explanatory Technical Detail Card */}
                {PROCESSING_FINISH_DETAILS[activeProcessingType] && (
                  <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-[13px] leading-relaxed shadow-2xs transition-all">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-1.5">
                        <Info className="w-4 h-4 text-[#B22234] shrink-0" />
                        <span className="font-bold text-slate-900">
                          {PROCESSING_FINISH_DETAILS[activeProcessingType].title}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#B22234]/10 text-[#B22234] border border-[#B22234]/20 shrink-0">
                        {PROCESSING_FINISH_DETAILS[activeProcessingType].methodType}
                      </span>
                    </div>
                    <p className="text-slate-600 font-normal pl-5">
                      {PROCESSING_FINISH_DETAILS[activeProcessingType].desc}
                    </p>
                  </div>
                )}

                {/* 100% Double Laser Sortex Cleaned Guarantee (Standard Included for Grains & Pulses) */}
                {(product.category === 'Wheat' || product.category === 'Beans and Pulses') && (
                  <div className="mt-3 p-3 sm:p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 flex items-start space-x-3 shadow-2xs">
                    <div className="p-1 rounded-full bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div className="text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-emerald-950 text-xs sm:text-[13px]">
                          100% Double Laser Sortex Cleaned
                        </span>
                        <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                          Included Standard
                        </span>
                      </div>
                      <p className="text-emerald-900/80 text-[11px] sm:text-xs mt-0.5 leading-relaxed font-normal">
                        Computerized optical sorting eliminates 99.8% foreign matter, stones, mud balls, and discolored kernels across all grade tiers.
                      </p>
                    </div>
                  </div>
                )}

                {/* Physical Form Specification Tag for Animal Feed */}
                {product.category === 'Animal Feed' && (
                  <div className="mt-3 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center space-x-2 text-xs text-slate-700">
                      <Package className="w-4 h-4 text-[#8C6D2B] shrink-0" />
                      <span className="font-bold text-slate-900">Available Physical Forms:</span>
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200/90 shadow-2xs">
                      {product.slug.includes('soy')
                        ? 'Available in Coarse Meal, De-Hulled Flakes, and Pellets on request.'
                        : product.slug.includes('rapeseed')
                        ? 'Available in Coarse Granular Meal and Pelletized Meal on request.'
                        : product.slug.includes('corn')
                        ? 'Available in Golden Granular Meal and Coarse DDGS on request.'
                        : 'Available in Ultra-Fine Meal and Granular Meal on request.'}
                    </span>
                  </div>
                )}

                {/* Certified Laboratory Protein Guarantee (Standard Included for Animal Feed) */}
                {product.category === 'Animal Feed' && (
                  <div className="mt-3 p-3 sm:p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 flex items-start space-x-3 shadow-2xs">
                    <div className="p-1 rounded-full bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div className="text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-emerald-950 text-xs sm:text-[13px]">
                          Certified Lab-Tested Analysis Guarantee
                        </span>
                        <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                          Included Standard
                        </span>
                      </div>
                      <p className="text-emerald-900/80 text-[11px] sm:text-xs mt-0.5 leading-relaxed font-normal">
                        Certified low moisture (&lt;10%), zero urease activity, high protein solubility, and zero fungal contamination guaranteed across both tiers.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Available Pack Sizes */}
            {packSizes.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2.5">
                  Select Packaging Size
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {packSizes.map((size, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPackSize(size)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border-2 transition-all cursor-pointer ${
                        activePackSize === size
                          ? 'bg-[#0B132B] border-[#0B132B] text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* High-Converting Action Buttons */}
            <div className="pt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => openEnquiryModal(activeProcessingType ? `${product.name} (${activeProcessingType})` : product.name)}
                  className="w-full flex items-center justify-center py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer text-center"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-amber-200 shrink-0" />
                  <span>Request Commercial Quote</span>
                </button>

                <a
                  href={getWhatsAppLink(`Hello Attri Nexus, I am interested in inquiring about ${product.name} ${activeProcessingType ? `(${activeProcessingType} finish)` : ''} (${activePackSize}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-[#0E7466] hover:bg-[#075E54] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all text-center"
                >
                  <WhatsAppIcon className="w-4 h-4 mr-2 fill-white shrink-0" />
                  <span>Instant WhatsApp Quote</span>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between text-xs text-slate-500 pt-2 px-1">
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8C6D2B] shrink-0" />
                  <span>Commercial Hotline: <strong className="text-slate-800">{BUSINESS_CONFIG.phonePrimary}</strong></span>
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center space-x-1 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Sensory & Laboratory Quality Highlights */}
      <section className="bg-white py-16 sm:py-20 border-y border-slate-200/80 mb-16 sm:mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] bg-amber-50 text-[#8C6D2B] border border-amber-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Institutional Quality Standards</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Technical Specifications & Physical Standards
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-light">
              Certified laboratory parameters, physical grain metrics, and sensory benchmark values for commercial trade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Aroma */}
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200/90 text-center shadow-xs hover:shadow-md hover:border-amber-400/80 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0B132B] text-amber-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Aroma & Purity
              </h3>
              <p className="font-serif text-xl font-extrabold text-slate-950">
                {specifications.aroma || 'Natural Fresh'}
              </p>
              <span className="block text-xs font-bold text-slate-700 mt-1.5">100% Sortex Lab Tested</span>
            </div>

            {/* Texture */}
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200/90 text-center shadow-xs hover:shadow-md hover:border-amber-400/80 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0B132B] text-amber-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Texture Profile
              </h3>
              <p className="font-serif text-xl font-extrabold text-slate-950">
                {specifications.texture || 'Consistent Grade'}
              </p>
              <span className="block text-xs font-bold text-slate-700 mt-1.5">Culinary & Industrial Standard</span>
            </div>

            {/* Grain Length / Structure */}
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200/90 text-center shadow-xs hover:shadow-md hover:border-amber-400/80 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0B132B] text-amber-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Grain Structure & Grade
              </h3>
              <p className="font-serif text-xl font-extrabold text-slate-950">
                {specifications.grainType || product.variety}
              </p>
              <span className="block text-xs font-bold text-slate-700 mt-1.5">Uniform Laser Sorted</span>
            </div>

            {/* Processing Standard */}
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200/90 text-center shadow-xs hover:shadow-md hover:border-amber-400/80 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#0B132B] text-amber-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Processing Grade
              </h3>
              <p className="font-serif text-xl font-extrabold text-slate-950">
                {specifications.cookingTime || 'Laser Sortex Cleaned'}
              </p>
              <span className="block text-xs font-bold text-slate-700 mt-1.5">Moisture-Barrier Packaging</span>
            </div>

          </div>

        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-8 pb-4 border-b border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8C6D2B]">Similar Portfolio</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Related Commodities in {product.category || 'Portfolio'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageSrc={product.image || '/images/products/attri_traditional_basmati.jpg'}
        title={product.name}
        category={product.category}
        description={product.shortDescription}
      />

    </div>
  );
};
