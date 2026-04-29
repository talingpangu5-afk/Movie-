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
    description: "Deep neural generation of synthetic reality layers. Optimized for 8K surveillance nodes."
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
    if (isPlaying) {
      const subs = [
        "Analyzing packet fragments...",
        "Neural sync established at 98.4%",
        "Decrypting visual metadata layer 4",
        "Bio-synthetic signatures detected",
        "Rebuilding frame buffer 0x82A",
        "Quantum superposition resolved",
      ];
      const interval = setInterval(() => {
        setSubtitle(subs[Math.floor(Math.random() * subs.length)]);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      const timer = setTimeout(() => {
        setSubtitle('');
      }, 0);
      return () => clearTimeout(timer);
    }
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
      // Simulate command recognition
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
      initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      className="fixed inset-0 z-[1000] bg-[#020617] text-white overflow-hidden flex flex-col font-sans"
      style={{ perspective: "1000px" }}
    >
      {/* JARVIS STYLE BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] opacity-50" />
        <div className="absolute inset-0 bg-[#020617]" />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)', 
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black, transparent)'
          }} 
        />

        {/* Floating Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              x: p.x, 
              y: p.y,
              opacity: p.opacity 
            }}
            animate={{ 
              y: [null, p.yTo],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* HEADER HUD */}
      <div className="relative z-10 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/20 border border-cyan-500/30 rounded-xl backdrop-blur-xl">
             <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-[0.2em] italic">Neural Stream Alpha</h1>
            <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-500/60 uppercase">
               <Activity className="w-3 h-3" />
               Synced: 0x82_NODE_PLATFORM
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden md:flex flex-col items-end font-mono text-[9px] text-cyan-500/40 uppercase tracking-widest">
              <span>Encryption: Quantum_ECC_256</span>
              <span className="text-cyan-400/80 animate-pulse">Stream_Live: 144Hz</span>
           </div>
           <button 
             onClick={onClose}
             className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-red-500 hover:text-black transition-all group lg:scale-110"
           >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
           </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row p-6 pt-0 gap-8 min-h-0 overflow-hidden">
        
        {/* LEFT SIDEBAR: GRID OF VIDEOS */}
        <div className="w-full lg:w-80 h-full flex flex-col gap-4 overflow-hidden order-2 lg:order-1">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">Neural Feed</h2>
            <div className="flex gap-2">
              <Search className="w-4 h-4 text-white/40 cursor-pointer hover:text-cyan-400 transition-colors" />
              <Info className="w-4 h-4 text-white/40 cursor-pointer hover:text-cyan-400 transition-colors" />
            </div>
          </div>
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar pb-20 lg:pb-0"
          >
             {videos.map((video) => (
                <motion.div
                  key={video.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveVideo(video)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all p-1 ${
                    activeVideo?.id === video.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                    <Image 
                      src={video.thumbnail} 
                      alt={video.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-xl" />
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-md rounded text-[9px] font-mono font-bold">
                       {video.duration}
                    </div>
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-tight line-clamp-1 mb-1">{video.title}</h3>
                    <div className="flex justify-between items-center text-[8px] font-mono text-cyan-500/50">
                       <span>{video.category}</span>
                       <span>{video.views} Views</span>
                    </div>
                  </div>
                </motion.div>
             ))}

             {/* Adsterra Grid Banner */}
             <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-center">
                <div className="text-[8px] font-mono text-indigo-400 mb-2 uppercase">Sponsored_Network_Uplink</div>
                <div className="text-[10px] font-black text-white uppercase mb-3">Strategic Partner Distribution</div>
                <div className="w-full h-24 bg-black/20 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                   <Zap className="w-8 h-8 text-indigo-500/20 absolute -right-2 -bottom-2" />
                   <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Adsterra High CPM Node</span>
                </div>
             </div>
          </div>
        </div>

        {/* MAIN VIDEO PLAYER: HOLOGRAPHIC STYLE */}
        <div className="flex-1 h-full flex flex-col gap-6 order-1 lg:order-2 overflow-hidden">
           {activeVideo ? (
             <div className="relative flex-1 rounded-3xl overflow-hidden bg-black/40 border-2 border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)] group/player">
              <Image 
                src={activeVideo.thumbnail} 
                alt="Active Stream" 
                fill 
                className={`object-cover transition-all duration-1000 ${isPlaying ? 'scale-105' : 'scale-100 blur-sm'} opacity-60`} 
                referrerPolicy="no-referrer"
              />
              
              {/* GLASS HUD OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-black/80 pointer-events-none" />
              
              {/* DYNAMIC LIGHTING REACTING TO VIDEO */}
              <motion.div 
                animate={{ 
                  opacity: isPlaying ? [0.1, 0.3, 0.1] : 0,
                  boxShadow: isPlaying ? ["0 0 100px rgba(6,182,212,0.2)", "0 0 150px rgba(6,182,212,0.3)", "0 0 100px rgba(6,182,212,0.2)"] : "none"
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 pointer-events-none" 
              />
              
              {/* SCAN LINES */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 3px, white 4px)', backgroundSize: '100% 4px' }} />

              <div className="absolute inset-0 flex flex-col justify-between p-8">
                 <div className="flex justify-between items-start">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl">
                       <div className="flex items-center gap-3 mb-1">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <h2 className="text-lg font-black uppercase tracking-widest">{activeVideo.title}</h2>
                       </div>
                       <div className="text-[9px] font-mono text-cyan-500 uppercase tracking-[0.2em]">Live Stream Channel_0x42</div>
                    </div>

                    <div className="flex gap-3">
                       <button className="w-12 h-12 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all">
                          <Share2 className="w-5 h-5" />
                       </button>
                       <button className="w-12 h-12 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all">
                          <Settings className="w-5 h-5" />
                       </button>
                    </div>
                 </div>

                 {/* CENTER PLAY BUTTON (Glows when paused) */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <AnimatePresence>
                       {!isPlaying && (
                          <motion.button
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            onClick={() => setIsPlaying(true)}
                            className="w-24 h-24 rounded-full bg-cyan-500/10 border-2 border-cyan-500/50 flex items-center justify-center pointer-events-auto shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md"
                          >
                             <Play className="w-10 h-10 text-cyan-400 fill-cyan-400" />
                          </motion.button>
                       )}
                    </AnimatePresence>
                 </div>

                 <div className="space-y-6">
                    {/* HOLOGRAPHIC CONTROLS */}
                    <div className="flex items-center gap-6 bg-black/40 backdrop-blur-2xl border border-white/5 p-4 rounded-3xl pointer-events-auto">
                       <button 
                         onClick={() => setIsPlaying(!isPlaying)}
                         className="w-14 h-14 rounded-2xl bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:scale-105 transition-all"
                       >
                          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                       </button>

                       <div className="flex-1 space-y-2">
                          <div className="flex justify-between text-[10px] font-mono text-cyan-500/80 uppercase">
                             <span>{(progress * 2).toFixed(2)} / 100.00 Neural_Sync</span>
                             <span>4K_60FPS_BITRATE: 48.2 MBPS</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                             <motion.div 
                               className="absolute inset-y-0 left-0 bg-cyan-500" 
                               animate={{ width: `${progress}%` }}
                               transition={{ ease: "linear" }}
                             />
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                          </div>
                       </div>

                       <div className="flex gap-4">
                          <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-cyan-400">
                             {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                          </button>
                          <button className="text-white/60 hover:text-cyan-400">
                             <Maximize2 className="w-6 h-6" />
                          </button>
                       </div>
                    </div>

                    <div className="flex justify-between items-end">
                       {/* AI SUBTITLES */}
                       <div className="max-w-[60%] pointer-events-none">
                          <AnimatePresence>
                             {subtitle && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-cyan-500/20"
                                >
                                   <div className="text-[8px] font-mono text-cyan-500/60 uppercase mb-1">AI_GENERATED_SUBTITLES</div>
                                   <p className="text-sm font-black text-white italic tracking-tight">{subtitle}</p>
                                </motion.div>
                             )}
                          </AnimatePresence>
                       </div>

                       {/* ACCESS BUTTONS */}
                       <div className="flex gap-4">
                          <button 
                            onClick={() => toast.success('NEURAL_SNAP: Screenshot captured and saved to cluster.')}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500 hover:text-black transition-all text-[10px] font-black uppercase tracking-widest group"
                          >
                             <Camera className="w-4 h-4 group-hover:scale-110" />
                             Capture
                          </button>
                          <button 
                            onClick={() => toast.info('DAT_STREAM_SECURE: Download initialized. Please wait for neural verification...')}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500 hover:text-black transition-all text-[10px] font-black uppercase tracking-widest group"
                          >
                             <Download className="w-4 h-4 group-hover:scale-110" />
                             Download
                          </button>
                       </div>

                       {/* AI AVATAR / JARVIS BOSS */}
                       <div className="flex items-center gap-4 relative">
                          <div className="text-right">
                             <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Bot_J.A.R.V.I.S</div>
                             <div className="text-[8px] font-mono text-cyan-500/40 uppercase">Awaiting Commands...</div>
                          </div>
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="relative w-16 h-16"
                          >
                             <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full" />
                             <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full" />
                             <div className="absolute inset-3 bg-cyan-500/10 rounded-full flex items-center justify-center group overflow-hidden cursor-pointer hover:bg-cyan-500 transition-all">
                                <Bot className="w-6 h-6 text-cyan-400 group-hover:text-black" />
                             </div>
                          </motion.div>
                          
                          {/* Pulse Ring */}
                          <motion.div 
                             animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                             transition={{ duration: 2, repeat: Infinity }}
                             className="absolute right-0 top-0 w-16 h-16 border border-cyan-400 rounded-full pointer-events-none"
                          />
                       </div>
                    </div>
                 </div>
              </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center bg-black/40 border-2 border-dashed border-cyan-500/20 rounded-3xl">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                <p className="text-xs font-mono text-cyan-500/60 uppercase tracking-widest animate-pulse">Initializing Neural Link...</p>
             </div>
           )}

           {/* BOTTOM FEATURE PANEL: VOICE & COMMANDS */}
           <div className="flex flex-col gap-4 shrink-0">
              {/* Adsterra Player Banner */}
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-indigo-500/20 transition-all">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                       <Zap className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                       <div className="text-[8px] font-mono text-indigo-400/60 uppercase">Adsterra_Link_09</div>
                       <div className="text-[10px] font-black text-white uppercase tracking-wider">Dynamic Revenue Protocol Multi-CPM</div>
                    </div>
                 </div>
                 <div className="text-[9px] font-mono text-white/40 group-hover:text-white transition-colors">ADSTERRA_NETWORK {">>" }</div>
              </div>

              <div className="h-32 flex divide-x divide-white/5 border border-white/5 bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden">
              <div className="flex-1 p-6 flex items-center gap-6">
                 <button 
                  onClick={toggleListening}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isListening ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.4)] text-black'
                  }`}
                 >
                    <Mic className={`w-8 h-8 ${isListening ? 'animate-pulse text-white' : ''}`} />
                 </button>
                 <div className="space-y-1">
                    <div className="text-xs font-black uppercase text-white/80 tracking-widest">Neural Voice Interface</div>
                    <div className="text-[10px] font-mono text-cyan-500 flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-green-500 opacity-40'}`} />
                       {commandText || 'Voice Authentication Ready...'}
                    </div>
                 </div>
                 {isListening && (
                    <div className="flex-1 flex gap-1 items-end h-8 overflow-hidden">
                       {waveformIndices.map((wave) => (
                          <motion.div
                            key={wave.id}
                            animate={{ height: [4, wave.maxHeight, 4] }}
                            transition={{ duration: 0.3, repeat: Infinity, delay: wave.delay }}
                            className="w-1 bg-cyan-500/60 rounded-t-full"
                          />
                       ))}
                    </div>
                 )}
              </div>

              <div className="w-1/3 p-6 flex flex-col justify-center gap-2">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Uplink Verified</span>
                 </div>
                 <p className="text-[8px] font-mono text-white/40 uppercase">Session_Token: 0x82_9281_A82_19</p>
                 <div className="flex gap-2">
                    <div className="w-2 h-2 bg-cyan-400" />
                    <div className="w-2 h-2 bg-cyan-400 opacity-60" />
                    <div className="w-2 h-2 bg-cyan-400 opacity-20" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* FOOTER: SPONSOR & RECENT SEARCHES */}
      <div className="relative z-10 p-6 flex justify-between items-center bg-gradient-to-t from-black to-transparent border-t border-white/5">
         <div className="flex items-center gap-8 text-[10px] font-mono text-white/40 uppercase">
            <span>Recent: Quantum_Reality_Scan</span>
            <span>Nebula_Sync_03</span>
            <span>Bios_Arch_Live</span>
         </div>

         <div className="flex items-center gap-4 bg-cyan-500/10 border border-cyan-500/20 px-6 py-3 rounded-2xl group cursor-pointer hover:border-cyan-400 transition-all">
            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
            <div className="text-left">
               <div className="text-[8px] text-cyan-500/40 uppercase leading-none mb-1">Adsterra_Prime_Node</div>
               <div className="text-[10px] font-black text-white uppercase tracking-tighter">Strategic Ads Distribution v9.1</div>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-500 group-hover:translate-x-1 transition-transform" />
         </div>
      </div>
    </div>
    </motion.div>
  );
}
