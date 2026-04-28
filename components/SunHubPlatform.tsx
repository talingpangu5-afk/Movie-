'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  Sun, 
  Thermometer, 
  Zap, 
  Activity, 
  Radio, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  Flame,
  Wind,
  Info,
  ExternalLink,
  AudioLines
} from 'lucide-react';

interface SunHubPlatformProps {
  onExit: () => void;
}

export function SunHubPlatform({ onExit }: SunHubPlatformProps) {
  const [activeTab, setActiveTab] = useState<'data' | 'science' | 'sounds'>('data');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const solarData = [
    { label: 'Surface Temperature', value: '5,500 °C', icon: Thermometer, color: 'text-orange-400' },
    { label: 'Core Temperature', value: '15,000,000 °C', icon: Flame, color: 'text-red-500' },
    { label: 'Composition', value: '73% H, 25% He', icon: Activity, color: 'text-yellow-400' },
    { label: 'Age', value: '4.6 Billion Years', icon: Zap, color: 'text-blue-400' },
    { label: 'Mass', value: '333,000 Earths', icon: Globe, color: 'text-cyan-400' },
    { label: 'Energy Source', value: 'Nuclear Fusion', icon: ShieldCheck, color: 'text-green-400' },
  ];

  const equipments = [
    { 
      name: 'SDO (Solar Dynamics Observatory)', 
      role: 'Monitors solar activity and its influence on Earth.', 
      img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400',
      description: 'SDO has been studying the Sun since 2010, taking high-definition images to understand the solar atmosphere and magnetic field.'
    },
    { 
      name: 'Parker Solar Probe', 
      role: 'First mission to "touch" the Sun.', 
      img: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&q=80&w=400',
      description: 'Launched in 2018, this spacecraft travels closer to the Sun than any before, surviving extreme heat and radiation to study the corona.'
    },
    { 
      name: 'SOHO (Solar & Heliospheric Observatory)', 
      role: 'Long-term solar watch since 1995.', 
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
      description: 'A joint NASA/ESA mission that provides near real-time data for space weather forecasting.'
    }
  ];

  useEffect(() => {
    // Adsterra Script Placement Logic - In a real app, this would be injected effectively
    // For now, we provide the container
    console.log("Sun Hub Platform mounted - Ad areas ready");
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.nasa.gov/wp-content/uploads/2015/01/594439main_hmi_sonification.mp3');
      audioRef.current.loop = true;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-[#050505] text-white flex flex-col overflow-hidden font-sans"
    >
      {/* Background Solar Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[200%] aspect-square bg-[radial-gradient(circle_at_center,rgba(255,160,0,0.15)_0%,transparent_70%)] opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between border-b border-orange-500/20 backdrop-blur-md bg-black/40">
        <div className="flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-orange-400" />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
              <Sun className="w-8 h-8 text-orange-500 animate-pulse" />
              SOLAR OBSERVATORY <span className="text-orange-500/50">v1.5</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-orange-400/60 font-mono">Real-time Heliospheric Data Link // NASA CONNECT</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-4 p-1 bg-white/5 rounded-lg border border-white/10">
            {(['data', 'science', 'sounds'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-orange-500 text-black' : 'hover:bg-white/5 text-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Top Banner Ad Placeholder */}
          <div className="w-full h-32 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center justify-center group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {/* THIS IS WHERE THE ADSTERRA BANNER WOULD GO */}
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-orange-500/40 mb-2 font-mono">Promotional Space // Adsterra Network</p>
              <div id="ad-banner-top" className="flex items-center justify-center gap-4 text-orange-500/20">
                <Zap className="w-6 h-6" />
                <span className="text-sm font-black italic">SOLAR DEALS UPCOMING</span>
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'data' && (
              <motion.div 
                key="data"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {solarData.map((item, i) => (
                  <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-orange-500/30 transition-all group">
                    <item.icon className={`w-8 h-8 ${item.color} mb-6 group-hover:scale-110 transition-transform`} />
                    <h3 className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2">{item.label}</h3>
                    <p className="text-3xl font-black tracking-tight">{item.value}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'science' && (
              <motion.div 
                key="science"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {equipments.map((eq, i) => (
                  <div key={i} className="flex flex-col md:flex-row bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/20 transition-all">
                    <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden relative">
                      <Image 
                        src={eq.img} 
                        alt={eq.name} 
                        fill
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black tracking-tight text-white">{eq.name}</h3>
                        <div className="flex gap-2">
                           <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase rounded-full">Active</span>
                        </div>
                      </div>
                      <p className="text-orange-400/80 text-sm font-medium mb-4 italic">&quot;{eq.role}&quot;</p>
                      <p className="text-white/60 text-sm leading-relaxed mb-6">{eq.description}</p>
                      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-400 hover:text-white transition-colors">
                        Learn More at NASA.gov <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'sounds' && (
              <motion.div 
                key="sounds"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12 gap-12"
              >
                <div className="relative">
                  <div className={`absolute inset-[-40px] bg-orange-500/20 rounded-full blur-[100px] transition-all duration-1000 ${isPlaying ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`} />
                  <button 
                    onClick={toggleSound}
                    className="relative w-48 h-48 bg-orange-500 rounded-full flex flex-col items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(249,115,22,0.4)] group overflow-hidden"
                  >
                     {isPlaying ? (
                       <AudioLines className="w-16 h-16 text-black animate-bounce" />
                     ) : (
                       <AudioLines className="w-16 h-16 text-black opacity-40" />
                     )}
                     <span className="text-black font-black text-[12px] uppercase tracking-widest">
                       {isPlaying ? 'MUTE SOLAR VOID' : 'HEAR THE SUN'}
                     </span>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </button>
                </div>

                <div className="max-w-xl text-center space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-widest text-orange-500">The Sounds of SDO</h3>
                  <p className="text-white/60 text-sm leading-relaxed font-mono">
                    Experience the sonification of our Sun. Data from NASA&apos;s Solar Dynamics Observatory (SDO) has been translated into sound frequencies, capturing the immense rhythmic &quot;boiling&quot; of the solar atmosphere.
                  </p>
                  <div className="flex items-center justify-center gap-8 pt-8">
                    <div className="flex flex-col items-center gap-2">
                       <Radio className="w-6 h-6 text-orange-400/50" />
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-40">24.2 kHz Capture</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <Cpu className="w-6 h-6 text-orange-400/50" />
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Frequency Synced</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Adsterra Placeholder */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 h-64 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center group transition-all hover:bg-white/[0.07]">
              <Info className="w-8 h-8 text-orange-500/30 mb-4" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Solar Weather Alert</h4>
              <p className="text-xs text-white/60 mb-6">Real-time flare intensity and CME tracking available for licensed researchers.</p>
              <button className="px-6 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-orange-500 hover:text-black transition-all">
                Request API Access
              </button>
            </div>

            <div className="w-full md:w-[320px] aspect-square bg-orange-500/5 border border-orange-500/10 rounded-2xl flex flex-col items-center justify-center gap-4 relative group cursor-pointer overflow-hidden">
               {/* 300x250 Banner Ad Area */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,160,0,0.1)_0%,transparent_100%)]" />
               <div className="relative z-10 space-y-4 text-center p-6">
                  <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-orange-500/30">Vertical Sponsored Slot</p>
                  <div className="w-full aspect-square bg-black/40 rounded-lg flex items-center justify-center border border-orange-500/10">
                     <Wind className="w-12 h-12 text-orange-500/20 animate-pulse" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-500/60">ADSTERRA NETWORK</p>
               </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="relative z-10 p-4 px-6 border-t border-white/5 bg-black/80 flex items-center justify-between text-[10px] font-mono text-white/30 uppercase tracking-[0.5em]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-green-500 animate-ping" /> LINK STABLE</span>
          <span>LAT: 0° / LON: 0° SUN_REF</span>
        </div>
        <div className="hidden md:block italic">Authorized access only // GSFC Mission Control</div>
      </footer>
    </motion.div>
  );
}
