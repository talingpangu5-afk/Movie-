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

const SERIES_COLLECTION = [
  { 
    id: "premium-series-1", 
    title: "The Silent Vault", 
    genre: "Thriller", 
    rating: "9.8", 
    year: "2024", 
    url: "https://ok.ru/videoembed/4617548401253", 
    description: "A premium thriller series exclusive to our high-tier subscribers.",
    image: "https://picsum.photos/seed/vault/500/750" 
  },
  { 
    id: "premium-series-2", 
    title: "Shadow Protocol", 
    genre: "Action", 
    rating: "9.5", 
    year: "2024", 
    url: "https://ok.ru/videoembed/2814491562457", 
    description: "Dive into a world of espionage and high-stakes action.",
    image: "https://picsum.photos/seed/protocol/500/750" 
  }
];

function MovieCard({ movie, i, isAdmin, isMovieUnlocked, setActiveVideo, setSelectedMovie, setIsPaymentModalOpen }: any) {
  const [imgSrc, setImgSrc] = useState(movie.poster_path ? tmdb.getImageUrl(movie.poster_path, 'w500') : movie.image);
  const [isLoading, setIsLoading] = useState(true);
  const fallbackImg = "https://picsum.photos/seed/cinema-poster/500/750";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * (i % 8) }}
      className="group relative cursor-pointer"
      onClick={() => {
        if (isMovieUnlocked(movie.title)) {
          if (movie.url !== "#") {
            setActiveVideo(movie as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            toast.info("Source synchronization in progress. Content available soon.");
          }
        } else {
          setSelectedMovie(movie);
          setIsPaymentModalOpen(true);
          toast.info("Premium content requires verification");
        }
      }}
    >
      <div className="relative aspect-[2/3] bg-secondary/20 rounded-xl overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-primary/50 group-hover:translate-y-[-8px]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"></div>
        
        {isLoading && (
          <div className="absolute inset-0 z-20">
            <Skeleton className="w-full h-full rounded-none" />
          </div>
        )}

        {/* Status Indicator */}
        <div className="absolute top-3 left-3 z-30 flex gap-2">
           {isAdmin && (
             <div className="px-2 py-0.5 bg-green-500/20 backdrop-blur-md rounded text-[9px] font-black text-green-500 border border-green-500/30 flex items-center gap-1">
               <ShieldCheck className="w-3 h-3" />
               MASTER
             </div>
           )}
           {!isMovieUnlocked(movie.title) && (
             <div className="px-2 py-0.5 bg-red-500/20 backdrop-blur-md rounded text-[9px] font-black text-red-500 border border-red-500/30 flex items-center gap-1">
               <Lock className="w-3 h-3" />
               LOCKED
             </div>
           )}
        </div>

        {/* Poster */}
        {imgSrc && (
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
        )}

        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-black text-primary border border-primary/30 z-20">
          WATCH NOW
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

        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] z-30">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center scale-75 group-hover:scale-100 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function WebSeriesPage() {
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [series, setSeries] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchSeries = async (pageToFetch: number) => {
    try {
      setIsLoading(true);
      const [trendingData, popularData] = await Promise.all([
        tmdb.getTrendingTV(pageToFetch),
        tmdb.getPopularTV(pageToFetch)
      ]);
      
      const combinedResults = [
        ...trendingData.results,
        ...popularData.results
      ];
      
      const uniqueSeries = Array.from(new Map(combinedResults.map(item => [item.id, item])).values());
      
      const formatted = uniqueSeries.map((s: any) => ({
        id: s.id,
        title: s.name || s.original_name,
        genre: "Web Series",
        rating: s.vote_average?.toFixed(1) || "0.0",
        year: new Date(s.first_air_date || "").getFullYear() || "2024",
        url: "#", 
        description: s.overview,
        poster_path: s.poster_path,
        backdrop_path: s.backdrop_path
      }));

      setSeries(prev => {
        const base = pageToFetch === 1 ? SERIES_COLLECTION : [];
        return [...base, ...(pageToFetch === 1 ? formatted : [...prev, ...formatted])];
      });
      
      if (pageToFetch === 1) {
        setActiveVideo(SERIES_COLLECTION[0] || formatted[0]);
      }
      
      setHasMore(formatted.length > 0);
    } catch (error) {
      console.error("Error fetching series:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    const premiumStatus = localStorage.getItem('isPremium');
    if (adminStatus === 'true') setIsAdmin(true);
    if (premiumStatus === 'true') setIsPremium(true);
    fetchSeries(1);
  }, []);

  const handleVerified = () => {
    localStorage.setItem('isPremium', 'true');
    setIsPremium(true);
    toast.success("Verification successful! Premium access granted.");
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSeries(nextPage);
  };

  const isMovieUnlocked = (title: string) => {
    return isAdmin || isPremium;
  };

  if (!activeVideo && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-primary font-bold tracking-widest uppercase text-xs">Synchronizing Web Series Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block"
            >
              <span className="px-3 py-1 text-[10px] font-bold tracking-[0.3em] uppercase bg-primary/10 text-primary border border-primary/20 rounded-full mb-4">
                Now Streaming
              </span>
            </motion.div>
            
            <div className="space-y-2">
              <motion.h1 
                key={`${activeVideo?.title}-title`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 select-none uppercase line-clamp-2"
              >
                {activeVideo?.title}
              </motion.h1>
            </div>

            <motion.p 
              key={`${activeVideo?.title}-desc`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed italic line-clamp-3"
            >
              {activeVideo?.description}
            </motion.p>
          </div>

          {/* Player */}
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
              <div className="w-full h-full relative">
                {activeVideo && isMovieUnlocked(activeVideo.title) ? (
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
          </div>

          {/* Ad Banner */}
          <div className="w-full mt-4 flex flex-col items-center">
            <AdBanner />
          </div>

          {/* Grid */}
          <div className="pt-12 space-y-8">
            <div className="flex items-end justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">Web Series Hub</h2>
                <p className="text-xs text-muted-foreground font-bold tracking-[0.2em] uppercase">Premium Series & Episodes</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {series.map((item, i) => (
                <MovieCard
                  key={`${item.id}-${i}`}
                  movie={item}
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
                  {isLoading ? "Synchronizing..." : "Load More Series"}
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-12 border-t border-white/5">
            <AdBanner />
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onVerified={handleVerified}
        title={selectedMovie?.title}
      />
    </div>
  )
}
