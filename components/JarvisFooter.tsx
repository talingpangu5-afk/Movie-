'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Cpu, Activity, Radio, ShieldCheck, Zap, ChevronUp, Sparkles, Mic, Terminal, Info, Layout, Globe, Lock } from 'lucide-react';

// --- SUB-COMPONENTS ---

function VoiceWaveform() {
  return (
    <div className="flex items-center gap-1.5 h-10 px-5 bg-cyan-500/5 rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
      <Mic className="w-3.5 h-3.5 text-cyan-400 mr-2" />
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ height: [4, (i % 3 === 0 ? 20 : 12), 4] }}
          transition={{ duration: 0.4 + (i % 5) * 0.1, repeat: Infinity, delay: i * 0.04 }}
          className="w-1 bg-cyan-400/50 rounded-full"
        />
      ))}
      <span className="text-[8px] font-black font-mono text-cyan-400/40 ml-3 uppercase tracking-[0.2em]">Live_Input</span>
    </div>
  );
}

function HolographicPanel({ title, items, side = 'left', delay = 0 }: { title: string; items: string[]; side?: 'left' | 'right'; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50, rotateY: side === 'left' ? 20 : -20 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`relative w-64 p-6 bg-black/40 backdrop-blur-3xl border border-cyan-500/20 rounded-2xl shadow-2xl ${side === 'right' ? 'text-right' : ''}`}
    >
      {/* Decorative Corners */}
      <div className={`absolute top-0 ${side === 'left' ? 'left-0' : 'right-0'} w-4 h-4 border-t-2 border-${side === 'left' ? 'l' : 'r'}-2 border-cyan-500/40`} />
      <div className={`absolute bottom-0 ${side === 'left' ? 'right-0' : 'left-0'} w-4 h-4 border-b-2 border-${side === 'left' ? 'r' : 'l'}-2 border-cyan-500/20`} />
      
      <div className={`flex items-center gap-2 mb-4 border-b border-cyan-500/10 pb-3 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
        <div className="p-1.5 bg-cyan-500/10 rounded-lg">
          {side === 'left' ? <Terminal className="w-3.5 h-3.5 text-cyan-400" /> : <Layout className="w-3.5 h-3.5 text-blue-400" />}
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/80">{title}</h4>
      </div>
      
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className={`flex items-center gap-3 text-[9px] font-mono leading-relaxed group ${side === 'right' ? 'flex-row-reverse' : ''}`}>
             <div className="w-1 h-1 rounded-full bg-cyan-400 group-hover:shadow-[0_0_8px_#06b6d4] transition-shadow" />
             <span className="text-white/60 group-hover:text-cyan-400 transition-colors">{item}</span>
          </li>
        ))}
      </ul>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none" />
    </motion.div>
  );
}

// --- MAIN COMPONENT ---

export function JarvisFooter() {
  const [isSwiped, setIsSwiped] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  
  const particles = useMemo(() => [...Array(25)].map((_, i) => ({
    id: i,
    delay: (i * 0.6) % 4,
    duration: 2 + (i * 0.4) % 3,
    y: -150 - (i * 12) % 250,
    x: (i * 4) % 60 - 30,
    marginLeft: (i - 12) * 25
  })), []);

  const handleTouchStart = (e: React.TouchEvent) => setStartY(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    const currentY = e.touches[0].clientY;
    const diffY = startY - currentY;
    if (diffY > 40) setIsSwiped(true);
    if (diffY < -40) setIsSwiped(false);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[1000] flex flex-col items-center pointer-events-none pb-8"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Cinematic Lighting & Atmosphere */}
      <div className="absolute bottom-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_100%,rgba(6,182,212,0.2)_0%,transparent_75%)] pointer-events-none" />

      {/* Floating Volumetric Particles */}
      <div className="absolute inset-x-0 bottom-0 h-[600px] pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 150 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: p.y - 120,
              x: p.x
            }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            className="absolute left-1/2 w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
            style={{ marginLeft: `${p.marginLeft}px` }}
          />
        ))}
      </div>

      {/* FOOTER SWIPE BAR - Futuristic Glassmorphism */}
      <motion.div
        layout
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: isSwiped ? -20 : 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 100 }}
        className="relative w-[340px] sm:w-[500px] lg:w-[750px] pointer-events-auto"
      >
        {/* Soft Reflection on Floor */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-cyan-500/10 blur-[30px] rounded-full pointer-events-none" />

        <div 
          className={`relative h-16 sm:h-20 bg-black/40 backdrop-blur-[30px] border border-cyan-500/30 rounded-full overflow-hidden flex items-center justify-between px-10 sm:px-14 group cursor-pointer transition-all duration-700 shadow-2xl ${isSwiped ? 'shadow-[0_0_120px_rgba(6,182,212,0.25)] border-cyan-500/50 scale-[1.03]' : 'hover:border-cyan-400/40'}`}
          onClick={() => setIsSwiped(!isSwiped)}
        >
          {/* Neon Bloom Glow */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]" />
          <div className="absolute inset-x-16 bottom-0 h-px bg-cyan-400 shadow-[0_0_15px_#06b6d4] opacity-40" />

          {/* Animated Internal Streaks */}
          <motion.div 
            animate={{ x: ['200%', '-200%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 bottom-0 w-64 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent skew-x-[-35deg]"
          />

          {/* Left Arrow Indicators */}
          <div className="flex items-center gap-1.5 text-cyan-500/20 group-hover:text-cyan-400/40 transition-colors">
            {[...Array(3)].map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}>
                <ChevronUp className="w-5 h-5 -rotate-90" />
              </motion.div>
            ))}
          </div>

          {/* Main Label */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-black tracking-[0.5em] uppercase text-white/90 italic drop-shadow-md group-hover:text-cyan-400 transition-colors duration-500">
              {isSwiped ? 'SYSTEM_COMMANDS' : 'SWIPE UP TO INTERACT'}
            </span>
            <div className={`w-8 h-0.5 bg-cyan-500/30 rounded-full group-hover:bg-cyan-500/60 transition-colors ${isSwiped ? 'hidden' : ''}`} />
          </div>

          {/* Right Arrow Indicators */}
          <div className="flex items-center gap-1.5 text-cyan-500/20 group-hover:text-cyan-400/40 transition-colors">
            {[...Array(3)].map((_, i) => (
              <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: (2 - i) * 0.2 }}>
                <ChevronUp className="w-5 h-5 rotate-90" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* EXPANDED INTERFACE - Ultra Realistic AI Scene */}
        <AnimatePresence>
          {isSwiped && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 80 }}
              animate={{ opacity: 1, scale: 1, y: -40 }}
              exit={{ opacity: 0, scale: 0.9, y: 80 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 w-full max-w-[1400px] mb-24 flex flex-col items-center"
            >
              {/* SPEECH BUBBLE */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-14 px-10 py-5 bg-black/80 backdrop-blur-3xl border border-cyan-500/40 rounded-3xl relative shadow-[0_0_50px_rgba(6,182,212,0.15)]"
              >
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-cyan-500/40" />
                <p className="text-white text-base font-black uppercase tracking-widest italic flex items-center gap-4">
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </motion.div>
                  &quot;Hello, Sir. How can I assist you today?&quot;
                </p>
              </motion.div>

              <div className="relative w-full h-[650px] flex items-center justify-center">
                {/* HOLOGRAPHIC SOURCE PLATFORM (Circular with energy beams) */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none">
                  {/* Rotating Rings */}
                  <div className="absolute inset-0 rounded-full border border-cyan-500/20 border-dashed animate-spin-slow" />
                  <div className="absolute inset-8 rounded-full border-2 border-cyan-400/10 animate-spin-reverse" />
                  <div className="absolute inset-16 rounded-full border border-blue-500/30 border-t-transparent shadow-[0_0_40px_rgba(6,182,212,0.2)]" />
                  
                  {/* Energy Beams & Volumetric Fog */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full w-2 h-[400px] bg-gradient-to-t from-cyan-400/40 via-cyan-400/10 to-transparent blur-[2px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[280px] w-80 h-[300px] bg-cyan-500/5 blur-[60px] rounded-full scale-y-150 opacity-40 mix-blend-screen" />
                  
                  {/* Pulse Effect */}
                  <motion.div 
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-cyan-500/20 blur-[50px]"
                  />
                </div>

                {/* JARVIS HUMANOID AI ROBOT (Realistic metallic figure) */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="relative w-80 h-[550px] z-20"
                >
                  <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-[0_0_40px_rgba(6,182,212,0.7)]">
                    <defs>
                      <linearGradient id="body-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0a0f14" />
                        <stop offset="50%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#020617" />
                      </linearGradient>
                      <filter id="h-glow-strong" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <radialGradient id="reactor-grad">
                         <stop offset="0%" stopColor="#fff" />
                         <stop offset="40%" stopColor="#22d3ee" />
                         <stop offset="100%" stopColor="#0891b2" />
                      </radialGradient>
                    </defs>

                    {/* MECHANICAL SKELETON (Subtle background details) */}
                    <g opacity="0.15" stroke="#06b6d4" strokeWidth="0.1">
                       <path d="M50,20 L50,135 M30,50 L70,50 M35,90 L65,90" />
                       <circle cx="50" cy="20" r="10" fill="none" />
                    </g>
                    
                    {/* ARMOR PLATING (Metallic, Sleek Black) */}
                    <g fill="url(#body-chrome)" stroke="#22d3ee" strokeWidth="0.3" strokeOpacity="0.3">
                      {/* Torso & Abdomen */}
                      <path d="M35,38 Q50,32 65,38 L70,80 Q50,85 30,80 Z" />
                      <path d="M40,25 Q50,18 60,25 L63,42 Q50,48 37,42 Z" />
                      {/* Pelvis/Leg Base */}
                      <path d="M32,85 Q50,82 68,85 L72,120 Q50,128 28,120 Z" />
                      {/* Shoulders (Articulated) */}
                      <path d="M22,45 Q28,35 34,45 Z" />
                      <path d="M66,45 Q72,35 78,45 Z" />
                      <circle cx="28" cy="50" r="7" />
                      <circle cx="72" cy="50" r="7" />
                      {/* Face / Helmet (Minimalist smooth) */}
                      <path d="M43,8 Q50,2 57,8 L60,30 Q50,36 40,30 Z" />
                    </g>

                    {/* LUMINOUS CIRCUIT LINES */}
                    <g stroke="#06b6d4" strokeWidth="0.7" opacity="0.9" filter="url(#h-glow-strong)">
                       <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                          d="M50,80 L50,45 M35,45 L45,60 M65,45 L55,60 M40,20 L60,20 M50,10 L50,5"
                       />
                    </g>

                    {/* CIRCULAR ARC REACTOR CORE (The Heart) */}
                    <g cursor="pointer">
                      <circle cx="50" cy="65" r="12" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.2" />
                      {/* Outer Ring */}
                      <circle cx="50" cy="65" r="9" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.6">
                         <animate attributeName="stroke-dasharray" values="1,15;15,1;1,15" dur="3s" repeatCount="indefinite" />
                      </circle>
                      {/* Glowing Core */}
                      <circle cx="50" cy="65" r="6" fill="url(#reactor-grad)" filter="url(#h-glow-strong)">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </g>

                    {/* MINIMAL GLOWING EYES (Intelligence) */}
                    <g filter="url(#h-glow-strong)">
                       <line x1="46" y1="18" x2="54" y2="18" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                       <line x1="46" y1="18" x2="54" y2="18" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" opacity="0.6">
                         <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
                       </line>
                    </g>
                  </svg>

                  {/* Holographic Grain/Texture Overlay */}
                  <div className="absolute inset-0 bg-scanlines mix-blend-overlay opacity-10 pointer-events-none" />
                </motion.div>

                {/* HOLOGRAPHIC FLOATING PANELS */}
                <div className="absolute inset-0 flex items-center justify-between w-full max-w-[1200px] pointer-events-none px-12 lg:px-4">
                   <div className="space-y-12">
                      <HolographicPanel 
                        title="JARVIS - AI SYSTEM" 
                        items={['SYSTEM_ONLINE', 'CORE_STABLE', 'UPLINK_v9.2', 'ENCRYPTED_LINK']} 
                        delay={0.2}
                      />
                      <HolographicPanel 
                        title="NETWORK_ACCESS" 
                        items={['FIREWALL_OPTIMAL', 'PROTOCOLS_READY', 'BYPASS_v4_ACTIVE']} 
                        delay={0.5}
                      />
                   </div>

                   <div className="space-y-12">
                      <HolographicPanel 
                        title="SYSTEM_COMMANDS" 
                        items={['VOICE_CONTROL: ON', 'NETWORK: SECURE', 'SYNC_LATENCY: 2ms']} 
                        side="right" 
                        delay={0.3}
                      />
                      <HolographicPanel 
                        title="DATA_ANALYSIS" 
                        items={['NODES_SCANNED: 42K', 'THREAT_LEVEL: ZERO', 'CAPACITY: 100%']} 
                        side="right" 
                        delay={0.6}
                      />
                   </div>
                </div>

                {/* BOTTOM LOGS / SUMMARY */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-10 w-full max-w-4xl flex justify-between px-16 pointer-events-none z-30"
                >
                   <div className="flex items-center gap-4 bg-black/40 backdrop-blur-2xl border border-cyan-500/10 p-4 rounded-2xl w-72">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]" />
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400/60">Status_Report</span>
                         <span className="text-[10px] font-mono text-white/80">100%_OPERATIONAL</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-4 bg-black/40 backdrop-blur-2xl border border-blue-500/10 p-4 rounded-2xl w-72 px-6">
                      <Activity className="w-4 h-4 text-blue-400 animate-bounce-slow" />
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black uppercase tracking-widest text-blue-400/60">Identity_Integrity</span>
                         <span className="text-[10px] font-mono text-white/80">VERIFIED_SIGNATURE</span>
                      </div>
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
