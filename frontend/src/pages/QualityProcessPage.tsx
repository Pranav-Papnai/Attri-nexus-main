import React, { useState } from 'react';
import { PROCESS_STEPS } from '@/constants/process';
import { ShieldCheck, Check, Sparkles, PackageCheck, Truck, Cog, Wheat, FileText } from 'lucide-react';
import { LabReportModal } from '@/components/ui/LabReportModal';

export const QualityProcessPage: React.FC = () => {
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);

  const iconMap: Record<string, React.ReactNode> = {
    Wheat: <Wheat className="w-5 h-5" />,
    Cog: <Cog className="w-5 h-5" />,
    ShieldCheck: <ShieldCheck className="w-5 h-5" />,
    PackageCheck: <PackageCheck className="w-5 h-5" />,
    Truck: <Truck className="w-5 h-5" />
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="relative bg-[#0B132B] text-white py-16 sm:py-20 overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] border border-amber-400/30 bg-amber-400/10 text-amber-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Attri Nexus Quality Protocol</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Quality You Can <span className="font-serif italic font-normal text-amber-300">Rely Upon.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-light">
              From origin farm testing and traditional stone-milling to laser sorting and moisture-locked export packaging — rigorous quality control is engineered into every single consignment.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 max-w-lg mx-auto">
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="block text-base sm:text-xl font-bold text-amber-300">99.8%</span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate block">Grain Purity</span>
              </div>
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="block text-base sm:text-xl font-bold text-white">5 Divisions</span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate block">Agro Lines</span>
              </div>
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="block text-base sm:text-xl font-bold text-amber-300">100%</span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate block">Lab Tested</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 5-STEP PROTOCOL */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8C6D2B] block mb-1">
              End-to-End Precision
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              The Attri Nexus 5-Step Process
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-light">
              Explore how our structured approach maintains consistent grain purity, balanced livestock nutrition, and tamper-evident packaging.
            </p>
          </div>

          {/* Top Row: 3 Steps (01, 02, 03) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {PROCESS_STEPS.slice(0, 3).map((step) => (
              <div 
                key={step.stepNumber}
                className="bg-slate-50/70 p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#B22234] flex items-center justify-center shadow-2xs">
                      {iconMap[step.icon] || <Sparkles className="w-5 h-5 text-[#B22234]" />}
                    </div>
                    <span className="text-2xl font-bold text-slate-300 group-hover:text-slate-500 transition-colors">
                      {step.stepNumber}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mb-1 tracking-tight">
                    {step.title}
                  </h3>
                  
                  <p className="text-xs font-semibold text-[#8C6D2B] mb-2.5">
                    {step.shortDesc}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-light">
                    {step.fullDesc}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-200/80 space-y-1.5">
                  {step.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-[#8C6D2B] mr-2 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row: 2 Steps (04, 05) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PROCESS_STEPS.slice(3, 5).map((step) => (
              <div 
                key={step.stepNumber}
                className="bg-slate-50/70 p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#B22234] flex items-center justify-center shadow-2xs">
                      {iconMap[step.icon] || <Sparkles className="w-5 h-5 text-[#B22234]" />}
                    </div>
                    <span className="text-2xl font-bold text-slate-300 group-hover:text-slate-500 transition-colors">
                      {step.stepNumber}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mb-1 tracking-tight">
                    {step.title}
                  </h3>
                  
                  <p className="text-xs font-semibold text-[#8C6D2B] mb-2.5">
                    {step.shortDesc}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-light">
                    {step.fullDesc}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-200/80 space-y-1.5">
                  {step.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-[#8C6D2B] mr-2 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. LAB TESTING & CERTIFICATION COMMITMENT */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0B132B] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="max-w-3xl space-y-4 text-left">
              <span className="text-amber-400 text-[11px] font-bold uppercase tracking-[0.16em]">
                Lab Verification
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Certified Testing For Every Bulk Consignment
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-light">
                We provide physical and chemical lab analysis reports for moisture levels, average grain length (AGL), elongation ratio, crude protein (CP) in animal feed, and zero adulteration on pulses.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setIsLabModalOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Request Spec Sheet & Lab Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Certified Lab Report Modal */}
      <LabReportModal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
      />

    </div>
  );
};
