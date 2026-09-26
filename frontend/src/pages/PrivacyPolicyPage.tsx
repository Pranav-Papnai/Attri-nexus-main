import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BUSINESS_CONFIG } from '@/constants/business';
import {
  DATA_PROCESSORS,
  GRIEVANCE_OFFICER,
  INQUIRY_RETENTION_MONTHS,
  LEGAL_LAST_UPDATED,
  PRIVACY_POLICY_VERSION
} from '@/constants/legal';

/**
 * Privacy Notice under the Digital Personal Data Protection Act, 2023 (India)
 * and the DPDP Rules, 2025. Section numbers in comments refer to the Act.
 * Bump PRIVACY_POLICY_VERSION in constants/legal.ts whenever this text changes.
 */

const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} className="space-y-3 scroll-mt-28">
    <h2 className="text-xl font-serif font-bold text-[#1A1D23]">{title}</h2>
    {children}
  </section>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm leading-relaxed text-[#5A6170]">{children}</p>
);

const UL: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="list-disc pl-5 text-sm space-y-1.5 text-[#5A6170]">{children}</ul>
);

const TOC = [
  ['who-we-are', '1. Who we are'],
  ['scope', '2. Who this notice applies to'],
  ['what-we-collect', '3. What we collect and why'],
  ['not-collected', '4. What we do not collect'],
  ['consent', '5. Consent and how to withdraw it'],
  ['sharing', '6. Who we share data with'],
  ['transfers', '7. Transfers outside India'],
  ['retention', '8. How long we keep data'],
  ['rights', '9. Your rights'],
  ['security', '10. How we protect data'],
  ['breach', '11. Data breaches'],
  ['children', '12. Children'],
  ['grievance', '13. Grievance Officer and contact'],
  ['changes', '14. Changes to this notice'],
  ['law', '15. Governing law']
] as const;

