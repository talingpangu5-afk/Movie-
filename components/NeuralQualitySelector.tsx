'use client';

import React, { useState } from 'react';
import { Settings, Check, Zap, Wifi, SignalHigh, SignalMedium, SignalLow } from 'lucide-react';
import { useNeuralQuality, QualityLevel } from '@/hooks/useNeuralQuality';
import { motion, AnimatePresence } from 'motion/react';

export function NeuralQualitySelector() {
  const { level, currentLevel, detectedLevel, config, updateLevel, isAuto } = useNeuralQuality();
  const [isOpen, setIsOpen] = useState(false);

  const options: { level: QualityLevel; label: string; icon: React.ReactNode }[] = [
    { level: 'auto', label: 'Auto (Neural)', icon: <Zap className="w-4 h-4" /> },
    { level: 'ultra', label: '8K Ultra', icon: <SignalHigh className="w-4 h-4" /> },
    { level: 'high', label: '1080p', icon: <SignalHigh className="w-4 h-4" /> },
    { level: 'standard', label: '720p', icon: <SignalMedium className="w-4 h-4" /> },
    { level: 'low', label: '480p', icon: <SignalLow className="w-4 h-4" /> },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-black/40 backdrop-blur-md text-[10px] font-bold text-primary uppercase tracking-widest transition-all hover:bg-primary/10 hover:border-primary/40 group"
      >
        <Settings className="w-3 h-3 animate-spin-slow group-hover:rotate-90 transition-transform duration-500" />
        <span className="hidden md:inline">{isAuto ? `Neural: ${config.label}` : config.label}</span>
        <span className="md:hidden">{config.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onMouseEnter={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              onMouseLeave={() => setIsOpen(false)}
              className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-primary/20 bg-black/95 backdrop-blur-xl p-2 z-50 shadow-2xl shadow-primary/20"
            >
              <div className="px-2 py-1.5 text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/5 mb-1 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span>Stream Quality</span>
                  <Wifi className="w-3 h-3" />
                </div>
                {isAuto && (
                  <span className="text-primary flex items-center gap-1 normal-case tracking-normal">
                    Detected: {detectedLevel.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {options.map((opt) => (
                  <button
                    key={opt.level}
                    onClick={() => {
                      updateLevel(opt.level);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                      level === opt.level
                        ? 'bg-primary/20 text-primary font-bold shadow-[0_0_15px_rgba(var(--primary),0.2)]'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {opt.icon}
                      <span>{opt.label}</span>
                    </div>
                    {level === opt.level && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
