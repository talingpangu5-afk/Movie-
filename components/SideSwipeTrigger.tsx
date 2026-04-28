'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Cpu, Activity, Zap } from 'lucide-react';

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
      <div className={`absolute inset-0 bg-cyan-500 blur-xl transition-all duration-500 ${isHovered ? 'opacity-40 scale-150' : 'opacity-20'}`} />
      
      <button
        onClick={onClick}
        className={`relative group flex items-center bg-black/40 backdrop-blur-md border-r border-t border-b border-cyan-500/30 rounded-r-2xl px-2 py-10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] ${
          isHovered ? 'w-16 pl-4' : 'w-10'
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ 
              rotate: isHovered ? 90 : 0,
              scale: isHovered ? 1.2 : 1
            }}
            className="text-cyan-400"
          >
            <Cpu className="w-5 h-5" />
          </motion.div>
          
          <div className="flex flex-col gap-1.5 items-center">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i} 
                animate={isHovered ? {
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.5, 1]
                } : {}}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className={`w-1.5 h-1.5 rounded-full bg-cyan-500 transition-all duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-40'
                }`} 
              />
            ))}
          </div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-10 whitespace-nowrap overflow-hidden pointer-events-none"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase">
                    SYSTEM_LINK
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="w-2 h-2 text-cyan-300 animate-pulse" />
                    <Zap className="w-2 h-2 text-yellow-400 animate-bounce" />
                    <span className="text-[6px] font-mono text-cyan-500/60">READY_FOR_COMM</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ChevronRight className={`w-4 h-4 text-cyan-500 transition-transform duration-300 ${isHovered ? 'translate-x-1 scale-125' : ''}`} />
        </div>

        {/* HUD Scanning Line */}
        <motion.div
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[2px] bg-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-10"
        />
      </button>
    </motion.div>
  );
}
