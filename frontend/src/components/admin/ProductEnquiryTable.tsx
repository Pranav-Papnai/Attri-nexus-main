import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface ProductEnquiryRow {
  id: string;
  name: string;
  variety?: string;
  category: string;
  total: number;
  new: number;
  contacted: number;
  quoted: number;
  closed: number;
  lastAt: string;
}

interface ProductEnquiryTableProps {
  rows: ProductEnquiryRow[];
  scopeLabel: string;
  showCategory: boolean;
  activeProductId: string;
  onViewEnquiries: (productId: string) => void;
  isDark: boolean;
}

const STATUS_COLUMNS = [
  { key: 'new', label: 'New', color: 'text-amber-600 dark:text-amber-400' },
  { key: 'contacted', label: 'Contacted', color: 'text-blue-600 dark:text-blue-400' },
  { key: 'quoted', label: 'Quoted', color: 'text-purple-600 dark:text-purple-400' },
  { key: 'closed', label: 'Closed', color: 'text-emerald-600 dark:text-emerald-400' }
] as const;

const formatDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const ProductEnquiryTable: React.FC<ProductEnquiryTableProps> = ({
  rows,
  scopeLabel,
  showCategory,
  activeProductId,
  onViewEnquiries,
  isDark
}) => {
  const maxTotal = Math.max(...rows.map((r) => r.total), 1);
  const grandTotal = rows.reduce((acc, r) => acc + r.total, 0);
  const muted = isDark ? 'text-gray-400' : 'text-[#64748B]';

  return (
    <div className={`rounded-3xl border shadow-sm ${isDark ? 'bg-[#131922] border-white/10' : 'bg-white border-[#E8E2D6]'}`}>
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h3 className={`text-sm sm:text-base font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0D3B2E]'}`}>
            Enquiries by Product · {scopeLabel}
          </h3>
          <p className={`text-xs mt-1 ${muted}`}>
            How many enquiries each product received, and where they stand. Click a category card above to narrow this list.
          </p>
        </div>
        <span className={`text-xs font-semibold ${muted}`}>
          {grandTotal} enquiries across {rows.length} {rows.length === 1 ? 'row' : 'rows'}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className={`px-6 pb-6 text-sm ${muted}`}>No products in this category yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className={`text-[10px] uppercase tracking-wider ${muted} border-y ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-[#EFE9DD] bg-[#FAF8F4]'}`}>
                <th className="text-left font-bold px-5 py-2.5">Product</th>
                {showCategory && <th className="text-left font-bold px-3 py-2.5">Category</th>}
                <th className="text-left font-bold px-3 py-2.5 w-[180px]">Total enquiries</th>
                {STATUS_COLUMNS.map((c) => (
                  <th key={c.key} className="text-center font-bold px-2 py-2.5">{c.label}</th>
                ))}
                <th className="text-left font-bold px-3 py-2.5">Last enquiry</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isActive = activeProductId === row.id;
                return (
                  <tr
                    key={row.id}
                    className={`border-b last:border-b-0 transition-colors ${isDark ? 'border-white/5' : 'border-[#F2EDE3]'} ${
                      isActive ? (isDark ? 'bg-[#C5A059]/10' : 'bg-[#C5A059]/10') : isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-[#FAF8F4]'
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className={`font-semibold ${isDark ? 'text-gray-100' : 'text-[#1E232B]'}`}>{row.name}</div>
                      {row.variety && <div className={`text-[11px] truncate max-w-[260px] ${muted}`}>{row.variety}</div>}
                    </td>
                    {showCategory && <td className={`px-3 py-3 text-xs ${muted}`}>{row.category}</td>}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-extrabold w-7 text-right ${row.total ? (isDark ? 'text-white' : 'text-[#0D3B2E]') : muted}`}>
                          {row.total}
                        </span>
                        <div className={`flex-1 h-2 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                          <div className="h-2 rounded-full bg-[#C5A059]" style={{ width: `${(row.total / maxTotal) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    {STATUS_COLUMNS.map((c) => (
                      <td key={c.key} className={`px-2 py-3 text-center font-mono font-bold ${row[c.key] ? c.color : muted}`}>
                        {row[c.key]}
                      </td>
                    ))}
                    <td className={`px-3 py-3 text-xs whitespace-nowrap ${muted}`}>{formatDate(row.lastAt)}</td>
                    <td className="px-5 py-3 text-right">
                      {row.total > 0 && (
                        <button
                          type="button"
                          onClick={() => onViewEnquiries(isActive ? 'all' : row.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#8A6828] dark:text-[#DFD1BA] hover:underline cursor-pointer whitespace-nowrap"
                        >
                          {isActive ? 'Show all' : 'View enquiries'}
                          {!isActive && <ArrowRight className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
