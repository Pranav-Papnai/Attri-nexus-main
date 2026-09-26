import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getWhatsAppLink } from '@/constants/business';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { motion, AnimatePresence } from 'motion/react';

export const WhatsAppFloatingBtn: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  // Auto-dismiss tooltip after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end">
      {/* Tooltip popover */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mb-2 hidden sm:flex items-center space-x-2 bg-white text-slate-800 text-xs font-medium px-3.5 py-1.5 rounded-xl shadow-lg border border-slate-200/80"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Chat on WhatsApp</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowTooltip(false);
              }}
              className="text-slate-500 hover:text-slate-600 ml-1 cursor-pointer p-0.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Dismiss WhatsApp hint"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button with Official WhatsApp Icon & Lively Continuous Bounce */}
      <motion.a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        animate={{
          y: [0, -14, 0, -6, 0, 0],
          boxShadow: [
            '0 10px 25px -5px rgba(37, 211, 102, 0.4)',
            '0 20px 35px -5px rgba(37, 211, 102, 0.65)',
            '0 10px 25px -5px rgba(37, 211, 102, 0.4)',
            '0 15px 30px -5px rgba(37, 211, 102, 0.55)',
            '0 10px 25px -5px rgba(37, 211, 102, 0.4)',
            '0 10px 25px -5px rgba(37, 211, 102, 0.4)',
          ],
        }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.28, 0.5, 0.68, 0.85, 1],
        }}
        whileHover={{ scale: 1.12, y: -4 }}
        whileTap={{ scale: 0.92 }}
        className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#0E7466] text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-[#075E54] cursor-pointer"
        aria-label="Chat with Attri Nexus on WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5 sm:w-7 sm:h-7 fill-white" />
      </motion.a>
    </div>
  );
};

