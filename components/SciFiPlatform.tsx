'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  X, 
  Play, 
  Info, 
  Cpu, 
  Activity, 
  Shield, 
  Terminal, 
  Zap, 
  Compass,
  Monitor,
  Share2,
  Volume2,
  Settings,
  Maximize
} from 'lucide-react';
import { tmdb, Movie, MovieDetails } from '@/lib/tmdb';

interface SciFiPlatformProps {
  onClose: () => void;
}

export function SciFiPlatform({ onClose }: SciFiPlatformProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [glitch, setGlitch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadMovies() {
      const data = await tmdb.getByGenre(878); // Sci-Fi
      setMovies(data.results || []);
      if (data.results?.[0]) {
        const details = await tmdb.getMovieDetails(data.results[0].id.toString());
        setSelectedMovie(details);
      }
      setLoading(false);
    }
    loadMovies();
  }, []);

  const handleMovieSelect = async (movie: Movie) => {
    setGlitch(true);
    const details = await tmdb.getMovieDetails(movie.id.toString());
    setSelectedMovie(details);
    setTimeout(() => setGlitch(false), 500);
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const trailer = selectedMovie?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, y: 50 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[200] bg-black text-white flex flex-col font-sans overflow-hidden"
    >
      {/* JARVIS Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        {/* Rotating Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -left-[10%] -top-[10%] w-[500px] h-[500px] border border-cyan-500/20 rounded-full border-dashed"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-[5%] -bottom-[5%] w-[400px] h-[400px] border border-blue-500/10 rounded-full"
        />
      </div>

      {/* Header HUD */}
      <header className="relative z-10 px-8 py-4 flex items-center justify-between border-b border-cyan-500/20 backdrop-blur-xl bg-black/40">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-20 animate-pulse" />
            <Cpu className="w-8 h-8 text-cyan-400 relative" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter flex items-center gap-3">
              ARK-SYSTEM <span className="text-cyan-500/50 text-xs">v4.0.2</span>
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-cyan-500 animate-[bounce_1s_infinite_0ms]" />
                <div className="w-1 h-3 bg-cyan-500 animate-[bounce_1s_infinite_100ms]" />
                <div className="w-1 h-3 bg-cyan-500 animate-[bounce_1s_infinite_200ms]" />
              </div>
            </h1>
            <p className="text-[8px] uppercase tracking-[0.5em] text-cyan-400/60 font-mono">NEURAL INTERFACE // DEEP SPACE OPS</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="hidden md:flex items-center gap-6 text-xs font-mono text-cyan-500/40">
              <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> LINK_STABLE</span>
              <span className="flex items-center gap-2"><Shield className="w-3 h-3" /> ENCRYPTION_ON</span>
           </div>
           <button 
             onClick={onClose}
             className="p-2 hover:bg-white/10 rounded-full transition-all group border border-transparent hover:border-cyan-500/30"
           >
             <X className="w-6 h-6 text-cyan-400 group-hover:scale-125 transition-transform" />
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main ref={containerRef} className="relative z-10 flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-7xl mx-auto p-8 space-y-12 pb-32">
          
          {/* Holographic Player Section */}
          <section className="relative group">
             {/* Player HUD Overlays */}
             <div className="absolute -inset-4 border border-cyan-500/10 pointer-events-none rounded-3xl" />
             <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500 rounded-tl-xl opacity-40" />
             <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500 rounded-tr-xl opacity-40" />
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500 rounded-bl-xl opacity-40" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500 rounded-br-xl opacity-40" />

             {/* Main Frame */}
             <div className={`relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/5 shadow-2xl transition-all duration-500 ${glitch ? 'scale-[0.98] blur-sm' : 'scale-100'}`}>
                {selectedMovie ? (
                  <>
                    {trailer ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                        className="w-full h-full border-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full relative">
                        <Image 
                          src={tmdb.getImageUrl(selectedMovie.backdrop_path, 'original')} 
                          fill
                          className="object-cover opacity-60" 
                          alt={selectedMovie.title}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                           <Play className="w-20 h-20 text-cyan-400 mb-6 opacity-80" />
                           <p className="text-xl font-bold">No Trailer Available</p>
                           <p className="text-sm text-white/60">System could not locate video stream for this asset.</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Floating HUD info */}
                    <div className="absolute top-6 left-6 p-4 bg-black/60 backdrop-blur-md border-l-2 border-cyan-500 rounded-r-lg max-w-sm pointer-events-none">
                      <h2 className="text-lg font-black tracking-tighter text-cyan-400 mb-1">{selectedMovie.title}</h2>
                      <div className="flex gap-4 text-[10px] font-mono text-white/50 mb-3">
                        <span>{selectedMovie.release_date?.split('-')[0]}</span>
                        <span>{selectedMovie.runtime} MIN</span>
                        <span className="text-cyan-500">HD_1080P</span>
                      </div>
                      <p className="text-xs text-white/70 line-clamp-2 leading-relaxed italic">&quot;{selectedMovie.tagline}&quot;</p>
                    </div>

                    {/* Scanlines Effect Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10 bg-[length:100%_2px,3px_100%]" />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-white/5">
                    <Monitor className="w-12 h-12 text-cyan-500/20 animate-pulse" />
                    <span className="text-xs font-mono text-cyan-500/40">INITIALIZING_STREAM...</span>
                  </div>
                )}

                {/* Glitch Overlay */}
                <AnimatePresence>
                  {glitch && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-cyan-500 mix-blend-overlay z-20 pointer-events-none"
                    />
                  )}
                </AnimatePresence>
             </div>

             {/* Player Controls HUD */}
             <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                   <button className="flex items-center gap-3 px-8 py-3 bg-cyan-500 text-black font-black text-xs uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                     <Play className="w-4 h-4 fill-current" /> Initialize Stream
                   </button>
                   <button className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-lg hover:bg-white/20 transition-all">
                     <Info className="w-4 h-4" /> Asset Intel
                   </button>
                </div>
                <div className="flex gap-3">
                   {[Share2, Settings, Volume2, Maximize].map((Icon, i) => (
                     <button key={i} className="p-3 bg-white/5 border border-white/10 rounded-lg hover:border-cyan-500/40 hover:text-cyan-400 transition-all">
                       <Icon className="w-4 h-4" />
                     </button>
                   ))}
                </div>
             </div>
          </section>

          {/* Sci-Fi Grid Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-4">
                <Compass className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-black uppercase tracking-tighter">Genre_Explorer: <span className="text-cyan-500">SCI-FI_ARCHIVES</span></h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> DATABASE_SYNCED
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {movies.slice(0, 18).map((movie, i) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleMovieSelect(movie)}
                    className={`group cursor-pointer relative aspect-[2/3] rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 ${
                      selectedMovie?.id === movie.id ? 'ring-2 ring-cyan-500' : ''
                    }`}
                  >
                    <Image 
                      src={tmdb.getImageUrl(movie.poster_path, 'w500')} 
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />
                    
                    {/* Hover Info */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300">
                       <h4 className="text-xs font-black leading-tight mb-2 uppercase">{movie.title}</h4>
                       <div className="flex items-center justify-between text-[8px] font-mono text-cyan-400">
                          <span>STAR_RATING: {movie.vote_average.toFixed(1)}</span>
                          <Play className="w-3 h-3 fill-current" />
                       </div>
                    </div>

                    {/* Hologram Flicker Effect */}
                    <div className="absolute inset-0 pointer-events-none group-hover:bg-cyan-500/10 mix-blend-overlay transition-colors" />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 border border-white/20 rounded text-[6px] font-mono uppercase text-white/60">
                      ID_{movie.id.toString().slice(-4)}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Bottom HUD Analytics */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Network Latency', value: '14.2 MS', icon: Zap },
              { label: 'Uplink Strength', value: '98.5%', icon: Activity },
              { label: 'Active Sessions', value: '4,029', icon: Terminal }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-cyan-500/5 transition-all">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
                   <p className="text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors uppercase">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-white/10 group-hover:text-cyan-500/20 transition-all" />
              </div>
            ))}
          </section>

        </div>
      </main>

      {/* Footer HUD */}
      <footer className="relative z-10 px-8 py-3 border-t border-cyan-500/20 backdrop-blur-xl bg-black/60 flex items-center justify-between text-[9px] font-mono text-cyan-500/30 uppercase tracking-[0.4em]">
        <div className="flex gap-8">
           <span>SYSTEM_TIME: {new Date().toLocaleTimeString()}</span>
           <span>LOC: GSFC-HUB.NODE_01</span>
        </div>
        <div className="flex gap-8">
           <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 animate-ping" /> CORE_SYNCED</span>
           <span>COPYRIGHT_2026 // NEURAL_NET_V4</span>
        </div>
      </footer>
    </motion.div>
  );
}
