import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from '@/constants/products';
import { useProducts } from '../context/ProductsContext';
import { ProductCard } from '../components/ui/ProductCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Search, Filter, RefreshCw, MessageSquare, X, Check, Sparkles } from 'lucide-react';
import { useEnquiryModal } from '../context/EnquiryModalContext';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subCategoryParam = searchParams.get('subCategory');
  const processingTypeParam = searchParams.get('processingType') || searchParams.get('type');
  const varietyParam = searchParams.get('variety');

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (categoryParam) {
      const match = PRODUCT_CATEGORIES.find(
        (c) => c.toLowerCase() === categoryParam.toLowerCase()
      );
      if (match) return match;
    }
    return 'All';
  });

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(subCategoryParam || 'All');
  const [selectedProcessingType, setSelectedProcessingType] = useState<string>(processingTypeParam || 'All');
  const [selectedVariety, setSelectedVariety] = useState<string>(varietyParam || 'All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { products: productList } = useProducts();
  const { openEnquiryModal } = useEnquiryModal();

  // Keep state in sync if URL param changes
  useEffect(() => {
    if (categoryParam) {
      const match = PRODUCT_CATEGORIES.find(
        (c) => c.toLowerCase() === categoryParam.toLowerCase()
      );
      setSelectedCategory(match || categoryParam);
    } else {
      setSelectedCategory('All');
    }

    if (subCategoryParam) {
      setSelectedSubCategory(subCategoryParam);
    } else {
      setSelectedSubCategory('All');
    }

    if (processingTypeParam) {
      setSelectedProcessingType(processingTypeParam);
    } else {
      setSelectedProcessingType('All');
    }

    if (varietyParam) {
      setSelectedVariety(varietyParam);
    } else {
      setSelectedVariety('All');
    }
  }, [categoryParam, subCategoryParam, processingTypeParam, varietyParam]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubCategory('All');
    setSelectedProcessingType('All');
    setSelectedVariety('All');

    const params = new URLSearchParams();
    if (cat !== 'All') {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSubCategorySelect = (subCat: string) => {
    setSelectedSubCategory(subCat);
    setSelectedVariety('All');
    setSelectedProcessingType('All');
    const params = new URLSearchParams(searchParams);
    params.delete('variety');
    params.delete('processingType');
    params.delete('type');
    if (subCat === 'All') {
      params.delete('subCategory');
    } else {
      params.set('subCategory', subCat);
    }
    setSearchParams(params);
  };

  const handleProcessingTypeSelect = (type: string) => {
    setSelectedProcessingType(type);
    const params = new URLSearchParams(searchParams);
    if (type === 'All') {
      params.delete('processingType');
      params.delete('type');
    } else {
      params.set('processingType', type);
    }
    setSearchParams(params);
  };

  const handleVarietySelect = (variety: string) => {
    setSelectedVariety(variety);
    setSelectedProcessingType('All');
    const params = new URLSearchParams(searchParams);
    params.delete('processingType');
    params.delete('type');
    if (variety === 'All') {
      params.delete('variety');
    } else {
      params.set('variety', variety);
    }
    setSearchParams(params);
  };

  const handleReset = () => {
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setSelectedProcessingType('All');
    setSelectedVariety('All');
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      // Category filter
      let matchesCategory = true;
      const activeCat = selectedCategory.trim().toLowerCase();

      if (activeCat !== 'all' && activeCat !== '') {
        const pCat = (product.category || '').toLowerCase();

        if (activeCat === 'rice') {
          matchesCategory =
            pCat === 'rice' ||
            pCat === 'basmati' ||
            pCat === 'sona masoori' ||
            pCat === 'non-basmati';
        } else if (activeCat === 'animal feed' || activeCat === 'animal-feed' || activeCat === 'feed') {
          matchesCategory = pCat === 'animal feed' || pCat.includes('feed');
        } else if (activeCat === 'beans and pulses' || activeCat === 'beans-and-pulses' || activeCat === 'pulses' || activeCat === 'beans' || activeCat === 'dal') {
          matchesCategory = pCat === 'beans and pulses' || pCat.includes('pulse') || pCat.includes('bean') || pCat.includes('dal');
        } else if (activeCat === 'wheat') {
          matchesCategory = pCat === 'wheat';
        } else if (activeCat === 'wheat flour' || activeCat === 'wheat-flour' || activeCat === 'flour' || activeCat === 'atta') {
          matchesCategory = pCat === 'wheat flour' || pCat.includes('flour') || pCat.includes('atta');
        } else if (activeCat === 'wheat and wheat flour' || activeCat === 'wheat-and-wheat-flour') {
          matchesCategory = pCat === 'wheat' || pCat === 'wheat flour' || pCat.includes('wheat') || pCat.includes('atta');
        } else {
          matchesCategory = pCat === activeCat || pCat.includes(activeCat);
        }
      }

      // Sub-category filter
      let matchesSubCategory = true;
      if (selectedSubCategory !== 'All') {
        const pSub = (product.subCategory || '').toLowerCase();
        const pCat = (product.category || '').toLowerCase();
        const subSearch = selectedSubCategory.toLowerCase();

        if (selectedSubCategory === 'Basmati') {
          matchesSubCategory = pSub === 'basmati' || pCat === 'basmati';
        } else if (selectedSubCategory === 'Non-Basmati') {
          matchesSubCategory = pSub === 'non-basmati' || pCat === 'non-basmati' || pCat === 'sona masoori';
        } else {
          matchesSubCategory = 
            pSub === subSearch || 
            pSub.includes(subSearch) || 
            product.name.toLowerCase().includes(subSearch) || 
            product.variety.toLowerCase().includes(subSearch);
        }
      }

      // Processing / Broken type filter
      let matchesProcessingType = true;
      if (selectedProcessingType !== 'All') {
        const types = product.processingTypes || [];
        const procSearch = selectedProcessingType.toLowerCase();
        matchesProcessingType = types.some((t) => {
          const lower = t.toLowerCase();
          return lower === procSearch || lower.includes(procSearch);
        });
      }

      // Specific Variety filter
      let matchesVariety = true;
      if (selectedVariety !== 'All') {
        const v = selectedVariety.toLowerCase();
        if (v === '1718' || v === '1885' || v.includes('1718') || v.includes('1885')) {
          matchesVariety =
            product.name.includes('1718') ||
            product.name.includes('1885') ||
            product.variety.includes('1718') ||
            product.variety.includes('1885') ||
            product.slug.includes('1718') ||
            product.slug.includes('1885');
        } else if (v === 'ir64' || v === 'ir 64') {
          matchesVariety =
            product.slug.includes('ir64') ||
            product.slug.includes('ir-64') ||
            product.name.toLowerCase().includes('ir 64') ||
            product.variety.toLowerCase().includes('ir 64');
        } else if (v === 'swarna') {
          matchesVariety =
            product.slug.includes('swarna') ||
            product.name.toLowerCase().includes('swarna') ||
            product.variety.toLowerCase().includes('swarna');
        } else if (v === 'sona' || v === 'sona masoori' || v === 'sona masori' || v === 'sona-masoori') {
          matchesVariety =
            product.slug.includes('sona') ||
            product.name.toLowerCase().includes('sona') ||
            product.variety.toLowerCase().includes('sona');
        } else if (v === 'ponni') {
          matchesVariety =
            product.slug.includes('ponni') ||
            product.name.toLowerCase().includes('ponni') ||
            product.variety.toLowerCase().includes('ponni');
        } else if (v === 'kolam' || v === 'kolan') {
          matchesVariety =
            product.slug.includes('kolam') ||
            product.name.toLowerCase().includes('kolam') ||
            product.name.toLowerCase().includes('kolan') ||
            product.variety.toLowerCase().includes('kolam');
        } else if (v === 'jaya' || v === 'jaya boiled') {
          matchesVariety =
            product.slug.includes('jaya') ||
            product.name.toLowerCase().includes('jaya') ||
            product.variety.toLowerCase().includes('jaya');
        } else {
          matchesVariety =
            product.name.toLowerCase().includes(v) ||
            product.variety.toLowerCase().includes(v) ||
            product.slug.toLowerCase().includes(v);
        }
      }

      // Search query filter
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = q === '' ||
        product.name.toLowerCase().includes(q) ||
        product.variety.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.brandLine.toLowerCase().includes(q);

      return matchesCategory && matchesSubCategory && matchesProcessingType && matchesVariety && matchesSearch;
    });
  }, [productList, selectedCategory, selectedSubCategory, selectedProcessingType, selectedVariety, searchQuery]);

  // Dynamic header title & subtitle
  const headerInfo = useMemo(() => {
    if (selectedCategory === 'Rice') {
      if (selectedSubCategory === 'Basmati') {
        return {
          title: "Basmati Rice Collection",
          subtitle: "Pusa 1121, Pusa 1509, and Pusa 1718 & 1885 in Creamy Sella, Golden Sella, and Steamed finishes."
        };
      }
      if (selectedSubCategory === 'Non-Basmati') {
        return {
          title: "Non-Basmati Rice Collection",
          subtitle: "IR 64, Swarna, Sona Masoori, Ponni, Kolam, and Jaya Boiled Rice."
        };
      }
      return {
        title: "Rice Collection",
        subtitle: "Explore our Basmati & Non-Basmati varieties crafted for commercial distribution and premium retail."
      };
    }
    switch (selectedCategory) {
      case 'Animal Feed':
        return {
          title: "Animal & Livestock Feed",
          subtitle: "High-protein commercial feed meals & distillers grains: Soybean Meal (Soy DOC), Rapeseed Meal (Mustard DOC), and Corn & Rice DDGS."
        };
      case 'Beans and Pulses':
        return {
          title: "Beans & Pulses Collection",
          subtitle: "Red Kidney Bean, Peas, Black-Eyed Bean, Chickpeas, Toor, Red Lentils, Black Matpe & Green Mung Bean. High Protein, Rich in Fiber, Sortex Cleaned & Premium Quality."
        };
      case 'Wheat':
        return {
          title: "Wheat Grains Portfolio",
          subtitle: "Sortex-cleaned premium whole wheat varieties: Sharbati Wheat, Lokwan Wheat, Malviya Wheat, and Durum Wheat."
        };
      case 'Wheat Flour':
        return {
          title: "Wheat Flour Collection",
          subtitle: "Milled directly from our 4 wheat varieties (Sharbati, Lokwan, Malviya, Durum) with your choice of 4 processing methods: Stone Ground (Chakki), Roller Milling, Impact / Hammer Milling, or Pin Milling."
        };
      default:
        return {
          title: "Grain & Agro Collection",
          subtitle: "Explore our premium selection of Indian rice, livestock feeds, unpolished pulses, golden wheat, and pure chakki flour."
        };
    }
  }, [selectedCategory, selectedSubCategory]);

  return (
    <div className="py-12 sm:py-16">

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <SectionHeader
          badge={selectedCategory === 'All' ? "Multi-Commodity Catalogue" : selectedCategory}
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          align="center"
        />

        {/* Structured Filter & Search Card Container */}
        <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-md max-w-5xl xl:max-w-6xl mx-auto space-y-4 sm:space-y-5">

          {/* Top Search & Filter Info */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search products by name, variety, or grade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-14 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-semibold bg-slate-50 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200">
                <Filter className="w-3.5 h-3.5 text-[#B22234]" />
                <span>{filteredProducts.length} Products</span>
              </div>

              {(selectedCategory !== 'All' || selectedSubCategory !== 'All' || selectedProcessingType !== 'All' || selectedVariety !== 'All' || searchQuery !== '') && (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center text-xs text-[#B22234] hover:text-[#931B2A] font-semibold px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Main Category Tab Buttons inside Container (Enlarged) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2.5 xl:gap-3 pt-2 border-t border-slate-100">
            {PRODUCT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`flex items-center justify-center py-2.5 sm:py-3.5 px-1.5 sm:px-2.5 xl:px-4 rounded-xl text-[11px] sm:text-[13px] xl:text-sm font-semibold transition-all cursor-pointer text-center leading-tight ${
                    isSelected
                      ? 'bg-[#0B132B] text-white shadow-md ring-2 ring-slate-800 scale-[1.01]'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <span className="break-words line-clamp-2">{cat === 'Beans and Pulses' ? 'Beans & Pulses' : cat}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-Filters for Rice (Dynamic Counts) */}
          {selectedCategory === 'Rice' && (() => {
            const riceProducts = productList.filter((p) => p.category === 'Rice');
            const basmatiCount = riceProducts.filter((p) => p.subCategory === 'Basmati').length;
            const nonBasmatiCount = riceProducts.filter((p) => p.subCategory === 'Non-Basmati').length;
            const totalRiceCount = riceProducts.length;

            const riceSubCategories = [
              { label: 'All Rice', value: 'All', count: `${totalRiceCount} Products` },
              { label: 'Basmati Rice', value: 'Basmati', count: `${basmatiCount} Varieties` },
              { label: 'Non-Basmati Rice', value: 'Non-Basmati', count: `${nonBasmatiCount} Varieties` }
            ];

            const basmatiVarieties = [
              { label: 'All Varieties', value: 'All' },
              { label: 'Pusa 1121', value: '1121' },
              { label: 'Pusa 1509', value: '1509' },
              { label: 'Pusa 1718 & 1885', value: '1718' }
            ];

            const basmatiFinishes = [
              { label: 'All Finishes', value: 'All' },
              { label: 'Creamy Sella', value: 'Creamy' },
              { label: 'Golden Sella', value: 'Golden' },
              { label: 'Steamed', value: 'Steamed' }
            ];

            const nonBasmatiVarieties = [
              { label: 'All Varieties', value: 'All' },
              { label: 'IR 64', value: 'ir64' },
              { label: 'Swarna', value: 'swarna' },
              { label: 'Sona Masoori', value: 'sona' },
              { label: 'Ponni Rice', value: 'ponni' },
              { label: 'Kolam', value: 'kolam' },
              { label: 'Jaya', value: 'jaya' }
            ];

            const currentVarieties = selectedSubCategory === 'Basmati' ? basmatiVarieties : nonBasmatiVarieties;

            // Dynamically calculate finishes based on the specific selected variety
            let currentFinishes: { label: string; value: string }[] = [];
            let finishSectionTitle = 'GRAIN FINISH:';

            if (selectedSubCategory === 'Basmati') {
              finishSectionTitle = 'GRAIN FINISH:';
              currentFinishes = [
                { label: 'All Finishes', value: 'All' },
                { label: 'Creamy Sella', value: 'Creamy' },
                { label: 'Golden Sella', value: 'Golden' },
                { label: 'Steamed', value: 'Steamed' }
              ];
            } else if (selectedSubCategory === 'Non-Basmati') {
              const vNorm = (selectedVariety || '').toLowerCase();
              if (vNorm === 'ir64' || vNorm === 'ir 64' || vNorm.includes('ir')) {
                finishSectionTitle = 'AVAILABLE BROKEN GRADES:';
                currentFinishes = [
                  { label: 'All Grades', value: 'All' },
                  { label: '5% Broken', value: '5% Broken' },
                  { label: '15% Broken', value: '15% Broken' },
                  { label: '25% Broken', value: '25% Broken' }
                ];
              } else if (vNorm === 'swarna' || vNorm.includes('swarna')) {
                finishSectionTitle = 'AVAILABLE BROKEN GRADES:';
                currentFinishes = [
                  { label: 'All Grades', value: 'All' },
                  { label: '5% Broken', value: '5% Broken' },
                  { label: '15% Broken', value: '15% Broken' },
                  { label: '25% Broken', value: '25% Broken' }
                ];
              } else if (vNorm === 'sona' || vNorm.includes('sona')) {
                finishSectionTitle = 'PROCESSING FINISH:';
                currentFinishes = [
                  { label: 'All Finishes', value: 'All' },
                  { label: 'Steam', value: 'Steam' },
                  { label: 'Raw', value: 'Raw' },
                  { label: 'Boiled', value: 'Boiled' }
                ];
              } else if (vNorm === 'ponni' || vNorm.includes('ponni')) {
                finishSectionTitle = 'PROCESSING FINISH:';
                currentFinishes = [
                  { label: 'All Finishes', value: 'All' },
                  { label: 'Steamed', value: 'Steamed' },
                  { label: 'Boiled', value: 'Boiled' }
                ];
              } else if (vNorm === 'kolam' || vNorm.includes('kolam')) {
                finishSectionTitle = 'PROCESSING FINISH:';
                currentFinishes = [
                  { label: 'All Finishes', value: 'All' },
                  { label: 'Steam', value: 'Steam' },
                  { label: 'Raw', value: 'Raw' },
                  { label: 'Boiled', value: 'Boiled' }
                ];
              } else if (vNorm === 'jaya' || vNorm.includes('jaya')) {
                finishSectionTitle = 'PROCESSING FINISH:';
                currentFinishes = [
                  { label: 'All Finishes', value: 'All' },
                  { label: 'Boiled', value: 'Boiled' }
                ];
              } else {
                finishSectionTitle = 'GRADES & PROCESSING:';
                currentFinishes = [
                  { label: 'All Grades & Finishes', value: 'All' },
                  { label: '5% Broken', value: '5% Broken' },
                  { label: '15% Broken', value: '15% Broken' },
                  { label: '25% Broken', value: '25% Broken' },
                  { label: 'Steam', value: 'Steam' },
                  { label: 'Raw', value: 'Raw' },
                  { label: 'Boiled', value: 'Boiled' }
                ];
              }
            }

            const clearRiceFilters = () => {
              handleVarietySelect('All');
              handleProcessingTypeSelect('All');
            };

            return (
              <div className="space-y-3 pt-3 sm:pt-3.5 border-t border-slate-200 animate-fade-in">
                {/* Sub-Category Main Selector (Large Floating Tabs) */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                  {riceSubCategories.map((sub) => {
                    const isSelected = selectedSubCategory === sub.value;
                    return (
                      <button
                        key={sub.value}
                        onClick={() => handleSubCategorySelect(sub.value)}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0D3B2E] text-white shadow-md scale-[1.01]'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs hover:border-slate-300'
                        }`}
                      >
                        <span>{sub.label}</span>
                        <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-semibold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {sub.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-Filters Container (Option 3 Bold Floating Tabs) */}
                {selectedSubCategory !== 'All' && (
                  <div className="p-3 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5 sm:space-y-4">
                    {/* Variety Large Floating Tabs */}
                    <div className="space-y-2">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        VARIETY:
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                        {currentVarieties.map((v) => {
                          const isSelected = selectedVariety === v.value;
                          return (
                            <button
                              key={v.value}
                              onClick={() => handleVarietySelect(v.value)}
                              className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
                                isSelected
                                  ? 'bg-[#0D3B2E] text-white shadow-md scale-[1.01]'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                              <span>{v.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-slate-100" />

                    {/* Finish Large Floating Tabs (Dynamically adapted to selected variety) */}
                    <div className="space-y-2">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        {finishSectionTitle}
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                        {currentFinishes.map((t) => {
                          const isSelected = selectedProcessingType === t.value;
                          return (
                            <button
                              key={t.value}
                              onClick={() => handleProcessingTypeSelect(t.value)}
                              className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
                                isSelected
                                  ? 'bg-[#C5A059] text-[#0D3B2E] shadow-md scale-[1.01]'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                              <span>{t.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {(selectedVariety !== 'All' || selectedProcessingType !== 'All') && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={clearRiceFilters}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reset Filters</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Sub-Filters for Animal Feed (Option 3: Bold Floating Tabs) */}
          {selectedCategory === 'Animal Feed' && (
            <div className="p-3 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 animate-fade-in">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                FEED DIVISION:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                {[
                  { label: 'All Feed Items (3 Core)', value: 'All' },
                  { label: 'Soybean Meal (Soy DOC)', value: 'Soybean Meal' },
                  { label: 'Rapeseed Meal (Mustard DOC)', value: 'Rapeseed Meal' },
                  { label: 'Distillers Grains (DDGS)', value: 'DDGS' }
                ].map((sub) => {
                  const isSelected = selectedSubCategory === sub.value;
                  return (
                    <button
                      key={sub.value}
                      onClick={() => handleSubCategorySelect(sub.value)}
                      className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
                        isSelected
                          ? 'bg-[#0D3B2E] text-white shadow-md scale-[1.01]'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-Filters for Wheat (Option 3: Bold Floating Tabs) */}
          {selectedCategory === 'Wheat' && (
            <div className="p-3 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 animate-fade-in">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                GRAIN SELECTION:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                {[
                  { label: 'All Wheat Grains (4 Varieties)', value: 'All' },
                  { label: 'Sharbati Wheat', value: 'Sharbati' },
                  { label: 'Lokwan Wheat', value: 'Lokwan' },
                  { label: 'Malviya Wheat', value: 'Malviya' },
                  { label: 'Durum Wheat', value: 'Durum' }
                ].map((sub) => {
                  const isSelected = selectedSubCategory === sub.value;
                  return (
                    <button
                      key={sub.value}
                      onClick={() => handleSubCategorySelect(sub.value)}
                      className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
                        isSelected
                          ? 'bg-[#0D3B2E] text-white shadow-md scale-[1.01]'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-Filters for Wheat Flour (Option 3: Bold Floating Tabs) */}
          {selectedCategory === 'Wheat Flour' && (
            <div className="p-3 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5 sm:space-y-4 animate-fade-in">
              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  MILLED FROM:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                  {[
                    { label: 'All Flours (4 Milled Varieties)', value: 'All' },
                    { label: 'Sharbati Flour', value: 'Sharbati' },
                    { label: 'Lokwan Flour', value: 'Lokwan' },
                    { label: 'Malviya Flour', value: 'Malviya' },
                    { label: 'Durum Semolina & Flour', value: 'Durum' }
                  ].map((sub) => {
                    const isSelected = selectedSubCategory === sub.value;
                    return (
                      <button
                        key={sub.value}
                        onClick={() => handleSubCategorySelect(sub.value)}
                        className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
                          isSelected
                            ? 'bg-[#0D3B2E] text-white shadow-md scale-[1.01]'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-100" />

              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  MILLING METHOD:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                  {[
                    { label: 'All Methods', value: 'All' },
                    { label: 'Stone Ground (Chakki)', value: 'Stone Ground' },
                    { label: 'Roller Milling', value: 'Roller Milling' },
                    { label: 'Impact / Hammer Milling', value: 'Impact / Hammer' },
                    { label: 'Pin Milling', value: 'Pin Milling' },
                  ].map((t) => {
                    const isSelected = selectedProcessingType === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => handleProcessingTypeSelect(t.value)}
                        className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
                          isSelected
                            ? 'bg-[#C5A059] text-[#0D3B2E] shadow-md scale-[1.01]'
                            : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Filters for Beans and Pulses (Option 3: Bold Floating Tabs) */}
          {selectedCategory === 'Beans and Pulses' && (
            <div className="p-3 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5 animate-fade-in">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                PULSE & BEAN SELECTION:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                {[
                  { label: 'All Beans & Pulses (8 Items)', value: 'All' },
                  { label: 'Red Kidney Bean (Rajma)', value: 'Red Kidney Bean' },
                  { label: 'Peas (Matar)', value: 'Peas' },
                  { label: 'Black-Eyed Bean (Lobia)', value: 'Black-Eyed Bean' },
                  { label: 'Chickpeas (Kabuli)', value: 'Chickpeas' },
                  { label: 'Toor (Arhar Dal)', value: 'Toor' },
                  { label: 'Red Lentils (Masoor)', value: 'Red Lentils' },
                  { label: 'Black Matpe (Urad)', value: 'Black Matpe' },
                  { label: 'Green Mung Bean (Moong)', value: 'Green Mung Bean' }
                ].map((sub) => {
                  const isSelected = selectedSubCategory === sub.value;
                  return (
                    <button
                      key={sub.value}
                      onClick={() => handleSubCategorySelect(sub.value)}
                      className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
                        isSelected
                          ? 'bg-[#0D3B2E] text-white shadow-md scale-[1.01]'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Product Grid or Empty State */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selectedProcessingType={selectedProcessingType !== 'All' ? selectedProcessingType : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-xl mx-auto shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              No matching commodities found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              We did not find any products matching your specific filter or query. Reset filters or contact our commercial sales team directly.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                onClick={() => openEnquiryModal()}
                className="px-4 py-2 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 inline mr-1" />
                Submit Enquiry
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
