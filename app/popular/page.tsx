import { tmdb, Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Flame } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PopularPage() {
  const { results } = await tmdb.getPopular();

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <Flame className="w-8 h-8" />
            <h1 className="text-4xl font-black tracking-tighter uppercase">Popular Movies</h1>
          </div>
          <p className="text-muted-foreground">Current fan favorites and trending hits.</p>
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
