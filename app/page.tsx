import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star } from 'lucide-react';
import { AdBanner } from '@/components/AdBanner';
import { tmdb, Movie, MovieDetails } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { TrailerModal } from '@/components/TrailerModal';
import { AutoRefresh } from '@/components/AutoRefresh';
import { Hero } from '@/components/Hero';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // Refresh every 5 minutes

async function MovieRow({ title, fetcher }: { title: string, fetcher: () => Promise<{ results: Movie[] }> }) {
  const { results } = await fetcher();
  
  const routeMap: Record<string, string> = {
    'Popular Movies': '/popular',
    'Top Rated': '/top-rated',
    'Upcoming': '/upcoming',
    'Now Playing': '/trending' // Fallback to trending for now or a specific route
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

  return (
    <div className="flex flex-col gap-8">
      <AutoRefresh />
      
      <Hero movie={heroMovie} />

      {/* Ad Placement */}
      <div className="container mx-auto px-4 py-4">
        <AdBanner id="1026be2f67d070ed95d941d9840c7084" />
      </div>

      {/* Movie Rows */}
      <div className="space-y-8 pb-20">
        <MovieRow title="Now Playing" fetcher={tmdb.getNowPlaying} />
        <MovieRow title="Popular Movies" fetcher={tmdb.getPopular} />
        
        {/* In-content Ad */}
        <div className="container mx-auto px-4 py-4">
          <AdBanner id="1026be2f67d070ed95d941d9840c7084" />
        </div>

        <MovieRow title="Top Rated" fetcher={tmdb.getTopRated} />
        <MovieRow title="Upcoming" fetcher={tmdb.getUpcoming} />
      </div>
    </div>
  );
}
