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
import { AdManager } from '@/components/AdManager';
import { CinematicBanner } from '@/components/CinematicBanner';
import { HologramTrailers } from '@/components/HologramTrailers';
import { EarthZoomContact } from '@/components/EarthZoomContact';

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
  try {
    const trendingData = await tmdb.getTrending();
    const trendingMovies = trendingData.results?.slice(0, 5) || [];

    if (trendingMovies.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
          <h1 className="text-2xl font-bold mb-4">Welcome to Taling Pangu</h1>
          <p className="text-muted-foreground">Unable to load trending movies at the moment. Please check your API configuration.</p>
        </div>
      );
    }

    // Fetch full details for hero movies to get trailers
    const heroMovies: MovieDetails[] = await tmdb.getMultipleMovieDetails(trendingMovies.map((m: Movie) => m.id));

    return (
      <div className="flex flex-col">
        <AutoRefresh />
        <AdManager />
        <EarthZoomContact />
        <Hero movies={heroMovies} />
        
        <div className="flex flex-col gap-8">

        {/* Ad Placement */}
        <div className="container mx-auto px-4 py-8">
          <AdBanner className="mt-8 mb-4" />
        </div>

        {/* Movie Rows */}
        <div className="space-y-8 pb-20">
          <MovieRow title="Now Playing" fetcher={tmdb.getNowPlaying} />
          
          {/* Ad Between Sections */}
          <div className="container mx-auto px-4 py-6">
            <AdBanner />
          </div>

          <MovieRow title="Popular Movies" fetcher={tmdb.getPopular} />
          
          {/* Ad Between Sections */}
          <div className="container mx-auto px-4 py-6">
            <AdBanner />
          </div>

          <MovieRow title="Top Rated" fetcher={tmdb.getTopRated} />
          
          {/* Ad Between Sections */}
          <div className="container mx-auto px-4 py-6">
            <AdBanner />
          </div>

          <CinematicBanner />

          <MovieRow title="Upcoming" fetcher={tmdb.getUpcoming} />

          <HologramTrailers />
        </div>
      </div>
    </div>
    );
  } catch (error) {
    console.error('Error in HomePage:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground">We encountered an error loading the home page. Please try again later.</p>
      </div>
    );
  }
}
