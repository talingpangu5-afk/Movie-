'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  Search, 
  Mic, 
  LayoutGrid, 
  Play, 
  Pause, 
  Maximize2, 
  Download, 
  Camera, 
  Cpu, 
  Activity, 
  Radio, 
  Zap,
  Globe,
  Settings,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import JarvisPlayer from './JarvisPlayer';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function JarvisPlatform() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [telemetry, setTelemetry] = useState({
    cpu: 42,
    mem: 68,
    net: 124,
    latency: 14,
    status: 'ONLINE'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * (45 - 38) + 38),
        mem: Math.floor(Math.random() * (72 - 65) + 65),
        net: Math.floor(Math.random() * (130 - 110) + 110),
        latency: Math.floor(Math.random() * (18 - 12) + 12),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleVideoSelect = (video: any) => {
    setActiveVideo(video);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden selection:bg-cyan-500/30 font-sans">
      {/* Background Immersive Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#1a103d_0%,transparent_70%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,#0891b2_0%,transparent_50%)] opacity-20" />
        <div 
           className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920')] bg-cover bg-center mix-blend-overlay opacity-10 blur-sm"
        />
        
        {/* Moving Grid Lines */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #0891b2 1px, transparent 1px), linear-gradient(to bottom, #0891b2 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }} 
        />
        
        <div className="scanline" />
      </div>

      {/* TOP SWIPE BAR */}
      <div className="fixed top-0 inset-x-0 z-[110] flex justify-center pt-4">
        <motion.button
          onClick={() => setIsDashboardOpen(!isDashboardOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-16 py-3 bg-gradient-to-r from-cyan-600/10 via-purple-600/10 to-cyan-600/10 backdrop-blur-3xl border border-white/5 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(147,51,234,0.2)] transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[9px] font-mono text-cyan-400 font-black tracking-[0.5em] uppercase animate-pulse">
              {isDashboardOpen ? 'INITIATE_COLLAPSE' : 'NEURAL_LINK_v9.0'}
            </span>
            <ChevronDown className={cn("w-5 h-5 text-cyan-400 transition-transform duration-700 ease-in-out", isDashboardOpen && "rotate-180")} />
          </div>
        </motion.button>
      </div>

      {/* MAIN VIEWPORT */}
      <motion.div 
        animate={{ 
            scale: isDashboardOpen ? 0.92 : 1,
            opacity: isDashboardOpen ? 0.2 : 1,
            filter: isDashboardOpen ? 'blur(20px)' : 'blur(0px)'
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pt-32"
      >
        <div className="max-w-7xl mx-auto px-8 space-y-20 pb-32">
            {/* HERO HERO FEATURE */}
            <section className="relative h-[70vh] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
               <img 
                 src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920" 
                 alt="Main Cinematic" 
                 className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent flex flex-col justify-end p-16">
                  <div className="max-w-3xl space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-cyan-500 rounded-xl text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.5)]">AI_SYNTH_01</div>
                        <div className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">Establishing Live Neural Feed...</div>
                     </div>
                     <h1 className="text-7xl md:text-9xl font-black text-white hover:text-cyan-400 transition-colors uppercase tracking-tighter leading-[0.85]">
                        Synthetic <br /> Horizons
                     </h1>
                     <p className="text-xl text-gray-400 max-w-xl font-medium leading-relaxed">
                        Journey through the uncharted digital landscapes generated by Neural Engine 4.0. Captured in real-time holographic synthesis.
                     </p>
                     <div className="flex items-center gap-8 pt-8">
                        <button 
                            onClick={() => handleVideoSelect({ title: 'Synthetic Horizons' })}
                            className="group flex items-center gap-4 px-10 py-5 bg-white text-black font-black uppercase rounded-2xl hover:bg-cyan-400 transition-all shadow-2xl active:scale-95"
                        >
                           <Play className="fill-black group-hover:scale-110 transition-transform" />
                           Initialize Stream
                        </button>
                        <button className="flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 backdrop-blur-2xl text-white font-black uppercase rounded-2xl hover:bg-white/10 transition-all active:scale-95">
                           <LayoutGrid className="w-6 h-6" />
                           Archives
                        </button>
                     </div>
                  </div>
               </div>

               {/* Cinematic HUD details */}
               <div className="absolute top-16 right-16 space-y-6 text-right">
                  <div className="p-6 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem]">
                     <div className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-4">Feed_Control_0x82</div>
                     <div className="space-y-3">
                        {['FPS: 120', 'BITRATE: 48GBPS', 'LATENCY: 14MS'].map((item, i) => (
                           <div key={i} className="flex justify-between gap-12 font-mono text-[9px] text-white/40 border-b border-white/5 pb-1">
                              <span className="uppercase tracking-widest">{item.split(':')[0]}</span>
                              <span className="text-white">{item.split(':')[1]}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </section>

            {/* QUICK SLOTS */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                {['NEURAL', 'CYBER', 'HYPER', 'VOX', 'SYNC', 'ARCH'].map((slot, i) => (
                    <motion.button 
                        key={i}
                        whileHover={{ y: -5, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}
                        className="relative p-6 rounded-3xl bg-white/5 border border-white/5 transition-all text-left group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/20 transition-all" />
                        <div className="text-[9px] font-mono text-cyan-500/40 mb-2 uppercase tracking-widest">{`Node_0${i+1}`}</div>
                        <div className="text-white font-black uppercase text-sm tracking-widest group-hover:translate-x-1 transition-transform">{slot}</div>
                        <Zap className="mt-4 w-4 h-4 text-cyan-500/20 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
                    </motion.button>
                ))}
            </div>

            {/* FEED SECTION */}
            <section className="space-y-12">
               <div className="flex justify-between items-end">
                  <div className="space-y-2">
                     <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Global Synapses</h2>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Live_Network_Ingestion_Active</span>
                     </div>
                  </div>
                  <button className="px-8 py-3 bg-white/5 border border-white/5 rounded-full text-xs font-black uppercase tracking-widest text-white/60 hover:text-cyan-400 hover:border-cyan-400/30 transition-all">
                     Refresh Database &gt;
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <motion.div 
                        key={i}
                        onClick={() => handleVideoSelect({ title: `Neural Sync 0x${i+123}` })}
                        whileHover={{ y: -10 }}
                        className="group relative aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/5 cursor-pointer bg-black"
                    >
                        <img 
                            src={`https://picsum.photos/seed/${i + 150}/800/600`} 
                            alt="Node Snapshot" 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-all duration-700 filter grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        
                        <div className="absolute inset-x-8 bottom-8 flex flex-col gap-4">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em]">Synapse_{i+102}</span>
                              <div className="flex gap-1.5">
                                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-40" />
                              </div>
                           </div>
                           <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-cyan-400 transition-colors">Neural Convergence 0x{i+12}</h3>
                           <div className="flex items-center justify-between pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                               <div className="flex gap-4">
                                  <span className="text-[9px] font-mono text-gray-500">RES_8K</span>
                                  <span className="text-[9px] font-mono text-gray-500">LEN_12:44</span>
                               </div>
                               <Plus className="w-4 h-4 text-cyan-400" />
                           </div>
                        </div>
                    </motion.div>
                  ))}
               </div>
            </section>
        </div>
      </motion.div>

      {/* DASHBOARD OVERLAY */}
      <AnimatePresence>
        {isDashboardOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 100 }}
            className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-3xl overflow-y-auto custom-scrollbar pt-12"
          >
             <div className="max-w-[1700px] mx-auto p-12">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* HUB SIDEBAR */}
                    <aside className="w-full lg:w-[400px] space-y-12">
                       <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 p-px">
                             <div className="w-full h-full rounded-3xl bg-[#050505] flex items-center justify-center">
                                <Globe className="w-10 h-10 text-cyan-400 animate-pulse" />
                             </div>
                          </div>
                          <div>
                             <h2 className="text-3xl font-black text-white tracking-widest uppercase">Node_Hub</h2>
                             <div className="text-cyan-500 font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">Neural_Sync_Stable</div>
                          </div>
                       </div>

                       <nav className="flex flex-col gap-3">
                          {[
                            { icon: Globe, label: 'Global Network', active: true },
                            { icon: Activity, label: 'Neural Activity' },
                            { icon: LayoutGrid, label: 'Synthetic Repository' },
                            { icon: Radio, label: 'Live Uplink' },
                            { icon: User, label: 'Identity_Config' }
                          ].map((item, i) => (
                             <button
                                key={i}
                                className={cn(
                                    "w-full flex items-center gap-6 p-6 rounded-[2rem] border transition-all text-left active:scale-[0.98]",
                                    item.active 
                                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.15)]" 
                                        : "bg-white/5 border-transparent text-gray-500 hover:bg-white/10 hover:text-white"
                                )}
                             >
                                <item.icon className={cn("w-6 h-6", item.active && "animate-pulse")} />
                                <span className="font-black uppercase text-xs tracking-[0.2em]">{item.label}</span>
                                {item.active && <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />}
                             </button>
                          ))}
                       </nav>

                       <div className="p-10 bg-white/5 border border-white/5 rounded-[3rem] space-y-10 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors duration-700" />
                           <div className="flex items-center justify-between relative z-10">
                              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Bio_Metric_Uplink</span>
                              <Activity className="w-4 h-4 text-cyan-500 animate-bounce" />
                           </div>
                           <div className="space-y-8 relative z-10">
                              {[
                                { label: 'CPU', value: telemetry.cpu, color: 'from-cyan-400 to-cyan-600' },
                                { label: 'MEM', value: telemetry.mem, color: 'from-purple-400 to-purple-600' },
                                { label: 'SYN', value: 98, color: 'from-green-400 to-green-600' }
                              ].map((bar, i) => (
                                 <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] font-mono text-gray-500 uppercase">{bar.label}</span>
                                        <span className="text-white font-mono text-[10px]">{bar.value}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${bar.value}%` }}
                                            className={cn("h-full rounded-full bg-gradient-to-r", bar.color)} 
                                        />
                                    </div>
                                 </div>
                              ))}
                           </div>
                           <div className="p-4 bg-black/40 rounded-2xl border border-white/5 relative z-10 flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                  <User className="text-cyan-400 w-5 h-5" />
                               </div>
                               <div className="overflow-hidden">
                                  <div className="text-white text-[10px] font-bold uppercase truncate">ARUNPANGU81125@GMAIL.COM</div>
                                  <div className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Access_Lvl: Oracle</div>
                               </div>
                           </div>
                       </div>
                    </aside>

                    {/* GRID DISPLAY */}
                    <div className="flex-1 space-y-16">
                        <div className="flex flex-col md:flex-row gap-8 justify-between items-center">
                           <div className="w-full max-w-2xl relative group">
                              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                              <input 
                                type="text" 
                                placeholder="QUERY_NEURAL_DATABASE..."
                                className="w-full bg-white/5 border border-white/5 rounded-full py-6 pl-20 pr-10 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/40 focus:bg-white/10 transition-all placeholder:text-gray-700"
                              />
                           </div>
                           <div className="flex gap-4">
                              <button className="p-6 rounded-full bg-white/5 border border-white/5 hover:border-cyan-500/50 transition-all text-gray-500 hover:text-cyan-400 active:scale-95">
                                 <Bell className="w-7 h-7" />
                              </button>
                              <button className="px-10 py-6 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-full hover:bg-cyan-400 transition-all shadow-2xl active:scale-95">
                                 Initiate Upload
                              </button>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                           {Array.from({ length: 15 }).map((_, i) => (
                             <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => handleVideoSelect({ title: `Archival Node ${i+1000}` })}
                                className="group relative bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-6 hover:bg-white/5 hover:border-cyan-500/20 transition-all cursor-pointer"
                             >
                                <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-8">
                                   <img 
                                    src={`https://picsum.photos/seed/${i + 300}/800/450`} 
                                    alt="Grid Arch"
                                    className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 grayscale group-hover:grayscale-0"
                                   />
                                   <div className="absolute inset-0 bg-cyan-500/10 group-hover:opacity-0 transition-opacity" />
                                   <div className="absolute top-4 right-4 animate-flicker">
                                      <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-cyan-500/30 text-[8px] font-mono text-cyan-400">DATA_LOCKED</div>
                                   </div>
                                </div>

                                <div className="space-y-6">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-purple-700 p-px">
                                         <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center font-black text-[10px]">AI</div>
                                      </div>
                                      <div className="overflow-hidden">
                                         <h4 className="text-white font-black uppercase text-sm tracking-tight truncate group-hover:text-cyan-400 transition-colors">Digital Evolution v{i+12}</h4>
                                         <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">By: Neural_Agent_{i+1}</div>
                                      </div>
                                   </div>
                                   <div className="flex flex-wrap gap-2">
                                      {['CYBER', 'NEURAL', 'HYPER'].map(tag => (
                                         <span key={tag} className="text-[7px] font-mono px-3 py-1 bg-white/5 rounded-full text-gray-500 tracking-widest">{tag}</span>
                                      ))}
                                   </div>
                                </div>
                             </motion.div>
                           ))}
                        </div>

                        {/* INFINITE SCROLL INDICATOR */}
                        <div className="flex justify-center py-20">
                            <motion.div 
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="flex flex-col items-center gap-4 group cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-cyan-500 transition-all">
                                   <ChevronDown className="w-8 h-8 text-gray-600 group-hover:text-cyan-400" />
                                </div>
                                <span className="text-[10px] font-mono text-gray-600 group-hover:text-cyan-400 uppercase tracking-[0.4em]">Decrypting_More_Sequences...</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
             </div>

             {/* ADSTERRA BANNER - CINEMATIC INTEGRATION */}
             <footer className="mt-24 p-20 border-t border-white/5 space-y-12 bg-black/40">
                <div className="text-center space-y-4">
                    <div className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-[0.8em]">Sponsor_Uplink_Module</div>
                    <div className="relative w-full max-w-4xl mx-auto h-48 rounded-[3rem] bg-gradient-to-r from-cyan-500/5 via-cyan-500/10 to-cyan-500/5 border border-white/5 flex flex-col items-center justify-center group cursor-pointer overflow-hidden transition-all hover:border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.05)]">
                        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/ads/1200/300')] bg-cover opacity-10 filter grayscale mix-blend-overlay group-hover:opacity-20 transition-opacity" />
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="absolute -right-24 -bottom-24 w-80 h-80 border border-cyan-500/10 rounded-full"
                        />
                        
                        <div className="relative z-10 flex items-center gap-6 mb-4">
                           <Zap className="w-10 h-10 text-yellow-500 fill-yellow-500 animate-pulse" />
                           <h3 className="text-3xl md:text-5xl font-black text-white tracking-[0.3em] uppercase group-hover:scale-105 transition-transform">Neural_Ads_Sync</h3>
                        </div>
                        <p className="relative z-10 text-xs font-mono text-white/30 uppercase tracking-widest max-w-lg text-center leading-relaxed">
                           High-fidelity commercial synchronizations deployed across the entire neural architecture. Uninterrupted platform experience.
                        </p>
                        <div className="absolute top-6 right-8 flex items-center gap-3">
                           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                           <span className="text-[9px] font-mono text-green-500 uppercase tracking-widest">Adsterra_Uplink_Stable</span>
                        </div>
                    </div>
                </div>
                
                <div className="text-center pt-20">
                   <div className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">© 2026 NEURAL_STREAM_v9.0 // JARVIS_OPERATING_SYSTEM // ARUN_PANGU_CORP</div>
                </div>
             </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL PLAYER */}
      <AnimatePresence>
        {activeVideo && (
           <JarvisPlayer video={activeVideo} onClose={() => setActiveVideo(null)} />
        )}
      </AnimatePresence>

      {/* FLOATING JARVIS ORB */}
      <JarvisAssistant isActive={isVoiceActive} setIsActive={setIsVoiceActive} />
      
      {/* HUD SYSTEM INDICATORS */}
      <div className="fixed top-1/3 left-8 pointer-events-none z-50">
         <div className="flex gap-4">
            <div className="w-1 h-48 bg-gradient-to-b from-cyan-500 to-transparent rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            <div className="space-y-6">
                <div className="space-y-1">
                   <div className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse">Scanning_Environment...</div>
                   <div className="text-white font-black text-xs uppercase tracking-widest">Active_HUD_Render</div>
                </div>
                <div className="space-y-3">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="flex gap-1">
                        {Array.from({ length: i + 2 }).map((_, j) => (
                           <div key={j} className="w-3 h-1 bg-cyan-500" style={{ opacity: 1 - (i * 0.25) }} />
                        ))}
                     </div>
                   ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function JarvisAssistant({ isActive, setIsActive }: { isActive: boolean, setIsActive: (v: boolean) => void }) {
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Simulated Voice Command recognition
  const triggerVoice = () => {
    setIsActive(!isActive);
    if (!isActive) {
        // Mock recognition
        setTimeout(() => {
            setTranscript("Initialize Search for Cyberpunk Sequences");
            setIsAiTyping(true);
            setTimeout(() => {
                setAiResponse("Query understood. Accessing neural archives for Cyberpunk tagged content. Displaying results now.");
                setIsAiTyping(false);
            }, 1000);
        }, 1500);
    } else {
        setTranscript('');
        setAiResponse('');
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-[200] group">
       <AnimatePresence>
          {isActive && (
             <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                className="absolute right-full mr-10 top-1/2 -translate-y-1/2 w-[350px] bg-black/60 backdrop-blur-3xl border border-cyan-500/40 rounded-[2.5rem] p-10 overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.3)]"
             >
                <div className="absolute inset-0 bg-scanlines opacity-[0.03] pointer-events-none" />
                
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#ef4444]" />
                   <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Listening_Command_Input...</span>
                </div>

                <div className="space-y-8 relative z-10">
                   <div className="space-y-2">
                       <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">User_Input:</span>
                       <div className={cn("text-lg font-black text-white uppercase leading-tight italic", !transcript && "opacity-20 animate-pulse")}>
                          {transcript || "Speak now_"}
                       </div>
                   </div>

                   <div className="h-px bg-white/10" />

                   <div className="space-y-4">
                       <span className="text-[8px] font-mono text-cyan-500 uppercase tracking-widest">Jarvis_System_Output:</span>
                       <div className="text-cyan-400 font-bold uppercase tracking-tight leading-relaxed">
                          {isAiTyping ? <div className="flex gap-1 h-4 items-end">{[1, 2, 3].map(i => <div key={i} className="w-1 h-full bg-cyan-400 animate-pulse" />)}</div> : (aiResponse || "Standing by for command instructions.")}
                       </div>
                   </div>

                   {/* Visualizer */}
                   <div className="flex items-end justify-center gap-1 h-12 pt-4">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div
                           key={i}
                           animate={{ height: isActive ? ['20%', `${(i % 3 + 1) * 30}%`, '30%'] : '20%' }}
                           transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                           className="w-1 bg-cyan-500/60 rounded-full"
                        />
                      ))}
                   </div>
                </div>
             </motion.div>
          )}
       </AnimatePresence>

       <button 
         onClick={triggerVoice}
         className="relative w-28 h-28 rounded-full bg-cyan-500/20 p-1 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_80px_rgba(6,182,212,0.6)] hover:border-cyan-400 transition-all active:scale-95 group overflow-hidden"
       >
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center relative">
             {/* ORB RINGS */}
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
               className="absolute inset-2 border-2 border-dashed border-cyan-500/30 rounded-full"
             />
             <motion.div 
               animate={{ rotate: -360 }}
               transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
               className="absolute inset-5 border border-cyan-400/10 rounded-full"
             />
             
             {/* INNER GLOW */}
             <div className="relative z-10 p-5 bg-cyan-500/10 rounded-full group-hover:bg-cyan-500/20 transition-all">
                <Mic className={cn("w-10 h-10 transition-all", isActive ? "text-cyan-400 scale-110" : "text-white group-hover:scale-110")} />
             </div>
             
             {/* BACKGROUND PULSE */}
             <div className={cn("absolute inset-0 bg-cyan-500 opacity-5 shadow-[inset_0_0_40px_rgba(6,182,212,0.3)]", isActive && "animate-flicker opacity-20")} />
          </div>
       </button>

       {/* HUB TAGS */}
       <div className="absolute -top-16 left-1/2 -track-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 whitespace-nowrap">
          <div className="px-5 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full backdrop-blur-2xl text-[10px] font-mono text-cyan-400 font-black uppercase tracking-[0.3em]">
             Voice_Assistance_Core_Beta
          </div>
       </div>
    </div>
  );
}

function Star(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

