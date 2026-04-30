'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { ChevronRight, Cpu } from 'lucide-react';

interface FooterSwipeBarProps {
  onTrigger: () => void;
}

export function FooterSwipeBar({ onTrigger }: FooterSwipeBarProps) {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [0, 200],
    ["rgba(255, 255, 255, 0.05)", "rgba(0, 255, 255, 0.2)"]
  );
  
  const opacity = useTransform(x, [0, 150], [0.4, 0]);
  const scale = useTransform(x, [0, 200], [1, 1.1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 150) {
      onTrigger();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black font-mono animate-pulse">
        Swipe to Initialize AI
      </p>
      
      <div className="relative w-[280px] h-16 bg-white/5 border border-white/10 rounded-full p-2 flex items-center overflow-hidden">
        {/* Track Label */}
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest pl-8">
            Access Jarvis Core
          </span>
        </motion.div>

        {/* Swipe Active Background */}
        <motion.div 
          style={{ width: x, background }}
          className="absolute left-0 h-full rounded-l-full pointer-events-none"
        />

        {/* The Draggable Knob */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 210 }}
          dragElastic={0.1}
          style={{ x }}
          onDragEnd={handleDragEnd}
          className="z-10 group cursor-grab active:cursor-grabbing"
        >
          <motion.div 
            style={{ scale }}
            className="w-12 h-12 bg-primary flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,255,255,0.4)] group-hover:scale-105 transition-transform"
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </motion.div>
        </motion.div>

        {/* End Target Indicator */}
        <div className="absolute right-3 w-10 h-10 border border-white/10 rounded-full flex items-center justify-center">
           <Cpu className="w-4 h-4 text-white/10" />
        </div>
      </div>
    </div>
  );
}
