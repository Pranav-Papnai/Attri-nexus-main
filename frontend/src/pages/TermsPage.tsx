import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BUSINESS_CONFIG } from '@/constants/business';
import { LEGAL_LAST_UPDATED } from '@/constants/legal';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-3">
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

export const TermsPage: React.FC = () => {
  const contactEmail = BUSINESS_CONFIG.email;

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Terms of Service"
          title="TERMS & CONDITIONS"
          subtitle="The terms that govern your use of the Attri Nexus website and the enquiries you submit through it."
          align="left"
        />

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E2E5EA] shadow-sm max-w-none text-gray-700 space-y-8">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Last updated: {LEGAL_LAST_UPDATED}
          </p>

          <Section title="1. Acceptance of these terms">
            <P>
              This website is operated by <strong>{BUSINESS_CONFIG.legalEntityName}</strong> (“Attri Nexus”, “we”, “us”). By
              accessing or using the website you agree to these Terms &amp; Conditions and to our{' '}
              <Link to="/privacy-policy" className="text-[#1B2A4A] font-semibold underline underline-offset-2">Privacy Policy</Link>. If you
              do not agree, please do not use the website.
            </P>
          </Section>

          <Section title="2. Use of the website">
            <P>The website is provided for the purpose of learning about our products and contacting us about them. You agree not to:</P>
            <UL>
              <li>submit false, misleading or fraudulent enquiries, or enquiries on behalf of someone else without their permission;</li>
              <li>use automated tools to scrape content, submit forms, or probe the website or its API;</li>
              <li>attempt to gain unauthorised access to the administration area or any other system;</li>
              <li>upload or transmit malware, or interfere with the availability of the website for others;</li>
              <li>use the website in any way that breaches applicable law.</li>
            </UL>
            <P>We may block access or delete enquiries that breach these terms without notice.</P>
          </Section>

          <Section title="3. Product information, enquiries and quotations">
            <P>
              Product descriptions, specifications, grain characteristics, nutritional values, images and packaging shown on this
              website are for general information and preliminary trade evaluation only. Natural agricultural commodities vary by
              season, origin and lot; the specifications that apply to a particular consignment are those stated in the written
              quotation, contract of sale, or certificate of analysis issued for that consignment.
            </P>
            <P>
              Nothing on this website is an offer to sell. Submitting an enquiry is a request for information or a quotation and
              does not create a contract. A binding contract arises only when we confirm an order in writing (for example by
              proforma invoice or sales contract) and you accept it. Quotations are valid for the period stated on them and are
              subject to availability, exchange-rate movements and market conditions.
            </P>
            <P>
              We may decline any enquiry or order at our discretion, including where minimum order quantities are not met or where
              export to the destination is restricted.
            </P>
          </Section>

          <Section title="4. Prices, payment and delivery">
            <P>
              The website does not display prices and does not take payments. All prices, payment terms, delivery terms
              (including Incoterms for exports), packaging, inspection and documentation are agreed separately in writing for each
              order and are governed by that agreement, not by these terms.
            </P>
          </Section>

          <Section title="5. Intellectual property">
            <P>
              The Attri Nexus name, logo and emblem, packaging artwork, website design, graphics, photographs and written content are
              owned by or licensed to Attri Nexus and protected by Indian and international intellectual-property law. You may view
              and print pages for your own business evaluation. You may not otherwise copy, reproduce, republish, distribute or
              create derivative works from any part of the website without our prior written permission.
            </P>
            <P>
              If you believe content on this website infringes your rights, email{' '}
              <a href={`mailto:${contactEmail}`} className="text-[#1B2A4A] font-semibold underline underline-offset-2">{contactEmail}</a>{' '}
              with details and we will investigate promptly.
            </P>
          </Section>

          <Section title="6. Storage and handling disclaimer">
            <P>
              Grains, flours, pulses and feed ingredients are perishable. Once goods are dispatched from our facilities, proper
              storage — dry, ventilated, off the floor, away from moisture, pests and direct sunlight — is the buyer's
              responsibility. We are not liable for deterioration caused by storage, handling or use that does not follow the
              guidance provided with the consignment.
            </P>
          </Section>

          <Section title="7. Third-party links and services">
            <P>
              The website may link to third-party websites (for example our group affiliate or WhatsApp). We do not control those
              sites and are not responsible for their content or privacy practices. Links are provided for convenience only and do
              not imply endorsement.
            </P>
          </Section>

          <Section title="8. Disclaimer of warranties">
            <P>
              The website is provided “as is” and “as available”. To the fullest extent permitted by law we make no warranty that
              the website will be uninterrupted, error-free or free of viruses, or that the information on it is complete, accurate
              or current at all times. This does not limit any warranty we give in a written contract of sale.
            </P>
          </Section>

          <Section title="9. Limitation of liability">
            <P>
              To the fullest extent permitted by law, Attri Nexus and its directors, employees and agents shall not be liable for any
              indirect, incidental, special or consequential loss, or for loss of profit, business, revenue or data, arising out of
              or in connection with your use of, or inability to use, this website or any information on it. Our total liability
              for any claim connected with the website is limited to INR 10,000. Nothing in these terms excludes liability for fraud,
              death or personal injury caused by negligence, or any liability that cannot be excluded under Indian law, including the
              Consumer Protection Act, 2019 where it applies.
            </P>
          </Section>

          <Section title="10. Indemnity">
            <P>
              You agree to indemnify Attri Nexus against claims, losses and costs (including reasonable legal fees) arising from your
              breach of these terms or your misuse of the website.
            </P>
          </Section>

          <Section title="11. Personal data">
            <P>
              We process the personal data you submit through this website in accordance with our{' '}
              <Link to="/privacy-policy" className="text-[#1B2A4A] font-semibold underline underline-offset-2">Privacy Policy</Link> and
              the Digital Personal Data Protection Act, 2023. Browser storage and third-party scripts are described in our{' '}
              <Link to="/cookie-policy" className="text-[#1B2A4A] font-semibold underline underline-offset-2">Cookie &amp; Storage Policy</Link>.
            </P>
          </Section>

          <Section title="12. Changes to these terms">
            <P>
              We may revise these terms at any time by updating this page. The “last updated” date shows when they last changed.
              Continued use of the website after a change means you accept the revised terms.
            </P>
          </Section>

          <Section title="13. Severability and waiver">
            <P>
              If any part of these terms is held invalid or unenforceable, the rest remains in force. Our failure to enforce a term
              is not a waiver of it.
            </P>
          </Section>

          <Section title="14. Governing law and jurisdiction">
            <P>
              These terms are governed by the laws of India. Any dispute arising out of or in connection with the website shall be
              subject to the exclusive jurisdiction of the competent courts in Delhi, India.
            </P>
          </Section>

          <Section title="15. Contact">
            <P>
              Questions about these terms: <a href={`mailto:${contactEmail}`} className="text-[#1B2A4A] font-semibold underline underline-offset-2">{contactEmail}</a> · {BUSINESS_CONFIG.phonePrimary}
            </P>
          </Section>
        </div>
      </div>
    </div>
  );
};
