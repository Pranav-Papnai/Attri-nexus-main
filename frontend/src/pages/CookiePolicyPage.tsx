import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BUSINESS_CONFIG } from '@/constants/business';
import { LEGAL_LAST_UPDATED } from '@/constants/legal';

/**
 * The site sets no cookies of its own and runs no analytics or advertising
 * scripts. What it does use is browser storage (localStorage/sessionStorage)
 * and two third-party scripts. Keep the tables below in sync with:
 *   - context/CartContext.tsx, services/api/backend.ts, services/api/auth.ts
 *   - components/ui/Turnstile.tsx, index.html (Google Fonts)
 */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-xl font-serif font-bold text-[#1A1D23]">{title}</h2>
    {children}
  </section>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm leading-relaxed text-[#5A6170]">{children}</p>
);

const STORAGE_ITEMS = [
  { key: 'attri_nexus_cart', type: 'localStorage', purpose: 'Remembers the products you added to the enquiry cart between visits.', lifetime: 'Until you clear it or empty the cart', essential: true },
  { key: 'attri_nexus_last_submit_ts', type: 'localStorage', purpose: 'Timestamp of your last form submission, used to stop accidental double-submits and basic spam.', lifetime: '20 seconds of effect; value overwritten on next submit', essential: true },
  { key: 'attri_nexus_recent_submits', type: 'localStorage', purpose: 'Phone number of a recent submission so the same enquiry is not sent twice within 5 minutes.', lifetime: '5 minutes of effect; overwritten on next submit', essential: true },
  { key: 'attri_nexus_local_inquiries', type: 'localStorage', purpose: 'Temporary copy of your enquiry if our server could not be reached, so it is not lost.', lifetime: 'Until the browser storage is cleared', essential: true },
  { key: 'attri_nexus_local_products_v17', type: 'localStorage', purpose: 'Cache of the product catalogue so pages load faster. Contains no personal data.', lifetime: 'Until the catalogue changes or storage is cleared', essential: true },
  { key: 'attri_nexus_admin_session, attri_nexus_admin_theme, attri_nexus_local_admins_v2', type: 'localStorage', purpose: 'Login session and display preference for Attri Nexus staff only. Never set for ordinary visitors.', lifetime: 'Session: 7 days. Theme: until changed.', essential: true },
  { key: 'reset_otp_*', type: 'sessionStorage', purpose: 'Admin password-reset code (staff only, development mode).', lifetime: 'Until the tab is closed', essential: true }
];

const THIRD_PARTY = [
  {
    name: 'Cloudflare Turnstile',
    what: 'Bot-protection widget loaded on the enquiry forms. May set Cloudflare cookies (for example __cf_bm or cf_clearance) to tell humans from automated traffic. It does not track you across other websites.',
    policy: 'https://www.cloudflare.com/privacypolicy/'
  },
  {
    name: 'Google Fonts',
    what: 'Delivers the typefaces used on this site. Google receives your IP address and browser details when the font files are requested. Google states it does not set cookies for this service.',
    policy: 'https://developers.google.com/fonts/faq/privacy'
  }
];

export const CookiePolicyPage: React.FC = () => (
  <div className="py-12 sm:py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        badge="Legal Compliance"
        title="COOKIE & STORAGE POLICY"
        subtitle="What this website stores in your browser, which third-party scripts it loads, and how to control them."
        align="left"
      />

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E2E5EA] shadow-sm max-w-none text-gray-700 space-y-8">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Last updated: {LEGAL_LAST_UPDATED}</p>

        <Section title="1. The short version">
          <P>
            <strong>This website does not use advertising, analytics or tracking cookies.</strong> We do not run Google Analytics, Meta
            Pixel, heat-mapping or any similar service. Because everything we store is strictly necessary for the site to work, we
            do not show a cookie consent banner — there is nothing optional to consent to. If that ever changes, we will update
            this page and ask for your consent first.
          </P>
        </Section>

        <Section title="2. Browser storage we use">
          <P>
            Instead of cookies, the site keeps a few values in your browser's <em>localStorage</em> and <em>sessionStorage</em>.
            These stay on your device, are never sent to advertisers, and are only read by this website.
          </P>
          <div className="overflow-x-auto rounded-xl border border-[#E2E5EA]">
            <table className="min-w-full text-sm text-left">
              <caption className="sr-only">Browser storage keys used by this website, their purpose and lifetime</caption>
              <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wider text-slate-700">
                <tr>
                  <th scope="col" className="px-4 py-3 font-bold">Key</th>
                  <th scope="col" className="px-4 py-3 font-bold">Type</th>
                  <th scope="col" className="px-4 py-3 font-bold">Purpose</th>
                  <th scope="col" className="px-4 py-3 font-bold">Lifetime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5EA] text-[#5A6170]">
                {STORAGE_ITEMS.map((item) => (
                  <tr key={item.key}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-800 whitespace-nowrap">{item.key}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{item.type}</td>
                    <td className="px-4 py-3">{item.purpose}</td>
                    <td className="px-4 py-3">{item.lifetime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>All of the above are <strong>strictly necessary</strong> — the site's cart, spam protection and admin login cannot work without them.</P>
        </Section>

        <Section title="3. Third-party scripts">
          <P>Two external services load on this site. Each has its own privacy policy:</P>
          <div className="space-y-3">
            {THIRD_PARTY.map((tp) => (
              <div key={tp.name} className="bg-[#F8FAFC] border border-[#E2E5EA] rounded-xl p-4 text-sm">
                <p className="font-bold text-slate-800">{tp.name}</p>
                <p className="text-[#5A6170] mt-1 leading-relaxed">{tp.what}</p>
                <a
                  href={tp.policy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-[#1B2A4A] font-semibold underline underline-offset-2 hover:text-[#B22234]"
                >
                  {tp.name} privacy policy ↗
                </a>
              </div>
            ))}
          </div>
          <P>
            Links to WhatsApp, Instagram, Facebook, LinkedIn and YouTube open those services in a new tab; nothing from them is
            loaded on this site until you click.
          </P>
        </Section>

        <Section title="4. How to clear or block storage">
          <P>
            You can delete everything this site has stored at any time from your browser's settings — usually under
            <em> Privacy &amp; security → Clear browsing data → Cookies and site data</em>, or by right-clicking the page, choosing
            <em> Inspect → Application → Storage</em> and clearing it. Blocking storage entirely will disable the cart and may cause
            the enquiry forms to reject repeated submissions; everything else will still work.
          </P>
        </Section>

        <Section title="5. Questions">
          <P>
            See our <Link to="/privacy-policy" className="text-[#1B2A4A] font-semibold underline underline-offset-2">Privacy Policy</Link> for
            how we handle the personal data you submit, or email{' '}
            <a href={`mailto:${BUSINESS_CONFIG.email}`} className="text-[#1B2A4A] font-semibold underline underline-offset-2">{BUSINESS_CONFIG.email}</a>.
          </P>
        </Section>
      </div>
    </div>
  </div>
);
