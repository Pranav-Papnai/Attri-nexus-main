import React, { useState } from 'react';

export interface BarCategoryItem {
  label: string;
  shortLabel?: string;
  value: number;
  color: string;
  emoji?: string;
  subText?: string;
}

interface ExecutiveBarChartProps {
  title: string;
  subtitle?: string;
  data: BarCategoryItem[];
  isDark: boolean;
}

export const ExecutiveBarChart: React.FC<ExecutiveBarChartProps> = ({
  title,
  subtitle,
  data,
  isDark
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  const maxValue = Math.max(...data.map((d) => d.value), 6);
  const ceiling = Math.ceil(maxValue * 1.2);

  // 4 clear horizontal grid steps
  const yTicks = [
    ceiling,
    Math.round(ceiling * 0.75),
    Math.round(ceiling * 0.5),
    Math.round(ceiling * 0.25),
    0
  ];

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all flex flex-col justify-between ${
        isDark ? 'bg-[#131922] border-white/10' : 'bg-white border-[#E8E2D6]'
      }`}
    >
      {/* Header with Title and Live Metric Highlight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] bg-[#0D3B2E] text-[#DFD1BA] border border-[#C5A059]/40">
              COMMODITY MATRIX
            </span>
            <h3 className={`text-sm sm:text-base font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0D3B2E]'}`}>
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-[#64748B]'}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Dynamic Highlight on Hover */}
        <div className={`px-3.5 py-1.5 rounded-2xl border transition-all text-right ${
          hoveredIdx !== null
            ? isDark ? 'bg-white/10 border-white/20' : 'bg-[#FAF8F5] border-[#C5A059]/40'
            : isDark ? 'bg-white/5 border-transparent' : 'bg-slate-50 border-slate-200/80'
        }`}>
          <span className={`text-sm sm:text-base font-extrabold font-mono ${isDark ? 'text-white' : 'text-[#0D3B2E]'}`}>
            {hoveredIdx !== null ? data[hoveredIdx].value : total} SKUs
          </span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {hoveredIdx !== null ? data[hoveredIdx].label : 'Total Catalog Range'}
          </span>
        </div>
      </div>

      {/* Expanded, Taller Bar Chart Canvas (h-64 sm:h-72) */}
      <div className="relative pt-6 pb-2">
        {/* Horizontal Background Guidelines */}
        <div className="absolute inset-x-0 top-6 bottom-16 flex flex-col justify-between pointer-events-none">
          {yTicks.map((tick, i) => (
            <div key={i} className="flex items-center space-x-3">
              <span className={`text-[11px] font-mono font-bold w-6 text-right ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                {tick}
              </span>
              <div className={`flex-1 border-b ${isDark ? 'border-white/8' : 'border-slate-200/90'} border-dashed`} />
            </div>
          ))}
        </div>

        {/* Tall Columns Grid with Spacious Width & Column Tower Tracks */}
        <div className="grid grid-cols-4 gap-4 sm:gap-8 md:gap-10 pl-10 pr-4 relative z-10 h-64 sm:h-72 items-end pb-12">
          {data.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const barHeightPct = Math.max((item.value / ceiling) * 100, 10);
            const sharePct = Math.round((item.value / total) * 100);

            return (
              <div
                key={idx}
                className="flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Floating Value Pill with Count and Percentage */}
                <div
                  className={`mb-2 px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all duration-300 flex items-center space-x-1 shadow-md ${
                    isHovered
                      ? 'scale-110 -translate-y-1 ring-2 ring-white/30'
                      : 'opacity-95'
                  }`}
                  style={{
                    backgroundColor: isHovered ? item.color : (isDark ? '#1C2533' : '#F1ECE1'),
                    color: isHovered ? '#FFFFFF' : (isDark ? '#DFD1BA' : '#0D3B2E')
                  }}
                >
                  <span className="font-extrabold">{item.value}</span>
                  <span className="text-[10px] opacity-75">({sharePct}%)</span>
                </div>

                {/* Substantial, Wide Column Tower Track */}
                <div className="w-12 sm:w-16 md:w-20 lg:w-24 h-48 sm:h-56 bg-slate-100/80 dark:bg-white/[0.04] rounded-t-2xl p-1 sm:p-1.5 flex items-end justify-center border border-slate-200/60 dark:border-white/5 transition-all group-hover:border-slate-300 dark:group-hover:border-white/15">
                  {/* Active Colored Fill Bar */}
                  <div
                    style={{
                      height: `${barHeightPct}%`,
                      backgroundColor: item.color
                    }}
                    className={`w-full rounded-t-xl transition-all duration-500 relative overflow-hidden shadow-sm ${
                      isHovered
                        ? 'brightness-110 shadow-lg scale-y-102 origin-bottom'
                        : 'group-hover:brightness-105'
                    }`}
                  >
                    {/* Top glass reflection highlight */}
                    <div className="absolute inset-x-0 top-0 h-2 bg-white/30 rounded-t-xl" />
                  </div>
                </div>

                {/* X-Axis Category Name & Emoji */}
                <div className="mt-3 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {item.emoji && <span className="text-sm">{item.emoji}</span>}
                    <span className={`text-xs sm:text-sm font-bold tracking-tight truncate max-w-[85px] sm:max-w-none transition-colors ${
                      isHovered
                        ? (isDark ? 'text-white' : 'text-[#0D3B2E]')
                        : (isDark ? 'text-gray-300' : 'text-[#2D3748]')
                    }`}>
                      {item.shortLabel || item.label}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block mt-0.5">
                    {item.value} Products
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High-Converting Summary Legend with SKUs & Shares */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-200/80 dark:border-white/10 mt-2">
        {data.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const sharePct = Math.round((item.value / total) * 100);

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isHovered
                  ? isDark
                    ? 'bg-white/10 border-white/20 shadow-sm'
                    : 'bg-[#FAF8F5] border-[#C5A059]/40 shadow-sm'
                  : isDark
                  ? 'bg-white/5 border-transparent'
                  : 'bg-slate-50 border-slate-200/60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className={`text-xs font-bold truncate ${isDark ? 'text-gray-200' : 'text-[#1E232B]'}`}>
                  {item.shortLabel || item.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] mt-1 pl-4.5 font-mono">
                <span className="text-gray-400 font-semibold">{item.value} SKUs</span>
                <span className="font-bold" style={{ color: item.color }}>{sharePct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
