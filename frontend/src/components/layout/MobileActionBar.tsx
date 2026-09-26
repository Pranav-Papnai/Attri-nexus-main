import React from 'react';
import { Phone, Sparkles } from 'lucide-react';
import { getPhoneLink, getWhatsAppLink } from '@/constants/business';
import { useEnquiryModal } from '../../context/EnquiryModalContext';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

export const MobileActionBar: React.FC = () => {
  const { openEnquiryModal } = useEnquiryModal();

  return (
    <aside
      aria-label="Mobile quick action bar"
      className="lg:hidden fixed bottom-0 inset-x-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E5EA] shadow-[0_-4px_25px_rgba(0,0,0,0.1)] py-2 px-2.5 sm:px-4 safe-area-pb"
    >
      <div className="grid grid-cols-3 gap-2 w-full max-w-full sm:max-w-xl mx-auto">
        {/* Call Button */}
        <a
          href={getPhoneLink()}
          className="flex flex-col items-center justify-center py-2 px-1 min-h-[48px] rounded-xl bg-[#F0F2F5] text-[#1A1D23] hover:bg-[#EAE0D0] transition-colors text-center active:scale-95 border border-slate-200/70"
        >
          <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1B2A4A] mb-0.5 shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold tracking-tight">Call Us</span>
        </a>

        {/* WhatsApp Button with Official Logo */}
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 min-h-[48px] rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors text-center active:scale-95 border border-emerald-200"
        >
          <WhatsAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#25D366] mb-0.5 fill-[#25D366] shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold tracking-tight">WhatsApp</span>
        </a>

        {/* Enquire Button */}
        <button
          type="button"
          onClick={() => openEnquiryModal()}
          className="flex flex-col items-center justify-center py-2 px-1 min-h-[48px] rounded-xl bg-[#B22234] text-white hover:bg-[#9A1D2C] transition-colors text-center shadow-md active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 mb-0.5 text-white shrink-0" />
          <span className="text-[11px] sm:text-xs font-bold tracking-tight">Enquire</span>
        </button>
      </div>
    </aside>
  );
};
