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
      className="fixed right-0 bottom-32 z-[500]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Glow Background */}
      <div className={`absolute inset-0 bg-gradient-to-l from-indigo-500 to-purple-500 blur-2xl transition-all duration-700 ${
        isHovered ? 'opacity-60 scale-150' : 'opacity-20 scale-100'
      }`} />
      
      <button
        onClick={onClick}
        className={`relative group flex items-center bg-black/40 backdrop-blur-2xl border-l border-t border-b border-indigo-500/30 rounded-l-3xl p-3 transition-all duration-500 hover:shadow-[0_0_40px_rgba(129,140,248,0.3)] shadow-2xl ${
          isHovered ? 'w-20 pr-6' : 'w-14'
        }`}
      >
        <div className="flex flex-col items-center gap-8 py-4">
          {/* Header Icon */}
          <motion.div
            animate={{ 
              rotate: isHovered ? -360 : 0,
              scale: isHovered ? 1.2 : 1,
              filter: isHovered ? "drop-shadow(0 0 8px #818cf8)" : "none"
            }}
            transition={{ duration: 1, ease: "backOut" }}
            className="text-indigo-400"
          >
            <Youtube className="w-6 h-6" />
          </motion.div>
          
          {/* Pulsing Dots / Data Stream */}
          <div className="flex flex-col gap-2 items-center">
            {[...Array(4)].map((_, i) => (
              <motion.div 
                key={i} 
                animate={{
                   opacity: [0.2, 1, 0.2],
                   scale: [1, 1.3, 1],
                   backgroundColor: ["#818cf8", "#c084fc", "#818cf8"]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.5)]" 
              />
            ))}
          </div>

          {/* Expanded HUD Label */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-12 whitespace-nowrap pointer-events-none"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase italic">
                    AI_UNIVERSE
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="w-2.5 h-2.5 text-indigo-400 animate-pulse" />
                    <Sparkles className="w-2.5 h-2.5 text-purple-400 animate-spin-slow" />
                    <span className="text-[7px] font-mono text-white/40 uppercase">Connect_Now</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ChevronLeft className={`w-5 h-5 text-indigo-500 transition-transform duration-500 ${isHovered ? '-translate-x-2 scale-125' : ''}`} />
        </div>

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
