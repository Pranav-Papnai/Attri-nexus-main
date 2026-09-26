import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Cookie, 
  Printer, 
  Search, 
  Calendar, 
  BadgeCheck, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { LEGAL_LAST_UPDATED, PRIVACY_POLICY_VERSION } from '@/constants/legal';
import { BUSINESS_CONFIG } from '@/constants/business';

interface TocItem {
  id: string;
  label: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  badge?: string;
  version?: string;
  toc?: readonly TocItem[] | readonly (readonly [string, string])[];
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  subtitle,
  badge = "Legal Compliance",
  version = PRIVACY_POLICY_VERSION,
  toc = [],
  children
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Normalize TOC items
  const normalizedToc: TocItem[] = toc.map((item) => {
    if (Array.isArray(item) || (item && typeof item === 'object' && 0 in item && 1 in item)) {
      const tuple = item as unknown as readonly [string, string];
      return { id: tuple[0], label: tuple[1] };
    }
    return item as unknown as TocItem;
  });

  const filteredToc = searchQuery.trim()
    ? normalizedToc.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : normalizedToc;

  const handlePrint = () => {
    window.print();
  };

  const navTabs = [
    {
      to: '/privacy-policy',
      label: 'Privacy Policy',
      icon: ShieldCheck,
      badge: 'DPDP 2023',
      isActive: currentPath === '/privacy-policy'
    },
    {
      to: '/terms',
      label: 'Terms & Conditions',
      icon: FileText,
      badge: 'Commercial',
      isActive: currentPath === '/terms'
    },
    {
      to: '/cookie-policy',
      label: 'Cookie & Storage',
      icon: Cookie,
      badge: 'Zero-Trackers',
      isActive: currentPath === '/cookie-policy'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Floating Policy Navigation Switcher */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                      tab.isActive
                        ? 'bg-[#0B132B] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#0B132B] hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${tab.isActive ? 'text-[#C5A059]' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                      tab.isActive 
                        ? 'bg-white/15 text-slate-200' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tab.badge}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Print & Compliance Button */}
            <div className="hidden sm:flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-[#0B132B] bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-lg relative overflow-hidden mb-10 border border-slate-700/50">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B22234]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 max-w-3xl">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#C5A059] text-[11px] font-bold uppercase tracking-[0.16em] mb-4">
              <BadgeCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>

            {/* Metadata Pills */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>Last Updated: <strong className="text-white">{LEGAL_LAST_UPDATED}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Version: <strong className="text-white">{version}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-200">DPDP Act 2023 Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Table of Contents Toggle */}
        {normalizedToc.length > 0 && (
          <div className="lg:hidden mb-6">
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-sm font-bold text-[#0B132B]"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C5A059]" />
                <span>Table of Contents ({normalizedToc.length} Sections)</span>
              </div>
              {mobileTocOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {mobileTocOpen && (
              <div className="mt-2 p-4 bg-white rounded-2xl border border-slate-200 shadow-md space-y-2 max-h-72 overflow-y-auto">
                {normalizedToc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileTocOpen(false)}
                    className="block py-1.5 px-3 rounded-lg text-xs font-medium text-slate-600 hover:text-[#0B132B] hover:bg-slate-50 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Sticky Left Sidebar for Table of Contents (Desktop) */}
          {normalizedToc.length > 0 && (
            <aside className="hidden lg:block lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Contents</span>
                  </h2>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {normalizedToc.length} items
                  </span>
                </div>

                {/* Instant Filter Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search sections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B132B]/10 focus:border-[#0B132B]"
                  />
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                  {filteredToc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-[#0B132B] hover:bg-slate-50 transition-all duration-150"
                    >
                      <span className="truncate group-hover:translate-x-1 transition-transform duration-150">
                        {item.label}
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  ))}
                  {filteredToc.length === 0 && (
                    <p className="text-xs text-slate-400 py-3 text-center">No matching sections</p>
                  )}
                </nav>

                {/* Quick Help Card */}
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                  <p className="font-semibold text-slate-700">Need legal assistance?</p>
                  <p className="text-[11px] leading-relaxed">
                    Contact our legal team directly at{' '}
                    <a href={`mailto:${BUSINESS_CONFIG.email}`} className="text-[#0B132B] font-bold underline underline-offset-2">
                      {BUSINESS_CONFIG.email}
                    </a>
                  </p>
                </div>
              </div>
            </aside>
          )}

          {/* Right Main Legal Document */}
          <main className={normalizedToc.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-xs space-y-10">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};
