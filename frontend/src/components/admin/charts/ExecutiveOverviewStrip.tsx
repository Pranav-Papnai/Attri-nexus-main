import React from 'react';

export interface CategoryProgressItem {
  id: string;
  name: string;
  count: number;
  pct: number;
  color: string;
}

export interface DivisionItem {
  name: string;
  count: number;
  pct: number;
  color: string;
}

export interface StatusSummaryItem {
  label: string;
  count: number;
  color: string;
}

interface ExecutiveOverviewStripProps {
  categories: CategoryProgressItem[];
  divisions: DivisionItem[];
  statuses: StatusSummaryItem[];
  isDark: boolean;
}

export const ExecutiveOverviewStrip: React.FC<ExecutiveOverviewStripProps> = ({
  categories,
  divisions,
  statuses,
  isDark
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Col 1: BY CATEGORY (5 cols) */}
      <div
        className={`lg:col-span-5 p-5 rounded-3xl border shadow-sm transition-all flex flex-col justify-between ${
          isDark ? 'bg-[#131922] border-white/10' : 'bg-white border-[#E8E2D6]'
        }`}
      >
        <div className="mb-3">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#DFD1BA]' : 'text-[#0D3B2E]'}`}>
            BY CATEGORY
          </h3>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-[#64748B]'}`}>
            Catalog products & inquiries distribution
          </p>
        </div>

        <div className="space-y-3 my-auto">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-2 truncate">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-[#1E232B]'}`}>
                    {cat.name}
                  </span>
                </span>
                <span className="font-mono text-xs font-bold text-[#64748B] dark:text-gray-400">
                  {cat.count} <span className="text-[10px] font-normal">({cat.pct}%)</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <div
                  style={{ width: `${Math.max(cat.pct, 4)}%`, backgroundColor: cat.color }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Col 2: BY DIVISION / CHANNELS (4 cols) */}
      <div
        className={`lg:col-span-4 p-5 rounded-3xl border shadow-sm transition-all flex flex-col justify-between ${
          isDark ? 'bg-[#131922] border-white/10' : 'bg-white border-[#E8E2D6]'
        }`}
      >
        <div className="mb-3">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#DFD1BA]' : 'text-[#0D3B2E]'}`}>
            BY INQUIRY CHANNEL
          </h3>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-[#64748B]'}`}>
            B2B bulk, direct contact & quote portals
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center my-auto">
          {divisions.map((div, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-2xl border transition-colors ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-[#FAF8F5] border-[#E8E2D6]'
              }`}
            >
              <div className="text-lg font-bold font-mono" style={{ color: div.color }}>
                {div.count}
              </div>
              <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {div.name.split(' ')[0]}
              </div>
              <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                {div.pct}%
              </div>
            </div>
          ))}
        </div>

        {/* Interconnected Multi-segment Progress Bar */}
        <div className="mt-4 pt-2">
          <div className="w-full h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden flex shadow-inner">
            {divisions.map((div, idx) => (
              <div
                key={idx}
                style={{ width: `${div.pct}%`, backgroundColor: div.color }}
                className="h-full transition-all duration-500"
                title={`${div.name}: ${div.count} (${div.pct}%)`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Col 3: WORKFLOW STATUS (3 cols) */}
      <div
        className={`lg:col-span-3 p-5 rounded-3xl border shadow-sm transition-all flex flex-col justify-between ${
          isDark ? 'bg-[#131922] border-white/10' : 'bg-white border-[#E8E2D6]'
        }`}
      >
        <div className="mb-3">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-[#DFD1BA]' : 'text-[#0D3B2E]'}`}>
            ORDER / LEAD STATUS
          </h3>
          <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-[#64748B]'}`}>
            Active stage pipeline
          </p>
        </div>

        <div className="space-y-2.5 my-auto">
          {statuses.map((st, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2 rounded-xl border transition-colors ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-[#FAF8F5] border-[#E8E2D6]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} />
                <span className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-[#1E232B]'}`}>
                  {st.label}
                </span>
              </div>
              <span className="font-mono text-xs font-bold" style={{ color: st.color }}>
                {st.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
