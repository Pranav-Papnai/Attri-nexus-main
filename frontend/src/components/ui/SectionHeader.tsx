import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  light = false
}) => {
  const alignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto'
  }[align];

  return (
    <div className={`flex flex-col max-w-3xl mb-8 sm:mb-10 ${alignmentClass}`}>
      {badge && (
        <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] mb-3 border ${
          light
            ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
            : 'border-amber-200/80 bg-amber-50/60 text-[#8C6D2B] shadow-2xs'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#B22234]" />
          <span>{badge}</span>
        </div>
      )}
      
      <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] ${
        light ? 'text-white' : 'text-slate-900'
      }`}>
        {title}
      </h2>

      {subtitle && (
        <p className={`mt-3 text-sm sm:text-base md:text-lg leading-relaxed font-light ${
          light ? 'text-slate-300' : 'text-slate-600'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
