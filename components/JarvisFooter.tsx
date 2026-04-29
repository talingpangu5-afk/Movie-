'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Cpu, Activity, Radio, ShieldCheck, Zap, ChevronUp, Sparkles, Mic, Terminal, Info } from 'lucide-react';

// --- SUB-COMPONENTS ---

function VoiceWaveform() {
  return (
    <div className="flex items-center gap-1 h-8 px-4 bg-cyan-500/5 rounded-full border border-cyan-500/20">
      <Mic className="w-3 h-3 text-cyan-400 mr-2" />
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ height: [4, (i % 3 === 0 ? 18 : 10), 4] }}
          transition={{ duration: 0.5 + (i % 4) * 0.1, repeat: Infinity, delay: i * 0.05 }}
          className="w-0.5 bg-cyan-400/60 rounded-full"
        />
      ))}
      <span className="text-[7px] font-mono text-cyan-400/40 ml-2 uppercase tracking-tighter">Voice_Protocol_Active</span>
    </div>
  );
}

function SystemLogs() {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const rawLogs = [
      "DECRYPTING_PACKET_0x82",
      "NEURAL_SYNAPSE_SYNC_100%",
      "BYPASSING_FIREWALL_v4",
      "OPTIMIZING_RENDER_PIPELINE",
      "SCANNING_DEEP_NODES",
      "ESTABLISHING_SECURE_LINK",
      "UPLINK_ESTABLISHED_0x9A",
      "GEO_SPATIAL_CALIBRATION",
    ];
    
    // Deterministic log flow
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLogs(prev => [`[${timestamp}] ${rawLogs[prev.length % rawLogs.length]}`, ...prev].slice(0, 5));
    }, 2500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full h-24 overflow-hidden">
      <AnimatePresence initial={false}>
        {logs.map((log, i) => (
          <motion.div
            key={`${log}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1 - i * 0.2, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-[9px] font-mono text-cyan-400/80 truncate uppercase tracking-widest">{log}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- MAIN COMPONENT ---

export function JarvisFooter() {
  const [isSwiped, setIsSwiped] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  
  // Stabilize values for particles using deterministic logic
  const particles = useMemo(() => [...Array(15)].map((_, i) => ({
    id: i,
    delay: (i * 0.7) % 5,
    duration: 3 + (i * 0.5) % 4,
    y: -100 - (i * 15) % 200,
    x: (i * 3) % 20 - 10,
    marginLeft: (i - 7) * 40
  })), []);

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
      {/* Cinematic Lighting Ambience */}
      <div className="absolute bottom-0 w-full h-[300px] bg-[radial-gradient(circle_at_50%_100%,rgba(6,182,212,0.1)_0%,transparent_70%)] pointer-events-none" />
      
      {/* Floating Spark Particles */}
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
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            className="absolute left-1/2 w-0.5 h-0.5 bg-cyan-400 rounded-full blur-[0.5px]"
            style={{ marginLeft: `${p.marginLeft}px` }}
          />
        ))}
      </div>

      {/* FOOTER BAR */}
      <motion.div
        layout
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: isSwiped ? -20 : 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative w-[320px] sm:w-[450px] lg:w-[650px] pointer-events-auto"
      >
        <div className={`relative h-14 sm:h-20 bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] overflow-hidden flex items-center justify-center group cursor-pointer transition-all duration-700 shadow-2xl ${isSwiped ? 'shadow-[0_0_80px_rgba(6,182,212,0.2)] scale-[1.02]' : 'hover:border-cyan-500/20'}`}
             onClick={() => setIsSwiped(!isSwiped)}
        >
          {/* Internal Glow Streak */}
          <motion.div 
            animate={{ x: ['100%', '-100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent skew-x-[-30deg]"
          />
          
          <div className="flex items-center gap-4 lg:gap-10 z-10 px-8 w-full justify-between">
            {/* Left Status */}
            <div className="hidden lg:flex flex-col items-start gap-1">
              <span className="text-[7px] font-black tracking-widest text-white/20 uppercase font-mono">SYS_CORE_v9</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-500/5 border border-cyan-500/10 rounded-full">
                <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[9px] font-mono text-cyan-400/80 uppercase">READY</span>
              </div>
            </div>

            {/* Core Hub */}
            <div className="flex items-center gap-5">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-cyan-500/20 border-dashed"
                />
                <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                   className="absolute inset-2 rounded-full border border-blue-500/40"
                />
                <Bot className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              </div>

              <div className="flex flex-col items-start">
                <h3 className="text-sm font-black tracking-[0.4em] uppercase italic text-white flex items-center gap-2">
                  JARVIS <span className="text-cyan-500/60 font-medium">INTERFACE</span>
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <Activity className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Neural_Net_Online</span>
                </div>
              </div>
            </div>

            {/* Right Status */}
            <div className="hidden lg:flex items-center gap-4">
              <VoiceWaveform />
              <div className="flex items-center gap-4 border-l border-white/5 pl-4 ml-4">
                <ShieldCheck className="w-4 h-4 text-cyan-400/40" />
                <Zap className="w-4 h-4 text-blue-400/40" />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 border-b-2 border-cyan-500/10 pointer-events-none" />
        </div>

        {/* EXPANDED INTERFACE */}
        <AnimatePresence>
          {isSwiped && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: -40 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 w-[340px] sm:w-[550px] lg:w-[900px] mb-12"
            >
              <div className="relative flex flex-col items-center">
                
                {/* ADVANCED ROBOTIC SVG */}
                <motion.div 
                  initial={{ rotateY: 45, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="relative w-48 h-64 lg:w-96 lg:h-[450px] mb-12 z-20 perspective-1000"
                >
                  <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-[0_0_50px_rgba(6,182,212,0.5)]">
                    <defs>
                      <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="50%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <filter id="h-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <linearGradient id="cyber-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>

                    {/* MECHANICAL SKELETON */}
                    <g className="skeleton" fill="none" stroke="#2dd4bf" strokeWidth="0.2" opacity="0.3">
                      <path d="M50,15 L50,140 M30,40 L70,40 M40,80 L60,80 M45,110 L55,110" />
                    </g>
                    
                    {/* ARMOR PLATING */}
                    <g fill="url(#metal-grad)" stroke="#06b6d4" strokeWidth="0.3" strokeOpacity="0.4">
                      {/* Torso Components */}
                      <path d="M30,40 Q50,35 70,40 L75,85 Q50,90 25,85 Z" />
                      <path d="M35,95 Q50,92 65,95 L68,130 Q50,135 32,130 Z" />
                      {/* Shoulders */}
                      <circle cx="28" cy="45" r="8" />
                      <circle cx="72" cy="45" r="8" />
                      {/* Head Piece */}
                      <path d="M40,10 Q50,0 60,10 L62,32 Q50,38 38,32 Z" />
                      <rect x="42" y="24" width="16" height="4" rx="1" fill="#06b6d4" fillOpacity="0.2" />
                    </g>

                    {/* ENERGY NETWORK */}
                    <g stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" filter="url(#h-glow)">
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        d="M50,130 L50,90 M30,45 L40,60 M70,45 L60,60 M50,40 L50,15"
                      />
                    </g>

                    {/* MAIN CORE (ARC REACTOR STYLE) */}
                    <g cursor="pointer">
                      <circle cx="50" cy="62" r="8" fill="#06b6d4" filter="url(#h-glow)">
                        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="50" cy="62" r="3" fill="white" />
                      <circle cx="50" cy="62" r="14" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="4 2">
                        <animateTransform attributeName="transform" type="rotate" from="0 50 62" to="360 50 62" dur="3s" repeatCount="indefinite" />
                      </circle>
                    </g>

                    {/* VISOR LIGHT */}
                    <line x1="45" y1="20" x2="55" y2="20" stroke="#06b6d4" strokeWidth="1.5" filter="url(#h-glow)">
                      <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
                    </line>
                  </svg>
                  
                  {/* Digital Atmosphere */}
                  <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none opacity-40 blur-3xl animate-pulse" />
                </motion.div>

                {/* HOLOGRAPHIC TILES */}
                <div className="absolute top-20 w-full flex justify-between px-4 lg:px-0 pointer-events-none z-30">
                   <div className="space-y-6">
                      <SystemPanel icon={ShieldCheck} title="FIREWALL" status="OPTIMAL" delay={0.1} />
                      <SystemPanel icon={Radio} title="UPLINK" status="9.8 GB/S" delay={0.3} />
                   </div>
                   <div className="space-y-6 text-right flex flex-col items-end">
                      <SystemPanel icon={Cpu} title="PROCESSOR" status="24.2 THz" delay={0.2} flip />
                      <SystemPanel icon={Zap} title="BATTERY" status="98.4%" delay={0.4} flip />
                   </div>
                </div>

                {/* DATA SUMMARY PANEL */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-2xl bg-black/80 backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.8)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">NEURAL_DECRYPT_LOGS</h4>
                      </div>
                      <SystemLogs />
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Info className="w-4 h-4 text-blue-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">ANALYSIS_REPORT</h4>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[11px] font-mono text-white/50 leading-loose uppercase italic">
                          Sentiment Layer: <span className="text-white font-bold">STABLE</span> <br />
                          Identity Integrity: <span className="text-white font-bold">VERIFIED</span> <br />
                          Sync Latency: <span className="text-cyan-400">2ms_SYNCED</span> <br />
                          Current Load: <span className="text-blue-400">14.2%_IDLE</span>
                        </p>
                      </div>
                      <div className="flex justify-end pr-2">
                        <Sparkles className="w-4 h-4 text-cyan-400 opacity-20 animate-spin-slow" />
                      </div>
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

function SystemPanel({ icon: Icon, title, status, delay, flip = false }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: flip ? 30 : -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`flex items-center gap-4 bg-black/60 backdrop-blur-2xl border border-white/5 p-4 rounded-2xl min-w-[140px] shadow-xl ${flip ? 'flex-row-reverse text-right' : ''}`}
    >
      <div className="p-2 bg-cyan-500/10 rounded-lg">
        <Icon className="w-4 h-4 text-cyan-400" />
      </div>
      <div>
        <div className="text-[8px] font-black uppercase tracking-widest text-white/40">{title}</div>
        <div className="text-[10px] font-mono font-bold text-white uppercase">{status}</div>
      </div>
    </motion.div>
  );
}
