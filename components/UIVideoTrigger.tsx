'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Youtube, Sparkles, Activity, Cpu, Zap, ChevronLeft } from 'lucide-react';

export function UIVideoTrigger({ onClick }: { onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    // Swipe left (open)
    if (diffX > 30) {
      onClick();
    }
    touchStartX.current = null;
  };

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed right-0 bottom-12 z-[1005]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-t from-cyan-500 to-blue-600 blur-xl transition-all duration-700 ${
        isHovered ? 'opacity-80 scale-150' : 'opacity-20 scale-100'
      }`} />
      
      <button
        onClick={onClick}
        className={`relative group flex items-center bg-black/60 backdrop-blur-3xl border-l border-y border-cyan-500/30 rounded-l-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] ${
          isHovered ? 'w-10 h-40' : 'w-6 h-32'
        }`}
      >
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
             <Zap className={`w-4 h-4 text-cyan-400 ${isHovered ? 'scale-125' : ''} transition-transform`} />
          </motion.div>
          
          <div className="flex flex-col gap-1.5 items-center">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1 rounded-full bg-cyan-500/40 transition-all ${
                  isHovered ? 'h-4 bg-cyan-400' : 'h-2'
                }`}
              />
            ))}
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-12 whitespace-nowrap"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase italic">
                    AI_WORLD
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="w-3 h-3 text-white/40 animate-pulse" />
                    <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest">Swipe_to_Enter</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ChevronLeft className={`w-4 h-4 text-cyan-500/60 transition-transform duration-500 ${isHovered ? '-translate-x-1 scale-125' : ''}`} />
        </div>

        {/* Vertical Pulse Line */}
        <motion.div
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-y-4 left-1 w-[1px] bg-cyan-400/30"
        />
      </button>
    </motion.div>
  );
}
