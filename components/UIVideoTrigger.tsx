'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Youtube, Sparkles, Activity, Cpu, Zap, ChevronLeft } from 'lucide-react';

export function UIVideoTrigger({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[500] h-[300px] flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Background */}
      <div className={`absolute inset-0 bg-gradient-to-l from-indigo-500/20 to-transparent blur-xl transition-all duration-700 ${
        isHovered ? 'scale-x-150 opacity-100' : 'scale-x-100 opacity-0'
      }`} />
      
      <button
        onClick={onClick}
        className={`relative h-full flex items-center bg-black/60 backdrop-blur-3xl border-l border-t border-b border-indigo-500/40 rounded-l-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(129,140,248,0.3)] shadow-2xl ${
          isHovered ? 'w-16 pr-2' : 'w-3'
        }`}
      >
        {/* The "Swipe Bar" Visual */}
        <div className="absolute inset-y-4 left-1 w-1 bg-indigo-500/40 rounded-full group-hover:bg-indigo-400 group-hover:shadow-[0_0_10px_#818cf8]" />

        <div className={`flex flex-col items-center gap-8 w-full transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {/* Header Icon */}
          <motion.div
            animate={{ 
              rotate: isHovered ? -360 : 0,
              scale: isHovered ? 1.2 : 1,
            }}
            className="text-indigo-400"
          >
            <Youtube className="w-6 h-6" />
          </motion.div>
          
          {/* Vertical Dots */}
          <div className="flex flex-col gap-3 items-center">
            {[...Array(6)].map((_, i) => (
              <motion.div 
                key={i} 
                animate={isHovered ? {
                   opacity: [0.3, 1, 0.3],
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" 
              />
            ))}
          </div>

          <ChevronLeft className="w-5 h-5 text-indigo-500 -translate-x-1" />
        </div>

        {/* HUD Text for Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-full mr-4 whitespace-nowrap pointer-events-none"
            >
              <div className="flex flex-col items-end">
                <span className="text-[12px] font-black tracking-[0.5em] text-white uppercase italic drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  NEURAL_VOID
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
                  <span className="text-[8px] font-mono text-indigo-400/60 uppercase">Sync_Request_0x82</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Scan Line */}
        <motion.div
          animate={{ bottom: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[2px] bg-indigo-400/40 shadow-[0_0_20px_rgba(129,140,248,0.8)] z-10"
        />
        
        {/* Border Pulse */}
        <div className="absolute inset-0 rounded-l-3xl border border-indigo-400/20 animate-pulse pointer-events-none" />
      </button>
    </motion.div>
  );
}
