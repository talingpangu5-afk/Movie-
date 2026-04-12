import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star } from 'lucide-react';
import { tmdb, Movie, MovieDetails } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { TrailerModal } from '@/components/TrailerModal';

async function MovieRow({ title, fetcher }: { title: string, fetcher: () => Promise<{ results: Movie[] }> }) {
  const { results } = await fetcher();
  
  const routeMap: Record<string, string> = {
    'Popular Movies': '/popular',
    'Top Rated': '/top-rated',
    'Upcoming': '/upcoming'
  };

  const href = routeMap[title] || '/';
  
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <Link href={href} className="text-primary text-sm font-medium hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-6 gap-6">
          {results.slice(0, 6).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const trendingData = await tmdb.getTrending();
  const heroMovieBasic = trendingData.results?.[0];

  if (!heroMovieBasic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to Movie World</h1>
        <p className="text-muted-foreground">Unable to load trending movies at the moment. Please check your API configuration.</p>
      </div>
    );
  }

  // Fetch full details for hero movie to get trailer
  const heroMovie: MovieDetails = await tmdb.getMovieDetails(heroMovieBasic.id.toString());
  const trailer = heroMovie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Banner */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src={tmdb.getImageUrl(heroMovie.backdrop_path)}
          alt={heroMovie.title}
          fill
          priority
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 flex flex-col justify-end pb-20">
          <div className="container mx-auto px-4 space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Star className="w-5 h-5 fill-primary" />
              <span>Trending Today</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter max-w-3xl text-shadow">
              {heroMovie.title}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl line-clamp-3 text-shadow">
              {heroMovie.overview}
            </p>
            <div className="flex items-center gap-4 pt-4">
              {trailer ? (
                <TrailerModal 
                  trailerKey={trailer.key} 
                  title={heroMovie.title}
                  className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-12"
                >
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
                    <Play className="w-5 h-5 mr-2 fill-white" />
                    Watch Now
                  </Button>
                </TrailerModal>
              ) : (
                <Link href={`/movie/${heroMovie.id}`}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8">
                    <Play className="w-5 h-5 mr-2 fill-white" />
                    Watch Now
                  </Button>
                </Link>
              )}
              <Link href={`/movie/${heroMovie.id}`}>
                <Button size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold px-8">
                  <Info className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Placement Placeholder */}
      <div className="container mx-auto px-4 py-4">
        <div className="w-full h-24 bg-secondary/20 rounded-lg flex items-center justify-center border border-dashed border-muted-foreground/30">
          <span className="text-muted-foreground text-sm uppercase tracking-widest">Advertisement</span>
        </div>
      </div>

      {/* Movie Rows */}
      <div className="space-y-8 pb-20">
        <MovieRow title="Popular Movies" fetcher={tmdb.getPopular} />
        
        {/* In-content Ad */}
        <div className="container mx-auto px-4 py-4">
          <div className="w-full h-32 bg-secondary/20 rounded-lg flex items-center justify-center border border-dashed border-muted-foreground/30">
            <span className="text-muted-foreground text-sm uppercase tracking-widest">Sponsored Content</span>
          </div>
        </div>

        <MovieRow title="Top Rated" fetcher={tmdb.getTopRated} />
        <MovieRow title="Upcoming" fetcher={tmdb.getUpcoming} />
      </div>
    </div>
  );
}
