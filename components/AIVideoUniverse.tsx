'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, Mic, Camera, Download, X, Maximize2, 
  Settings, Share2, Info, Sparkles, Loader2, 
  Activity, Cpu, Radio, Search, ChevronRight, 
  ChevronLeft, Monitor, Zap, ShieldCheck, 
  Volume2, VolumeX, MessageSquare, Bot,
  Eye, Calendar, Star, TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { tmdb } from '@/lib/tmdb';

// Alien Monitor Scanline Effect
const Scanline = () => (
  <div className="absolute inset-0 pointer-events-none z-50">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
    <motion.div 
      animate={{ top: ['-100%', '100%'] }} 
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute inset-x-0 h-2 bg-cyan-400/20 blur-[10px]"
    />
  </div>
);

// Simulated AI Video Data with infinite generator simulation
// Simulated AI Video Data with informative futuristic loops
const FUTURISTIC_VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-background-with-lines-and-dots-interactive-31623-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-abstract-futuristic-lines-of-light-flowing-in-dark-blue-background-31624-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-glowing-digital-lines-moving-on-a-blue-background-31625-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-neon-lights-and-flying-cars-31626-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-abstract-background-of-flying-digital-numbers-and-letters-31627-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-connecting-network-lines-on-a-dark-blue-background-31628-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-moving-digital-world-map-on-a-dark-blue-background-31629-large.mp4"
];

const generateVideos = (count: number, offset: number) => 
  Array.from({ length: count }, (_, i) => ({
    id: `ai-vid-${offset + i}`,
    title: `[NEURAL_LINK] Stream_${(Math.random() * 9999).toFixed(0)}`,
    nodeId: Math.random().toString(16).slice(2, 8).toUpperCase(),
    thumbnail: `https://picsum.photos/seed/ai-v-${offset + i}/800/450`,
    videoUrl: FUTURISTIC_VIDEOS[(offset + i) % FUTURISTIC_VIDEOS.length],
    duration: `${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 50).toString().padStart(2, '0')}`,
    category: ['SYNTHETIC', 'QUANTUM_CORE', 'NEURO_NET', 'VOID_ASTRO'][Math.floor(Math.random() * 4)],
    views: `${(Math.random() * 500).toFixed(1)}K`,
    description: "Deep neural generation of synthetic reality layers. Optimized for 8K surveillance nodes using real-time packet reconstruction."
  }));

