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
  Maximize,
  AlertCircle
} from 'lucide-react';
import { tmdb, Movie, MovieDetails } from '@/lib/tmdb';
import { AdBanner } from '@/components/AdBanner';

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
      try {
        const data = await tmdb.getByGenre(878); // Sci-Fi
        setMovies(data.results || []);
        if (data.results?.[0]) {
          const details = await tmdb.getMovieDetails(data.results[0].id.toString());
          setSelectedMovie(details);
        }
      } catch (err) {
        console.error('Failed to load Sci-Fi movies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, []);

  const handleMovieSelect = async (movie: Movie) => {
    setGlitch(true);
    try {
      const details = await tmdb.getMovieDetails(movie.id.toString());
      setSelectedMovie(details);
    } catch (err) {
      console.error('Failed to load movie details:', err);
    }
    setTimeout(() => setGlitch(false), 300);
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const trailer = selectedMovie?.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.1, y: 100 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="fixed inset-0 z-[200] bg-black text-white flex flex-col font-sans overflow-hidden"
    >
      {/* JARVIS Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute inset-0 bg-[#02050a]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.15)_0%,transparent_70%)]" />
        
        {/* Animated Grid lines in background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

        {/* Floating HUD Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          className="absolute -left-48 -top-48 w-[600px] h-[600px] border border-cyan-500/10 rounded-full border-dashed"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute -right-32 -bottom-32 w-[500px] h-[500px] border border-blue-500/10 rounded-full"
        />
      </div>

      {/* Header HUD */}
      <header className="relative z-10 px-8 py-4 flex items-center justify-between border-b border-cyan-500/20 backdrop-blur-2xl bg-black/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-40 group-hover:opacity-100 transition-opacity animate-pulse" />
            <Cpu className="w-10 h-10 text-cyan-400 relative" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              M-SYSTEM <span className="text-cyan-500/60 text-xs px-2 py-0.5 border border-cyan-500/30 rounded">PROTO v9.0</span>
              <div className="flex gap-1.5 h-4 items-end">
                {[0.4, 0.7, 0.5, 0.9, 0.3].map((h, i) => (
                   <motion.div 
                    key={i}
                    animate={{ height: ['20%', '100%', '30%'] }}
                    transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1 bg-cyan-500/80 rounded-full"
                  />
                ))}
              </div>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.6em] text-cyan-400/70 font-mono">HOLOGRAPHIC CINEMA INTERFACE // SYNC: ACTIVE</p>
          </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="hidden lg:flex items-center gap-8 text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> SIGNAL: 100%</span>
              <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> SECURE_LAYER: ON</span>
              <span className="flex items-center gap-2 underline underline-offset-4 decoration-cyan-500/20"><Terminal className="w-3.5 h-3.5" /> RTD: 1.2ms</span>
           </div>
           <button 
             onClick={onClose}
             className="relative p-2.5 rounded-xl transition-all group overflow-hidden border border-white/10 hover:border-red-500/50 hover:bg-red-500/5"
           >
             <X className="w-7 h-7 text-white/50 group-hover:text-red-400 transition-colors z-10 relative" />
             <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 transition-colors" />
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main ref={containerRef} className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-[1600px] mx-auto p-12 space-y-20 pb-40">
          
          {/* FULL FUTURISTIC HOLOGRAPHIC PLAYER SECTION */}
          <section className="relative group max-w-6xl mx-auto">
             {/* Holographic Projection Base */}
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-cyan-500/20 blur-xl opacity-50" />
             <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[90%] h-40 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_70%)] pointer-events-none" />

             {/* Outer HUD Frame */}
             <div className="absolute -inset-8 border border-cyan-500/10 pointer-events-none rounded-[40px] opacity-40">
                <div className="absolute top-1/2 -left-1 w-1 h-32 bg-cyan-500/20 -translate-y-1/2" />
                <div className="absolute top-1/2 -right-1 w-1 h-32 bg-cyan-500/20 -translate-y-1/2" />
             </div>

             {/* Corner Brackets with dynamic glow */}
             <motion.div 
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500 rounded-tl-3xl z-30" 
             />
             <motion.div 
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
               className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500 rounded-tr-3xl z-30" 
             />
             <motion.div 
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2, repeat: Infinity, delay: 1 }}
               className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500 rounded-bl-3xl z-30" 
             />
             <motion.div 
               animate={{ opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
               className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500 rounded-br-3xl z-30" 
             />

             {/* Holographic Panel */}
             <div className="relative aspect-video rounded-3xl overflow-hidden bg-black/80 border border-white/10 shadow-[0_0_100px_rgba(6,182,212,0.1)] transition-all duration-700">
                
                {/* Floating HUD Information Overlays */}
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                   {/* Top Bar Data */}
                   <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-10 px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/5 text-[9px] font-mono text-cyan-400">
                      <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-green-400" /> FEED: NORMAL</span>
                      <span className="opacity-30">|</span>
                      <span className="flex items-center gap-2"><Monitor className="w-3 h-3 text-blue-400" /> RES: 4K_UHD</span>
                      <span className="opacity-30">|</span>
                      <span className="animate-pulse">AUTO_UPDATING...</span>
                   </div>

                   {/* Left Side HUD Stats */}
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex flex-col gap-1">
                          <div className="w-12 h-[2px] bg-cyan-500/40" />
                          <div className="w-8 h-[2px] bg-cyan-500/20" />
                          <span className="text-[7px] font-mono text-cyan-500/50">SENSOR_{i}</span>
                        </div>
                      ))}
                   </div>

                   {/* Scanning Grid Layer (Subtle) */}
                   <div className="absolute inset-0 bg-transparent opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                   
                   {/* Horizontal Scanning Line */}
                   <motion.div 
                     animate={{ top: ['-10%', '110%'] }}
                     transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                     className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent z-40"
                   />
                </div>

                {selectedMovie ? (
                  <>
                    <div className="w-full h-full relative group">
                      {trailer ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&iv_load_policy=3`}
                          className="w-full h-full border-none relative z-10"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full relative">
                          <Image 
                            src={tmdb.getImageUrl(selectedMovie.backdrop_path, 'original')} 
                            fill
                            className="object-cover opacity-70" 
                            alt={selectedMovie.title} 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-20">
                             <div className="relative">
                               <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20" />
                               <AlertCircle className="w-24 h-24 text-cyan-400/80 mb-6 animate-pulse" />
                             </div>
                             <p className="text-2xl font-black uppercase tracking-widest text-cyan-400">Restricted Stream</p>
                             <p className="max-w-md text-sm text-white/50 mt-4 font-mono">No decryption key available for visual sequence. Metadata retrieval only.</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Floating Info Panel - Glassmorphism */}
                      <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="absolute bottom-8 left-8 p-8 bg-black/60 backdrop-blur-3xl border-l-[4px] border-cyan-500 rounded-r-2xl max-w-md z-30 pointer-events-none group-hover:scale-105 transition-transform"
                      >
                        <div className="mb-4 flex items-center gap-3">
                           <span className="px-2 py-0.5 bg-cyan-500 text-black text-[9px] font-black uppercase rounded">Top Classified</span>
                           <span className="text-[10px] font-mono text-cyan-400/60 uppercase">FileID: {selectedMovie.id}</span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter text-white mb-3 text-shadow-lg">{selectedMovie.title}</h2>
                        <div className="flex gap-6 text-xs font-mono text-cyan-500 mb-5">
                          <span className="flex items-center gap-2"><Play className="w-3 h-3 fill-current" /> {selectedMovie.release_date?.split('-')[0]}</span>
                          <span className="flex items-center gap-2"><Activity className="w-3 h-3" /> {selectedMovie.runtime} MIN</span>
                          <span className="flex items-center gap-2"><Shield className="w-3 h-3 text-green-400" /> DECRYPTED_1080P</span>
                        </div>
                        <p className="text-sm text-white/70 line-clamp-3 leading-relaxed font-medium italic opacity-90 border-t border-white/5 pt-4">
                          &quot;{selectedMovie.tagline || selectedMovie.overview}&quot;
                        </p>
                      </motion.div>
                    </div>

                    {/* Chromatic Aberration / VHS Glitch Overlay (Active) */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] z-50 bg-[length:100%_4px,5px_100%]" />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-black">
                     <div className="w-20 h-20 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                     <div className="text-center font-mono space-y-2">
                        <p className="text-cyan-500 text-sm animate-pulse tracking-[0.3em]">INITIALIZING_UPLINK...</p>
                        <p className="text-white/20 text-[8px]">WAITING FOR SYSTEM RESPONSE</p>
                     </div>
                  </div>
                )}

                {/* Glitch Overlay Effect */}
                <AnimatePresence>
                  {glitch && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-cyan-400 mix-blend-color-dodge z-[100] pointer-events-none flex items-center justify-center"
                    >
                       <div className="text-white font-black text-6xl tracking-[2em] opacity-30 skew-x-12">RE_SHAPE</div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* Dynamic Light Beam Effect below player */}
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[conic-gradient(from_0deg_at_50%_0%,transparent_160deg,rgba(6,182,212,0.15)_180deg,transparent_200deg)] mix-blend-screen -z-10 blur-3xl pointer-events-none" />

             {/* Player Controls - Floating HUD Style */}
             <div className="mt-12 flex flex-wrap gap-8 items-center justify-between px-4">
                <div className="flex gap-6">
                   <button className="group relative flex items-center gap-4 px-10 py-5 bg-cyan-500 text-black font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-white transition-all overflow-hidden">
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                     <Play className="w-5 h-5 fill-current relative z-10" /> 
                     <span className="relative z-10">Neural_Play</span>
                     <div className="absolute bottom-0 left-0 h-1 bg-black/20 w-0 group-hover:w-full transition-all duration-300" />
                   </button>
                   <button className="flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-white/15 transition-all hover:border-cyan-500/40">
                     <Info className="w-5 h-5" /> Detailed_Intel
                   </button>
                </div>
                <div className="flex gap-4">
                   {[Share2, Settings, Volume2, Maximize].map((Icon, i) => (
                     <button key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/60 hover:text-cyan-400 transition-all hover:bg-cyan-500/5 group">
                       <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                     </button>
                   ))}
                </div>
             </div>
          </section>

          {/* SCI-FI GRID SECTION */}
          <section className="space-y-10 pt-10">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-8">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                   <Compass className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                   <h3 className="text-3xl font-black uppercase tracking-tighter">DATA_FETCH: <span className="text-cyan-500 text-2xl">SCI-FI_NODES</span></h3>
                   <div className="flex items-center gap-3 mt-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-[ping_2s_infinite]" />
                      <span className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest">Global Archives Decrypted</span>
                   </div>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1">
                 <span className="text-xs font-mono text-white/20">NETWORK_LOAD: 24.8%</span>
                 <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ['-100%', '0%'] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-full h-full bg-cyan-500/40"
                    />
                 </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {movies.slice(0, 18).map((movie, i) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleMovieSelect(movie)}
                    className={`group cursor-pointer relative aspect-[2/3] rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-3 ${
                      selectedMovie?.id === movie.id 
                      ? 'border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.2)]' 
                      : 'border-white/10 hover:border-cyan-500/50'
                    }`}
                  >
                    <Image 
                      src={tmdb.getImageUrl(movie.poster_path, 'w500')} 
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all translate-y-6 group-hover:translate-y-0 duration-500">
                       <div className="flex gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[8px] font-bold uppercase rounded">Protocol_{movie.id.toString().slice(-3)}</span>
                       </div>
                       <h4 className="text-sm font-black leading-tight mb-3 uppercase tracking-tighter text-white drop-shadow-md">{movie.title}</h4>
                       <div className="flex items-center justify-between text-[9px] font-mono text-cyan-400 font-bold border-t border-white/10 pt-3">
                          <span className="flex items-center gap-2"><Star className="w-2.5 h-2.5 fill-current" /> {movie.vote_average.toFixed(1)}</span>
                          <div className="p-1.5 bg-cyan-500 rounded-lg text-black group-hover:animate-pulse">
                            <Play className="w-3 h-3 fill-current" />
                          </div>
                       </div>
                    </div>

                    {/* Holographic scanning flicker */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity mix-blend-screen bg-cyan-500/5" />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* BANNER ADS PLACEMENTS AT THE END OF GRID */}
          <section className="space-y-12">
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity" />
                <div className="relative bg-black/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-10 flex flex-col items-center">
                   <div className="w-full flex items-center justify-between mb-8 opacity-20 text-[9px] font-mono tracking-[0.5em] text-cyan-500 uppercase">
                      <span>Ad_Server: Connected</span>
                      <span>Link_Status: Encrypted</span>
                   </div>
                   
                   <AdBanner className="w-full" />
                   
                   <div className="mt-8 text-center">
                      <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Holographic Stream Supported by Integrated Partners</p>
                   </div>
                </div>
             </div>

             {/* Second Ad Space for better monetization */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-1 border border-cyan-500/10 rounded-2xl bg-cyan-500/5 backdrop-blur-md">
                   <AdBanner />
                </div>
                <div className="p-1 border border-blue-500/10 rounded-2xl bg-blue-500/5 backdrop-blur-md">
                   <AdBanner />
                </div>
             </div>
          </section>

          {/* BOTTOM ANALYTICS HUD - ARCHIVE DATA */}
          <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-10">
            {[
              { label: 'Neural Throughput', value: '8.4 GB/S', icon: Zap, color: 'text-cyan-400' },
              { label: 'Core Integrity', value: '100% OK', icon: Shield, color: 'text-green-400' },
              { label: 'Asset Clusters', value: '42,091', icon: Terminal, color: 'text-blue-400' },
              { label: 'Temporal Sync', value: 'ACTIVE', icon: Activity, color: 'text-purple-400' }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-cyan-500/5 transition-all hover:border-cyan-500/30 relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{stat.label}</p>
                   <p className={`text-2xl font-black tracking-tight ${stat.color} transition-colors uppercase`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color} opacity-10 group-hover:opacity-30 transition-all group-hover:scale-125 z-10`} />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </section>

        </div>
      </main>

      {/* Footer HUD */}
      <footer className="relative z-10 px-12 py-5 border-t border-cyan-500/20 backdrop-blur-3xl bg-black/80 flex items-center justify-between text-[10px] font-mono text-cyan-500/40 uppercase tracking-[0.5em]">
        <div className="flex gap-12">
           <span className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
             SYSTEM_LIVE: {new Date().toLocaleTimeString()}
           </span>
           <span className="hidden md:inline">UPLINK_NODE: GSFC-HUB.DELTA_9</span>
        </div>
        <div className="flex gap-12">
           <span className="flex items-center gap-3"><div className="w-2 h-2 rounded-full border border-cyan-500/50 animate-ping" /> CORE_SYNC_ACTIVE</span>
           <span className="hidden sm:inline">PROPRIETARY_NEURAL_INTERFACE_V9</span>
        </div>
      </footer>
    </motion.div>
  );
}

// Reuse icon for grid
function Star(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
