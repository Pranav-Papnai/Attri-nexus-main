import React, { useState, useMemo } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { FAQS, FAQ_CATEGORIES } from '@/constants/faqs';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { getWhatsAppLink } from '@/constants/business';
import { useEnquiryModal } from '../context/EnquiryModalContext';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';

export const FAQPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);
  const { openEnquiryModal } = useEnquiryModal();

  const toggleAccordion = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    return FAQS.filter(faq => {
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="py-12 sm:py-16 bg-slate-50/60 min-h-screen">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <SectionHeader
          badge="Knowledge Base"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our commodity portfolio, quality parameters, and bulk commercial ordering procedures."
          align="center"
        />

        {/* Search & Category Filter */}
        <div className="max-w-3xl mx-auto space-y-4 mt-6">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search trade terms, quality parameters, packaging..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] shadow-2xs font-medium"
            />
          </div>

          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {FAQ_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B132B] text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs transition-all text-left"
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D2B] px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/60 w-fit shrink-0">
                      {faq.category}
                    </span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#0B132B] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-light border-t border-slate-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-slate-800">No matching questions found</h3>
            <p className="text-xs text-slate-500">
              Try searching with different keywords or clear your search query.
            </p>
          </div>
        )}
      </div>

      {/* Direct Contact Prompt */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 text-center space-y-4">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
            Have a Specific Commercial Query?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-light leading-relaxed">
            Our trade specialists are on standby to provide custom laboratory test parameters, FOB/CIF pricing, and sample delivery options.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => openEnquiryModal()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
            >
              Submit Trade Enquiry
            </button>
            <a
              href={getWhatsAppLink("Hello Attri Nexus, I have a question regarding commercial supply terms.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#0E7466] hover:bg-[#075E54] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 mr-2 fill-white" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
