import React, { useState } from 'react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  percentage?: number;
}

interface ExecutiveDonutChartProps {
  title: string;
  subtitle?: string;
  data: DonutSegment[];
  isDark: boolean;
  centerValue?: string | number;
  centerLabel?: string;
}

export const ExecutiveDonutChart: React.FC<ExecutiveDonutChartProps> = ({
  title,
  subtitle,
  data,
  isDark,
  centerValue,
  centerLabel
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  const radius = 62;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  // Calculate cumulative offsets
  let accumulatedPercent = 0;
  const segmentsWithAngles = data.map((d, index) => {
    const percent = (d.value / total) * 100;
    const strokeDash = (d.value / total) * circumference;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += percent;
    return {
      ...d,
      index,
      percent: Math.round(percent),
      strokeDash,
      strokeDashoffset
    };
  });

  const displayCenterValue = centerValue !== undefined ? centerValue : (hoveredIdx !== null ? `${segmentsWithAngles[hoveredIdx]?.percent}%` : total);
  const displayCenterLabel = centerLabel !== undefined ? centerLabel : (hoveredIdx !== null ? segmentsWithAngles[hoveredIdx]?.label : 'Total Volume');

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all flex flex-col justify-between ${
        isDark ? 'bg-[#131922] border-white/10' : 'bg-white border-[#E8E2D6]'
      }`}
    >
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            SEGMENTATION
          </span>
          <h3 className={`text-sm sm:text-base font-serif font-bold tracking-tight ${isDark ? 'text-[#DFD1BA]' : 'text-[#0D3B2E]'}`}>
            {title}
          </h3>
        </div>
        {subtitle && (
          <p className={`text-xs mt-1 line-clamp-1 ${isDark ? 'text-gray-400' : 'text-[#64748B]'}`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Donut Graphic + Side Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 my-auto py-1">
        {/* SVG Donut (Grand w-52 h-52) */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 170 170">
            {/* Background Ring Track */}
            <circle
              cx="85"
              cy="85"
              r={radius}
              fill="transparent"
              stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
              strokeWidth={strokeWidth}
            />

            {/* Colored Segment Rings */}
            {segmentsWithAngles.map((seg) => {
              const isHovered = hoveredIdx === seg.index;
              return (
                <circle
                  key={seg.index}
                  cx="85"
                  cy="85"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${seg.strokeDash} ${circumference - seg.strokeDash}`}
                  strokeDashoffset={seg.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(seg.index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Center Cutout Metric */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight transition-all duration-200 ${
              isDark ? 'text-white' : 'text-[#0D3B2E]'
            }`}>
              {displayCenterValue}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 line-clamp-1 max-w-[110px] ${
              isDark ? 'text-gray-400' : 'text-[#786F60]'
            }`}>
              {displayCenterLabel}
            </span>
          </div>
        </div>

        {/* Legend List on the right */}
        <div className="w-full sm:w-auto flex-1 space-y-2.5">
          {segmentsWithAngles.map((seg) => {
            const isHovered = hoveredIdx === seg.index;
            return (
              <div
                key={seg.index}
                onMouseEnter={() => setHoveredIdx(seg.index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isHovered
                    ? isDark
                      ? 'bg-white/10 border-white/20 shadow-sm scale-[1.02]'
                      : 'bg-[#F9F7F2] border-[#C5A059]/40 shadow-sm scale-[1.02]'
                    : isDark
                    ? 'bg-white/5 border-transparent hover:bg-white/8'
                    : 'bg-slate-50 border-slate-200/60 hover:bg-[#F2ECE1]/50'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-xs ring-2 ring-white/20"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className={`text-xs font-bold truncate ${isDark ? 'text-gray-200' : 'text-[#1E232B]'}`}>
                    {seg.label}
                  </span>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0 text-right">
                  <span className={`text-xs font-mono font-extrabold ${isDark ? 'text-white' : 'text-[#0D3B2E]'}`}>
                    {seg.value}
                  </span>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-md font-mono"
                    style={{
                      backgroundColor: `${seg.color}22`,
                      color: seg.color
                    }}
                  >
                    {seg.percent}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
