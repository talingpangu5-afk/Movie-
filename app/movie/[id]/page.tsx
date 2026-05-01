'use client';

import Image from 'next/image';
import { use, useState, useEffect } from 'react';
import { Star, Clock, Calendar, Play, Users, Film, Loader2, Maximize2, Minimize2, ShieldCheck, Zap } from 'lucide-react';
import { tmdb, MovieDetails } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrailerModal } from '@/components/TrailerModal';
import { WatchlistButton } from '@/components/WatchlistButton';
import { AdBanner } from '@/components/AdBanner';
import { cn } from '@/lib/utils';

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullView, setIsFullView] = useState(false);

  useEffect(() => {
    async function loadMovie() {
      try {
        const data = await tmdb.getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error('Failed to load movie details:', error);
      } finally {
        // Ensure "Neural Stream" clears by setting a reasonable timeout
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
      }
    }
    loadMovie();
  }, [id]);

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden">
        <div className="relative">
          <div className="absolute -inset-20 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -inset-40 bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-700" />
          
          <div className="relative flex flex-col items-center gap-8">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-primary/20 rounded-full animate-ping" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-black italic tracking-[0.2em] text-primary uppercase animate-pulse">NEURAL_STREAM_ALPHA</h2>
              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> BUFFERING_FLUX</span>
                <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                <span>SYNCING_VOIDS</span>
              </div>
            </div>
            
            <div className="w-64 h-1 bg-muted/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
        <style jsx global>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }
  
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';

  return (
    <div className={cn("min-h-screen pb-20 transition-all duration-500", isFullView ? "bg-black" : "bg-background")}>
      <div className={cn(
        "relative transition-all duration-700 ease-in-out",
        isFullView ? "h-0 opacity-0 pointer-events-none" : "h-[60vh] opacity-100"
      )}>
        <Image
          src={tmdb.getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
          priority
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className={cn(
        "container mx-auto px-4 relative z-10 transition-all duration-700",
        isFullView ? "mt-0 pt-8" : "-mt-64"
      )}>
        <div className={cn(
          "flex flex-col gap-12",
          isFullView ? "md:flex-col" : "md:flex-row"
        )}>
          <div className={cn(
            "w-full md:w-1/3 lg:w-1/4 shrink-0 transition-all duration-500",
            isFullView ? "hidden" : "block shadow-2xl"
          )}>
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
              <Image
                src={tmdb.getImageUrl(movie.poster_path, 'w780')}
                alt={movie.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-8 w-full">
              <AdBanner />
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div className={cn(
              "space-y-4 transition-all duration-500",
              isFullView ? "hidden" : "pt-20 md:pt-40"
            )}>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic">{movie.title}</h1>
              <p className="text-xl text-primary font-medium italic opacity-80">{movie.tagline}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-foreground text-lg">{movie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{movie.runtime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{releaseDate}</span>
                </div>
              </div>
            </div>

            <div className={cn(
              "space-y-6 transition-all duration-500",
              isFullView ? "pt-0 max-w-[95vw] mx-auto" : "pt-12"
            )} id="watch-now">
              <div className="flex items-center justify-between bg-muted/5 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-primary uppercase italic tracking-tighter">
                    <Play className="w-5 h-5 fill-current" />
                    {isFullView ? "SYNCHRONIZED_MODE" : "SOURCE_ALPHA_STREAM"}
                  </h3>
                  {!isFullView && (
                    <Badge variant="outline" className="text-primary border-primary/30 font-black animate-pulse bg-primary/5 uppercase text-[9px] tracking-widest px-3 hidden sm:flex">
                      ULTRA_HD_ACTIVE
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullView(!isFullView)}
                  className="rounded-xl border-white/10 bg-white/5 hover:bg-primary hover:text-white font-black text-[10px] tracking-tighter transition-all h-10 px-6 shadow-lg shadow-black/20"
                >
                  {isFullView ? (
                    <>
                      <Minimize2 className="w-4 h-4 mr-2" /> RESTORE VIEW
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4 mr-2" /> THEATER_FULL_VIEW
                    </>
                  )}
                </Button>
              </div>

              <div className={cn(
                "relative transition-all duration-700 ease-out rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)] border bg-black group",
                isFullView 
                  ? "aspect-[21/9] border-primary/40 scale-[1.01]" 
                  : "aspect-video border-white/5"
              )}>
                <iframe
                  src={`https://vidsrc.xyz/embed/movie/${id}`}
                  title={`${movie.title} Full Movie`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                />
              </div>

              {!isFullView && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest bg-muted/5 p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                    Signal: Stable
                  </div>
                  <div>Format: HEVC_10BIT_HD</div>
                  <div>Audio: ATMOS_7.1</div>
                  <div className="text-primary/60">Node: AIS_PREMIUM</div>
                </div>
              )}
            </div>

            {!isFullView && (
              <>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button 
                    onClick={() => {
                      const el = document.getElementById('watch-now');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-primary hover:bg-primary/90 text-white font-black px-12 h-14 rounded-full shadow-[0_0_20px_rgba(255,242,0,0.3)] transition-all hover:scale-105"
                  >
                    <Play className="w-5 h-5 mr-3 fill-current" />
                    INITIALIZE STREAM
                  </Button>
                  {trailer && (
                    <TrailerModal 
                      trailerKey={trailer.key} 
                      title={movie.title}
                      className="bg-secondary/20 hover:bg-secondary/40 text-white font-bold px-8 h-14 rounded-full border border-white/10"
                    />
                  )}
                  <WatchlistButton movieTitle={movie.title} />
                </div>

                <Separator className="bg-muted/30" />

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2 uppercase italic tracking-tighter">
                    <Film className="w-6 h-6 text-primary" />
                    Transmission_Log
                  </h3>
                  <p className="text-lg leading-relaxed text-muted-foreground max-w-4xl">
                    {movie.overview}
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2 uppercase italic tracking-tighter">
                    <Users className="w-6 h-6 text-primary" />
                    Cortex_Actors
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {movie.credits?.cast?.slice(0, 5).map(person => (
                      <div key={person.id} className="space-y-3 group text-center">
                        <div className="relative aspect-square rounded-2xl rotate-3 group-hover:rotate-0 transition-transform overflow-hidden border-2 border-muted hover:border-primary shadow-xl">
                          <Image
                            src={tmdb.getImageUrl(person.profile_path, 'w185')}
                            alt={person.name}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tighter uppercase">{person.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase opacity-60">{person.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
