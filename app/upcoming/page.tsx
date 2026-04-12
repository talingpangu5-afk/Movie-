import { tmdb, Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Calendar } from 'lucide-react';
import { AdBanner } from '@/components/AdBanner';
import { AdNative } from '@/components/AdNative';

export const dynamic = 'force-dynamic';

export default async function UpcomingPage() {
  const { results } = await tmdb.getUpcoming();

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <Calendar className="w-8 h-8" />
            <h1 className="text-4xl font-black tracking-tighter uppercase">Upcoming</h1>
          </div>
          <p className="text-muted-foreground">Movies coming soon to theaters near you.</p>
        </div>

        <AdBanner />

        <div className="grid grid-cols-6 gap-6">
          {results.slice(0, 12).map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <AdNative />

        <div className="grid grid-cols-6 gap-6">
          {results.slice(12).map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <AdBanner className="mt-12" />
      </div>
    </div>
  );
}
