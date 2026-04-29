'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Mic, Camera, Download, X, Maximize2, 
  Settings, Share2, Info, Sparkles, Loader2, 
  Activity, Cpu, Radio, Search, ChevronRight, 
  ChevronLeft, Monitor, Zap, ShieldCheck, 
  Volume2, VolumeX, MessageSquare, Bot
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

// Simulated AI Video Data with infinite generator simulation
const generateVideos = (count: number, offset: number) => 
  Array.from({ length: count }, (_, i) => ({
    id: `ai-vid-${offset + i}`,
    title: `[NEURAL_LINK] Stream_${(Math.random() * 9999).toFixed(0)}`,
    thumbnail: `https://picsum.photos/seed/ai-v-${offset + i}/800/450`,
    duration: `${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 50).toString().padStart(2, '0')}`,
    category: ['SYNTHETIC', 'QUANTUM_CORE', 'NEURO_NET', 'VOID_ASTRO'][Math.floor(Math.random() * 4)],
    views: `${(Math.random() * 500).toFixed(1)}K`,
    description: "Deep neural generation of synthetic reality layers. Optimized for 8K surveillance nodes using real-time packet reconstruction."
  }));

export function AIVideoUniverse({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [videos, setVideos] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [commandText, setCommandText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [subtitle, setSubtitle] = useState('');
  const [particles, setParticles] = useState<any[]>([]);
  const [waveformIndices, setWaveformIndices] = useState<any[]>([]);

  // Initialize random values on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideos(generateVideos(20, 0));
      setParticles(Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5,
        yTo: `${Math.random() * 100}%`,
        duration: 10 + Math.random() * 10
      })));

      setWaveformIndices(Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        maxHeight: Math.random() * 24 + 4,
        delay: i * 0.02
      })));
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  
  // Set initial active video
  useEffect(() => {
    if (!activeVideo && videos.length > 0) {
      const timer = setTimeout(() => {
        setActiveVideo(videos[0]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [videos, activeVideo]);

  // Subtitle Simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      const subs = [
        "Analyzing packet fragments...",
        "Neural sync established at 98.4%",
        "Decrypting visual metadata layer 4",
        "Bio-synthetic signatures detected",
        "Rebuilding frame buffer 0x82A",
        "Quantum superposition resolved",
      ];
      interval = setInterval(() => {
        setSubtitle(subs[Math.floor(Math.random() * subs.length)]);
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      setSubtitle('');
    };
  }, [isPlaying]);

  // Infinite Scroll Simulation
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setVideos(prev => [...prev, ...generateVideos(10, prev.length)]);
    }
  };

  // Simulated Voice Command Logic
  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setCommandText('Listening for Neural Input...');
      setTimeout(() => {
        const commands = ["Play next video", "Search AI space videos", "Mute audio"];
        const recognized = commands[Math.floor(Math.random() * commands.length)];
        setCommandText(`Command Identified: "${recognized}"`);
        
        setTimeout(() => {
           setIsListening(false);
           setCommandText('');
           if (recognized === "Play next video") {
              const currentIdx = videos.findIndex(v => v.id === activeVideo.id);
              setActiveVideo(videos[(currentIdx + 1) % videos.length]);
           }
        }, 2000);
      }, 3000);
    }
  };

  // Progress Bar Simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      className="fixed inset-0 z-[1000] bg-[#0b0f1a] text-white overflow-hidden flex flex-col font-sans"
    >
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-cyan-500/10 to-transparent" />
        <div className="absolute inset-0 bg-[#0b0f1a]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Animated Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: p.opacity }}
            animate={{ y: [null, p.yTo], opacity: [0, 1, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* HEADER HUD */}
      <div className="relative z-[20] px-6 lg:px-12 py-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 180 }}
            className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl backdrop-blur-xl"
          >
             <Cpu className="w-6 h-6 text-cyan-400" />
          </motion.div>
          <div className="hidden sm:block">
            <h1 className="text-xl lg:text-2xl font-black uppercase tracking-[0.3em] text-white italic">Neural Stream <span className="text-cyan-500">Alpha</span></h1>
            <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-500/60 uppercase">
               <Activity className="w-3 h-3" />
               Synced: SYSTEM_UPTIME_99.98%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden lg:flex gap-8">
              {['Home', 'Streams', 'Labs', 'Global Node'].map((item) => (
                <button key={item} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors">
                  {item}
                </button>
              ))}
           </div>
           <button 
             onClick={onClose}
             className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-red-500 hover:border-red-400 hover:text-black transition-all group lg:scale-110"
           >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
           </button>
        </div>
      </div>

      {/* MAIN SCROLLABLE AREA */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative z-10 flex-1 overflow-y-auto no-scrollbar scroll-smooth"
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 space-y-12 lg:space-y-20 pb-32">
          
          {/* HERO PLAYER SECTION */}
          {activeVideo ? (
            <motion.section 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative w-full aspect-video rounded-[24px] lg:rounded-[32px] overflow-hidden border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] bg-black group/hero"
            >
              <Image 
                src={activeVideo.thumbnail} 
                alt="Active Stream" 
                fill 
                className={`object-cover transition-all duration-1000 ${isPlaying ? 'scale-105' : 'scale-100 blur-sm'} opacity-60`} 
                priority
                referrerPolicy="no-referrer"
              />
              
              {/* Dynamic Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-transparent to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f1a]/80 via-transparent to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-between p-6 lg:p-12">
                <div className="flex justify-between items-start">
                   <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="max-w-xl space-y-2 lg:space-y-4"
                   >
                      <div className="flex items-center gap-3">
                         <span className="px-2 py-1 bg-red-500 text-[8px] font-black uppercase tracking-widest rounded animate-pulse text-white">LIVE</span>
                         <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em]">{activeVideo.category}</span>
                      </div>
                      <h2 className="text-2xl lg:text-5xl font-black uppercase tracking-tight leading-none italic drop-shadow-2xl">{activeVideo.title}</h2>
                      <p className="text-white/60 text-xs lg:text-sm font-medium line-clamp-2 max-w-md hidden sm:block">{activeVideo.description}</p>
                   </motion.div>

                   <div className="flex gap-4">
                      <button onClick={() => toast.success('Link Secured')} className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-md">
                         <Share2 className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-md focus:outline-none">
                         <Settings className="w-5 h-5" />
                      </button>
                   </div>
                </div>

                <div className="space-y-4 lg:space-y-8">
                   {/* Centered Subtitles */}
                   <div className="flex justify-center h-12">
                      <AnimatePresence>
                         {subtitle && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.1 }}
                              className="bg-black/90 backdrop-blur-2xl px-6 py-2 rounded-full border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                            >
                               <p className="text-sm lg:text-base font-black text-white tracking-tight italic">{subtitle}</p>
                            </motion.div>
                         )}
                      </AnimatePresence>
                   </div>

                   {/* Holographic Controls Bar */}
                   <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 bg-black/80 backdrop-blur-3xl border border-white/10 p-4 lg:p-6 rounded-[24px] lg:rounded-[32px]">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 lg:w-20 lg:h-20 rounded-2xl bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:scale-105 transition-all shrink-0"
                      >
                         {isPlaying ? <Pause className="w-8 h-8 fill-black" /> : <Play className="w-8 h-8 fill-black translate-x-0.5" />}
                      </button>

                      <div className="flex-1 w-full space-y-4">
                         <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                            <span>NEURAL_SYNC: {(progress * 0.42).toFixed(2)} GB</span>
                            <span className="hidden sm:block text-white/40">NODE_STATUS: OPTIMIZED_Surveillance_SYNC</span>
                         </div>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                            <motion.div 
                              className="absolute inset-y-0 left-0 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,1)]" 
                              animate={{ width: `${progress}%` }}
                              transition={{ ease: "linear" }}
                            />
                         </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 w-full lg:w-auto justify-between lg:justify-start">
                         <div className="flex items-center gap-4 text-white/60">
                            <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition-colors">
                               {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>
                            <div className="w-20 h-1 bg-white/10 rounded-full relative overflow-hidden hidden sm:block">
                               <div className="absolute inset-y-0 left-0 bg-white w-[80%]" />
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <button className="p-3 bg-white/5 rounded-xl text-white/60 hover:text-cyan-400 border border-white/5">
                               <Maximize2 className="w-5 h-5" />
                            </button>
                            <button className="hidden sm:flex items-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl hover:bg-cyan-500 hover:text-black transition-all">
                               <Bot className="w-5 h-5" />
                               <span className="text-[10px] font-black uppercase tracking-widest">Connect AI</span>
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.section>
          ) : (
            <div className="aspect-video w-full rounded-[32px] bg-white/5 animate-pulse flex items-center justify-center">
               <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            </div>
          )}

          {/* GRID FEED SECTION */}
          <section className="space-y-8 lg:space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-8 gap-4 px-2">
              <div className="space-y-1">
                <h3 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tighter">Neural Stream <span className="text-cyan-500">Feed</span></h3>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Quantum Lattice: Global Node Ingestion [ACTIVE_0x92]</p>
              </div>
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400">
                  <Activity className="w-4 h-4 animate-pulse" />
                  Live Nodes: 1,482
                </button>
                <div className="w-px h-4 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors cursor-pointer">
                  <Monitor className="w-4 h-4" />
                  Grid Browse
                </div>
              </div>
            </div>

            {/* RESPONSIVE GRID LAYOUT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => {
                    setActiveVideo(video);
                    setIsPlaying(true);
                    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative cursor-pointer"
                >
                  {/* Premium OTT-Style Card */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/5 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] group-hover:border-cyan-500/40 bg-black/40">
                    <Image 
                      src={video.thumbnail} 
                      alt={video.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    
                    {/* Hover Play Glow */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.8)] scale-75 group-hover:scale-100 transition-transform">
                         <Play className="w-6 h-6 text-black fill-black" />
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-black font-mono border border-white/10">
                       {video.duration}
                    </div>
                  </div>

                  {/* Card Metadata */}
                  <div className="mt-5 space-y-3 px-1">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-base font-black uppercase tracking-tight text-white/90 line-clamp-1 group-hover:text-cyan-400 transition-colors italic">
                        {video.title}
                      </h4>
                      <Zap className="w-4 h-4 text-cyan-500/40 shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded uppercase tracking-widest">{video.category}</span>
                      <span className="text-white/30 uppercase">{video.views} NODES</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* DYNAMIC SPONSORED GRID ITEM */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 flex flex-col items-center justify-center p-8 text-center group cursor-pointer"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] opacity-50" />
                <Zap className="w-12 h-12 text-indigo-400 mb-4 animate-pulse scale-125" />
                <div className="relative z-10 space-y-3">
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Integrated_Uplink</div>
                  <h4 className="text-xl font-black uppercase tracking-tighter text-white">Strategic Partner distribution</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Connect to Adsterra high-CPM node</p>
                  <button className="mt-4 px-8 py-3 bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)] rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:scale-105 transition-all">
                    UPGRADE_LINK
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>

      {/* DASHBOARD BOTTOM HUD */}
      <div className="relative z-20 bg-black/95 backdrop-blur-3xl border-t border-white/5 lg:h-32 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10 overflow-hidden shrink-0">
         <div className="flex-1 p-6 flex items-center gap-8 group">
            <button 
              onClick={toggleListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all relative shrink-0 ${
                isListening ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.6)]' : 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400'
              }`}
            >
               <Mic className={`w-8 h-8 ${isListening ? 'animate-pulse text-white' : ''}`} />
               {isListening && (
                 <motion.div 
                   animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                   transition={{ duration: 1.5, repeat: Infinity }}
                   className="absolute inset-0 border-4 border-red-400 rounded-full"
                 />
               )}
            </button>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Neural Voice Protocol</span>
                  <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-green-500 opacity-40'}`} />
               </div>
               <div className="text-xs font-mono text-cyan-500 truncate uppercase tracking-tighter">
                  {commandText || 'READY_FOR_NEURAL_VOICE_AUTHENTICATION_...'}
               </div>
            </div>
            {isListening && (
              <div className="hidden md:flex gap-1 items-end h-10 px-4">
                 {waveformIndices.slice(0, 20).map((wave) => (
                    <motion.div
                      key={wave.id}
                      animate={{ height: [4, wave.maxHeight, 4] }}
                      transition={{ duration: 0.3, repeat: Infinity, delay: wave.delay }}
                      className="w-1 bg-cyan-500 rounded-t-full shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                    />
                 ))}
              </div>
            )}
         </div>

         <div className="w-full lg:w-[450px] p-6 flex justify-between items-center bg-cyan-500/5 group transition-colors hover:bg-cyan-500/10">
            <div className="flex items-center gap-6">
               <div className="relative w-16 h-16 shrink-0">
                  <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-spin-slow" />
                  <div className="absolute inset-3 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/40">
                     <Bot className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
               </div>
               <div>
                  <div className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">Bot_J.A.R.V.I.S</div>
                  <div className="text-[9px] font-mono text-cyan-500/40 uppercase">Cluster_Awaiting_Node_Command</div>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => toast.success('Neuro-Snap Captured')} className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all">
                  <Camera className="w-5 h-5" />
               </button>
               <button onClick={() => toast.info('Neural Uplink Initialized')} className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all">
                  <Download className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
