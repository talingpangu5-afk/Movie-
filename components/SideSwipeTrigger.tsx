'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Cpu } from 'lucide-react';

interface SideSwipeTriggerProps {
  onClick: () => void;
}

export function SideSwipeTrigger({ onClick }: SideSwipeTriggerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[100]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-cyan-500 blur-xl opacity-20 transition-opacity duration-300 ${isHovered ? 'opacity-40' : 'opacity-20'}`} />
      
      <button
        onClick={onClick}
        className={`relative group flex items-center bg-black/40 backdrop-blur-md border-r border-t border-b border-cyan-500/30 rounded-r-2xl px-2 py-12 transition-all duration-500 ${
          isHovered ? 'w-16 pl-4' : 'w-10'
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: isHovered ? 90 : 0 }}
            className="text-cyan-400"
          >
            <Cpu className="w-5 h-5" />
          </motion.div>
          
          <div className="flex flex-col gap-1 items-center">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1 h-1 rounded-full bg-cyan-500 transition-all duration-300 ${
                  isHovered ? 'opacity-100 scale-125' : 'opacity-40'
                }`} 
                style={{ transitionDelay: `${i * 100}ms` }}
              />
            ))}
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-10 whitespace-nowrap"
              >
                <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase">
                  Launch Interface
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <ChevronRight className={`w-4 h-4 text-cyan-500 transition-transform duration-300 ${isHovered ? 'translate-x-1 scale-125' : ''}`} />
        </div>

        {/* HUD Scanning Line */}
        <motion.div
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
        />
      </button>
    </motion.div>
  );
}
