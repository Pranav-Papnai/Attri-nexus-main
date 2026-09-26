import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Phone, Mail, User, ShieldCheck, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '@/context/ProductsContext';
import { getWhatsAppLink } from '@/constants/business';
import { WhatsAppIcon } from './WhatsAppIcon';
import { TurnstileWidget } from './Turnstile';
import { ConsentCheckbox } from './ConsentCheckbox';
import { PRIVACY_POLICY_VERSION } from '@/constants/legal';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { saveInquiry } from '@/services/api/backend';
import { sanitizeText, sanitizeEmail } from '@/utils/validation';
import confetti from 'canvas-confetti';

const captchaEnabled = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'Rice' | 'Animal Feed' | 'Wheat' | 'Wheat Flour' | 'Beans and Pulses';
}

const COMMODITY_TABS: { id: string; label: string; categoryKey: 'Rice' | 'Animal Feed' | 'Wheat' | 'Wheat Flour' | 'Beans and Pulses' }[] = [
  { id: 'rice', label: 'Rice', categoryKey: 'Rice' },
  { id: 'animal-feed', label: 'Animal Feed', categoryKey: 'Animal Feed' },
  { id: 'wheat', label: 'Wheat', categoryKey: 'Wheat' },
  { id: 'wheat-flour', label: 'Wheat Flour', categoryKey: 'Wheat Flour' },
  { id: 'pulses', label: 'Pulses', categoryKey: 'Beans and Pulses' }
];

