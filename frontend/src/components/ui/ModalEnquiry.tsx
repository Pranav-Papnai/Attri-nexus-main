import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Send, Phone, Sparkles, Building, User, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEnquiryModal } from '../../context/EnquiryModalContext';
import { useProducts } from '../../context/ProductsContext';
import { BUSINESS_CONFIG } from '@/constants/business';
import { WhatsAppIcon } from './WhatsAppIcon';
import { TurnstileWidget } from './Turnstile';
import { ConsentCheckbox } from './ConsentCheckbox';
import { PRIVACY_POLICY_VERSION } from '@/constants/legal';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { saveInquiry } from '@/services/api/backend';
import { sanitizeText, sanitizeEmail } from '@/utils/validation';
import confetti from 'canvas-confetti';

const captchaEnabled = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);


export const ModalEnquiry: React.FC = () => {
  const { isOpen, initialProduct, closeEnquiryModal } = useEnquiryModal();
  const { products: PRODUCTS } = useProducts();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(cardRef, isOpen);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    businessType: 'Retail / Household',
    product: '',
    packSize: '25kg Standard Bag',
    estimatedQuantity: '',
    message: '',
    website: '' // honeypot — must always stay empty for real users
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProduct) {
      setFormData(prev => ({ ...prev, product: initialProduct }));
    } else if (PRODUCTS.length > 0) {
      setFormData(prev => ({ ...prev, product: prev.product || PRODUCTS[0].name }));
    }
  }, [initialProduct, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeEnquiryModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeEnquiryModal]);

  // Lock background body & html scroll and stop Lenis when enquiry modal is open
  useEffect(() => {
    if (!isOpen) return;

    const lenisInstance = (window as any).lenis;
    if (lenisInstance) {
      lenisInstance.stop();
    }

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      if (lenisInstance) {
        lenisInstance.start();
      }
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

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

    const result = await saveInquiry({
      name: sanitizeText(formData.name),
      email: formData.email ? sanitizeEmail(formData.email) : undefined,
      phone: formData.phone,
      company_name: sanitizeText(`${formData.businessType} — ${formData.city}`),
      product_id: formData.product,
      quantity: sanitizeText(formData.estimatedQuantity || formData.packSize),
      message: sanitizeText(formData.message || `Enquiry for ${formData.product} (${formData.estimatedQuantity || formData.packSize}) from ${formData.city}`),
      source: 'modal',
      consent: true,
      consent_version: PRIVACY_POLICY_VERSION
    }, formData.website, captchaToken);

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || 'Something went wrong. Please try again.');
      setCaptchaToken(null); // Turnstile tokens are single-use — force a fresh challenge on retry
      return;
    }

    setIsSuccess(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Safe fallback
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setSubmitError(null);
    setCaptchaToken(null);
    setConsent(false);
    setConsentError(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: '',
      businessType: 'Retail / Household',
      product: PRODUCTS[0]?.name || '',
      packSize: '25kg Standard Bag',
      estimatedQuantity: '',
      message: '',
      website: ''
    });
    closeEnquiryModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          data-lenis-prevent="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-hidden overscroll-contain"
          onClick={handleResetAndClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-enquiry-title"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            ref={cardRef}
            data-lenis-prevent="true"
            className="relative w-full max-w-xl my-auto bg-[#F5F6F8] border border-[#C5A059]/40 rounded-2xl shadow-2xl overflow-hidden text-[#1A1D23] flex flex-col max-h-[90dvh] max-h-[90vh] overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Ribbon */}
            <div className="bg-gradient-to-r from-[#0F2C4C] via-[#1B2A4A] to-[#B22234] p-4 sm:p-6 text-white relative flex-shrink-0">

          <button
            onClick={handleResetAndClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close enquiry modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-[#DFD1BA] text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Direct Commercial Desk</span>
          </div>
          <h2 id="modal-enquiry-title" className="text-lg sm:text-2xl font-serif font-bold text-white">
            Product & Business Enquiry
          </h2>
          <p className="text-[11px] sm:text-sm text-gray-200 mt-1">
            Connect with the official Attri Nexus sales and distribution team.
          </p>
        </div>

        <div data-lenis-prevent="true" className="p-4 sm:p-6 flex-1 overflow-y-auto overscroll-contain">
          {isSuccess ? (
            <div className="text-center py-8 px-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1A1D23]">
                Thank you for reaching out!
              </h3>
              <p className="text-[#5A6170] text-sm max-w-md mx-auto">
                Our commercial desk has received your enquiry. An Attri Nexus representative will connect with you shortly via phone or WhatsApp.
              </p>
              <div className="pt-4 border-t border-[#E2E5EA] flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${BUSINESS_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello Attri Nexus, I just submitted an enquiry for ${formData.product || 'Rice Products'}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-[#0E7466] text-white rounded-lg text-sm font-medium hover:bg-[#075E54] transition-colors shadow-md"
                >
                  <WhatsAppIcon className="w-4 h-4 mr-2 fill-white" />
                  Chat on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field — hidden from real visitors, catches basic spam bots */}
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
                  <div role="alert" className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {submitError}
                </div>
              )}

              {/* Product Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="enq-product">
                  Select Product of Interest <span className="text-rose-600">*</span>
                </label>
                <select
                  required
                  id="enq-product"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E5EA] rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-transparent transition-all"
                >
                  {PRODUCTS.map((prod) => (
                    <option key={prod.id} value={prod.name}>
                      {prod.name} — {prod.variety} ({prod.category})
                    </option>
                  ))}
                  <option value="All Products / Bulk Assortment">All Products / General Bulk Assortment</option>
                </select>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="enq-name">
                    Your Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3 top-3.5 sm:top-3" />
                    <input
                      type="text"
                      required
                      id="enq-name"
                      autoComplete="name"
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E5EA] rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="enq-phone">
                    Phone / WhatsApp <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3.5 sm:top-3" />
                    <input
                      type="tel"
                      required
                      id="enq-phone"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E5EA] rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Email & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="enq-email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5 sm:top-3" />
                    <input
                      type="email"
                      id="enq-email"
                      autoComplete="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E5EA] rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="enq-city">
                    City & State <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-3.5 sm:top-3" />
                    <input
                      type="text"
                      required
                      id="enq-city"
                      autoComplete="address-level2"
                      placeholder="e.g. Delhi NCR"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E5EA] rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Business Type & Estimated Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="enq-buyer-type">
                    Business / Buyer Type
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-500 absolute left-3 top-3.5 sm:top-3" />
                    <select
                      id="enq-buyer-type"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E5EA] rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
                    >
                      <option value="Wholesaler / Trader">Wholesaler / Trader</option>
                      <option value="Distributor / Stockist">Distributor / Stockist</option>
                      <option value="Supermarket / Retailer">Supermarket / Retail Store</option>
                      <option value="Hotel / Restaurant / Caterer (HoReCa)">Hotel / Restaurant / Caterer (HoReCa)</option>
                      <option value="Institution / Canteen">Institution / Canteen</option>
                      <option value="Household / Direct Consumer">Household / Direct Consumer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="enq-quantity">
                    Estimated Requirement
                  </label>
                  <input
                    type="text"
                    id="enq-quantity"
                    placeholder="e.g. 50 Bags / 2 Metric Tons / Samples"
                    value={formData.estimatedQuantity}
                    onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E5EA] rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="enq-message">
                  Requirement Details / Message
                </label>
                <textarea
                  rows={3}
                  id="enq-message"
                  placeholder="Mention target variety, grain finish, target delivery destination, etc."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E2E5EA] rounded-lg text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] transition-all resize-none"
                />
              </div>

              <ConsentCheckbox
                id="enq-consent"
                checked={consent}
                onChange={(v) => { setConsent(v); if (v) setConsentError(null); }}
                error={consentError || undefined}
                compact
              />

              {captchaEnabled && (
                <TurnstileWidget onVerify={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-[#5A6170] text-center sm:text-left">
                  Or call directly: <span className="font-semibold text-gray-800">{BUSINESS_CONFIG.phonePrimary}</span>
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#B22234] hover:bg-[#9A1D2C] text-white font-medium rounded-lg text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-75 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Submit Enquiry</span>
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
