import React, { useState, useEffect } from 'react';
import { BUSINESS_CONFIG } from '@/constants/business';

interface PreloaderProps {
  onFinish?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // Quick & snappy progress increments (~400ms total)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const jump = Math.floor(Math.random() * 20) + 15;
        return Math.min(prev + jump, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setIsFadingOut(true);
        const removeTimeout = setTimeout(() => {
          setIsRemoved(true);
          if (onFinish) onFinish();
        }, 400);
        return () => clearTimeout(removeTimeout);
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [progress, onFinish]);

  if (isRemoved) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0C1015] text-white transition-all duration-400 select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 45%, #16202B 0%, #0C1015 80%)'
      }}
    >
      {/* Background Golden Atmospheric Lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-md w-full">
        
        {/* Animated Brand Emblem Frame */}
        <div className="relative mb-5">
          {/* Pulsing Outer Glow Ring */}
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-[#DFD1BA] via-[#C5A059] to-[#997530] opacity-40 blur-md animate-pulse" />
          
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#121820] border-2 border-[#C5A059] p-1.5 shadow-2xl flex items-center justify-center overflow-hidden">
            <img
              src={BUSINESS_CONFIG.logo}
              alt="Attri Nexus Logo"
              className="w-full h-full object-contain filter drop-shadow-md transform transition-transform duration-500 scale-105"
            />
          </div>
        </div>

        {/* Brand Name with Luxury Typography */}
        <h1 className="font-display text-xl sm:text-2xl font-bold tracking-[0.25em] text-white mb-1.5">
          ATTRI NEXUS
        </h1>

        {/* Tagline */}
        <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.35em] text-[#C5A059] font-medium mb-6">
          {BUSINESS_CONFIG.tagline}
        </p>

        {/* Progress Bar Container */}
        <div className="w-40 sm:w-48 h-1 bg-white/10 rounded-full overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#DFD1BA] via-[#C5A059] to-[#997530] transition-all duration-100 ease-out rounded-full shadow-[0_0_12px_#C5A059]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Grain Heritage Subtext */}
        <div className="mt-3.5 flex items-center space-x-2 text-[9px] sm:text-[10px] text-gray-400 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
          <span>Curating Authentic Indian Grains</span>
        </div>

      </div>
    </div>
  );
};
