import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BUSINESS_CONFIG } from '@/constants/business';
import { ShieldCheck, Award, HeartHandshake, Sparkles, ArrowRight, CheckCircle2, Globe2, ExternalLink, Scale } from 'lucide-react';
import { useEnquiryModal } from '../context/EnquiryModalContext';

export const AboutPage: React.FC = () => {
  const { openEnquiryModal } = useEnquiryModal();

  return (
    <div className="py-12 sm:py-16">
      
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 sm:mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] border border-amber-200/80 bg-amber-50/60 text-[#8C6D2B] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>About Attri Nexus</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.08]">
            Pure Commodities. <br />
            <span className="font-serif italic font-normal text-[#8C6D2B]">Exceptional Global Supply.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-light">
            Attri Nexus is a premier Indian agricultural commodities enterprise supplying pure grains, high-protein livestock feeds, stone-ground flours, and unpolished pulses to households, dairy enterprises, and commercial trade partners worldwide.
          </p>
        </div>
      </section>

      {/* Brand Heritage & Philosophy Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8C6D2B]">
              <span className="w-5 h-[2px] bg-[#B22234]" />
              <span>Our Agricultural Vision</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              From Prime Farm Belts to Modern Processing
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              Food staples and livestock nutrition are the backbone of thriving communities and robust commercial supply chains. At Attri Nexus, we manage five dedicated agricultural divisions designed to deliver uncompromised purity and consistent bulk supply.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              We pair generations of Indian crop knowledge with automated optical color sorting, cold stone-milling chakkis, hygienic feed compounding, and moisture-barrier protective packaging.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                <span>Connect with Commercial Desk</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden text-left">
              <div className="relative z-10 space-y-5">
                <div className="w-12 h-12 rounded-full bg-white p-0.5 border border-slate-200">
                  <img
                    src={BUSINESS_CONFIG.logo}
                    alt="Attri Nexus Emblem"
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Our Multi-Commodity Commitment
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  Trust is earned bag by bag. Whether it is our aged Pusa 1121 Basmati, NutriCattle 20%+ protein dairy feed, stone-ground MP Sharbati Chakki Atta, or unpolished Toor Dal, every consignment adheres to strict laboratory standards.
                </p>

                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center space-x-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Direct farm & mandi origin verification</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Advanced optical laser sorting & lab analysis</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Durable moisture-lock multi-layer packaging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Brand Values */}
      <section className="bg-slate-50 py-16 sm:py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionHeader
            badge="Guiding Principles"
            title="The Values We Stand By"
            subtitle="The fundamental standards shaping every decision at Attri Nexus."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#B22234] mb-4">
                <Award className="w-5 h-5 text-[#B22234]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-1.5 tracking-tight">
                Purity & Natural Integrity
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                We supply genuine commodities with zero chemical bleaching, zero artificial polish on pulses, and nutrient-dense formulations for cattle.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#B22234] mb-4">
                <ShieldCheck className="w-5 h-5 text-[#B22234]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-1.5 tracking-tight">
                Batch Consistency
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                From bag to bag and season to season, we ensure our partners, dairies, and commercial kitchens experience the exact same high performance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#B22234] mb-4">
                <HeartHandshake className="w-5 h-5 text-[#B22234]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-1.5 tracking-tight">
                Customer & Trade Trust
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                Building enduring relationships with grain traders, dairy cooperatives, wholesale distributors, and export importers through dependable supply.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Strategic Corporate Alliances & Institutional Ecosystem */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5 text-[#0D3B2E]" />
              <span>Corporate Ecosystem & Group Alliances</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Institutional Trade & Legal Network
            </h2>
            <p className="text-sm text-slate-600 font-light max-w-2xl mx-auto">
              Strategic cross-border commodity alliances and institutional legal governance powering Attri Nexus operations worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: International Trade Network: VSASL (Myanmar) */}
            <div className="bg-gradient-to-br from-[#0B132B] via-[#162238] to-[#1F2D4A] rounded-3xl p-7 sm:p-9 text-white border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#DFD1BA] text-[10px] font-bold uppercase tracking-wider">
                  <Globe2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Cross-Border Commercial Alliance</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                  International Trade Network: <span className="text-[#DFD1BA]">VSASL (Myanmar)</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  Through our strategic sister affiliate, <strong className="text-white font-semibold">Vardaan Steel & Agro Science Ltd. (VSASL)</strong> based in Myanmar, we facilitate bilateral agro-commodity supply chains, cross-border procurement, and containerized distribution across Southeast Asian trade corridors.
                </p>

                <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-300">Strategic Hub</span>
                    <span className="text-xs font-semibold text-white mt-0.5 block truncate">Yangon, Myanmar</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-300">Operations</span>
                    <span className="text-xs font-semibold text-white mt-0.5 block truncate">Bilateral Agro Trade</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-300">Freight</span>
                    <span className="text-xs font-semibold text-white mt-0.5 block truncate">Containerized Sea</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Official Global Portal</span>
                  <span className="text-base font-serif font-bold text-white">vsasl.com</span>
                </div>
                <a
                  href="https://vsasl.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#b08e4d] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all group/btn cursor-pointer"
                >
                  <span>Visit vsasl.com</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Card 2: Corporate Legal Counsel & Advisory: Vardaan’s Law & Associates */}
            <div className="bg-gradient-to-br from-[#0D3B2E] via-[#123E32] to-[#1B4B3D] rounded-3xl p-7 sm:p-9 text-white border border-[#C5A059]/40 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#DFD1BA]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#DFD1BA] text-[10px] font-bold uppercase tracking-wider">
                  <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Corporate Governance & Legal Counsel</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Legal Advisory & Compliance: <span className="text-[#DFD1BA]">Vardaan’s Law & Associates</span>
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed">
                  Institutional legal advisory and corporate counsel overseeing Attri Nexus cross-border trade contracts, bilateral supply agreements, regulatory DGFT & FSSAI export compliances, customs advisory, and international commercial arbitration.
                </p>

                <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-200">Practice Area</span>
                    <span className="text-xs font-semibold text-white mt-0.5 block truncate">Trade & Commercial Law</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-200">Compliance</span>
                    <span className="text-xs font-semibold text-white mt-0.5 block truncate">Export & DGFT Rules</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-200">Advisory</span>
                    <span className="text-xs font-semibold text-white mt-0.5 block truncate">Contracts & Disputes</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold block">Institutional Counsel</span>
                  <span className="text-base font-serif font-bold text-[#DFD1BA]">Vardaan’s Law & Associates</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-[#DFD1BA] text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Authorized Counsel</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          Explore Our Agricultural Spectrum
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6 font-light">
          Discover our full range of Rice, Animal Feed, Wheat Grains, Wheat Flour, and Pulses, or connect with our sales team.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
          >
            Explore Product Portfolio
          </Link>
          <Link
            to="/bulk-enquiry"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs"
          >
            Commercial Bulk Enquiry
          </Link>
        </div>
      </section>

    </div>
  );
};
