import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useProducts } from '../context/ProductsContext';
import { BUSINESS_CONFIG, getPhoneLink, getWhatsAppLink } from '@/constants/business';
import { 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck, 
  Package, 
  MapPin, 
  User, 
  Briefcase,
  Wheat,
  Boxes,
  Layers
} from 'lucide-react';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { TurnstileWidget } from '../components/ui/Turnstile';
import { ConsentCheckbox } from '../components/ui/ConsentCheckbox';
import { PRIVACY_POLICY_VERSION } from '@/constants/legal';
import { saveInquiry } from '@/services/api/backend';
import { sanitizeText, sanitizeEmail } from '@/utils/validation';
import confetti from 'canvas-confetti';

const captchaEnabled = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

interface CommodityDivisionConfig {
  id: string;
  label: string;
  categoryKey: 'Rice' | 'Animal Feed' | 'Wheat' | 'Wheat Flour' | 'Beans and Pulses';
  defaultItem: string;
  defaultBusinessSegment: string;
  businessSegments: string[];
  defaultVolume: string;
  volumePills: string[];
  defaultPackFormat: string;
  packFormats: string[];
}

const COMMODITY_DIVISIONS: CommodityDivisionConfig[] = [
  {
    id: 'rice',
    label: 'Rice',
    categoryKey: 'Rice',
    defaultItem: 'Pusa 1121 Basmati Rice',
    defaultBusinessSegment: 'Wholesaler / Grain Mandi Trader',
    businessSegments: [
      'Wholesaler / Grain Mandi Trader',
      'International Rice Exporter / Merchant',
      'Supermarket / Retail Chain Brand',
      'Hotel / Restaurant / HoReCa Buyer',
      'Institutional / Canteen Bulk Procurement',
      'Distributor / Regional Stockist'
    ],
    defaultVolume: '10 MT (1 Full Truckload)',
    volumePills: ['5 MT', '10 MT (1 FTL)', '25 MT (1 FCL)', '50 MT+'],
    defaultPackFormat: '25kg Standard Commercial Bag',
    packFormats: [
      '25kg Standard Commercial Bag',
      '50kg Master Agricultural Sack',
      '10kg Consumer Pack',
      '5kg Retail Poly Pack',
      '1-Ton Jumbo Bulk Bag (FIBC)',
      'Custom Export Packing (20ft FCL)'
    ]
  },
  {
    id: 'animal-feed',
    label: 'Animal Feed',
    categoryKey: 'Animal Feed',
    defaultItem: 'Soybean Meal DOC (Non-GMO)',
    defaultBusinessSegment: 'Dairy Farm / Cattle Feed Buyer',
    businessSegments: [
      'Dairy Farm / Cattle Feed Buyer',
      'Feed Mill / Commercial Formulator',
      'Poultry Farm / Broiler Integrator',
      'Aquafeed / Shrimp Feed Manufacturer',
      'Livestock Cooperative / Dairy Union',
      'International Feed Exporter'
    ],
    defaultVolume: '15 MT (1 Tipper Truckload)',
    volumePills: ['10 MT', '15 MT (Tipper)', '30 MT (2-Axle)', '50 MT+ (Multi-Axle)'],
    defaultPackFormat: '50kg HDPE Heavy-Duty Bag',
    packFormats: [
      '50kg HDPE Heavy-Duty Bag',
      '1-Ton Jumbo Bulk Bag (FIBC)',
      'Bulk Loose Truckload (Hopper/Tipper)',
      '25kg Commercial Bag',
      'Containerized Bulk Export (20ft FCL)'
    ]
  },
  {
    id: 'wheat',
    label: 'Wheat',
    categoryKey: 'Wheat',
    defaultItem: 'MP Sharbati Whole Wheat Grains',
    defaultBusinessSegment: 'Roller Flour Mill / Chakki Atta Unit',
    businessSegments: [
      'Roller Flour Mill / Chakki Atta Unit',
      'Commercial Bakery / Biscuit Manufacturer',
      'Grain Mandi Stockist / Wholesaler',
      'Institutional & Government Procurement',
      'International Grain Exporter'
    ],
    defaultVolume: '10 MT (1 Full Truckload)',
    volumePills: ['10 MT (1 FTL)', '25 MT (1 FCL)', '50 MT (Fleet)', '100 MT+ (Rake)'],
    defaultPackFormat: '50kg Master Jute / HDPE Sack',
    packFormats: [
      '50kg Master Jute / HDPE Sack',
      'Bulk Loose Hopper Truckload',
      '1-Ton Jumbo Bulk Bag (FIBC)',
      '25kg Standard PP Bag',
      'Custom Containerized Bulk Export'
    ]
  },
  {
    id: 'wheat-flour',
    label: 'Wheat Flour',
    categoryKey: 'Wheat Flour',
    defaultItem: 'MP Sharbati Whole Wheat Chakki Atta',
    defaultBusinessSegment: 'Commercial Bakery / Food Processor',
    businessSegments: [
      'Commercial Bakery / Food Processor',
      'Wholesale Stockist / FMCG Distributor',
      'Retail Chain / Supermarket Network',
      'HoReCa / Hotel & Restaurant Buyer',
      'Institutional Canteen / Mess Contractor'
    ],
    defaultVolume: '5 MT (Commercial Batch)',
    volumePills: ['2 MT', '5 MT (1 Batch)', '10 MT (1 FTL)', '25 MT (1 FCL)'],
    defaultPackFormat: '50kg HDPE Moisture-Barrier Sack',
    packFormats: [
      '50kg HDPE Moisture-Barrier Sack',
      '25kg Commercial Bakery Bag',
      '10kg Consumer Pack',
      '5kg Consumer Pack',
      'Custom Private Label Retail Pouches'
    ]
  },
  {
    id: 'pulses',
    label: 'Pulses',
    categoryKey: 'Beans and Pulses',
    defaultItem: 'Unpolished Desi Toor Dal',
    defaultBusinessSegment: 'Dal Mill / Pulse Processor',
    businessSegments: [
      'Dal Mill / Pulse Processor',
      'Wholesale Grain Mandi Trader',
      'Supermarket / Retail Chain Brand',
      'Private Label Packaging Enterprise',
      'Hotel & Catering (HoReCa) Procurement',
      'International Pulses Exporter'
    ],
    defaultVolume: '5 MT (Half Truckload)',
    volumePills: ['2 MT', '5 MT', '10 MT (1 FTL)', '25 MT (1 FCL)'],
    defaultPackFormat: '25kg PP Commercial Bag',
    packFormats: [
      '25kg PP Commercial Bag',
      '50kg Master HDPE Sack',
      '30kg Export Standard Bag',
      '1-Ton Jumbo FIBC Bag',
      '1kg / 2kg / 5kg Branded Retail Pack'
    ]
  }
];

