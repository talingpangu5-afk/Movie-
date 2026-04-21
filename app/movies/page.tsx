'use client'

import { motion } from 'motion/react'
import { AdBanner } from '@/components/AdBanner'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { PaymentModal } from '@/components/PaymentModal'
import { Lock, Unlock, ShieldCheck, Play } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { tmdb } from '@/lib/tmdb'

export const dynamic = 'force-dynamic';

const MOVIES_COLLECTION = [
  { id: "unfaithful-2002", title: "Unfaithful (2002)", genre: "Drama", rating: "9.8", year: "2002", url: "https://ok.ru/videoembed/4617548401253", description: "Unfaithful - Premium Cinema Experience" },
  { id: "madam", title: "Madam", genre: "Classic", rating: "9.9", year: "2024", url: "https://ok.ru/videoembed/2814491562457", description: "Korean Widow Adult Movie", image: "https://picsum.photos/seed/korean-madam/500/750" },
  { id: "sin", title: "Sin", genre: "Romance", rating: "9.5", year: "2023", url: "https://ok.ru/videoembed/2300466955754", description: "Sin - A Premium Romance Experience", image: "https://picsum.photos/seed/sin-romance/500/750" },
  { id: "young-mother-3", title: "Young Mother 3", genre: "Drama", rating: "9.2", year: "2015", url: "https://ok.ru/videoembed/1002271672931", description: "Young Mother 3 - Premium Family Drama", image: "https://picsum.photos/seed/young-mother/500/750" },
];

