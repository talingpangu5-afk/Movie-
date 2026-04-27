'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Cpu, Zap, Activity, Wifi, Lock, Globe, Database, Radio, Loader2, Brain, Fingerprint, Eye, Command } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";

export function SecretPlatform({ onExit }: { onExit: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [typedWelcome, setTypedWelcome] = useState("");
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const messages = [
      "ESTABLISHING QUANTUM LINK...",
      "DECRYPTING MULTIVERSE SIGNALS...",
      "CALIBRATING NEURAL INTERFACE...",
      "BYPASSING COSMIC ENCRYPTION...",
      "ACCESS GRANTED: THE HIDDEN LAYER",
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < messages.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${messages[current]}`]);
        current++;
      } else {
        setIsInitializing(false);
        clearInterval(interval);
        startWelcomeSequence();
      }
    }, 800);

    return () => {
        clearInterval(interval);
        if (audioSourceRef.current) audioSourceRef.current.stop();
    };
  }, []);

  const startWelcomeSequence = async () => {
    const text = "Welcome to the Hidden Layer of the Universe. You have successfully bypassed the solar boundary. Exploring the unknown world now.";
    
    // Typing animation
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypedWelcome(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    // AI Voice Intro
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: `Say in a deep, calm, robotic futuristic male voice: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Charon' },
            },
          },
        },
      });

      const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        
        const float32Data = new Float32Array(bytes.length / 2);
        const view = new DataView(bytes.buffer);
        for (let i = 0; i < float32Data.length; i++) {
            const s16 = view.getInt16(i * 2, true);
            float32Data[i] = s16 / 32768;
        }

        const buffer = audioContext.createBuffer(1, float32Data.length, 24000);
        buffer.getChannelData(0).set(float32Data);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
        audioSourceRef.current = source;
      }
    } catch (e) {
      console.error("AI Voice failed:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Digital City Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,transparent_100%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <motion.div 
            animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%"],
                opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop')] bg-cover opacity-10 mix-blend-overlay"
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-8 flex flex-col items-center h-full pt-16 pb-12">
        {isInitializing ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            <div className="relative w-32 h-32">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-2 border-b-purple-500 border-t-transparent border-r-transparent border-l-transparent rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Fingerprint className="w-10 h-10 text-cyan-400 animate-pulse" />
                </div>
            </div>
            <div className="text-center font-mono space-y-2">
                {logs.map((log, i) => (
                    <motion.p 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-cyan-400/60 text-xs tracking-[0.2em]"
                    >
                        {log}
                    </motion.p>
                ))}
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex-1 flex flex-col"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-12 border-b border-cyan-500/20 pb-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-cyan-400/10 rounded-2xl flex items-center justify-center border border-cyan-400/30 group cursor-pointer hover:bg-cyan-400/20 transition-all">
                        <Brain className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,1)]" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-white tracking-widest uppercase">The Hidden Layer</h2>
                        <div className="flex items-center gap-3">
                             <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
                             </div>
                             <p className="text-cyan-400/60 font-mono text-[10px] uppercase tracking-[0.5em]">Sector: Unknown / Infinity Core ACTIVE</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onExit}
                    className="px-8 py-3 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all rounded-xl flex items-center gap-2 group"
                >
                    <Command className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Terminate Access
                </button>
            </div>

            {/* Welcome Text */}
            <div className="mb-12 min-h-[60px]">
                <p className="font-mono text-cyan-400 text-lg md:text-xl tracking-tight max-w-3xl leading-relaxed">
                    {typedWelcome}
                    <motion.span 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-6 bg-cyan-400 ml-2 align-middle" 
                    />
                </p>
            </div>

            {/* Interactive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                {/* Explore Zones */}
                <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-cyan-400/10 rounded-2xl p-6 hover:border-cyan-400/40 transition-all group overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-400/5 rounded-full blur-3xl group-hover:bg-cyan-400/10 transition-all" />
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-cyan-400/10 rounded-xl"><Globe className="w-6 h-6 text-cyan-400" /></div>
                        <h3 className="text-white font-black uppercase tracking-widest text-sm">Explore Zones</h3>
                    </div>
                    <div className="space-y-3">
                        {["Neon Suburbs", "Digital Cloud City", "Quantum Overlook"].map((zone, i) => (
                            <button key={i} className="w-full text-left p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-cyan-400/10 hover:border-cyan-400/20 transition-all flex items-center justify-between group/btn">
                                <span className="text-[10px] text-white/60 font-black uppercase tracking-widest">{zone}</span>
                                <Zap className="w-3 h-3 text-cyan-400 opacity-0 group-hover/btn:opacity-100 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI Assistant Panel */}
                <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-purple-400/10 rounded-2xl p-6 hover:border-purple-400/40 transition-all group relative">
                    <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-purple-400/5 rounded-full blur-3xl" />
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-400/10 rounded-xl"><Eye className="w-6 h-6 text-purple-400" /></div>
                            <h3 className="text-white font-black uppercase tracking-widest text-sm">AI Assistant</h3>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-1 h-3 bg-purple-400/40 animate-pulse" />
                            <div className="w-1 h-3 bg-purple-400/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1 h-3 bg-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>
                    <div className="p-4 bg-purple-400/5 border border-purple-400/20 rounded-xl font-mono text-[10px] text-purple-400/80 leading-loose mb-6">
                        &quot;I am V-Core 9000. Your presence in the hidden universe is monitored. State your objective or navigate using the nodes.&quot;
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                        <Radio className="w-4 h-4 text-purple-400" />
                        <span className="text-[10px] text-white/40 font-mono italic">Waiting for voice command...</span>
                    </div>
                </div>

                {/* Hidden Knowledge Hub */}
                <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-green-400/10 rounded-2xl p-6 hover:border-green-400/40 transition-all group overflow-hidden">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-green-400/10 rounded-xl"><Lock className="w-6 h-6 text-green-400" /></div>
                        <h3 className="text-white font-black uppercase tracking-widest text-sm">Knowledge Hub</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-white/5 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-3 p-4 hover:bg-green-400/10 hover:border-green-400/20 transition-all cursor-pointer group/node">
                                <Database className="w-6 h-6 text-white/20 group-hover/node:text-green-400 transition-all" />
                                <span className="text-[8px] text-white/40 font-mono text-center">ENCRYPTED_FILE_0{i}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Decorative Grid Perspective */}
      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none border-[30px] border-black/50" />
    </div>
  );
}
