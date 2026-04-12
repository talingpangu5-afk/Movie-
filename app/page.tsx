import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star } from 'lucide-react';
import { tmdb, Movie, MovieDetails } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { TrailerModal } from '@/components/TrailerModal';
import { AdBanner } from '@/components/AdBanner';
import { AdNative } from '@/components/AdNative';

async function MovieRow({ title, fetcher }: { title: string, fetcher: () => Promise<{ results: Movie[] }> }) {
  const { results } = await fetcher();
  
  const routeMap: Record<string, string> = {
    'Popular Movies': '/popular',
    'Top Rated': '/top-rated',
    'Upcoming': '/upcoming'
  };

  const href = routeMap[title] || '/';
  
  return (
    <section className="py-4 group/row">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black uppercase tracking-tighter group-hover/row:text-primary transition-colors">{title}</h2>
          <Link href={href} className="text-muted-foreground text-xs font-bold hover:text-primary transition-colors uppercase tracking-widest">
            Explore All
          </Link>
        </div>
        
        {/* Horizontal Scroll Row */}
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
          {results.map((movie) => (
            <div key={movie.id} className="min-w-[180px] w-[180px] snap-start">
              <MovieCard movie={movie} />
            </div>
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
    <div className="flex flex-col">
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
              <span className="uppercase tracking-widest text-xs">Trending Today</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter max-w-3xl text-shadow uppercase">
              {heroMovie.title}
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl line-clamp-3 text-shadow font-medium">
              {heroMovie.overview}
            </p>
            <div className="flex items-center gap-4 pt-4">
              {trailer ? (
                <TrailerModal 
                  trailerKey={trailer.key} 
                  title={heroMovie.title}
                  className="bg-primary hover:bg-primary/90 text-white font-black px-10 h-14 rounded-xl shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                >
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-black px-10 h-14 rounded-xl">
                    <Play className="w-6 h-6 mr-2 fill-white" />
                    WATCH NOW
                  </Button>
                </TrailerModal>
              ) : (
                <Link href={`/movie/${heroMovie.id}`}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-black px-10 h-14 rounded-xl">
                    <Play className="w-6 h-6 mr-2 fill-white" />
                    WATCH NOW
                  </Button>
                </Link>
              )}
              <Link href={`/movie/${heroMovie.id}`}>
                <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black px-10 h-14 rounded-xl border border-white/10">
                  <Info className="w-6 h-6 mr-2" />
                  DETAILS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Ad Placement 1: Below Hero */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <AdBanner className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/5" />
      </div>

      {/* Movie Rows with Integrated Ads */}
      <div className="space-y-4 py-10">
        <MovieRow title="Popular Movies" fetcher={tmdb.getPopular} />
        
        {/* Strategic Ad Placement 2: Native Ad between rows */}
        <div className="container mx-auto px-4">
          <AdNative className="my-6" />
        </div>

        <MovieRow title="Top Rated" fetcher={tmdb.getTopRated} />
        
        {/* Strategic Ad Placement 3: Banner Ad between rows */}
        <div className="container mx-auto px-4">
          <AdBanner className="my-6" />
        </div>

        <MovieRow title="Upcoming" fetcher={tmdb.getUpcoming} />
        
        {/* Strategic Ad Placement 4: Native Ad at bottom */}
        <div className="container mx-auto px-4">
          <AdNative className="my-6" />
        </div>
      </div>
    </div>
  );
}