function MovieCard({ movie, i, isAdmin, isMovieUnlocked, setActiveVideo, setSelectedMovie, setIsPaymentModalOpen }: any) {
  const isUnfaithful = movie.title.includes("Unfaithful");
  const [imgSrc, setImgSrc] = useState(movie.poster_path ? tmdb.getImageUrl(movie.poster_path, 'w500') : movie.image);
  const [isLoading, setIsLoading] = useState(true);
  const fallbackImg = "https://picsum.photos/seed/cinema-poster/500/750";

  useEffect(() => {
    if (!movie.poster_path && !movie.image) {
      console.log(`[DEBUG] Missing poster for: ${movie.title}`);
    }
  }, [movie]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * (i % 8) }}
      className="group relative cursor-pointer"
      onClick={() => {
        if (movie.url !== "#") {
          if (isMovieUnlocked(movie.title)) {
            setActiveVideo(movie as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setSelectedMovie(movie);
            setIsPaymentModalOpen(true);
            toast.info("Premium content requires verification");
          }
        }
      }}
    >
      <div className="relative aspect-[2/3] bg-secondary/20 rounded-xl overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-primary/50 group-hover:translate-y-[-8px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"></div>
        
        {isLoading && !isUnfaithful && (
          <div className="absolute inset-0 z-20">
            <Skeleton className="w-full h-full rounded-none" />
          </div>
        )}

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
        {isUnfaithful ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            id="fixedPoster"
            src="https://image.tmdb.org/t/p/w500/dG3W6t8G4PpXcE1vdlzA94ppWK4.jpg"
            alt="Unfaithful (2002)"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0"
            referrerPolicy="no-referrer"
          />
        ) : imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={movie.title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 z-0 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              if (imgSrc !== fallbackImg) {
                setImgSrc(fallbackImg);
              }
              setIsLoading(false);
            }}
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
          <h4 className="text-lg font-black tracking-tighter uppercase leading-none mb-2 text-white line-clamp-1">{movie.title}</h4>
          <div className="flex items-center gap-1">
            <div className="flex items-center text-[10px] font-mono text-yellow-500">
              <span className="mr-1">★</span>
              {movie.rating}
            </div>
          </div>
        </div>

        {/* Futuristic hover overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] z-30">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center scale-75 group-hover:scale-100 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MoviesPage() {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (pageToFetch: number) => {
    try {
      setIsLoading(true);
      // Fetching from multiple high-quality endpoints for a robust cinematic list
      const [popularData, trendingData, topRatedData, upcomingData] = await Promise.all([
        tmdb.getPopular(pageToFetch),
        tmdb.getTrending(pageToFetch),
        tmdb.getTopRated(pageToFetch),
        tmdb.getUpcoming(pageToFetch)
      ]);
      
      const combinedResults = [
        ...popularData.results, 
        ...trendingData.results,
        ...topRatedData.results,
        ...upcomingData.results
      ];
      
      // Basic deduplication by ID to prevent duplicate items in the grid
      const uniqueMovies = Array.from(new Map(combinedResults.map(item => [item.id, item])).values());
      
      const formatted = uniqueMovies.map((m: any) => ({
        id: m.id,
        title: m.title || m.name,
        genre: "Premium",
        rating: m.vote_average?.toFixed(1) || "0.0",
        year: new Date(m.release_date || m.first_air_date || "").getFullYear() || "2024",
        url: "https://ok.ru/videoembed/4617548401253", // Using a stable premium player placeholder
        description: m.overview,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path
      }));

      setMovies(prev => {
        const baseMovies = pageToFetch === 1 ? MOVIES_COLLECTION : [];
        return [...baseMovies, ...(pageToFetch === 1 ? formatted : [...prev, ...formatted])];
      });
      
      if (pageToFetch === 1) {
        setActiveVideo(MOVIES_COLLECTION[0]);
      }
      
      setHasMore(formatted.length > 0);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
    fetchMovies(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    // Since tmdb util doesn't support page yet, we'd ideally update getPopular(page)
    // For now we'll simulate by fetching trending again or popular (this is a placeholder for actual pagination logic)
    fetchMovies(nextPage);
  };

  const isMovieUnlocked = (title: string) => {
    return isAdmin;
  };

  if (!activeVideo && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-primary font-bold tracking-widest uppercase text-xs">Initializing Flux Network...</p>
        </div>
      </div>
    );
  }

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
                key={`${activeVideo?.title}-title`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 select-none uppercase line-clamp-1"
              >
                {activeVideo?.title}
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
              key={`${activeVideo?.title}-desc`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed italic line-clamp-2"
            >
              {activeVideo?.description}
            </motion.p>
          </div>

          {/* Movie Player Section - Futuristic Frame */}
          <div className="relative group max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
            
            <div className="absolute -top-2 -left-2 w-10 h-10 border-t-2 border-l-2 border-primary rounded-tl-lg z-10"></div>
            <div className="absolute -top-2 -right-2 w-10 h-10 border-t-2 border-r-2 border-primary rounded-tr-lg z-10"></div>
            <div className="absolute -bottom-2 -left-2 w-10 h-10 border-b-2 border-l-2 border-primary rounded-bl-lg z-10"></div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 border-b-2 border-r-2 border-primary rounded-br-lg z-10"></div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-video bg-[#050505] rounded-lg overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
              
              <div className="w-full h-full relative">
                {activeVideo && (isMovieUnlocked(activeVideo.title) || activeVideo.title.includes("Unfaithful")) ? (
                  <iframe 
                    key={activeVideo.url}
                    src={activeVideo.url}
                    className="w-full h-full border-0"
                    allowFullScreen
                    title={activeVideo.title}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-black/40 backdrop-blur-xl">
                    <div className="p-6 bg-primary/20 rounded-full border border-primary/30 animate-pulse">
                      <Lock className="w-12 h-12 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-black uppercase tracking-tighter">Content Locked</h3>
                      <p className="text-white/40 text-sm">Please verify payment to restore primary transmission</p>
                    </div>
                    <Button 
                      onClick={() => {
                        if (activeVideo) {
                          setSelectedMovie(activeVideo);
                          setIsPaymentModalOpen(true);
                        }
                      }}
                      className="bg-primary hover:bg-primary/80"
                    >
                      Unlock Now
                    </Button>
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

          {/* Ad Banner */}
          <div className="w-full mt-4 flex flex-col items-center">
             <div className="flex items-center gap-4 w-full mb-4">
              <div className="h-[1px] flex-grow bg-white/5"></div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">Recommended for you</span>
              <div className="h-[1px] flex-grow bg-white/5"></div>
            </div>
            <div className="w-full flex justify-center">
              <AdBanner />
            </div>
          </div>

          {/* Premium Video Grid Section */}
          <div className="pt-12 space-y-8">
            <div className="flex items-end justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Dynamic Collection</h2>
                <p className="text-xs text-muted-foreground font-bold tracking-[0.2em] uppercase">Powered by TMDb Network</p>
              </div>
              <div className="flex gap-2 mb-1">
                <div className="w-8 h-[2px] bg-primary"></div>
                <div className="w-2 h-[2px] bg-white/20"></div>
                <div className="w-2 h-[2px] bg-white/20"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie, i) => (
                <MovieCard
                  key={`${movie.id}-${i}`}
                  movie={movie}
                  i={i}
                  isAdmin={isAdmin}
                  isMovieUnlocked={isMovieUnlocked}
                  setActiveVideo={setActiveVideo}
                  setSelectedMovie={setSelectedMovie}
                  setIsPaymentModalOpen={setIsPaymentModalOpen}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-8">
                <Button 
                  onClick={loadMore} 
                  disabled={isLoading}
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 uppercase tracking-widest font-black italic"
                >
                  {isLoading ? "Synchronizing..." : "Expand Network"}
                </Button>
              </div>
            )}
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
