'use client'

import { motion } from 'motion/react'
import { AdBanner } from '@/components/AdBanner'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { PaymentModal } from '@/components/PaymentModal'
import { Lock, Unlock, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function MoviesPage() {
  const adRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch movies from TMDB
  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      if (!apiKey) throw new Error('TMDB API Key missing');

      // Fetch trending movies + popular to get a good list
      const response = await fetch(
        `${TMDB_BASE_URL}/trending/movie/week?api_key=${apiKey}&language=en-US`,
        { cache: 'no-store' } // Force fresh data
      );

      if (!response.ok) throw new Error('API response error');

      const data = await response.json();
      
      const mappedMovies = data.results.map((m: any) => ({
        title: m.title,
        genre: m.genre_ids?.[0] ? 'Action' : 'Drama', // We could map genre IDs if needed
        rating: m.vote_average?.toFixed(1) || '8.0',
        year: m.release_date?.split('-')[0] || '2024',
        url: '#', // TMDB doesn't provide free stream links, using placeholder
        description: m.overview || 'Exclusive Premiere Experience',
        image: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : `https://picsum.photos/seed/${m.id}/500/750`
      }));

      setMovies(mappedMovies);
      if (mappedMovies.length > 0) {
        setActiveVideo(mappedMovies[0]);
      }
    } catch (error) {
      console.error('TMDB Fetch Error:', error);
      toast.error('Failed to fetch latest movies. Showing local backup.');
      // Fallback to minimal fixed list if API fails
      setMovies([
        { title: "Unfaithful", genre: "Drama", rating: "9.8", year: "2024", url: "https://ok.ru/videoembed/4617548401253", description: "Unfaithful - Premium Cinema Experience", image: "https://picsum.photos/seed/unfaithful-movie/500/750" },
        { title: "Madam", genre: "Classic", rating: "9.9", year: "2024", url: "https://ok.ru/videoembed/2814491562457", description: "Korean Widow Adult Movie", image: "https://picsum.photos/seed/korean-madam/500/750" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const isMovieUnlocked = (title: string) => {
    return isAdmin;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block"
            >
              <span className="px-3 py-1 text-[10px] font-bold tracking-[0.3em] uppercase bg-primary/10 text-primary border border-primary/20 rounded-full mb-4">
                Exclusive Premiere
              </span>
            </motion.div>
            
            <div className="space-y-2">
              <motion.h1 
                key={`${activeVideo?.title || 'loading'}-title`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 select-none uppercase"
              >
                {activeVideo?.title || "Symmetra"}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-4 text-xs font-bold tracking-widest text-primary/80 uppercase"
              >
                <span>Full HD</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span>Premium Quality</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span>1080p</span>
              </motion.div>
            </div>

            <motion.p 
              key={`${activeVideo?.title || 'loading'}-desc`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed italic"
            >
              {activeVideo?.description || "Initializing high-fidelity movie network..."}
            </motion.p>
          </div>

          {/* Movie Player Section - Futuristic Frame */}
          <div className="relative group max-w-5xl mx-auto">
            {/* Outer Glow / Atmospheric Light */}
            <div className="absolute -inset-4 bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
            
            {/* Cyberpunk Border Decor */}
            <div className="absolute -top-2 -left-2 w-10 h-10 border-t-2 border-l-2 border-primary rounded-tl-lg z-10"></div>
            <div className="absolute -top-2 -right-2 w-10 h-10 border-t-2 border-r-2 border-primary rounded-tr-lg z-10"></div>
            <div className="absolute -bottom-2 -left-2 w-10 h-10 border-b-2 border-l-2 border-primary rounded-bl-lg z-10"></div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-2 border-r-2 border-primary rounded-br-lg z-10"></div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video bg-[#050505] rounded-lg overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            >
              {/* Scanline Effect Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
              
              <div className="w-full h-full relative">
                {activeVideo ? (
                  isMovieUnlocked(activeVideo.title) ? (
                    <iframe 
                      key={activeVideo.url}
                      src={activeVideo.url === '#' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : activeVideo.url}
                      className="w-full h-full border-0"
                      allowFullScreen
                      title={activeVideo.title}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-black/40 backdrop-blur-xl">
                      <div className="p-6 bg-primary/20 rounded-full border border-primary/30 animate-pulse">
                        <Lock className="w-12 h-12 text-primary" />
                      </div>
                      <div className="text-center px-4">
                        <h3 className="text-xl font-black uppercase tracking-tighter">Content Locked</h3>
                        <p className="text-white/40 text-sm">Please verify payment to restore primary transmission</p>
                      </div>
                      <Button 
                        onClick={() => {
                          setSelectedMovie(activeVideo);
                          setIsPaymentModalOpen(true);
                        }}
                        className="bg-primary hover:bg-primary/80"
                      >
                        Unlock Now
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-black/60">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">Loading Transmission</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Futuristic Player Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between mt-6 px-4 gap-4">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Status</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-tighter">Live Transmission</span>
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Bitrate</span>
                  <span className="text-xs font-mono text-primary">8.4 Mbps / AES-256</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all">
                  Switch Server
                </button>
                <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary rounded-md text-[10px] font-bold uppercase tracking-widest transition-all">
                  Go Premium
                </button>
              </div>
            </div>
          </div>

          {/* Adsterra Banner Ad Implementation (Following User Structure) */}
          <div className="w-full mt-4 flex flex-col items-center">
             <div className="flex items-center gap-4 w-full mb-4">
              <div className="h-[1px] flex-grow bg-white/5"></div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">Recommended for you</span>
              <div className="h-[1px] flex-grow bg-white/5"></div>
            </div>
            
            {/* We use AdBanner as it provides a safe, responsive wrapper for the Adsterra script logic */}
            <div className="w-full flex justify-center">
              <AdBanner />
            </div>
          </div>

          {/* Premium Video Grid Section */}
          <div className="pt-12 space-y-8">
            <div className="flex items-end justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Premium Collection</h2>
                <p className="text-xs text-muted-foreground font-bold tracking-[0.2em] uppercase">Handpicked Cinematic Masterpieces</p>
              </div>
              <div className="flex gap-2 mb-1">
                <div className="w-8 h-[2px] bg-primary"></div>
                <div className="w-2 h-[2px] bg-white/20"></div>
                <div className="w-2 h-[2px] bg-white/20"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse flex items-center justify-center">
                     <span className="text-[8px] font-bold uppercase tracking-widest text-white/10 italic">Secure Node Syncing...</span>
                  </div>
                ))
              ) : (
                movies.map((movie, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (i % 8) }}
                    className="group relative cursor-pointer"
                    onClick={() => {
                      if (isMovieUnlocked(movie.title)) {
                        setActiveVideo(movie);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setSelectedMovie(movie);
                        setIsPaymentModalOpen(true);
                        toast.info("Premium content requires verification");
                      }
                    }}
                  >
                  <div className="relative aspect-[3/4] bg-secondary/20 rounded-xl overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-primary/50 group-hover:translate-y-[-8px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"></div>
                    
                    {/* Admin/Locked Status Indicator */}
                    <div className="absolute top-3 left-3 z-30 flex gap-2">
                       {isAdmin && (
                         <div className="px-2 py-0.5 bg-green-500/20 backdrop-blur-md rounded text-[9px] font-black text-green-500 border border-green-500/30 flex items-center gap-1">
                           <ShieldCheck className="w-3 h-3" />
                           MASTER
                         </div>
                       )}
                       {!isMovieUnlocked(movie.title) && movie.url !== "#" && (
                         <div className="px-2 py-0.5 bg-red-500/20 backdrop-blur-md rounded text-[9px] font-black text-red-500 border border-red-500/30 flex items-center gap-1">
                           <Lock className="w-3 h-3" />
                           LOCKED
                         </div>
                       )}
                    </div>

                    {/* Movie Poster Thumbnail */}
                    {movie.image ? (
                      <Image
                        src={movie.image}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                        <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-black text-primary border border-primary/30 z-20">
                      {movie.url === "#" ? "SOON" : "WATCH NOW"}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <div className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-1">{movie.genre} • {movie.year}</div>
                      <h4 className="text-lg font-black tracking-tighter uppercase leading-none mb-2 text-white">{movie.title}</h4>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center text-[10px] font-mono text-yellow-500">
                          <span className="mr-1">★</span>
                          {movie.rating}
                        </div>
                      </div>
                    </div>

                    {/* Futuristic hover overlay */}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] z-30">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center scale-75 group-hover:scale-100 transition-transform">
                          <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
                ))
              )}
            </div>
          </div>
          
          {/* Navigation/Actions Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
            <div className="relative overflow-hidden p-8 rounded-3xl bg-secondary/20 border border-white/5 group hover:border-primary/50 transition-all duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Movie Library</h3>
              <p className="text-muted-foreground mb-6">Explore our curated collection of upcoming and trending titles.</p>
              <div className="flex gap-4">
                <a href="/popular" className="px-6 py-2 bg-primary rounded-full text-white text-sm font-bold hover:bg-primary/80 transition-colors">Popular</a>
                <a href="/trending" className="px-6 py-2 bg-white/5 rounded-full text-white text-sm font-bold hover:bg-white/10 transition-colors">Trending</a>
              </div>
            </div>
            
            <div className="relative overflow-hidden p-8 rounded-3xl bg-secondary/20 border border-white/5 group hover:border-primary/50 transition-all duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Help Center</h3>
              <p className="text-muted-foreground mb-6">Need assistance? Our support team is here to help you 24/7.</p>
              <a href="/contact" className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all">
                Contact Support <span className="ml-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={selectedMovie?.title}
      />
    </div>
  )
}