export const BulkEnquiryPage: React.FC = () => {
  const { products: PRODUCTS } = useProducts();
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('rice');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const currentDivision = COMMODITY_DIVISIONS.find((d) => d.id === selectedDivisionId) || COMMODITY_DIVISIONS[0];
  const divisionProducts = PRODUCTS.filter((p) => p.category === currentDivision.categoryKey);

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    mobileNumber: '',
    email: '',
    city: '',
    state: '',
    businessType: COMMODITY_DIVISIONS[0].defaultBusinessSegment,
    productInterested: COMMODITY_DIVISIONS[0].defaultItem,
    estimatedQuantity: COMMODITY_DIVISIONS[0].defaultVolume,
    preferredPackSize: COMMODITY_DIVISIONS[0].defaultPackFormat,
    message: '',
    website: '' // honeypot
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState<string | null>(null);

  const handleDivisionSelect = (division: CommodityDivisionConfig) => {
    setSelectedDivisionId(division.id);
    const available = PRODUCTS.filter((p) => p.category === division.categoryKey);
    const defaultProduct = available[0]?.name || division.defaultItem;

    setFormData((prev) => ({
      ...prev,
      productInterested: defaultProduct,
      businessType: division.defaultBusinessSegment,
      estimatedQuantity: division.defaultVolume,
      preferredPackSize: division.defaultPackFormat
    }));
  };

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
      name: sanitizeText(formData.fullName),
      email: formData.email ? sanitizeEmail(formData.email) : undefined,
      phone: formData.mobileNumber,
      company_name: sanitizeText(`${formData.companyName} (${formData.businessType}) - ${formData.city}, ${formData.state}`),
      product_id: formData.productInterested,
      quantity: `${sanitizeText(formData.estimatedQuantity)} (${formData.preferredPackSize})`,
      message: sanitizeText(formData.message || `Bulk requirement for ${formData.productInterested}. Quantity: ${formData.estimatedQuantity}. Packaging: ${formData.preferredPackSize}`),
      source: 'bulk',
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
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Safe fallback
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmitError(null);
    setCaptchaToken(null);
    setConsent(false);
    setConsentError(null);
    setFormData({
      fullName: '',
      companyName: '',
      mobileNumber: '',
      email: '',
      city: '',
      state: '',
      businessType: 'Wholesaler / Mandi Trader',
      productInterested: PRODUCTS[0]?.name || 'Pusa 1121 Basmati Rice',
      estimatedQuantity: '10 MT (1 Full Truckload)',
      preferredPackSize: '25kg Standard Commercial Bag',
      message: '',
      website: ''
    });
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50/60 min-h-screen">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <SectionHeader
          badge="Commercial Procurement"
          title="Institutional & Wholesale Desk"
          subtitle="Direct containerized, truckload, and dealership quotes for agro commodities with certified lab purity."
          align="center"
        />
      </div>

      {/* Target Buyer Categories Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
          <div className="text-center max-w-xl mx-auto mb-4">
            <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-[#8C6D2B]">
              Direct Supply Channels
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mt-1 tracking-tight">
              Serving Trade Partners Across Key Agro Segments
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-700">
            {[
              "Grain Mandi Wholesalers",
              "Dairy Farms & Feed Mills",
              "Flour Stockists & Bakeries",
              "Supermarket Chains",
              "Hotels & Commercial Caterers",
              "Institutional Canteens",
              "Global Commodity Exporters"
            ].map((cat, idx) => (
              <span 
                key={idx}
                className="px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200/90 shadow-2xs flex items-center space-x-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#B22234]" />
                <span>{cat}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form & Benefits Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Commercial Values & Fast Direct Contacts */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#0B132B] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md space-y-5">
              <span className="text-amber-400 text-[11px] font-bold uppercase tracking-[0.16em]">
                Trade Assurance
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                Why Partner With Attri Nexus For Bulk Supply?
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-semibold">Strict Laboratory Quality Analysis</strong>
                    Certified moisture percentage, protein content, and zero foreign matter across consignments.
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
                  <Package className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-semibold">Multi-Format Packaging</strong>
                    10kg, 25kg, 50kg multi-layer BOPP/HDPE bags and 1-ton jumbo bulk bags.
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
                  <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-semibold">Dependable Dispatch & Rail/Port Logistics</strong>
                    Streamlined nationwide truckload fulfillment and containerized vessel booking.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <p className="text-xs text-slate-400 font-light">Prefer instant direct conversation?</p>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={getPhoneLink()}
                    className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-colors border border-white/15"
                  >
                    <Phone className="w-3.5 h-3.5 mr-2 text-amber-300" />
                    <span>Call Sales Desk</span>
                  </a>
                  <a
                    href={getWhatsAppLink("Hello Attri Nexus, I am looking for commercial bulk supply details for Rice / Feed / Wheat / Pulses.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#0E7466] hover:bg-[#075E54] text-white text-xs sm:text-sm font-semibold transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 mr-2 fill-white" />
                    <span>WhatsApp Quote</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 text-xs text-slate-600 space-y-1.5 shadow-2xs">
              <p className="font-bold text-slate-900 text-sm">Commercial Operations Desk:</p>
              <p>Primary: <strong className="text-slate-800">{BUSINESS_CONFIG.phonePrimary}</strong></p>
              <p>Email: <strong className="text-slate-800">{BUSINESS_CONFIG.salesEmail}</strong></p>
              <p>Hours: {BUSINESS_CONFIG.businessHours}</p>
            </div>
          </div>

          {/* Right Column: Business Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
              
              {isSubmitted ? (
                <div className="text-center py-8 px-2 space-y-4 animate-fade-in">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Thank you! Our commercial team will connect shortly.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed font-light">
                    Your business enquiry has been routed to our commercial distribution team. A representative will contact you with product specifications and price quotations.
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                    <a
                      href={getWhatsAppLink(`Hello Attri Nexus, I have just submitted a bulk business enquiry for ${formData.productInterested} on behalf of ${formData.companyName || formData.fullName}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 bg-[#0E7466] text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#075E54] transition-colors shadow-xs"
                    >
                      <WhatsAppIcon className="w-4 h-4 mr-2 fill-white" />
                      Follow Up On WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto px-5 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      Request Commercial Quotation (RFQ)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 font-light">
                      Please provide your business details and required consignment volume.
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

                  {/* 1-Click Commodity Selector Tabs */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span id="rfq-division-label" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        1. Select Commodity Division
                      </span>
                      <span className="text-[10px] font-bold text-[#8C6D2B] uppercase tracking-wider">
                        {currentDivision.label} Division
                      </span>
                    </div>
                    <div role="group" aria-labelledby="rfq-division-label" className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {COMMODITY_DIVISIONS.map((item) => {
                        const isSelected = selectedDivisionId === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleDivisionSelect(item)}
                            className={`flex items-center justify-center py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#0D3B2E] text-white border-[#0D3B2E] shadow-sm ring-2 ring-[#C5A059]/30'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="rfq-name">
                        Full Name <span className="text-[#B22234]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          id="rfq-name"
                          autoComplete="name"
                          placeholder="e.g. Ramesh Patel"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="rfq-company">
                        Company / Firm Name <span className="text-slate-500 font-normal lowercase">(optional)</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          id="rfq-company"
                          autoComplete="organization"
                          placeholder="e.g. Patel Enterprises Pvt Ltd"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="rfq-phone">
                        Mobile / WhatsApp <span className="text-[#B22234]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          id="rfq-phone"
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="rfq-email">
                        Business Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          id="rfq-email"
                          autoComplete="email"
                          placeholder="procurement@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="rfq-city">
                        City <span className="text-[#B22234]">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          id="rfq-city"
                          autoComplete="address-level2"
                          placeholder="e.g. Mumbai / Delhi / Kandla"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="rfq-state">
                        State <span className="text-[#B22234]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        id="rfq-state"
                        autoComplete="address-level1"
                        placeholder="e.g. Maharashtra"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Business Type & Product Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="rfq-segment">
                        Business Segment <span className="text-[#B22234]">*</span>
                      </label>
                      <select
                        id="rfq-segment"
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] font-medium"
                      >
                        {currentDivision.businessSegments.map((segment) => (
                          <option key={segment} value={segment}>
                            {segment}
                          </option>
                        ))}
                        <option value="Direct Agro Commodity Importer">Direct Agro Commodity Importer</option>
                        <option value="Other Commercial Buyer">Other Commercial Buyer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="rfq-variety">
                        Specific Variety ({currentDivision.label}) <span className="text-[#B22234]">*</span>
                      </label>
                      <select
                        id="rfq-variety"
                        value={formData.productInterested}
                        onChange={(e) => setFormData({ ...formData, productInterested: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] font-medium"
                      >
                        {divisionProducts.length > 0 ? (
                          divisionProducts.map((prod) => (
                            <option key={prod.id} value={prod.name}>
                              {prod.name} {prod.variety ? `(${prod.variety})` : ''}
                            </option>
                          ))
                        ) : (
                          <option value={currentDivision.defaultItem}>
                            {currentDivision.defaultItem}
                          </option>
                        )}
                        <option value={`All ${currentDivision.label} Varieties / Multi-Grade Lot`}>
                          All {currentDivision.label} Varieties / Multi-Grade Lot
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Quantity with Quick-Pills & Packaging */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="rfq-volume">
                        Estimated Volume <span className="text-[#B22234]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        id="rfq-volume"
                        placeholder={`e.g. ${currentDivision.defaultVolume}`}
                        value={formData.estimatedQuantity}
                        onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium"
                      />
                      {/* Quantity Quick-Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-2" role="group" aria-label="Quick volume presets">
                        {currentDivision.volumePills.map((qty) => (
                          <button
                            key={qty}
                            type="button"
                            onClick={() => setFormData({ ...formData, estimatedQuantity: qty })}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                              formData.estimatedQuantity === qty
                                ? 'bg-[#0D3B2E] text-white border-[#0D3B2E]'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                            }`}
                          >
                            {qty}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="rfq-packaging">
                        Packaging Preference
                      </label>
                      <select
                        id="rfq-packaging"
                        value={formData.preferredPackSize}
                        onChange={(e) => setFormData({ ...formData, preferredPackSize: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] font-medium"
                      >
                        {currentDivision.packFormats.map((pack) => (
                          <option key={pack} value={pack}>
                            {pack}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message / Delivery Destination */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="rfq-message">
                      Destination Mandi / ICD / Port & Notes
                    </label>
                    <textarea
                      rows={3}
                      id="rfq-message"
                      placeholder="Specify delivery destination (ICD / Port / Mandi), target dispatch timeline, or quality specifications..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#B22234]/30 focus:border-[#B22234] transition-all font-medium resize-none"
                    />
                  </div>

                  <ConsentCheckbox
                    id="rfq-consent"
                    checked={consent}
                    onChange={(v) => { setConsent(v); if (v) setConsentError(null); }}
                    error={consentError || undefined}
                  />

                  {captchaEnabled && (
                    <TurnstileWidget onVerify={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />
                  )}

                  {/* High-Converting Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center py-4 px-6 rounded-xl bg-[#B22234] hover:bg-[#931B2A] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <span>Processing RFQ...</span>
                      ) : (
                        <>
                          <span>Submit Commercial RFQ</span>
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