export function AIVideoUniverse({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [videos, setVideos] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [commandText, setCommandText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [subtitle, setSubtitle] = useState('');
  const [particles, setParticles] = useState<any[]>([]);
  const [waveformIndices, setWaveformIndices] = useState<any[]>([]);

  // Fetch movies from TMDB
  const fetchMovies = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await tmdb.getTrending(pageNum);
      const moviesWithDetails = data.results.map((m: any) => ({
        id: m.id,
        title: m.title || m.name,
        overview: m.overview,
        thumbnail: tmdb.getImageUrl(m.backdrop_path || m.poster_path, 'w1280'),
        poster: tmdb.getImageUrl(m.poster_path, 'w500'),
        rating: m.vote_average.toFixed(1),
        release: m.release_date || m.first_air_date,
        views: `${(m.popularity / 10).toFixed(1)}K`,
        category: 'CINEMATIC_RECON'
      }));
      
      setVideos(prev => pageNum === 1 ? moviesWithDetails : [...prev, ...moviesWithDetails]);
      
      if (pageNum === 1 && moviesWithDetails.length > 0) {
        setActiveVideo(moviesWithDetails[0]);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMovies(1);
      
      // Initialize particles
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
    }
  }, [isOpen, fetchMovies]);

  // Fetch trailer for active video
  useEffect(() => {
    if (activeVideo?.id) {
      const getTrailer = async () => {
        const details = await tmdb.getMovieDetails(activeVideo.id);
        const trailer = details.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
        setActiveTrailerKey(trailer?.key || null);
        setIsPlaying(true);
      };
      getTrailer();
    }
  }, [activeVideo]);

  // Subtitle Simulation
  useEffect(() => {
    if (!isPlaying) return;
    
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
    
    return () => {
      clearInterval(interval);
      setSubtitle('');
    };
  }, [isPlaying]);

  // Infinite Scroll Simulation
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (mainVideoRef.current) {
      if (isPlaying) {
        mainVideoRef.current.play().catch(() => {});
      } else {
        mainVideoRef.current.pause();
      }
    }
  }, [isPlaying]);
  const handleScroll = () => {
    if (!scrollContainerRef.current || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 300) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
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
          
          {/* HERO PLAYER SECTION (ALIEN MONITOR) */}
          {activeVideo ? (
            <motion.section 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative w-full aspect-video rounded-[32px] overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_80px_rgba(6,182,212,0.3)] bg-black group/hero"
            >
              <div className="absolute inset-0 pointer-events-none z-[60] border-[16px] border-black/40 ring-1 ring-cyan-500/30" />
              {activeTrailerKey && isPlaying ? (
                <div className="absolute inset-0 z-0 scale-105 pointer-events-none">
                  <iframe 
                    src={`https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&loop=1&playlist=${activeTrailerKey}&rel=0`}
                    className="w-full h-full object-cover"
                    allow="autoplay; encrypted-media"
                    title={activeVideo.title}
                  />
                  <div className="absolute inset-0 bg-cyan-900/10 mix-blend-color" />
                </div>
              ) : (
                <Image 
                  src={activeVideo.thumbnail}
                  alt={activeVideo.title}
                  fill
                  className="object-cover opacity-60 grayscale scale-110"
                  referrerPolicy="no-referrer"
                />
              )}
              
              {/* Alien Monitor HUD Elements */}
              <Scanline />
              
              <div className="absolute inset-0 z-[10] flex flex-col justify-between p-8 pointer-events-none">
                {/* Top Corner HUD */}
                <div className="flex justify-between items-start">
                  <div className="bg-black/80 backdrop-blur-md border-l-2 border-cyan-500 p-4 rounded-r-xl space-y-1 max-w-lg">
                    <div className="flex items-center gap-2 text-[8px] font-mono text-cyan-400">
                      <motion.div 
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                      />
                      NEURAL_UPLINK_STABLE [0x{activeVideo.id.toString(16).toUpperCase()}]
                    </div>
                    <div className="text-xl lg:text-3xl font-black uppercase italic tracking-widest text-white leading-none truncate">{activeVideo.title}</div>
                    <div className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-[0.3em]">SEC_COORD: 45.92 / -122.34</div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div 
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                          className="w-1 h-4 bg-cyan-500"
                        />
                      ))}
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-[0.4em]">DEEP_SPACE_NODE_9</div>
                  </div>
                </div>

                <div className="flex justify-between items-end pb-32">
                   <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl max-w-lg shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1.5 text-cyan-400">
                           <TrendingUp className="w-3.5 h-3.5" />
                           <span className="text-sm font-black tracking-tighter">{activeVideo.rating} RATING</span>
                        </div>
                        <div className="w-[1px] h-3 bg-cyan-500/20" />
                        <div className="flex items-center gap-1.5 text-white/40">
                           <Calendar className="w-3.5 h-3.5" />
                           <span className="text-[10px] uppercase font-mono tracking-widest">{activeVideo.release}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/60 font-mono leading-relaxed transition-all group-hover:text-cyan-100 uppercase tracking-tight line-clamp-3">
                        {activeVideo.overview}
                      </p>
                   </div>

                   <div className="flex flex-col items-center gap-4">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="relative w-32 h-32 flex items-center justify-center font-mono text-cyan-400/60 text-[10px] font-black"
                      >
                         <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full border-t-cyan-500" />
                         <div className="absolute inset-4 border border-cyan-500/10 rounded-full border-b-cyan-400/40" />
                         SCANNING...
                      </motion.div>
                   </div>
                </div>
              </div>




                   {/* Alien Monitor Controls Bar */}
                   <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 bg-black/80 backdrop-blur-3xl border border-cyan-500/30 p-4 lg:p-6 rounded-[24px] shadow-[0_0_50px_rgba(0,0,0,1)] hover:border-cyan-400 transition-colors pointer-events-auto">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] group/p shrink-0"
                      >
                         {isPlaying ? <Pause className="w-8 h-8 fill-black" /> : <Play className="w-8 h-8 fill-black translate-x-1" />}
                      </motion.button>
                      
                      <div className="flex-1 w-full space-y-4">
                         <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400">
                            <span className="flex items-center gap-2 italic font-black uppercase">
                              <Activity className="w-3 h-3" /> BUFFER_SYNC: {progress.toFixed(1)}%
                            </span>
                            <span className="opacity-40 hidden sm:block">SYSTEM: J.A.R.V.I.S_V4.0</span>
                         </div>
                         <div className="h-2 bg-white/5 rounded-full relative overflow-hidden">
                            <motion.div 
                               className="absolute inset-y-0 left-0 bg-transparent"
                               style={{ width: `${progress}%` }}
                            >
                              <div className="w-full h-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,1)]" />
                            </motion.div>
                         </div>
                      </div>

                      <div className="flex items-center gap-4 lg:gap-8 shrink-0 w-full lg:w-auto justify-between lg:justify-start">
                         <div className="flex items-center gap-4 text-cyan-400/60">
                            <button onClick={() => setIsMuted(!isMuted)} className="hover:text-cyan-400 transition-colors">
                               {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>
                            <div className="w-20 h-1 bg-white/10 rounded-full relative overflow-hidden hidden sm:block">
                               <div className="absolute inset-y-0 left-0 bg-cyan-500 w-[80%]" />
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <button 
                              onClick={() => toast.success('Targeting Data Exported')}
                              className="flex items-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl hover:bg-cyan-500 hover:text-black transition-all group/b"
                            >
                               <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                               <span className="text-[10px] font-black uppercase tracking-widest leading-none">Export Stats</span>
                            </button>
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
                  whileHover={{ y: -10 }}
                  onClick={() => {
                    setActiveVideo(video);
                    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative cursor-pointer"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-cyan-500/20 transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] group-hover:border-cyan-400 bg-black/40">
                    <Image 
                      src={video.thumbnail} 
                      alt={video.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:via-cyan-500/5 transition-colors" />
                    
                    {/* Neural Scan Line (Futuristic Effect) */}
                    <div className="absolute top-2 left-2 z-20 flex gap-2">
                      <div className="px-2 py-0.5 bg-black/60 rounded text-[8px] font-mono text-cyan-400 border border-cyan-500/30">
                        HD_RECON
                      </div>
                    </div>

                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-black font-mono border border-white/10 text-cyan-400">
                       {video.rating} ★
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <h4 className="text-sm font-black uppercase tracking-wide text-white/90 line-clamp-1 italic group-hover:text-cyan-400 transition-colors">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-[8px] font-mono text-white/40 uppercase tracking-widest">
                      <span>{video.category}</span>
                      <span>{video.views} NODES</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {loading && Array.from({ length: 4 }).map((_, i) => (
                <div key={`loader-${i}`} className="aspect-video rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>

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
