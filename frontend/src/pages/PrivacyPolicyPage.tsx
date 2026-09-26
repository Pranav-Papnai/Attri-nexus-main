import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Scale, 
  Clock, 
  Globe, 
  AlertCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  CheckCircle2,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { BUSINESS_CONFIG } from '@/constants/business';
import {
  DATA_PROCESSORS,
  GRIEVANCE_OFFICER,
  INQUIRY_RETENTION_MONTHS,
  PRIVACY_POLICY_VERSION
} from '@/constants/legal';

const TOC = [
  ['who-we-are', '1. Who We Are & Data Fiduciary'],
  ['scope', '2. Scope & Applicable Persons'],
  ['what-we-collect', '3. What We Collect & Lawful Basis'],
  ['not-collected', '4. What We Strictly Never Collect'],
  ['consent', '5. Consent & Free Withdrawal'],
  ['sharing', '6. Data Processors & Sharing'],
  ['transfers', '7. Cross-Border Data Transfers'],
  ['retention', '8. Data Retention Timeline'],
  ['rights', '9. Your Rights Under DPDP Act 2023'],
  ['security', '10. Technical Security Measures'],
  ['breach', '11. Data Breach Protocol'],
  ['children', '12. Minors & Children Notice'],
  ['grievance', '13. Grievance Officer & Redressal'],
  ['changes', '14. Amendments to this Notice'],
  ['law', '15. Governing Law & Jurisdiction']
] as const;

