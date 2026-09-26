import React from 'react';
import { Award, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { motion } from 'motion/react';

export const TrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: Award,
      title: "5 Agro Divisions",
      desc: "Rice, Feed, Wheat, Flour & Pulses"
    },
    {
      icon: ShieldCheck,
      title: "Certified Lab Purity",
      desc: "Moisture & protein verification"
    },
    {
      icon: Sparkles,
      title: "Sortex Optical Clean",
      desc: "Dust-free sorting & stone-milling"
    },
    {
      icon: Truck,
      title: "Bulk & Export Logistics",
      desc: "Containerized global shipments"
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-20 -mt-8 sm:-mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-md p-5 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={idx} 
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center space-x-3.5 pt-3 sm:pt-0 group ${idx !== 0 ? 'lg:pl-6' : ''}`}
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-[#B22234] group-hover:bg-[#B22234] group-hover:text-white group-hover:scale-105 transition-all duration-300">
                  <Icon className="w-5 h-5 transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-tight">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

