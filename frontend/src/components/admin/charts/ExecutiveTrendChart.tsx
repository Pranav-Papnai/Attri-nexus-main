import React, { useState } from 'react';

export interface TrendDataPoint {
  label: string;
  value: number;
  subLabel?: string;
}

interface ExecutiveTrendChartProps {
  title: string;
  subtitle?: string;
  data: TrendDataPoint[];
  isDark: boolean;
  strokeColor?: string;
  badgeText?: string;
}

export const ExecutiveTrendChart: React.FC<ExecutiveTrendChartProps> = ({
  title,
  subtitle,
  data,
  isDark,
  strokeColor = '#2563EB',
  badgeText
}) => {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return null;
  }

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 10);
  const ceiling = Math.ceil(maxVal * 1.25);

  const width = 680;
  const height = 220;
  const padLeft = 45;
  const padRight = 25;
  const padTop = 25;
  const padBottom = 35;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  // Compute (x, y) coordinates
  const points = data.map((d, i) => {
    const x = padLeft + (i / (data.length - 1 || 1)) * chartWidth;
    const y = padTop + chartHeight - (d.value / (ceiling || 1)) * chartHeight;
    return { x, y, ...d, index: i };
  });

  // Generate smooth cubic bezier curve
  const generateBezierPath = (pts: { x: number; y: number }[]): string => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const linePath = generateBezierPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + chartHeight} L ${points[0].x} ${padTop + chartHeight} Z`;

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            {badgeText && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                {badgeText}
              </span>
            )}
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

        {/* Active hovered point quick indicator */}
        <div className={`px-3.5 py-1.5 rounded-2xl border transition-all text-right ${
          activePoint !== null
            ? isDark ? 'bg-white/10 border-white/20' : 'bg-[#FAF8F5] border-[#C5A059]/40'
            : isDark ? 'bg-white/5 border-transparent' : 'bg-slate-50 border-slate-200/80'
        }`}>
          <span className={`text-sm sm:text-base font-extrabold font-mono ${isDark ? 'text-white' : 'text-[#0D3B2E]'}`}>
            {activePoint !== null ? points[activePoint].value : points[points.length - 1]?.value} Units
          </span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {activePoint !== null ? points[activePoint].label : 'Current Velocity'}
          </span>
        </div>
      </div>

      {/* SVG Curve Chart */}
      <div className="w-full relative overflow-hidden py-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`trend-grad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={isDark ? 0.4 : 0.28} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {yTicks.map((tickVal, idx) => {
            const yPos = padTop + chartHeight - (tickVal / (ceiling || 1)) * chartHeight;
            return (
              <g key={idx}>
                <line
                  x1={padLeft}
                  y1={yPos}
                  x2={width - padRight}
                  y2={yPos}
                  stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                  strokeDasharray="4 4"
                />
                <text
                  x={padLeft - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                  fill={isDark ? '#6B7280' : '#94A3B8'}
                >
                  {tickVal}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path
            d={areaPath}
            fill={`url(#trend-grad-${title.replace(/\s+/g, '')})`}
            className="transition-all duration-700"
          />

          {/* Spline Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-700"
          />

          {/* Data Nodes (Circles) */}
          {points.map((pt) => {
            const isHovered = activePoint === pt.index;
            return (
              <g
                key={pt.index}
                className="cursor-pointer"
                onMouseEnter={() => setActivePoint(pt.index)}
                onMouseLeave={() => setActivePoint(null)}
              >
                {/* Invisible large touch target */}
                <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />

                {/* Outer halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? '8' : '5'}
                  fill={isDark ? '#11161F' : '#FFFFFF'}
                  stroke={strokeColor}
                  strokeWidth={isHovered ? '3.5' : '2.5'}
                  className="transition-all duration-200 shadow-lg"
                />

                {/* Center dot */}
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill={strokeColor}
                  />
                )}

                {/* X-axis Label */}
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isHovered ? 'bold' : '600'}
                  fill={isHovered ? (isDark ? '#DFD1BA' : '#0D3B2E') : (isDark ? '#9CA3AF' : '#64748B')}
                  className="transition-colors duration-200"
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