export const PrivacyPolicyPage: React.FC = () => {
  const contactEmail = BUSINESS_CONFIG.email;
  const { address } = BUSINESS_CONFIG;

  const rightsList = [
    {
      title: 'Right to Access',
      section: 'Sec 11',
      desc: 'Obtain a summary of personal data held, processing activities undertaken, and third parties with whom data was shared.'
    },
    {
      title: 'Right to Correction',
      section: 'Sec 12',
      desc: 'Request rectification, completion, and updating of inaccurate, outdated, or misleading business or personal contact records.'
    },
    {
      title: 'Right to Erasure',
      section: 'Sec 12',
      desc: 'Request complete deletion of your enquiry data once the trade quotation purpose has been satisfactorily served.'
    },
    {
      title: 'Right of Grievance Redressal',
      section: 'Sec 13',
      desc: 'Direct escalation to our designated Grievance Officer with an assured acknowledgement within 3 working days.'
    },
    {
      title: 'Right to Nominate',
      section: 'Sec 14',
      desc: 'Designate another individual to exercise these data rights in the unfortunate event of death or legal incapacity.'
    },
    {
      title: 'Right to Withdraw Consent',
      section: 'Sec 6(4)',
      desc: 'Revoke your consent at any time via email or WhatsApp as effortlessly as it was provided.'
    }
  ];

  return (
    <LegalLayout
      title="Privacy Policy Notice"
      subtitle="How Attri Nexus collects, processes, safeguards and disposes of personal data in strict compliance with the Digital Personal Data Protection Act, 2023 (India)."
      badge="DPDP Act 2023 Verified"
      version={PRIVACY_POLICY_VERSION}
      toc={TOC}
    >
      {/* 1. Who We Are */}
      <section id="who-we-are" className="space-y-4 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            01
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Who We Are &amp; Data Fiduciary
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          This website is operated by <strong>{BUSINESS_CONFIG.legalEntityName}</strong> (“Attri Nexus”, “we”, “us”), a premier exporter and wholesale supplier of agricultural commodities based in {address.city}, {address.country}.
        </p>

        <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 space-y-3 text-xs text-[#475569]">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Building2 className="w-4 h-4 text-[#C5A059]" />
            <span>Official Data Fiduciary Status</span>
          </div>
          <p className="leading-relaxed">
            For the purposes of the <strong>Digital Personal Data Protection Act, 2023 (the “DPDP Act”)</strong> and DPDP Rules, 2025, Attri Nexus acts as the <strong>Data Fiduciary</strong> for all personal data submitted through this platform — determining the legitimate purposes and processing methods.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-slate-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span>{address.line1}, {address.area}, {address.city}, {address.state} {address.pincode}, {address.country}</span>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span>Official Inquiries: <a href={`mailto:${contactEmail}`} className="font-semibold text-[#0B132B] underline">{contactEmail}</a></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Scope */}
      <section id="scope" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            02
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Who This Notice Applies To
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          This Privacy Notice applies to any natural person who navigates this website or submits a Request for Quotation (RFQ) or business inquiry through it — including commercial buyers, procurement managers, institutional traders, brokers, and individual consumers. Commercial contracts executed offline under formal supply agreements are governed by their respective bilateral legal covenants.
        </p>
      </section>

      {/* 3. What We Collect */}
      <section id="what-we-collect" className="space-y-5 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            03
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            What We Collect &amp; Lawful Purpose
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          We practice strict data minimization (DPDP Act s.6). We collect only what is strictly necessary to prepare custom pricing, freight quotes, and technical grain specifications requested by you:
        </p>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] uppercase tracking-wider text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th scope="col" className="px-4 py-3.5">Data Field</th>
                <th scope="col" className="px-4 py-3.5">Specific Processing Purpose</th>
                <th scope="col" className="px-4 py-3.5">Mandatory?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#475569]">
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900">Full Name</td>
                <td className="px-4 py-3">To address you professionally and identify your trade record</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Required</span></td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900">Phone / WhatsApp Number</td>
                <td className="px-4 py-3">Primary trade channel to deliver prompt proforma quotes and container dispatches</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Required</span></td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900">Email Address</td>
                <td className="px-4 py-3">To deliver formal PDF contracts, Certificates of Analysis (COA), and dispatch documents</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">Optional (Required on Contact)</span></td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900">Company &amp; Business Type</td>
                <td className="px-4 py-3">To customize wholesale vs retail freight volumes and export compliance tier</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">Optional</span></td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900">City / State / Destination</td>
                <td className="px-4 py-3">To calculate logistics, port handling charges, and transit duration estimates</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Bulk Forms</span></td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-900">Consent Audit Record</td>
                <td className="px-4 py-3">Immutable record of consent timestamp, IP hash, and policy version (DPDP s.6 compliance)</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Required</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
          <p>
            <strong>Lawful Basis (DPDP Act s.6 &amp; s.7(a)):</strong> Processing is founded upon the affirmative consent provided when you check the submission box. Furthermore, voluntary provision of contact coordinates for a quotation constitutes legitimate use under Section 7(a).
          </p>
          <p>
            For browser cookies and local storage tokens, review our dedicated{' '}
            <Link to="/cookie-policy" className="text-[#0B132B] font-bold underline">
              Cookie &amp; Storage Policy
            </Link>.
          </p>
        </div>
      </section>

      {/* 4. What We Do NOT Collect */}
      <section id="not-collected" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            04
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            What We Strictly Never Collect
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'No credit/debit card, bank accounts or UPI payment details.',
            'No government ID numbers (Aadhaar, Passport, Personal PAN).',
            'No biometric, health, genetic, or sensitive financial data.',
            'No advertising cookies, Meta Pixels, or Google Ad retargeting.',
            'No cross-site tracking or clandestine device fingerprinting.',
            'No personal data belonging to minors or children under 18.'
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs text-rose-950">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B22234] mt-1.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Consent & Free Withdrawal */}
      <section id="consent" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            05
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Consent &amp; Easy Withdrawal
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          Under Section 6(4) of the DPDP Act, withdrawing your consent is as effortless as giving it. You may revoke consent at any moment without penalty:
        </p>

        <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">How to revoke consent:</h4>
            <p className="text-slate-600">Send an email with subject "Withdraw Consent" or message our compliance WhatsApp desk.</p>
            <p className="text-slate-500">All enquiry records are permanently purged within 30 days of withdrawal notice.</p>
          </div>
          <a
            href={`mailto:${contactEmail}?subject=Withdraw%20Consent`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B132B] hover:bg-[#1C2541] text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-sm"
          >
            <span>Email Data Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 6. Third-Party Sharing */}
      <section id="sharing" className="space-y-5 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            06
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Who We Share Data With (Data Processors)
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          We do not sell, rent, monetize, or disclose your inquiries to commercial third parties. We engage only vetted technical infrastructure processors bound by formal Data Processing Addendums (DPAs):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DATA_PROCESSORS.map((dp) => (
            <div key={dp.name} className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{dp.name}</span>
                <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                  Processor
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{dp.purpose}</p>
              <div className="pt-2 flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Globe className="w-3 h-3 text-[#C5A059]" />
                <span>Region: {dp.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Cross-Border Transfers */}
      <section id="transfers" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            07
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Cross-Border Data Transfers
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          Core enquiry databases reside within India (AWS Mumbai region, ap-south-1). In accordance with Section 16 of the DPDP Act 2023, data transmission to global CDN edge caches or transactional email gateways (e.g. Resend) occurs solely to un-restricted jurisdictions and subject to international enterprise security covenants.
        </p>
      </section>

      {/* 8. Retention */}
      <section id="retention" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            08
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Data Retention Timeline
          </h2>
        </div>

        <div className="space-y-2.5 text-xs text-[#475569]">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Enquiries &amp; Quotation Requests:</strong> Retained during the active quotation negotiation cycle, followed by automatic automated database purging {INQUIRY_RETENTION_MONTHS} months after inquiry closure.
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Security &amp; Abuse Prevention Logs:</strong> Transient IP connection hashes used for rate limiting expire and clear automatically within 15 minutes.
            </div>
          </div>
        </div>
      </section>

      {/* 9. Your DPDP Rights */}
      <section id="rights" className="space-y-5 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            09
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Your Rights Under DPDP Act 2023
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          As a Data Principal under Sections 11–14 of the DPDP Act 2023, you hold the following statutory guarantees:
        </p>

        {/* Visual Cards Grid for Rights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {rightsList.map((r) => (
            <div key={r.title} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#0B132B]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-xs">{r.title}</span>
                  <span className="text-[10px] font-mono font-bold text-[#C5A059] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {r.section}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          To exercise any statutory right, transmit your request to <a href={`mailto:${contactEmail}`} className="font-bold text-[#0B132B] underline">{contactEmail}</a>. If aggrieved by our final determination, you hold the right to lodge a formal complaint with the <strong>Data Protection Board of India</strong>.
        </p>
      </section>

      {/* 10. Security Measures */}
      <section id="security" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            10
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Technical &amp; Operational Security Measures
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#475569]">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-[#0B132B] shrink-0 mt-0.5" />
            <div><strong>Encryption at Rest &amp; Transit:</strong> TLS 1.3 encryption across all network channels and AES-256 encrypted database volumes.</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#0B132B] shrink-0 mt-0.5" />
            <div><strong>Access Control &amp; Auth:</strong> Argon2/bcrypt credential hashing, JWT token rotation, and restricted staff roles.</div>
          </div>
        </div>
      </section>

      {/* 11 & 12. Breach & Minors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
        <section id="breach" className="space-y-3 scroll-mt-28">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">11. Data Breach Protocol</h3>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            In compliance with Section 8(6) of the DPDP Act 2023, should any security incident affect personal data, timely notification detailing the scope, impact, and mitigation will be transmitted to affected principals and the Data Protection Board of India.
          </p>
        </section>

        <section id="children" className="space-y-3 scroll-mt-28">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">12. Minors &amp; Children</h3>
          </div>
          <p className="text-xs text-[#475569] leading-relaxed">
            Attri Nexus operates exclusively as a commercial B2B enterprise. We do not knowingly solicit or maintain records of minors under 18 years of age. Any inadvertent submissions are promptly expunged upon notification.
          </p>
        </section>
      </div>

      {/* 13. Grievance Officer */}
      <section id="grievance" className="space-y-4 scroll-mt-28 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">
            13
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0B132B]">
            Grievance Officer &amp; Statutory Redressal
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-[#475569]">
          In statutory compliance with Section 8(10) of the DPDP Act 2023, our designated Grievance Officer handles all privacy escalations:
        </p>

        <div className="bg-gradient-to-br from-slate-900 via-[#0B132B] to-[#1C2541] rounded-2xl p-6 text-white space-y-4 border border-slate-700 shadow-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">Designated Data Grievance Desk</span>
              <h4 className="text-base font-bold text-white mt-0.5">{GRIEVANCE_OFFICER.name}</h4>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
              Active SLA: 72h
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Email: <a href={`mailto:${GRIEVANCE_OFFICER.email}`} className="text-white underline">{GRIEVANCE_OFFICER.email}</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Helpline: <strong className="text-white">{BUSINESS_CONFIG.phonePrimary}</strong></span>
            </div>
            <div className="sm:col-span-2 flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
              <span>Registered Headquarters: {address.line1}, {address.area}, {address.city}, {address.state} {address.pincode}, India</span>
            </div>
          </div>
        </div>
      </section>

      {/* 14 & 15. Changes & Law */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
        <section id="changes" className="space-y-2 scroll-mt-28">
          <h3 className="font-bold text-slate-900 text-sm">14. Amendments to this Notice</h3>
          <p className="text-xs text-[#475569] leading-relaxed">
            Policy updates reflect statutory regulatory modifications. Submissions remain governed by the historical version in force at the time of your recorded consent.
          </p>
        </section>

        <section id="law" className="space-y-2 scroll-mt-28">
          <h3 className="font-bold text-slate-900 text-sm">15. Governing Law</h3>
          <p className="text-xs text-[#475569] leading-relaxed">
            Subject to the laws of the Republic of India. Exclusive legal jurisdiction rests with the competent courts located in New Delhi, India.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
};