export const PrivacyPolicyPage: React.FC = () => {
  const contactEmail = BUSINESS_CONFIG.email;
  const { address } = BUSINESS_CONFIG;

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Legal Compliance"
          title="PRIVACY POLICY"
          subtitle="How Attri Nexus collects, uses, shares and protects your personal data — our notice under the Digital Personal Data Protection Act, 2023."
          align="left"
        />

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E2E5EA] shadow-sm max-w-none text-gray-700 space-y-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-500 uppercase tracking-widest font-semibold">
            <span>Last updated: {LEGAL_LAST_UPDATED}</span>
            <span>Version: {PRIVACY_POLICY_VERSION}</span>
          </div>

          <nav aria-label="Privacy policy sections" className="bg-[#F8FAFC] border border-[#E2E5EA] rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">Contents</p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {TOC.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-[#1B2A4A] hover:text-[#B22234] hover:underline underline-offset-2">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <Section id="who-we-are" title="1. Who we are">
            <P>
              This website is operated by <strong>{BUSINESS_CONFIG.legalEntityName}</strong> (“Attri Nexus”, “we”, “us”), a supplier
              and exporter of agricultural commodities based in {address.city}, {address.country}. For the purposes of the Digital
              Personal Data Protection Act, 2023 (the “DPDP Act”) we are the <strong>Data Fiduciary</strong> for the personal data
              described in this notice — we decide why and how it is processed.
            </P>
            <P>
              Registered address: {address.line1}, {address.area}, {address.city}, {address.state} {address.pincode}, {address.country}.
              Email: <a href={`mailto:${contactEmail}`} className="text-[#1B2A4A] font-semibold underline underline-offset-2">{contactEmail}</a>.
              Phone: {BUSINESS_CONFIG.phonePrimary}.
            </P>
          </Section>

          <Section id="scope" title="2. Who this notice applies to">
            <P>
              This notice applies to anyone who visits this website or submits an enquiry through it — whether you are a business
              buyer, a distributor, a trader, or an individual customer. It does not cover data we receive under a separate written
              supply agreement; that is governed by the agreement itself.
            </P>
          </Section>

          <Section id="what-we-collect" title="3. What we collect and why">
            <P>We collect only what we need to answer the enquiry you send us. Nothing is collected unless you choose to give it to us.</P>

            <div className="overflow-x-auto rounded-xl border border-[#E2E5EA]">
              <table className="min-w-full text-sm text-left">
                <caption className="sr-only">Personal data collected through the enquiry forms, its purpose and whether it is required</caption>
                <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wider text-slate-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-bold">Data</th>
                    <th scope="col" className="px-4 py-3 font-bold">Why we need it</th>
                    <th scope="col" className="px-4 py-3 font-bold">Required?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5EA] text-[#5A6170]">
                  <tr><td className="px-4 py-3 font-semibold text-slate-800">Full name</td><td className="px-4 py-3">To address you and identify your enquiry</td><td className="px-4 py-3">Yes</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-slate-800">Phone / WhatsApp number</td><td className="px-4 py-3">To respond to your enquiry — this is our primary contact channel</td><td className="px-4 py-3">Yes</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-slate-800">Email address</td><td className="px-4 py-3">To send written quotations, spec sheets or lab reports if you prefer email</td><td className="px-4 py-3">Optional (required on the Contact page only)</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-slate-800">Company / firm name, business type</td><td className="px-4 py-3">To prepare a quotation appropriate to your trade segment</td><td className="px-4 py-3">Optional</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-slate-800">City / state</td><td className="px-4 py-3">To estimate freight and dispatch routing</td><td className="px-4 py-3">Required on bulk / quick enquiry forms</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-slate-800">Product interest, quantity, packaging, message</td><td className="px-4 py-3">The substance of your enquiry</td><td className="px-4 py-3">Message required; rest optional</td></tr>
                  <tr><td className="px-4 py-3 font-semibold text-slate-800">Consent record (tick-box, timestamp, policy version)</td><td className="px-4 py-3">To evidence that you agreed to this notice (DPDP Act s.6)</td><td className="px-4 py-3">Yes</td></tr>
                </tbody>
              </table>
            </div>

            <P>
              <strong>Collected automatically.</strong> When a form is submitted our server records the IP address of the request for a short
              period purely to block spam and abuse (rate limiting and duplicate detection). Cloudflare Turnstile, our bot-protection
              service, also processes technical browser signals to tell humans from bots; it does not build a profile of you. Our
              hosting providers keep standard server logs (IP address, browser type, pages requested) for security and error
              diagnosis. We do not use these logs to identify or track individual visitors.
            </P>
            <P>
              <strong>Stored in your browser.</strong> The site uses browser storage for the product cart, a short anti-spam timer, and the
              admin login session. None of this is sent to advertising or analytics companies. See our{' '}
              <Link to="/cookie-policy" className="text-[#1B2A4A] font-semibold underline underline-offset-2">Cookie &amp; Storage Policy</Link>.
            </P>
            <P>
              <strong>Lawful basis.</strong> We process this data on the basis of your <strong>consent</strong> (DPDP Act s.6), given by ticking the
              consent box before you submit a form. Where you voluntarily give us your details and ask us to respond, the DPDP Act also
              treats responding to that request as a legitimate use (s.7(a)).
            </P>
          </Section>

          <Section id="not-collected" title="4. What we do not collect">
            <UL>
              <li>No payment card, bank account or UPI details — the website takes no payments.</li>
              <li>No government identifiers (Aadhaar, PAN, passport, GSTIN of individuals).</li>
              <li>No precise location, device fingerprinting or cross-site tracking.</li>
              <li>No advertising cookies, no Google Analytics, no Meta Pixel or similar tracking scripts.</li>
              <li>No data from children (see section 12).</li>
            </UL>
          </Section>

          <Section id="consent" title="5. Consent and how to withdraw it">
            <P>
              Every enquiry form has an un-ticked consent box. By ticking it you agree that we may store and use the details you
              entered to respond to your enquiry as described here. Consent is recorded with the time and the version of this notice.
            </P>
            <P>
              You may <strong>withdraw consent at any time</strong> by emailing{' '}
              <a href={`mailto:${contactEmail}?subject=Withdraw%20consent`} className="text-[#1B2A4A] font-semibold underline underline-offset-2">{contactEmail}</a>{' '}
              or messaging us on WhatsApp at {BUSINESS_CONFIG.phonePrimary}. Withdrawing is as easy as giving consent. When you withdraw
              we will stop processing your data and delete your enquiry within 30 days, unless a law requires us to keep it (for
              example, tax or export records for a completed transaction). Withdrawal does not affect processing that happened
              before it.
            </P>
          </Section>

          <Section id="sharing" title="6. Who we share data with">
            <P>
              We do not sell, rent or trade your personal data, and we do not share it with marketing companies. We use the following
              service providers (Data Processors under the DPDP Act) who process data only on our instructions:
            </P>
            <div className="overflow-x-auto rounded-xl border border-[#E2E5EA]">
              <table className="min-w-full text-sm text-left">
                <caption className="sr-only">Third-party service providers that process personal data on our behalf</caption>
                <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wider text-slate-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-bold">Provider</th>
                    <th scope="col" className="px-4 py-3 font-bold">Purpose</th>
                    <th scope="col" className="px-4 py-3 font-bold">Where data is processed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5EA] text-[#5A6170]">
                  {DATA_PROCESSORS.map((p) => (
                    <tr key={p.name}>
                      <td className="px-4 py-3 font-semibold text-slate-800">{p.name}</td>
                      <td className="px-4 py-3">{p.purpose}</td>
                      <td className="px-4 py-3">{p.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <P>
              We may also disclose personal data where the law requires it — for example to a court, a regulator, or a government
              authority acting under the DPDP Act or other Indian law — or to protect our legal rights.
            </P>
          </Section>

          <Section id="transfers" title="7. Transfers outside India">
            <P>
              Enquiry records are stored in India (Mumbai). Some providers listed above process data on servers outside India —
              notably our email-notification service (United States) and our font and bot-protection services (global networks).
              These transfers are permitted under section 16 of the DPDP Act to any country not restricted by the Central Government.
              Each provider is bound by contract to protect your data and use it only for the stated purpose.
            </P>
          </Section>

          <Section id="retention" title="8. How long we keep data">
            <UL>
              <li><strong>Enquiries:</strong> kept while we are dealing with your enquiry, then deleted automatically {INQUIRY_RETENTION_MONTHS} months after it is closed.</li>
              <li><strong>Anti-abuse records (IP address for rate limiting, failed login attempts):</strong> deleted automatically within 15 minutes.</li>
              <li><strong>Enquiry notification emails</strong> in our sales mailbox: deleted when the enquiry is closed, and in any case within {INQUIRY_RETENTION_MONTHS} months.</li>
              <li><strong>If you withdraw consent:</strong> deleted within 30 days (section 5).</li>
              <li><strong>If a transaction follows:</strong> commercial documents (invoices, shipping papers) are kept for the period required by Indian tax, customs and company law, separately from this website.</li>
            </UL>
            <P>
              When data is deleted we also instruct our processors to delete their copies (DPDP Act s.8(7)).
            </P>
          </Section>

          <Section id="rights" title="9. Your rights">
            <P>Under sections 11 to 14 of the DPDP Act you have the right to:</P>
            <UL>
              <li><strong>Access</strong> — a summary of the personal data we hold about you, what we do with it and who we have shared it with.</li>
              <li><strong>Correction and updating</strong> — fix inaccurate or incomplete details.</li>
              <li><strong>Erasure</strong> — have your data deleted, unless we must keep it by law.</li>
              <li><strong>Withdraw consent</strong> — at any time (section 5).</li>
              <li><strong>Grievance redressal</strong> — raise a complaint with our Grievance Officer (section 13).</li>
              <li><strong>Nominate</strong> another person to exercise these rights on your behalf in the event of death or incapacity.</li>
            </UL>
            <P>
              To exercise any right, email{' '}
              <a href={`mailto:${contactEmail}?subject=Data%20rights%20request`} className="text-[#1B2A4A] font-semibold underline underline-offset-2">{contactEmail}</a>{' '}
              with the phone number or email you used on the form so we can find your record. We will respond within 30 days.
              We may ask you to confirm your identity before acting. If you are not satisfied with our response you may complain to
              the <strong>Data Protection Board of India</strong>.
            </P>
          </Section>

          <Section id="security" title="10. How we protect data">
            <UL>
              <li>All traffic to the website and API is encrypted (HTTPS/TLS).</li>
              <li>Enquiry records are stored in an access-controlled database with encryption at rest; only authorised staff can view them, after logging in.</li>
              <li>Admin accounts use hashed passwords, session expiry, login lockouts and token revocation.</li>
              <li>Inputs are validated and sanitised, and all forms are rate-limited and bot-protected.</li>
              <li>Credentials for our service providers are stored outside the codebase and rotated if exposed.</li>
            </UL>
          </Section>

          <Section id="breach" title="11. Data breaches">
            <P>
              If a personal data breach affects you, we will notify you and the Data Protection Board of India as required by
              section 8(6) of the DPDP Act and the DPDP Rules, 2025, explaining what happened, what data was involved and what we are
              doing about it.
            </P>
          </Section>

          <Section id="children" title="12. Children">
            <P>
              This is a business-to-business trade website and is not directed at anyone under 18. We do not knowingly collect
              personal data from children. If you believe a child has submitted an enquiry, contact us and we will delete it.
            </P>
          </Section>

          <Section id="grievance" title="13. Grievance Officer and contact">
            <P>
              In line with section 8(10) of the DPDP Act, our Grievance Officer handles questions, requests and complaints about
              personal data:
            </P>
            <div className="bg-[#F0F2F5] p-4 rounded-xl border border-[#E2E5EA] text-xs sm:text-sm text-gray-700 space-y-1">
              <p><strong>Grievance Officer:</strong> {GRIEVANCE_OFFICER.name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${GRIEVANCE_OFFICER.email}`} className="text-[#1B2A4A] font-semibold underline underline-offset-2">{GRIEVANCE_OFFICER.email}</a></p>
              <p><strong>Phone:</strong> {BUSINESS_CONFIG.phonePrimary} ({BUSINESS_CONFIG.businessHours})</p>
              <p><strong>Post:</strong> {BUSINESS_CONFIG.legalEntityName}, {address.line1}, {address.area}, {address.city}, {address.state} {address.pincode}, {address.country}</p>
              <p><strong>Response time:</strong> acknowledgement within 3 working days, resolution within 30 days.</p>
            </div>
          </Section>

          <Section id="changes" title="14. Changes to this notice">
            <P>
              We may update this notice when our practices or the law change. The date and version number at the top will change,
              and material changes will be announced on this page. Enquiries submitted before a change remain governed by the version
              you consented to, which is recorded with your enquiry.
            </P>
          </Section>

          <Section id="law" title="15. Governing law">
            <P>
              This notice is governed by the laws of India, including the Digital Personal Data Protection Act, 2023, the DPDP
              Rules, 2025, and the Information Technology Act, 2000. Courts in Delhi, India have exclusive jurisdiction.
            </P>
          </Section>
        </div>
      </div>
    </div>
  );
};
