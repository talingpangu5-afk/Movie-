'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Cpu, Activity, Radio, ShieldCheck, Zap, ChevronUp, Sparkles } from 'lucide-react';

export function JarvisFooter() {
  const [isSwiped, setIsSwiped] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  
  // Stabilize values for particles using deterministic logic
  const particles = React.useMemo(() => [...Array(15)].map((_, i) => ({
    id: i,
    delay: (i * 0.7) % 5,
    duration: 3 + (i * 0.5) % 4,
    y: -100 - (i * 15) % 200,
    x: (i * 3) % 20 - 10,
    marginLeft: (i - 7) * 40
  })), []);

  const sentimentLevel = 94; // Fixed deterministic value

  // Swipe logic
  const handleTouchStart = (e: React.TouchEvent) => setStartY(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    const currentY = e.touches[0].clientY;
    const diffY = startY - currentY;
    if (diffY > 50) setIsSwiped(true);
    if (diffY < -50) setIsSwiped(false);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[1000] flex flex-col items-center pointer-events-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* GLOWING AMBIENCE (Cinematic lighting) */}
      <div className="absolute bottom-0 w-full h-[300px] bg-[radial-gradient(circle_at_50%_100%,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none" />
      
      {/* FLOATING PARTICLES */}
      <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: p.y,
              x: p.x
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity, 
              delay: p.delay 
            }}
            className="absolute left-1/2 w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
            style={{ marginLeft: `${p.marginLeft}px` }}
          />
        ))}
      </div>

      {/* SWIPE BAR CONTAINER */}
      <motion.div
        layout
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: isSwiped ? -20 : 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative w-[320px] sm:w-[450px] lg:w-[600px] pointer-events-auto"
      >
        {/* THE GLASS BAR */}
        <div className={`relative h-16 sm:h-20 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden flex items-center justify-center group cursor-pointer transition-all duration-500 ${isSwiped ? 'shadow-[0_0_50px_rgba(6,182,212,0.3)]' : 'shadow-2xl hover:border-cyan-500/30'}`}
             onClick={() => setIsSwiped(!isSwiped)}
        >
          {/* ANIMATED LIGHT STREAKS */}
          <motion.div 
            animate={{ x: ['100%', '-100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent skew-x-[-20deg]"
          />
          
          {/* NEON EDGES */}
          <div className="absolute inset-px rounded-[2rem] border border-cyan-500/20 pointer-events-none" />
          <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 shadow-[0_0_15px_#06b6d4]" />

          {/* CENTER INTERFACE */}
          <div className="flex items-center gap-4 lg:gap-8 z-10 px-6 w-full justify-between">
            {/* Status Left */}
            <div className="hidden lg:flex flex-col items-start gap-1">
              <span className="text-[8px] font-black tracking-widest text-white/40 uppercase">V-STRL_001</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400/60 uppercase">ACTIVE_SECURE</span>
              </div>
            </div>

            {/* MAIN AI CORE HUB */}
            <div className="flex items-center gap-4">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed" />
                <div className="absolute inset-2 rounded-full border border-blue-500/50 animate-pulse" />
                <Cpu className="w-5 h-5 text-cyan-400" />
              </motion.div>

              <div className="flex flex-col items-center sm:items-start">
                <h3 className="text-sm sm:text-base font-black tracking-[0.2em] uppercase italic text-white group-hover:text-cyan-400 transition-colors">
                  JARVIS <span className="text-cyan-500">SYSTEM</span>
                </h3>
                <div className="flex items-center gap-2 text-[8px] font-mono text-white/30 uppercase">
                  <Activity className="w-3 h-3 text-cyan-500 animate-pulse" />
                  Neural_Link: ONLINE_0x92
                </div>
              </div>
            </div>

            {/* Status Right */}
            <div className="hidden lg:flex flex-col items-end gap-1">
              <span className="text-[8px] font-black tracking-widest text-white/40 uppercase">LOC_DATA_02</span>
              <div className="flex items-center gap-2">
                <Radio className="w-3 h-3 text-cyan-400/60" />
                <span className="text-[10px] font-mono text-cyan-400/60 uppercase">NODE_UP_99%</span>
              </div>
            </div>
          </div>

          {/* Swipe Indicator Button */}
          <div className="absolute top-0 right-4 h-full flex items-center">
            <motion.div 
              animate={{ y: isSwiped ? [2, -2, 2] : [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="p-1 bg-white/5 border border-white/10 rounded-full"
            >
              <ChevronUp className={`w-3 h-3 text-white/40 transition-transform ${isSwiped ? 'rotate-180' : ''}`} />
            </motion.div>
          </div>
        </div>

        {/* EXPANDED HOLOGRAPHIC OVERLAY */}
        <AnimatePresence>
          {isSwiped && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: 'auto', y: -40 }}
              exit={{ opacity: 0, height: 0, y: 20 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 w-[340px] sm:w-[500px] lg:w-[800px] mb-8 lg:mb-12"
            >
              <div className="relative flex flex-col items-center">
                
                {/* JARVIS HUMANOID (Sophisticated SVG Representation) */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0, rotateY: 30 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="relative w-48 h-64 lg:w-72 lg:h-96 mb-12 z-20 perspective-1000"
                >
                  {/* Holographic Figure Composition */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-[0_0_40px_rgba(6,182,212,0.6)]">
                      <defs>
                        <linearGradient id="cyber-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="armor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1e293b" />
                          <stop offset="50%" stopColor="#334155" />
                          <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Body Structure */}
                      <g className="metallic-armor" fill="url(#armor-grad)">
                        {/* Torso */}
                        <path d="M35,40 L65,40 L70,85 L30,85 Z" rx="2" />
                        {/* Shoulders */}
                        <circle cx="30" cy="45" r="6" />
                        <circle cx="70" cy="45" r="6" />
                        {/* Head */}
                        <path d="M42,15 Q50,5 58,15 L58,35 Q50,42 42,35 Z" />
                      </g>

                      {/* Illuminated Circuit Lines (Energy Paths) */}
                      <g stroke="#06b6d4" strokeWidth="0.8" fill="none" opacity="0.8" filter="url(#glow)">
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                          d="M50,85 L50,40 M30,45 L40,55 M70,45 L60,55 M50,15 L50,5" 
                        />
                        <path d="M42,25 L58,25 M45,70 L55,70" strokeOpacity="0.4" />
                      </g>

                      {/* Energy Core (Chest) */}
                      <circle cx="50" cy="62" r="6" fill="#06b6d4" filter="url(#glow)">
                        <animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                      </circle>
                      
                      {/* Breathing Light (Aura) */}
                      <circle cx="50" cy="62" r="15" fill="url(#cyber-gradient)" opacity="0.2">
                        <animate attributeName="r" values="10;18;10" dur="4s" repeatCount="indefinite" />
                      </circle>

                      {/* Internal Core Detail */}
                      <circle cx="50" cy="62" r="2" fill="white" filter="url(#glow)" />

                      {/* Eyes/Visor */}
                      <line x1="46" y1="22" x2="54" y2="22" stroke="#06b6d4" strokeWidth="1.5" filter="url(#glow)">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
                      </line>
                    </svg>
                  </div>
                  
                  {/* Atmospheric Glow/Reflections */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl opacity-30" />
                  
                  {/* Holographic Scanline Overlay */}
                  <div className="absolute inset-0 bg-scanlines opacity-[0.05] pointer-events-none" />
                </motion.div>

                {/* HOLOGRAPHIC FLOATING PANELS */}
                <div className="absolute inset-0 pointer-events-none">
                  {[
                    { text: 'System Status: 100% Operational', icon: ShieldCheck, pos: 'top-0 left-0', delay: 0.1 },
                    { text: 'Voice Interface Active', icon: Bot, pos: 'top-20 -left-12 sm:-left-24', delay: 0.3 },
                    { text: 'Network Connected', icon: Zap, pos: 'top-0 right-0', delay: 0.2 },
                    { text: 'Data Analysis Running', icon: Radio, pos: 'top-20 -right-12 sm:-right-24', delay: 0.4 }
                  ].map((panel, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: panel.delay }}
                      className={`absolute ${panel.pos} bg-black/80 backdrop-blur-2xl border border-cyan-500/30 p-3 rounded-xl hidden sm:flex items-center gap-3 shadow-[0_0_20px_rgba(6,182,212,0.1)]`}
                    >
                      <panel.icon className="w-4 h-4 text-cyan-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{panel.text}</span>
                      <div className="absolute -inset-1 border border-cyan-500/10 rounded-xl" />
                    </motion.div>
                  ))}
                </div>

                {/* BOT CONSOLE (Mini display) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full bg-cyan-500/5 backdrop-blur-3xl border border-cyan-500/20 p-6 rounded-3xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b border-cyan-500/10 pb-4">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                      <h4 className="text-[10px] font-black tracking-widest text-cyan-400 uppercase italic">NEURAL_DECRYPT_STREAM</h4>
                    </div>
                    <p className="text-[11px] font-mono text-cyan-400/60 leading-relaxed uppercase">
                      [INFO] Analyzing planetary movie nodes... <br />
                      [DATA] Sentiment level optimized at {sentimentLevel}% <br />
                      [CMD] Suggesting immersive entertainment layer...
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
