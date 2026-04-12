import { tmdb, Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TrendingPage() {
  const { results } = await tmdb.getTrending();

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-4xl font-black tracking-tighter uppercase">Trending Movies</h1>
          </div>
          <p className="text-muted-foreground">The most watched movies today across the globe.</p>
        </div>

        <div className="grid grid-cols-6 gap-6">
          {results.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
