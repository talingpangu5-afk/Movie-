'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Volume2, VolumeX, Info, Sparkles, Loader2 } from 'lucide-react';
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
    
    // Check session storage first for extremely fast retrieval
    const cachedKey = sessionStorage.getItem(`trailer_${movie.id}`);
    if (cachedKey) {
      setTrailerKey(cachedKey);
      return cachedKey;
    }

    setIsLoading(true);
    try {
      const data = await tmdb.getMovieDetails(movie.id.toString());
      const trailer = data.videos?.results?.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        setTrailerKey(trailer.key);
        sessionStorage.setItem(`trailer_${movie.id}`, trailer.key);
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
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleInteraction}
      whileHover={{ scale: 1.05, rotateY: 10, rotateX: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative group min-w-[280px] md:min-w-[320px] aspect-[2/3] rounded-xl overflow-hidden cursor-pointer bg-black/40 border transition-all duration-500 ${
        isActive ? 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]' : 'border-cyan-500/30 hologram-glow'
      }`}
    >
      {/* Hologram Flicker Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-cyan-500/5 animate-flicker" />
        <div className="scanline" />
      </div>

      {/* Poster Image */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={tmdb.getImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Light Beam Projection Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/20 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Video Preview / Iframe */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {isActive && trailerKey && (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&rel=0&VQ=HD1080&enablejsapi=1&origin=${window.location.origin}`}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
        
        {/* Loading / Error States */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-2" />
            <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest">Initializing Hologram...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40 p-4 text-center">
            <p className="text-red-500 font-bold mb-2 uppercase tracking-tighter">{error}</p>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setTrailerKey(null); setError(null); fetchTrailer(); }}>
              Retry
            </Button>
          </div>
        )}

        {/* Sound Wave Animation (Only when active) */}
        <div className="absolute bottom-4 left-4 right-4 h-8 flex items-end gap-1 pointer-events-none z-30">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: isActive ? [4, 16, 8, 20, 4] : 4 }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
              className="flex-1 bg-cyan-400/60 rounded-full"
            />
          ))}
        </div>

        {/* Mute Toggle Overlay */}
        <div className="absolute top-4 right-4 z-30">
          <Button 
            size="icon" 
            variant="ghost" 
            className="bg-black/40 backdrop-blur-md text-white hover:bg-black/60"
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-30 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg line-clamp-1">{movie.title}</h3>
        <p className="text-cyan-400 text-sm font-medium mb-4">{movie.release_date?.split('-')[0]}</p>
        
        <div className="flex gap-2">
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex-1">
            <Play className="w-4 h-4 mr-1 fill-black" />
            {isActive ? 'Playing' : 'Watch Trailer'}
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white p-2">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Play Button Center (Glows on hover, hides when active) */}
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <motion.div
            animate={{ 
              scale: isHovered ? 1.2 : 1, 
              opacity: isHovered ? 1 : 0.6,
              boxShadow: isHovered ? "0 0 20px rgba(34,211,238,0.6)" : "0 0 0px rgba(34,211,238,0)"
            }}
            className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center backdrop-blur-sm transition-shadow duration-300"
          >
            <Play className="w-8 h-8 text-cyan-400 fill-cyan-400" />
          </motion.div>
        </div>
      )}
    </motion.div>
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

  const handleTrailerEnd = useCallback(() => {
    if (activeIndex !== null && activeIndex < movies.length - 1) {
      setActiveIndex(activeIndex + 1);
      // Scroll to the next card
      if (scrollRef.current) {
        const cardWidth = 320 + 32; // width + gap
        scrollRef.current.scrollTo({
          left: (activeIndex + 1) * cardWidth,
          behavior: 'smooth'
        });
      }
    } else {
      setActiveIndex(null);
    }
  }, [activeIndex, movies.length]);

  return (
    <section className="relative py-20 overflow-hidden bg-black">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {FIXED_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 0.1 }}
            animate={{ y: ["-10%", "110%"], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              LIVE TRAILERS
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase">
              Watch Trailers in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Hologram</span> Experience
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Experience movie trailers like never before in immersive 3D visuals.
            </p>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10">
              View All Experience
            </Button>
          </div>
        </div>

        {/* Horizontal Scroll Area */}
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-12 pt-4 no-scrollbar snap-x snap-mandatory"
          >
            {movies.map((movie, index) => (
              <div key={movie.id} className="snap-center">
                <TrailerCard 
                  movie={movie} 
                  isActive={activeIndex === index}
                  onPlay={() => setActiveIndex(index)}
                  onEnded={handleTrailerEnd}
                />
              </div>
            ))}
            {movies.length === 0 && [...Array(5)].map((_, i) => (
              <div key={i} className="min-w-[320px] aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
          
          {/* Scroll Indicators/Shadows */}
          <div className="absolute top-0 left-0 bottom-12 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-20" />
          <div className="absolute top-0 right-0 bottom-12 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none z-20" />
        </div>

        {/* Bottom Action Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Button 
            size="lg" 
            onClick={() => setActiveIndex(0)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black px-10 h-14 rounded-full text-lg shadow-[0_0_30px_rgba(6,182,212,0.4)]"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            ENTER FULL IMMERSION
          </Button>
          <Button size="lg" variant="outline" className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold px-10 h-14 rounded-full text-lg">
            ADD ALL TO WATCHLIST
          </Button>
        </div>
      </div>

      {/* Decorative Wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
    </section>
  );
}