export const LabReportModal: React.FC<LabReportModalProps> = ({ isOpen, onClose, defaultCategory = 'Rice' }) => {
  const { products: PRODUCTS } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<'Rice' | 'Animal Feed' | 'Wheat' | 'Wheat Flour' | 'Beans and Pulses'>(defaultCategory);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(cardRef, isOpen);

  const availableProducts = PRODUCTS.filter((p) => p.category === selectedCategory);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product: availableProducts[0]?.name || 'Pusa 1121 Basmati Rice',
    testType: 'Full Certificate of Analysis (COA) & Purity Specs',
    website: '' // honeypot
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  // Sync category default product on tab switch
  const handleCategorySwitch = (catKey: 'Rice' | 'Animal Feed' | 'Wheat' | 'Wheat Flour' | 'Beans and Pulses') => {
    setSelectedCategory(catKey);
    const catProducts = PRODUCTS.filter((p) => p.category === catKey);
    setFormData((prev) => ({
      ...prev,
      product: catProducts[0]?.name || `${catKey} Standard Export Grade`
    }));
  };

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setSubmitError(null);
      setCaptchaToken(null);
      setConsent(false);
      setConsentError(null);
      const catProducts = PRODUCTS.filter((p) => p.category === defaultCategory);
      setFormData({
        name: '',
        phone: '',
        email: '',
        product: catProducts[0]?.name || 'Pusa 1121 Basmati Rice',
        testType: 'Full Certificate of Analysis (COA) & Purity Specs',
        website: ''
      });
    }
  }, [isOpen, defaultCategory]);

  // Lock background scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!consent) {
      setConsentError('Please tick the consent box so we can process your enquiry.');
      return;
    }

    if (captchaEnabled && !captchaToken) {
      setSubmitError('Please complete the captcha verification.');
      return;
    }

    setIsSubmitting(true);

    const result = await saveInquiry(
      {
        name: sanitizeText(formData.name),
        email: formData.email ? sanitizeEmail(formData.email) : undefined,
        phone: formData.phone,
        company_name: 'Lab Report / Spec Sheet Request',
        product_id: formData.product,
        quantity: formData.testType,
        message: `[LAB SPEC REQUEST] Buyer requested official technical spec sheet and lab certificate for ${formData.product}. Required parameters: ${formData.testType}. Contact via: Phone/WhatsApp ${formData.phone}${formData.email ? `, Email ${formData.email}` : ''}.`,
        source: 'modal',
        consent: true,
        consent_version: PRIVACY_POLICY_VERSION
      },
      formData.website,
      captchaToken
    );

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || 'Something went wrong. Please try again.');
      setCaptchaToken(null);
      return;
    }

    setIsSuccess(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lab-report-title"
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10 my-8"
          >
            {/* Header (Royal Forest Green Theme) */}
            <div className="bg-[#0D3B2E] text-white p-5 sm:p-6 relative border-b border-[#C5A059]/40">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-amber-300 text-[11px] font-bold uppercase tracking-[0.16em] mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Certified Lab Verification</span>
              </div>

              <h3 id="lab-report-title" className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                Request Lab Spec Sheet & COA
              </h3>
              <p className="text-xs text-slate-200 mt-1 font-light leading-relaxed">
                Receive certified physical & chemical analysis parameters (Moisture %, Purity, Protein) directly on WhatsApp / Email.
              </p>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6">
              {isSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-slate-900">
                    Spec Sheet Request Received!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Our quality desk has received your request for <strong>{formData.product}</strong>. We will share the official certified laboratory report shortly.
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <a
                      href={getWhatsAppLink(`Hello Attri Nexus Quality Desk, I requested the Certified Lab Analysis Report & Spec Sheet for ${formData.product} for ${formData.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-[#0E7466] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#075E54] transition-colors shadow-xs"
                    >
                      <WhatsAppIcon className="w-4 h-4 mr-2 fill-white" />
                      Get Report on WhatsApp
                    </a>
                    <button
                      onClick={onClose}
                      className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] w-px h-px opacity-0"
                  />

                  {submitError && (
                  <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      {submitError}
                    </div>
                  )}

                  {/* 1. Category Division Chips */}
                  <div>
                    <span id="lab-division-label" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      1. Commodity Division
                    </span>
                    <div role="group" aria-labelledby="lab-division-label" className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {COMMODITY_TABS.map((tab) => {
                        const isSelected = selectedCategory === tab.categoryKey;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleCategorySwitch(tab.categoryKey)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer text-center ${
                              isSelected
                                ? 'bg-[#0D3B2E] text-white border-[#0D3B2E] shadow-2xs ring-1 ring-[#C5A059]'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Target Product Variety */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="lab-product">
                      2. Specific Variety / Product <span className="text-[#B22234]">*</span>
                    </label>
                    <select
                      id="lab-product"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-medium"
                    >
                      {availableProducts.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} {p.variety ? `(${p.variety})` : ''}
                        </option>
                      ))}
                      <option value={`All ${selectedCategory} Varieties — Combined Lab Specs`}>
                        All {selectedCategory} Varieties — Combined Lab Specs
                      </option>
                    </select>
                  </div>

                  {/* 3. Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="lab-name">
                        Your Name <span className="text-[#B22234]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          id="lab-name"
                          autoComplete="name"
                          placeholder="e.g. Ramesh Patel"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="lab-phone">
                        Mobile / WhatsApp <span className="text-[#B22234]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          id="lab-phone"
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Business Email (Optional) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="lab-email">
                      Business Email <span className="text-slate-500 font-normal">(Optional for PDF Dispatch)</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        id="lab-email"
                        autoComplete="email"
                        placeholder="qa@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] font-medium"
                      />
                    </div>
                  </div>

                  <ConsentCheckbox
                    id="lab-consent"
                    checked={consent}
                    onChange={(v) => { setConsent(v); if (v) setConsentError(null); }}
                    error={consentError || undefined}
                    compact
                  />

                  {captchaEnabled && (
                    <TurnstileWidget onVerify={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />
                  )}

                  {/* Submit Button (Royal Forest Green) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center py-3 px-5 rounded-xl bg-[#0D3B2E] hover:bg-[#08261E] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <span>Processing Request...</span>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2 text-amber-300" />
                          <span>Send Certified Spec Sheet & COA</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
