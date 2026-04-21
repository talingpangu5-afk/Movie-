'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye } from 'lucide-react';
import { AdultVerificationModal } from './AdultVerificationModal';

export function AdultTrigger() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay reveal for smooth entrance
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.8 }}
            className="fixed bottom-6 left-6 z-[60]"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="group relative flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl hover:bg-black/60 hover:border-primary/50 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
              <div className="absolute -left-1/2 -top-1/2 w-full h-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lock className="w-4 h-4 text-primary group-hover:hidden" />
                <Eye className="w-4 h-4 text-primary hidden group-hover:block animate-pulse" />
              </div>

              <div className="relative text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary leading-none mb-1">Restricted</p>
                <p className="text-xl font-black italic uppercase italic tracking-tighter text-white leading-none">+18</p>
              </div>

              {/* Secure Indicator */}
              <div className="relative ml-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#e50914]" />
            </motion.button>

            {/* Sub-label */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              className="absolute -top-6 left-0 w-full text-center"
            >
              <span className="text-[8px] font-mono tracking-widest text-white uppercase">Vault // Encrypted</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdultVerificationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
