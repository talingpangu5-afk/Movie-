'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Cpu, Zap, Activity, Wifi, Lock, Globe, Database, Radio, Loader2 } from 'lucide-react';

export function SecretPlatform({ onExit }: { onExit: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const messages = [
      "INITIALIZING NEURAL LINK...",
      "DECRYPTING MARS SIGNAL...",
      "BYPASSING QUANTUM ENCRYPTION...",
      "ESTABLISHING SECURE CONNECTION...",
      "ACCESS GRANTED: SECTOR 7G",
      "WELCOME TO THE UNDERCROSSING."
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < messages.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${messages[current]}`]);
        current++;
      } else {
        setIsInitializing(false);
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-[#00050a] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Neon Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#001524_1px,transparent_1px),linear-gradient(to_bottom,#001524_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 perspective-1000">
        <div className="absolute inset-0 bg-gradient-to-t from-[#00050a] via-transparent to-transparent" />
        <motion.div 
          animate={{ rotateX: [20, 25, 20], y: [-20, 0, -20] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-full h-[200%] origin-top"
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              opacity: 0 
            }}
            animate={{ 
              y: [null, "-100%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-sm"
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center">
        {isInitializing ? (
          <div className="flex flex-col items-center gap-6">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-cyan-400" />
            </motion.div>
            <div className="flex flex-col gap-2 font-mono">
              {logs.map((log, i) => (
                <motion.p 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-cyan-400/80 text-xs md:text-sm tracking-wider"
                >
                  {log}
                </motion.p>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 w-full border-b border-cyan-900/50 pb-4">
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">
                  SECRET <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">PLATFORM</span>
                </h1>
                <p className="text-cyan-500 font-mono text-sm uppercase tracking-[0.3em]">Mars Sector / Node v.4.0.2</p>
              </div>
              <button 
                onClick={onExit}
                className="px-6 py-2 border border-red-500/50 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all rounded"
              >
                Terminate Connection
              </button>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Stats Panel */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="md:col-span-1 bg-[#001524]/50 backdrop-blur-xl border border-cyan-500/20 p-6 rounded-lg relative group"
              >
                <div className="absolute top-0 right-0 p-2 opacity-20"><Shield className="w-5 h-5 text-cyan-400" /></div>
                <h3 className="text-cyan-400 text-xs font-black uppercase mb-4 tracking-widest">Network Status</h3>
                <div className="space-y-4">
                  {[
                    { label: "Neural Link", value: "98.4%", icon: Wifi },
                    { label: "Core Temp", value: "34°C", icon: Activity },
                    { label: "Sync Latency", value: "0.2ms", icon: Zap },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <stat.icon className="w-4 h-4 text-cyan-500" />
                        <span className="text-[10px] text-white/60 uppercase">{stat.label}</span>
                      </div>
                      <span className="text-xs font-mono text-cyan-400">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Main Content Areas */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 bg-[#001524]/30 backdrop-blur-md border border-cyan-500/10 p-8 rounded-lg relative overflow-hidden"
              >
                <div className="absolute top-2 left-2 flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
                
                <h3 className="text-white text-lg font-black uppercase mb-6 tracking-widest flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" /> Active Data Streams
                </h3>
                
                <div className="space-y-2 font-mono text-[10px] text-cyan-500/60 h-48 overflow-hidden relative">
                  {[...Array(12)].map((_, i) => (
                    <motion.p 
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {`SYSTEM_CALL_${Math.random().toString(36).substring(7).toUpperCase()} >> INJECT_PACKET_${Math.floor(Math.random() * 1000)} ... SUCCESS`}
                    </motion.p>
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001524] to-transparent pointer-events-none" />
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  {[
                    { label: "Access Database", icon: Database },
                    { label: "Scan Perimeter", icon: Radio },
                    { label: "Global Sync", icon: Globe },
                  ].map((btn, i) => (
                    <button key={i} className="flex-1 flex items-center justify-center gap-2 py-3 bg-cyan-400/5 border border-cyan-400/20 rounded hover:bg-cyan-400/10 transition-all text-[10px] font-black uppercase tracking-widest text-cyan-400">
                      <btn.icon className="w-4 h-4" />
                      {btn.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Encryption Panel */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-1 bg-[#001524]/50 backdrop-blur-xl border border-cyan-500/20 p-6 rounded-lg overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-cyan-400 text-xs font-black uppercase tracking-widest">Encryption Key</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-10 bg-cyan-400/5 border border-cyan-400/10 flex items-center justify-center font-mono text-xs text-white/40">
                      {Math.floor(Math.random() * 9999).toString(16)}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-cyan-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase">Processor</p>
                      <p className="text-xs text-white font-bold">X-9 QUANTUM</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Marquee */}
            <div className="mt-12 overflow-hidden border-t border-b border-cyan-900/30 py-3 relative">
              <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="flex whitespace-nowrap gap-12 text-[10px] font-mono text-cyan-500/50"
              >
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    SECURE CONNECT ESTABLISHED ... NODE_ID: OXF7A2 ... MARS_COORDINATES: 18.25°N 142.07°E ... DATA_PACKET_LOSS: 0.00% ... ENCRYPTION_LEVEL: AES-4096 ... 
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
}
