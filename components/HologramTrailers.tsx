'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Volume2, VolumeX, Info, Sparkles, Loader2, AlertCircle, ChevronLeft, ChevronRight, Monitor, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { tmdb, Movie } from '@/lib/tmdb';

const FIXED_PARTICLES = [
  { id: 1, x: "15%", y: "10%", duration: 12 },
  { id: 2, x: "85%", y: "20%", duration: 15 },
  { id: 3, x: "45%", y: "80%", duration: 10 },
  { id: 4, x: "70%", y: "40%", duration: 18 },
  { id: 5, x: "20%", y: "60%", duration: 14 },
  { id: 6, x: "90%", y: "75%", duration: 11 },
  { id: 7, x: "5%", y: "90%", duration: 20 },
  { id: 8, x: "30%", y: "5%", duration: 13 },
  { id: 9, x: "60%", y: "35%", duration: 16 },
  { id: 10, x: "80%", y: "85%", duration: 12 },
];

interface TrailerCardProps {
  movie: Movie;
  isActive: boolean;
  onPlay: () => void;
  onEnded: () => void;
}

function TrailerCard({ movie, isActive, onPlay, onEnded }: TrailerCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fetchTrailer = useCallback(async () => {
    if (trailerKey) return trailerKey;
    setIsLoading(true);
    try {
      const data = await tmdb.getMovieDetails(movie.id.toString());
      const trailer = data.videos?.results?.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        setTrailerKey(trailer.key);
        return trailer.key;
      } else {
        setError("Trailer not available");
        return null;
      }
    } catch (err) {
      setError("Failed to load trailer");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [movie.id, trailerKey]);

  const handleInteraction = async () => {
    if (!isActive) {
      const key = await fetchTrailer();
      if (key) onPlay();
    } else {
      setIsMuted(!isMuted);
    }
  };

  // Listen for YouTube API messages to detect end of video
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === "infoDelivery" && data.info?.playerState === 0) {
          onEnded();
        }
      } catch (e) {}
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onEnded]);

  return (
    <div className="relative pt-10 pb-20 px-4 group/card">
      {/* Holographic Projector Base */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-8 bg-cyan-500/10 blur-xl rounded-full animate-pulse z-0" />
      <motion.div 
        animate={{ 
          opacity: isHovered || isActive ? 0.8 : 0.3,
          scaleX: isHovered || isActive ? 1.2 : 1
        }}
        className="absolute bottom-18 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-0"
      />
      
      {/* Light Projection Beam */}
      <motion.div 
        animate={{ 
          opacity: isHovered || isActive ? 0.2 : 0,
          scale: isHovered || isActive ? 1 : 0.8
        }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-96 bg-[conic-gradient(from_0deg_at_50%_100%,transparent_160deg,rgba(34,211,238,0.2)_180deg,transparent_200deg)] mix-blend-screen overflow-hidden pointer-events-none z-0 origin-bottom blur-2xl"
      />

      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleInteraction}
        whileHover={{ 
          scale: 1.05, 
          rotateY: 15, 
          rotateX: 5,
          y: -20,
          boxShadow: "0 20px 50px rgba(6,182,212,0.3)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative z-10 min-w-[300px] md:min-w-[340px] aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer bg-black/40 border-2 transition-all duration-700 select-none ${
          isActive 
            ? 'border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.5)]' 
            : 'border-cyan-500/20 backdrop-blur-sm'
        }`}
      >
        {/* Holographic Glitch Mask */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 bg-cyan-500/0 group-hover/card:bg-cyan-500/5 transition-colors" />
          <motion.div 
            animate={{ y: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-[2px] bg-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          />
          {/* Digital Noise Grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
        </div>

        {/* Poster Image */}
        <div className={`absolute inset-0 z-10 transition-transform duration-700 ${isActive ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
          <Image
            src={tmdb.getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Gradient Reveal */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        {/* Video Preview / Iframe */}
        <div className={`absolute inset-0 z-10 transition-all duration-700 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          {isActive && trailerKey && (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&rel=0&enablejsapi=1&origin=${window.location.origin}`}
              className="w-full h-full border-0 brightness-110 contrast-125"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
          
          {/* Loading / Error States */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mb-4" />
                <div className="absolute inset-0 w-16 h-16 border-2 border-cyan-500/20 rounded-full animate-ping" />
              </div>
              <p className="text-cyan-400 text-sm font-black uppercase tracking-[0.2em] animate-pulse">Initializing Stream</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40 p-10 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-500 font-black mb-4 uppercase tracking-widest">{error}</p>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={(e) => { e.stopPropagation(); setTrailerKey(null); setError(null); fetchTrailer(); }}>
                Retry Uplink
              </Button>
            </div>
          )}

          {/* Sound Wave Animation (Only when active) */}
          <div className="absolute bottom-6 left-6 right-6 h-12 flex items-end gap-1.5 pointer-events-none z-30 opacity-60">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: isActive ? [4, 24, 12, 32, 4] : 4 }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.04 }}
                className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              />
            ))}
          </div>

          {/* HUD Overlay Text */}
          <div className="absolute top-6 left-6 z-30 font-mono text-[8px] text-cyan-500/80 uppercase tracking-widest pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span>Recording: 00:0{Math.floor(Math.random()*9)}:45</span>
            </div>
            <div>Bitrate: 15.4 Mbps</div>
          </div>

          {/* Mute Toggle Overlay */}
          <div className="absolute top-6 right-6 z-30">
            <Button 
              size="icon" 
              variant="ghost" 
              className="w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/10 text-white hover:bg-cyan-500 hover:text-black transition-all rounded-xl"
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-30 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500 translate-y-4 group-hover/card:translate-y-0">
          <div className="flex gap-2 mb-3">
             <span className="px-2 py-0.5 bg-cyan-500 text-black text-[9px] font-black uppercase rounded shadow-[0_0_10px_rgba(34,211,238,0.5)]">Archive_{movie.id.toString().slice(-4)}</span>
             <span className="px-2 py-0.5 bg-white/10 border border-white/20 text-white text-[9px] font-bold uppercase rounded">Protocol_Active</span>
          </div>
          <h3 className="text-xl font-black text-white mb-2 drop-shadow-2xl line-clamp-2 tracking-tighter uppercase">{movie.title}</h3>
          
          <div className="flex gap-3 mt-4">
            <Button size="sm" className="bg-cyan-500 hover:bg-white text-black font-black flex-1 h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <Play className="w-4 h-4 mr-2 fill-black" />
              {isActive ? 'INITIALIZED' : 'SYNC TRAILER'}
            </Button>
            <Button size="sm" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/20 text-white w-12 h-12 rounded-xl p-0">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Play Button Center (Glows on hover, hides when active) */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <motion.div
              animate={{ 
                scale: isHovered ? 1.3 : 1, 
                opacity: isHovered ? 1 : 0.4,
                boxShadow: isHovered ? "0 0 40px rgba(34,211,238,0.5)" : "0 0 0px rgba(34,211,238,0)"
              }}
              className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-cyan-500/50 flex items-center justify-center backdrop-blur-md transition-all duration-500"
            >
              <div className="relative">
                <Play className="w-10 h-10 text-cyan-400 fill-cyan-400" />
                <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-20 animate-pulse" />
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function HologramTrailers() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await tmdb.getUpcoming();
        setMovies(data.results.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch upcoming movies", err);
      }
    };
    fetchMovies();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleTrailerEnd = useCallback(() => {
    if (activeIndex !== null && activeIndex < movies.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      
      if (scrollRef.current) {
        const cardElements = scrollRef.current.children;
        if (cardElements[nextIndex]) {
          cardElements[nextIndex].scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
      }
    } else {
      setActiveIndex(null);
    }
  }, [activeIndex, movies.length]);

  return (
    <section className="relative py-32 overflow-hidden bg-[#02050a]">
      {/* JARVIS STYLE BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05)_0%,transparent_70%)]" />
        
        {/* Animated Digital Grid */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)', 
            backgroundSize: '80px 80px',
            transform: 'perspective(1000px) rotateX(60deg) translateY(-100px)',
            transformOrigin: 'top'
          }} 
        />

        {/* Moving Scanning Lines */}
        <motion.div 
          animate={{ backgroundPosition: ['0% 0%', '0% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ 
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 100px, rgba(34,211,238,0.1) 101px, rgba(34,211,238,0.1) 102px)',
            backgroundSize: '100% 200%'
          }}
        />

        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] animate-pulse" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {FIXED_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 0.1 }}
            animate={{ y: ["-20%", "120%"], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              Neural Uplink Active
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">
              Watch Trailers in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 animate-gradient shadow-cyan-500/20">Hologram</span> Experience
            </h2>
            <div className="flex items-center gap-4 text-cyan-500/40 font-mono text-sm uppercase tracking-widest pt-2">
               <Compass className="w-5 h-5" />
               <span>Asset Retrieval Protocol 8.24 // Deep Space Archives</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="group border-cyan-500/30 bg-black/40 backdrop-blur-xl text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all px-8 h-14 rounded-2xl font-black text-xs uppercase tracking-widest"
            >
              <Monitor className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
              Access Full Archives
            </Button>
          </div>
        </div>

        {/* Horizontal Sliding Experience */}
        <div className="relative group">
          {/* Navigation Controls - HUD STYLE */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-40 w-14 h-24 bg-black/60 backdrop-blur-3xl border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 hover:scale-110 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-40 w-14 h-24 bg-black/60 backdrop-blur-3xl border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 hover:scale-110 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-12 overflow-x-auto pb-20 pt-10 no-scrollbar snap-x snap-mandatory px-4"
          >
            {movies.map((movie, index) => (
              <div key={movie.id} className="snap-center first:pl-0">
                <TrailerCard 
                  movie={movie} 
                  isActive={activeIndex === index}
                  onPlay={() => setActiveIndex(index)}
                  onEnded={handleTrailerEnd}
                />
              </div>
            ))}
            {movies.length === 0 && [...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[340px] aspect-[2/3] rounded-3xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
          
          {/* HUD Decorative Corners for the Slider Area */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-cyan-500/20 rounded-tl-3xl pointer-events-none -translate-x-4 -translate-y-4" />
          <div className="absolute bottom-20 right-0 w-32 h-32 border-b border-r border-cyan-500/20 rounded-br-3xl pointer-events-none translate-x-4 translate-y-4" />
          
          {/* Scroll Side Shadows */}
          <div className="absolute top-0 left-0 bottom-20 w-40 bg-gradient-to-r from-[#02050a] to-transparent pointer-events-none z-20" />
          <div className="absolute top-0 right-0 bottom-20 w-40 bg-gradient-to-l from-[#02050a] to-transparent pointer-events-none z-20" />
        </div>

        {/* Bottom Action Section */}
        <div className="mt-20 flex flex-col items-center gap-10">
          <div className="flex flex-wrap justify-center gap-8">
            <Button 
                size="lg" 
                onClick={() => setActiveIndex(0)}
                className="group relative bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:scale-105 transition-all text-black font-black px-12 h-20 rounded-2xl text-xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="w-6 h-6 mr-3 relative z-10" />
                <span className="relative z-10 uppercase tracking-widest">Connect Deep Neural Stream</span>
                <div className="absolute bottom-0 left-0 h-1 bg-white/40 w-0 group-hover:w-full transition-all duration-700" />
            </Button>
            
            <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/15 text-white font-black px-12 h-20 rounded-2xl text-xl transition-all uppercase tracking-widest backdrop-blur-xl">
              Sync All to Cluster
            </Button>
          </div>

          <div className="flex items-center gap-12 text-[10px] font-mono text-cyan-500/30 uppercase tracking-[0.4em]">
             <span className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-green-500/40 rounded-full" /> DATA_RECEPTION: NOMINAL</span>
             <span className="hidden sm:inline">|</span>
             <span className="hidden sm:inline">BUFFER_LEVEL: 98.4%</span>
             <span className="hidden sm:inline">|</span>
             <span>ENCRYPTION: AES_256_ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Futuristic Bottom Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
    </section>
  );
}
