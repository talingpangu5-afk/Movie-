'use client';

import Image from 'next/image';
import { use, useState, useEffect } from 'react';
import { Star, Clock, Calendar, Play, Users, Film, Loader2 } from 'lucide-react';
import { tmdb, MovieDetails } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrailerModal } from '@/components/TrailerModal';
import { WatchlistButton } from '@/components/WatchlistButton';
import { AdBanner } from '@/components/AdBanner';

export const dynamic = 'force-dynamic';

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMovie() {
      try {
        const data = await tmdb.getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error('Failed to load movie details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMovie();
  }, [id]);

  if (isLoading || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-primary font-black uppercase tracking-widest text-xs">Synchronizing Neural Stream...</p>
        </div>
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
    <div className="min-h-screen pb-20">
      {/* Backdrop Hero */}
      <div className="relative h-[60vh] w-full">
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

      <div className="container mx-auto px-4 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
              <Image
                src={tmdb.getImageUrl(movie.poster_path, 'w780')}
                alt={movie.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Sidebar Ad */}
            <div className="mt-8 w-full">
              <AdBanner />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-8 pt-20 md:pt-40">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">{movie.title}</h1>
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

              <div className="flex flex-wrap gap-2 pt-2">
                {movie.genres?.map(genre => (
                  <Badge key={genre.id} variant="secondary" className="bg-secondary/50 hover:bg-primary hover:text-white transition-colors">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Film className="w-6 h-6 text-primary" />
                Overview
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground max-w-4xl">
                {movie.overview}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                onClick={() => document.getElementById('watch-now')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary hover:bg-primary/90 text-white font-black px-12 h-14 rounded-full shadow-[0_0_20px_rgba(255,242,0,0.3)] transition-all hover:scale-105"
              >
                <Play className="w-5 h-5 mr-3 fill-current" />
                WATCH IN FULL HD
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

            {/* Cast Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Top Cast
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {movie.credits?.cast?.slice(0, 5).map(person => (
                  <div key={person.id} className="space-y-3 group">
                    <div className="relative aspect-square rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors">
                      <Image
                        src={tmdb.getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm line-clamp-1">{person.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Watch Section */}
            <div className="space-y-6 pt-12" id="watch-now">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold flex items-center gap-2 text-primary uppercase italic">
                  <Play className="w-6 h-6 fill-current" />
                  Watch Full Movie (HD)
                </h3>
                <Badge variant="outline" className="text-primary border-primary/30 font-black animate-pulse">
                  ULTRA HD SOURCE
                </Badge>
              </div>
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/5 bg-black group">
                <iframe
                  src={`https://vidsrc.xyz/embed/movie/${id}`}
                  title={`${movie.title} Full Movie`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                />
                <div className="absolute top-4 right-4 pointer-events-none px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  DECRYPTED_1080P_ACTIVE
                </div>
              </div>
              <div className="flex flex-wrap gap-6 text-[10px] font-mono text-muted-foreground uppercase tracking-widest bg-muted/5 p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                  Primary Server: High-Bitrate Flux
                </div>
                <div className="w-px h-4 bg-muted/20 hidden sm:block" />
                <div>Codec: H.264 HEVC / 10bit</div>
                <div className="w-px h-4 bg-muted/20 hidden sm:block" />
                <div>Audio: Dolby Atmos 7.1</div>
                <div className="w-px h-4 bg-muted/20 hidden sm:block" />
                <div>Latency: 12ms</div>
              </div>
            </div>

            {/* Trailer Embed */}
            {trailer && (
              <div className="space-y-6 pt-12">
                <h3 className="text-2xl font-bold uppercase italic">Official Cinematic Trailer</h3>
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-muted/20">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?vq=hd1080`}
                    title={`${movie.title} Trailer`}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
