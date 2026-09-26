import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BUSINESS_CONFIG, getPhoneLink, getWhatsAppLink } from '@/constants/business';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building, 
  User 
} from 'lucide-react';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { TurnstileWidget } from '../components/ui/Turnstile';
import { ConsentCheckbox } from '../components/ui/ConsentCheckbox';
import { PRIVACY_POLICY_VERSION } from '@/constants/legal';
import { saveInquiry } from '@/services/api/backend';
import { validateFormData, sanitizeText, sanitizeEmail } from '@/utils/validation';
import confetti from 'canvas-confetti';

const captchaEnabled = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setValidationErrors({});

    const validation = validateFormData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message
    });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

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
      email: sanitizeEmail(formData.email),
      phone: formData.phone,
      company_name: sanitizeText(formData.subject) || 'General Inquiry',
      message: sanitizeText(formData.message),
      source: 'contact',
      consent: true,
      consent_version: PRIVACY_POLICY_VERSION
    }, formData.website, captchaToken);

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || 'Something went wrong. Please try again.');
      setCaptchaToken(null);
      return;
    }

    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Fallback
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmitError(null);
    setCaptchaToken(null);
    setConsent(false);
    setConsentError(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      website: ''
    });
  };

  return (
    <div className="py-12 sm:py-16">
      
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <SectionHeader
            badge="Direct Inquiries"
            title="Get in Touch with Attri Nexus"
            subtitle="Have questions about our commodity portfolio, trade terms, or dealership opportunities? Connect with our team."
            align="center"
          />
        </div>
      </section>

      {/* Main Grid: Contact Details & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-5 text-left">
            
            {/* Contact Details Card */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Attri Nexus Corporate Office
              </h2>

              <div className="space-y-4">
                
                {/* Phone */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#B22234] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8C6D2B]">
                      Phone / Helpline
                    </h3>
                    <div className="mt-0.5 space-y-0.5 text-xs sm:text-sm">
                      <a href={getPhoneLink(BUSINESS_CONFIG.phonePrimary)} className="block font-bold text-slate-800 hover:text-[#B22234] transition-colors">
                        {BUSINESS_CONFIG.phonePrimary} (Primary Hotline)
                      </a>
                      <a href={getPhoneLink(BUSINESS_CONFIG.phoneSecondary)} className="block text-slate-600 hover:text-[#B22234] transition-colors font-medium">
                        {BUSINESS_CONFIG.phoneSecondary} (Commercial Desk)
                      </a>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#25D366] shrink-0">
                    <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-800">
                      WhatsApp Quick Desk
                    </h3>
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-0.5 text-xs sm:text-sm font-bold text-emerald-700 hover:underline"
                    >
                      {BUSINESS_CONFIG.phonePrimary} — Chat Online
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#B22234] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8C6D2B]">
                      Email Addresses
                    </h3>
                    <div className="mt-0.5 space-y-0.5 text-xs sm:text-sm">
                      <a href={`mailto:${BUSINESS_CONFIG.email}`} className="block font-bold text-slate-800 hover:text-[#B22234] transition-colors">
                        {BUSINESS_CONFIG.email}
                      </a>
                      <a href={`mailto:${BUSINESS_CONFIG.salesEmail}`} className="block text-slate-600 hover:text-[#B22234] transition-colors font-medium">
                        {BUSINESS_CONFIG.salesEmail}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#B22234] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8C6D2B]">
                      Registered Address
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
                      {BUSINESS_CONFIG.address.line1}<br />
                      {BUSINESS_CONFIG.address.area}, {BUSINESS_CONFIG.address.city}<br />
                      {BUSINESS_CONFIG.address.state} — {BUSINESS_CONFIG.address.pincode}, {BUSINESS_CONFIG.address.country}
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#B22234] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8C6D2B]">
                      Operational Hours
                    </h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-700 font-light">
                      {BUSINESS_CONFIG.businessHours}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Map Location Card */}
            <div className="bg-[#0B132B] text-white p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-amber-400 text-[11px] font-bold uppercase tracking-[0.16em]">
                  Location Verification
                </span>
                <h4 className="font-serif font-bold text-white text-base">
                  {BUSINESS_CONFIG.address.city}, {BUSINESS_CONFIG.address.country}
                </h4>
                <p className="text-xs text-slate-400 font-light">
                  Direct agricultural hub & nationwide dispatch.
                </p>
              </div>
              <Building className="w-7 h-7 text-amber-400 shrink-0" />
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7 text-left">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs">
              
              {isSubmitted ? (
                <div className="text-center py-10 px-2 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                    Thank you! Message Sent Successfully.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-light">
                    We have received your enquiry. Our client coordination team will review your message and reply via email or phone.
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <a
                      href={getWhatsAppLink(`Hello Attri Nexus, I just sent an inquiry via your contact page. Name: ${formData.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 bg-[#0E7466] text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#075E54] transition-colors"
                    >
                      <WhatsAppIcon className="w-4 h-4 mr-2 fill-white" />
                      Chat on WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                      Send a Message
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-light">
                      Fill out the form below and our team will get back to you within 24 hours.
                    </p>
                  </div>

                  {/* Honeypot field */}
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
                  <div role="alert" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      {submitError}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="contact-name">
                      Full Name <span className="text-[#B22234]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        id="contact-name"
                        autoComplete="name"
                        aria-invalid={validationErrors.name ? true : undefined}
                        aria-describedby={validationErrors.name ? 'contact-name-error' : undefined}
                        placeholder="e.g. Rajesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium ${
                          validationErrors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {validationErrors.name && (
                      <p id="contact-name-error" role="alert" className="mt-1 text-xs text-rose-600">{validationErrors.name}</p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="contact-email">
                        Email Address <span className="text-[#B22234]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          id="contact-email"
                          autoComplete="email"
                          aria-invalid={validationErrors.email ? true : undefined}
                          aria-describedby={validationErrors.email ? 'contact-email-error' : undefined}
                          placeholder="rajesh@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium ${
                            validationErrors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                          }`}
                        />
                      </div>
                      {validationErrors.email && (
                        <p id="contact-email-error" role="alert" className="mt-1 text-xs text-rose-600">{validationErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="contact-phone">
                        Phone / WhatsApp <span className="text-[#B22234]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          id="contact-phone"
                          autoComplete="tel"
                          aria-invalid={validationErrors.phone ? true : undefined}
                          aria-describedby={validationErrors.phone ? 'contact-phone-error' : undefined}
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium ${
                            validationErrors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                          }`}
                        />
                      </div>
                      {validationErrors.phone && (
                        <p id="contact-phone-error" role="alert" className="mt-1 text-xs text-rose-600">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="contact-subject">
                      Subject / Commodity of Interest
                    </label>
                    <input
                      type="text"
                      id="contact-subject"
                      placeholder="e.g. Inquiry regarding Basmati Rice / MP Sharbati Atta / Feed"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="contact-message">
                      Your Message <span className="text-[#B22234]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      id="contact-message"
                      aria-invalid={validationErrors.message ? true : undefined}
                      aria-describedby={validationErrors.message ? 'contact-message-error' : undefined}
                      placeholder="Please let us know your requirements, questions, or supply schedule..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all resize-none font-medium ${
                        validationErrors.message ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                      }`}
                    />
                    {validationErrors.message && (
                      <p id="contact-message-error" role="alert" className="mt-1 text-xs text-rose-600 font-semibold">{validationErrors.message}</p>
                    )}
                  </div>

                  <ConsentCheckbox
                    id="contact-consent"
                    checked={consent}
                    onChange={(v) => { setConsent(v); if (v) setConsentError(null); }}
                    error={consentError || undefined}
                  />

                  {captchaEnabled && (
                    <TurnstileWidget onVerify={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center py-4 px-6 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
