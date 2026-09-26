import React from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { WHY_US_PILLARS, B2B_BENEFITS } from '@/constants/whyUs';
import { Award, Target, Sparkles, CheckCircle2, ShieldAlert, Users, Check, ArrowRight, Building2, Utensils, Store, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEnquiryModal } from '../context/EnquiryModalContext';

export const WhyUsPage: React.FC = () => {
  const { openEnquiryModal } = useEnquiryModal();

  const iconMap: Record<string, React.ReactNode> = {
    Award: <Award className="w-5 h-5 text-[#B22234]" />,
    Target: <Target className="w-5 h-5 text-[#B22234]" />,
    Sparkles: <Sparkles className="w-5 h-5 text-[#B22234]" />,
    CheckCircle2: <CheckCircle2 className="w-5 h-5 text-[#B22234]" />,
    ShieldAlert: <ShieldAlert className="w-5 h-5 text-[#B22234]" />,
    Users: <Users className="w-5 h-5 text-[#B22234]" />
  };

  const b2bIconMap: Record<string, React.ReactNode> = {
    Building2: <Building2 className="w-5 h-5 text-amber-400" />,
    Utensils: <Utensils className="w-5 h-5 text-amber-400" />,
    Store: <Store className="w-5 h-5 text-amber-400" />,
    Globe: <Globe className="w-5 h-5 text-amber-400" />
  };

  return (
    <div className="py-12 sm:py-16">
      
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 sm:mb-16">
        <div className="text-center max-w-2xl mx-auto space-y-3.5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] border border-amber-200/80 bg-amber-50/60 text-[#8C6D2B] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>The Competitive Edge</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
            Why Choose Attri Nexus
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto font-light">
            In an industry where grain standards can vary wildly, Attri Nexus represents unswerving consistency, certified purity, and disciplined trade partnerships.
          </p>
        </div>
      </section>

      {/* 6 Core Feature Blocks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group text-left"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                  {iconMap[pillar.icon] || <Award className="w-5 h-5 text-[#B22234]" />}
                </div>

                <h3 className="font-serif text-xl font-bold text-slate-900 mb-1 tracking-tight">
                  {pillar.title}
                </h3>
                
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8C6D2B] mb-2.5">
                  {pillar.tagline}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-light">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-3.5 border-t border-slate-100 space-y-1.5">
                {pillar.keyPoints.map((pt, idx) => (
                  <div key={idx} className="flex items-center text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-[#8C6D2B] mr-2 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tailored For Every Business Model */}
      <section className="bg-[#0B132B] text-white py-16 sm:py-20 border-y border-slate-800 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionHeader
            badge="Trade Specialization"
            title="Tailored for B2B & Retail Sectors"
            subtitle="How Attri Nexus empowers trade partners across wholesale, foodservice, and modern retail channels."
            align="center"
            light={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {B2B_BENEFITS.map((item, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 hover:bg-slate-900 transition-colors flex flex-col justify-between text-left"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
                    {b2bIconMap[item.icon] || <Building2 className="w-5 h-5 text-amber-400" />}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-800 text-xs font-semibold text-amber-400">
                  Institutional Trade Standard
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Action Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Ready to Elevate Your Agro Sourcing?
        </h2>
        <p className="text-sm text-slate-600 max-w-lg mx-auto font-light">
          Connect directly with our commercial desk for sample evaluation, lab specs, and wholesale container pricing.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => openEnquiryModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
          >
            <span>Request Commercial Quotation</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs"
          >
            Browse Products
          </Link>
        </div>
      </section>

    </div>
  );
};
