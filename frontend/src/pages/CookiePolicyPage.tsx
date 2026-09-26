import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Database, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Lock, 
  HardDrive 
} from 'lucide-react';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { BUSINESS_CONFIG } from '@/constants/business';

const TOC = [
  ['short-version', '1. The Short Version (Zero Tracking)'],
  ['storage-used', '2. Browser Storage We Use'],
  ['third-party', '3. Third-Party Scripts & Widgets'],
  ['how-to-clear', '4. How to Clear or Block Storage'],
  ['questions', '5. Questions & Data Inquiries']
] as const;

const STORAGE_ITEMS = [
  { 
    key: 'attri_nexus_cart', 
    type: 'localStorage', 
    purpose: 'Remembers the products and commodities you added to your enquiry cart between visits.', 
    lifetime: 'Until cleared or enquiry submitted', 
    category: 'Essential Utility' 
  },
  { 
    key: 'attri_nexus_last_submit_ts', 
    type: 'localStorage', 
    purpose: 'Timestamp of your last form submission, preventing accidental double-submits and basic spam.', 
    lifetime: '20 seconds lifespan; overwritten on next submit', 
    category: 'Anti-Spam' 
  },
  { 
    key: 'attri_nexus_recent_submits', 
    type: 'localStorage', 
    purpose: 'Enquiry identifier preventing duplicate inquiries from being broadcast within 5 minutes.', 
    lifetime: '5 minutes duration; auto-expires', 
    category: 'Anti-Spam' 
  },
  { 
    key: 'attri_nexus_local_inquiries', 
    type: 'localStorage', 
    purpose: 'Temporary offline backup copy of your enquiry in case connection drops, ensuring no RFQ is lost.', 
    lifetime: 'Persists until browser cache is cleared', 
    category: 'Reliability' 
  },
  { 
    key: 'attri_nexus_local_products_v17', 
    type: 'localStorage', 
    purpose: 'Cached catalogue of grain and feed specs for ultra-fast instant page loading. Zero personal data.', 
    lifetime: 'Until catalogue version updates', 
    category: 'Performance' 
  },
  { 
    key: 'attri_nexus_admin_session', 
    type: 'localStorage', 
    purpose: 'Encrypted JWT authentication token for authorized Attri Nexus staff dashboard access only.', 
    lifetime: '7 days session validity', 
    category: 'Admin Security' 
  },
  { 
    key: 'reset_otp_*', 
    type: 'sessionStorage', 
    purpose: 'Temporary password reset token for authorized administrators in development mode.', 
    lifetime: 'Immediately destroyed when tab is closed', 
    category: 'Session Security' 
  }
];

const THIRD_PARTY = [
  {
    name: 'Cloudflare Turnstile',
    badge: 'Bot Defense',
    what: 'Non-intrusive bot-protection widget on RFQ enquiry forms. May set cryptographic security cookies (e.g. __cf_bm or cf_clearance) to distinguish real buyers from malicious automated scrapers. Does not track you across external websites.',
    policy: 'https://www.cloudflare.com/privacypolicy/'
  },
  {
    name: 'Google Fonts',
    badge: 'Typography CDN',
    what: 'Delivers optimized brand typography. Google receives standard browser handshake headers when font files load. Google explicitly confirms it sets no tracking cookies for this font distribution service.',
    policy: 'https://developers.google.com/fonts/faq/privacy'
  }
];

