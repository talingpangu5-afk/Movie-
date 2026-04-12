import { tmdb, Movie } from '@/lib/tmdb';
import { MovieCard } from '@/components/MovieCard';
import { Search as SearchIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const { q } = await searchParams;
  const { results } = await tmdb.search(q || '');
  
  const movies = results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 min-h-screen">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-primary">
            <SearchIcon className="w-6 h-6" />
            <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
          </div>
          <p className="text-muted-foreground">
            Showing results for &quot;<span className="text-foreground font-medium">{q}</span>&quot;
          </p>
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-6 gap-6">
            {movies.map((movie: Movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <SearchIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">No results found</h2>
              <p className="text-muted-foreground max-w-md">
                We couldn&apos;t find any movies or TV shows matching your search. Try different keywords or check for typos.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
