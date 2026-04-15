import Image from 'next/image';
import { Star, Clock, Calendar, Play, Users, Film } from 'lucide-react';
import { tmdb, MovieDetails } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrailerModal } from '@/components/TrailerModal';
import { WatchlistButton } from '@/components/WatchlistButton';
import { AdBanner } from '@/components/AdBanner';
import { PythonEngine } from '@/components/PythonEngine';

export const dynamic = 'force-dynamic';

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie: MovieDetails = await tmdb.getMovieDetails(id);
  
  const trailer = movie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';

  return (
    <div className="min-h-screen pb-20">
      <PythonEngine />
      {/* Backdrop Hero */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={tmdb.getImageUrl(movie.backdrop_path)}
          alt={movie.title}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className="container mx-auto px-4 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
              <Image
                src={tmdb.getImageUrl(movie.poster_path, 'w500')}
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
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{movie.title}</h1>
              <p className="text-xl text-primary font-medium italic opacity-80">{movie.tagline}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-foreground text-lg">{movie.vote_average.toFixed(1)}</span>
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
                {movie.genres.map(genre => (
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
              {trailer && (
                <TrailerModal 
                  trailerKey={trailer.key} 
                  title={movie.title}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-14 rounded-full"
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
                {movie.credits.cast.slice(0, 5).map(person => (
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

            {/* Trailer Embed */}
            {trailer && (
              <div className="space-y-6 pt-12">
                <h3 className="text-2xl font-bold">Official Trailer</h3>
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-muted/20">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
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