export const CookiePolicyPage: React.FC = () => {
  return (
    <LegalLayout
      title="Cookie & Storage Policy"
      subtitle="Complete transparency on what Attri Nexus stores in your browser, why we do not use tracking cookies, and how your privacy is protected."
      badge="Cookie & Data Storage"
      toc={TOC}
    >
      {/* 1. The Short Version */}
      <section id="short-version" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            01
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            The Short Version: 100% Tracking-Free
          </h2>
        </div>

        {/* Highlight Guarantee Box */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 text-emerald-950 flex items-start gap-4">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-sm leading-relaxed">
            <h3 className="font-bold text-emerald-900 text-base">Zero Tracking Cookies Guaranteed</h3>
            <p className="text-emerald-800">
              <strong>This website does not use advertising, marketing, analytics, or behavioral tracking cookies.</strong> We do not run Google Analytics, Meta Pixel, Hotjar, or cross-site tracking scripts.
            </p>
            <p className="text-emerald-700 text-xs">
              Because everything we store is strictly necessary for the enquiry cart, anti-spam defense, and website speed, we do not interrupt your browsing with annoying cookie consent banners. There is nothing optional to sell or consent to.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Browser Storage We Use */}
      <section id="storage-used" className="space-y-5 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            02
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Browser Storage We Use
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          Instead of persistent third-party cookies, this website utilizes modern browser-native <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-[#0B132B]">localStorage</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-[#0B132B]">sessionStorage</code>. These values remain isolated on your local device, are never transmitted to marketing networks, and are read only when interacting with our catalogue.
        </p>

        {/* Visual Cards Grid for Storage Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {STORAGE_ITEMS.map((item) => (
            <div 
              key={item.key} 
              className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-[#0B132B] bg-white border border-slate-200 px-2 py-0.5 rounded-md truncate max-w-[200px]" title={item.key}>
                    {item.key}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed mt-2">
                  {item.purpose}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-slate-400" />
                  <span>{item.category}</span>
                </span>
                <span className="italic">{item.lifetime}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-center gap-3 text-xs text-amber-900">
          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>All items listed above are <strong>strictly essential</strong> — the enquiry cart, catalogue caching, and abuse-prevention will not function properly without local browser storage enabled.</span>
        </div>
      </section>

      {/* 3. Third-Party Scripts & Widgets */}
      <section id="third-party" className="space-y-5 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            03
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Third-Party Scripts &amp; Services
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          To protect our quotation systems from distributed automated spam and render clean typography, we rely on two trusted infrastructure providers:
        </p>

        <div className="space-y-4">
          {THIRD_PARTY.map((tp) => (
            <div key={tp.name} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-[#0B132B]/30 transition-all">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-bold text-slate-900 text-sm">{tp.name}</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {tp.badge}
                </span>
              </div>
              <p className="text-xs text-[#5A6170] leading-relaxed mb-3">
                {tp.what}
              </p>
              <a
                href={tp.policy}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B132B] hover:text-[#B22234] underline underline-offset-2 transition-colors"
              >
                <span>Read {tp.name} Privacy &amp; Cookie Notice</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed italic">
          External social buttons (WhatsApp, LinkedIn, Instagram, Facebook, YouTube) open those respective platforms in a separate browser tab; zero trackers are loaded from those networks while you browse Attri Nexus.
        </p>
      </section>

      {/* 4. How to Clear or Block Storage */}
      <section id="how-to-clear" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            04
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            How to Clear or Block Storage
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          You have total control over browser data stored by this website. You can purge or disable storage at any time via your browser settings:
        </p>

        <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-5 space-y-3 text-xs text-[#475569]">
          <div className="flex items-start gap-2.5">
            <Trash2 className="w-4 h-4 text-[#B22234] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Clear Data Instantly:</strong> In Chrome, Edge or Safari, navigate to <span className="font-semibold text-slate-700">Settings → Privacy and Security → Clear browsing data → Cookies and other site data</span>.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Developer Tools Inspection:</strong> Right-click anywhere on this website → select <span className="font-semibold text-slate-700">Inspect</span> → open the <span className="font-semibold text-slate-700">Application</span> tab → expand <span className="font-semibold text-slate-700">Storage</span> to inspect or delete stored keys individually.
            </div>
          </div>
        </div>
      </section>

      {/* 5. Questions */}
      <section id="questions" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            05
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Questions &amp; Contact
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          For full details on how we handle personal data collected through quotation forms, please consult our{' '}
          <Link to="/privacy-policy" className="text-[#0B132B] font-bold underline underline-offset-2 hover:text-[#B22234]">
            Privacy Policy
          </Link>{' '}
          or reach out to our compliance desk directly at{' '}
          <a href={`mailto:${BUSINESS_CONFIG.email}`} className="text-[#0B132B] font-bold underline underline-offset-2 hover:text-[#B22234]">
            {BUSINESS_CONFIG.email}
          </a>.
        </p>
      </section>
    </LegalLayout>
  );
};
