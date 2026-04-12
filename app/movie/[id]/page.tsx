import Image from 'next/image';
import { Star, Clock, Calendar, Play, Users, Film } from 'lucide-react';
import { tmdb, MovieDetails } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrailerModal } from '@/components/TrailerModal';
import { WatchlistButton } from '@/components/WatchlistButton';
import { AdBanner } from '@/components/AdBanner';
import { AdNative } from '@/components/AdNative';
import Link from 'next/link';

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

  const directLink = "https://www.profitablecpmratenetwork.com/xhh6ge039?key=807476d0bfc69921208717114f0095bf";

  return (
    <div className="min-h-screen pb-20">
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
            
            {/* Sidebar Ad Area */}
            <div className="mt-8 space-y-6 sticky top-24">
              <div className="ad-container p-2">
                <AdNative />
              </div>
              
              <div className="p-4 rounded-xl bg-secondary/10 border border-white/5 text-center">
                <h4 className="text-xs font-black text-primary mb-4 uppercase tracking-widest">Trending Now</h4>
                <div className="space-y-4">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Top rated movies this week</p>
                </div>
              </div>

              <div className="ad-container p-2">
                <AdBanner className="scale-75 origin-center" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-8 pt-20 md:pt-40">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{movie.title}</h1>
              
              {/* Top Banner Ad */}
              <AdBanner className="my-4" />

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

            {/* Monetization Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Link href={`/movie/${id}/watch`} className="w-full">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-black text-lg h-16 rounded-xl shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-all hover:scale-[1.02]">
                  <Play className="w-6 h-6 mr-2 fill-white" />
                  WATCH NOW (HD)
                </Button>
              </Link>
              <a href={directLink} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button size="lg" variant="outline" className="w-full border-primary/50 hover:bg-primary/10 text-primary font-black text-lg h-16 rounded-xl transition-all hover:scale-[1.02]">
                  DOWNLOAD NOW
                </Button>
              </a>
            </div>

            {/* Fake Download Buttons for CTR */}
            <div className="flex flex-wrap gap-4">
              <a href={directLink} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" className="bg-green-600/20 hover:bg-green-600/40 text-green-500 border border-green-600/30">
                  Download Server 1 (Fast)
                </Button>
              </a>
              <a href={directLink} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-500 border border-blue-600/30">
                  Download Server 2 (HD)
                </Button>
              </a>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Film className="w-6 h-6 text-primary" />
                Overview
              </h3>
              <p className="text-lg leading-relaxed text-muted-foreground max-w-4xl">
                {movie.overview}
              </p>
              
              {/* Native Ad below description */}
              <AdNative />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {trailer && (
                <TrailerModal 
                  trailerKey={trailer.key} 
                  title={movie.title}
                  className="bg-secondary hover:bg-secondary/80 text-white font-bold px-8 h-14 rounded-full"
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
