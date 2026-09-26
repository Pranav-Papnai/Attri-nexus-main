import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  Scale, 
  FileText, 
  ShieldAlert, 
  Wheat, 
  Building2, 
  DollarSign, 
  Mail, 
  Phone,
  AlertTriangle
} from 'lucide-react';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { BUSINESS_CONFIG } from '@/constants/business';

const TOC = [
  ['acceptance', '1. Acceptance & Legal Capacity'],
  ['use-rules', '2. Permitted & Prohibited Use'],
  ['quotes', '3. Specifications, Inquiries & Quotations'],
  ['commercial', '4. Prices, Payment & Incoterms Delivery'],
  ['intellectual-prop', '5. Trademarks & Intellectual Property'],
  ['storage-handling', '6. Perishable Agro Commodities Disclaimer'],
  ['liability', '7. Limitation of Liability & Warranties'],
  ['indemnity', '8. Indemnity Obligations'],
  ['law-jurisdiction', '9. Governing Law, Delhi Jurisdiction & Contact']
] as const;

export const TermsPage: React.FC = () => {
  const contactEmail = BUSINESS_CONFIG.email;

  return (
    <LegalLayout
      title="Terms &amp; Conditions"
      subtitle="Standard commercial terms governing your access to the Attri Nexus trade portal, requests for quotation (RFQs), and preliminary commodity evaluations."
      badge="Commercial Terms of Service"
      toc={TOC}
    >
      {/* 1. Acceptance */}
      <section id="acceptance" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            01
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Acceptance &amp; Legal Capacity
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          This trade portal is operated by <strong>{BUSINESS_CONFIG.legalEntityName}</strong> (“Attri Nexus”, “we”, “us”). By accessing, reviewing commodity specifications, or transmitting an enquiry through this website, you irrevocably agree to be bound by these Terms &amp; Conditions and our{' '}
          <Link to="/privacy-policy" className="text-[#0B132B] font-bold underline underline-offset-2 hover:text-[#B22234]">
            Privacy Policy
          </Link>. If you represent a corporate entity, you represent and warrant that you hold express authority to bind that enterprise.
        </p>
      </section>

      {/* 2. Permitted vs Prohibited Use */}
      <section id="use-rules" className="space-y-5 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            02
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Permitted &amp; Prohibited Platform Use
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          The website is provided exclusively for commercial buyers to evaluate commodity specifications and initiate genuine trade transactions:
        </p>

        {/* Visual Split Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Permitted */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Permitted Activities</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-900 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Reviewing grain, animal feed, wheat, flour, and pulse specifications.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Submitting legitimate trade RFQs for domestic and export container consignments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Downloading or printing technical commodity specification sheets for internal procurement review.</span>
              </li>
            </ul>
          </div>

          {/* Prohibited */}
          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-3">
            <div className="flex items-center gap-2 text-rose-950 font-bold text-sm">
              <XCircle className="w-4 h-4 text-[#B22234]" />
              <span>Strictly Prohibited Activities</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-950 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#B22234] font-bold">✕</span>
                <span>Submitting fraudulent, speculative, or bot-generated wholesale inquiries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B22234] font-bold">✕</span>
                <span>Using automated scrapers, crawlers, or headless browsers to extract catalogue data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#B22234] font-bold">✕</span>
                <span>Attempting unauthorized access into administrative endpoints or network infrastructure.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Product Specifications & Quotes */}
      <section id="quotes" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            03
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Product Specifications, Inquiries &amp; Quotations
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          Product descriptions, grain characteristics, nutritional averages, moisture percentages, and packaging mockups shown on this website serve for preliminary commercial evaluation only. Natural agricultural commodities inherently exhibit seasonal variations based on crop harvest, origin, and lot segregation.
        </p>

        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5">
          <p className="font-bold flex items-center gap-1.5 text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Invitation to Treat (Not an Offer to Sell):</span>
          </p>
          <p className="leading-relaxed">
            Nothing published on this website constitutes a legally binding offer to sell. An enquiry submitted through the cart or contact form represents an Invitation to Treat. A binding commercial contract materializes solely upon the issuance and mutual bilateral execution of an official Proforma Invoice (PI) or Sales Agreement signed by authorized signatories of Attri Nexus.
          </p>
        </div>
      </section>

      {/* 4. Commercial Pricing, Payment & Delivery */}
      <section id="commercial" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            04
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Commercial Pricing, Payment &amp; Incoterms Delivery
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#475569]">
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-[#C5A059]" />
              <span>Zero On-Site Transactions</span>
            </span>
            <p className="leading-relaxed">
              This website does not solicit, process, or store credit card, debit card, or electronic consumer payments. All settlements occur via institutional banking channels (RTGS, NEFT, Irrevocable Letters of Credit / LC, or Cash Against Documents / CAD).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#0B132B]" />
              <span>Incoterms &amp; Freight</span>
            </span>
            <p className="leading-relaxed">
              International export consignments adhere strictly to ICC Incoterms 2020 (FOB Mundra/Kandla, CIF, CFR, or EXW) as explicitly stipulated on formal commercial quotations.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Trademarks */}
      <section id="intellectual-prop" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            05
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Trademarks &amp; Intellectual Property
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          The name <strong>Attri Nexus</strong>, corporate logo, typography, bag artwork prints, visual media, and proprietary technical descriptions are the exclusive intellectual property of Attri Nexus and protected by the Trade Marks Act, 1999 and the Copyright Act, 1957. Unauthorized duplication, reproduction, or reverse-engineering is strictly actionable under Indian law.
        </p>
      </section>

      {/* 6. Perishable Commodity Disclaimer */}
      <section id="storage-handling" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            06
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Perishable Agro Commodities &amp; Storage Disclaimer
          </h2>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3.5 text-xs text-amber-950">
          <Wheat className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1.5 leading-relaxed">
            <h4 className="font-bold text-amber-900 text-sm">Storage &amp; Preservation Responsibilities</h4>
            <p>
              Agricultural commodities (rice, flours, feed grains, pulses) are perishable natural goods. Upon dispatch and delivery acceptance, proper warehouse storage — cool, well-ventilated, elevated on wooden pallets, shielded from ambient moisture, rodents, and solar radiation — remains the sole responsibility of the buyer. Attri Nexus declines liability for post-delivery deterioration arising from substandard warehouse management.
            </p>
          </div>
        </div>
      </section>

      {/* 7 & 8. Liability & Indemnity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
        <section id="liability" className="space-y-3 scroll-mt-28">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#B22234]" />
            <h3 className="font-bold text-slate-900 text-base">7. Limitation of Liability</h3>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            To the maximum extent permissible under applicable law, Attri Nexus and its directors shall not be liable for any indirect, incidental, or consequential losses arising from website utilization. Aggregate website liability is strictly capped at INR 10,000, without curtailing statutory rights under commercial contracts.
          </p>
        </section>

        <section id="indemnity" className="space-y-3 scroll-mt-28">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#0B132B]" />
            <h3 className="font-bold text-slate-900 text-base">8. Indemnity Obligations</h3>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            You agree to defend and hold harmless Attri Nexus against all claims, liabilities, damages, and legal costs arising from any breach of these terms, fraudulent enquiry submissions, or infringement of third-party rights.
          </p>
        </section>
      </div>

      {/* 9. Law & Jurisdiction */}
      <section id="law-jurisdiction" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            09
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Governing Law, Delhi Jurisdiction &amp; Legal Desk
          </h2>
        </div>

        <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-5 space-y-3 text-xs text-[#475569]">
          <p className="leading-relaxed">
            These terms are governed exclusively by the laws of India. Any controversy, dispute, or claim arising out of or relating to this platform shall be subject to the exclusive jurisdiction of the competent courts in <strong>New Delhi, India</strong>.
          </p>
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-6 text-slate-700">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C5A059]" />
              <span>Legal Queries: <a href={`mailto:${contactEmail}`} className="font-bold text-[#0B132B] underline">{contactEmail}</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span>Direct Phone: <strong className="text-slate-900">{BUSINESS_CONFIG.phonePrimary}</strong></span>
            </div>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
};
