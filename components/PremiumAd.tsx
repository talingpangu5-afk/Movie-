'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Info, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface PremiumAdProps {
  className?: string;
  compact?: boolean;
}

export function PremiumAd({ className = '', compact = false }: PremiumAdProps) {
  const containerId = "container-97229860b04e823be4afd7fd18f7c502";
  const adInjected = useRef(false);

  useEffect(() => {
    if (adInjected.current) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = "https://pl29130365.profitablecpmratenetwork.com/97229860b04e823be4afd7fd18f7c502/invoke.js";
    
    document.head.appendChild(script);
    adInjected.current = true;
  }, []);

  if (compact) {
    return (
      <div className={`relative w-full overflow-hidden rounded-xl bg-black/40 border border-white/10 ${className}`}>
        <div id={containerId} className="w-full flex justify-center py-2" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative w-full max-w-5xl mx-auto overflow-hidden rounded-3xl group ${className}`}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 z-0" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full animate-pulse" />

      {/* Main Content Container */}
      <div className="relative z-10 border border-white/10 backdrop-blur-md bg-black/40 p-4 md:p-8 flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Header with status badges */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-primary animate-pulse">Exclusive Ad</p>
              <h4 className="text-sm font-bold text-white/90">Premium Sponsored Content</h4>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-[10px] font-bold text-white/40 uppercase">Verified Safe</span>
            </div>
            <button className="text-white/40 hover:text-white transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Actual Ad Content Area */}
        <div className="flex flex-col items-center justify-center min-h-[120px] md:min-h-[250px] bg-black/40 rounded-2xl border border-dashed border-white/10 group-hover:border-primary/30 transition-colors duration-500 overflow-hidden">
          {/* External Script Container */}
          <div id={containerId} className="w-full h-full flex justify-center items-center scale-90 md:scale-100 origin-center" />
          
          {/* Interactive Glow */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Footer info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-[11px] text-white/30 text-center md:text-left leading-relaxed max-w-md">
            Help us keep bringing you amazing movies for free by supporting our partners. All featured content is verified by our editorial team.
          </p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 group/btn px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[12px] font-bold text-white/80">
              LEARN MORE
              <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Border Glow */}
      <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" />
    </motion.div>
  );
}
