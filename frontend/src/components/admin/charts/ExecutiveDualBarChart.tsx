import React from 'react';

export interface DualBarItem {
  label: string;
  subLabel?: string;
  value: number;
  total: number;
  color: string;
}

interface ExecutiveDualBarChartProps {
  title: string;
  subtitle?: string;
  bars: DualBarItem[];
  isDark: boolean;
}

export const ExecutiveDualBarChart: React.FC<ExecutiveDualBarChartProps> = ({
  title,
  subtitle,
  bars,
  isDark
}) => {
  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all flex flex-col justify-between ${
        isDark ? 'bg-[#131922] border-white/10' : 'bg-white border-[#E8E2D6]'
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            PERFORMANCE RATIO
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

      {/* Comparative Horizontal Progress Bars */}
      <div className="space-y-6 my-auto py-2">
        {bars.map((bar, idx) => {
          const pct = Math.min(Math.round((bar.value / (bar.total || 1)) * 100), 100);

          return (
            <div key={idx} className="space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3 h-3 rounded-full shadow-xs ring-2 ring-white/20" style={{ backgroundColor: bar.color }} />
                  <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1E232B]'}`}>
                    {bar.label}
                  </span>
                  {bar.subLabel && (
                    <span className="text-[11px] text-gray-400 hidden sm:inline">
                      ({bar.subLabel})
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2.5">
                  <span className={`font-mono font-extrabold ${isDark ? 'text-[#DFD1BA]' : 'text-[#0D3B2E]'}`}>
                    {bar.value} / {bar.total}
                  </span>
                  <span
                    className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg shadow-xs"
                    style={{
                      backgroundColor: `${bar.color}22`,
                      color: bar.color
                    }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Robust, Tall Progress Track (h-5 sm:h-6) */}
              <div className="w-full h-5 sm:h-6 rounded-2xl bg-slate-100 dark:bg-white/[0.05] p-1 border border-slate-200/60 dark:border-white/10 shadow-inner overflow-hidden flex items-center">
                <div
                  style={{
                    width: `${pct}%`,
                    backgroundColor: bar.color
                  }}
                  className="h-full rounded-xl transition-all duration-700 shadow-sm relative overflow-hidden"
                >
                  {/* Glass highlight strip */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/20 rounded-t-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Insight */}
      <div className={`pt-4 border-t text-[11px] flex items-center justify-between ${
        isDark ? 'border-white/10 text-gray-400' : 'border-[#E8E2D6] text-[#786F60]'
      }`}>
        <span className="font-medium">Capacity Benchmark:</span>
        <span className="font-bold text-[#0D3B2E] dark:text-[#DFD1BA]">High Conversion & Supply Stability (100% Export-Grade)</span>
      </div>
    </div>
  );
};
