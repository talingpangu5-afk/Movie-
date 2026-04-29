'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Film, 
  Music, 
  PlayCircle, 
  Flame, 
  Laugh, 
  Tv, 
  MonitorPlay, 
  TrendingUp, 
  Star, 
  X,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Movies', icon: Film, href: '/movies' },
  { name: 'Albums', icon: Music, href: '/albums' },
  { name: 'Trailers', icon: PlayCircle, href: '/trailers' },
  { name: 'Action', icon: Flame, href: '/action' },
  { name: 'Comedy', icon: Laugh, href: '/comedy' },
  { name: 'Serials', icon: Tv, href: '/serials' },
  { name: 'Web Series', icon: MonitorPlay, href: '/web-series' },
  { name: 'Trending', icon: TrendingUp, href: '/trending' },
  { name: 'Popular', icon: Star, href: '/popular' },
];

export function TouchSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (isOpen) {
        inactivityTimer = setTimeout(() => {
          setIsOpen(false);
        }, 8000); // Auto-hide after 8s of inactivity
      }
    };

    if (isOpen) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('scroll', resetTimer);
      window.addEventListener('touchstart', resetTimer);
      resetTimer();
    }

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      clearTimeout(inactivityTimer);
    };
  }, [isOpen]);

  const toggleSidebar = () => {
    if (!isOpen && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10); // Haptic feedback
    }
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => setIsOpen(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchStartX.current - touchEndX;

      // Swipe right to left (open) - if starting near right edge
      if (diffX > 50 && touchStartX.current > window.innerWidth - 50) {
        setIsOpen(true);
      }
      
      // Swipe left to right (close) - if sidebar is open
      if (diffX < -50 && isOpen) {
        setIsOpen(false);
      }

      touchStartX.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen]);

  return (
    <>
      {/* Sidebar Trigger Indicator */}
      <div 
        className="fixed top-1/3 -translate-y-1/2 right-0 z-[999] cursor-pointer group flex items-center"
        onClick={toggleSidebar}
      >
        {/* The Visible Tab */}
        <div className="bg-primary/20 backdrop-blur-md border-l border-y border-primary/30 h-24 w-6 rounded-l-2xl flex flex-col items-center justify-center gap-2 group-hover:w-8 transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.2)] animate-pulse-border">
          <ChevronRight className="w-4 h-4 text-primary rotate-180 group-hover:scale-125 transition-transform" />
          <span className="text-[8px] font-black uppercase vertical-text tracking-widest text-primary/80 group-hover:text-primary">HUB</span>
        </div>
        
        {/* Invisible Extended Trigger Area for easier swiping */}
        <div className="absolute right-0 w-12 h-[300px] -z-10" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]"
              onClick={closeSidebar}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] md:w-[350px] bg-[#0c0c0c] border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-[1001] flex flex-col pt-10 px-6 pb-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Film className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Premium</h2>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">Services Hub</p>
                  </div>
                </div>
                <button 
                  onClick={closeSidebar}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/50 hover:text-white" />
                </button>
              </div>

              {/* Navigation List */}
              <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-2">
                <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.3em] mb-4 ml-2">Categories</p>
                {categories.map((cat, idx) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={cat.href}
                      onClick={closeSidebar}
                      className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/0 hover:border-primary/20 hover:bg-white/10 transition-all duration-300 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <cat.icon className="w-5 h-5 text-white/60 group-hover:text-primary transition-colors" />
                        <span className="font-bold uppercase tracking-widest text-sm group-hover:text-white transition-colors">
                          {cat.name}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 italic">Personalized</p>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Access your curated library and digital assets in one secure vault.
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-4 opacity-30">
                  <div className="w-8 h-[1px] bg-white" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Taling Pangu</span>
                  <div className="w-8 h-[1px] bg-white" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
