import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Latest Movies - Watch & Explore',
  description: 'Explore the latest trending and popular movies. Watch trailers, check ratings, and find your next cinematic experience.',
};

interface MovieDetails {
  id: number;
  title: string;
  year: number;
  user_rating: number | null;
  plot_overview: string;
  poster: string | null;
}

async function getMovies(): Promise<MovieDetails[]> {
  const API_KEY = '7bYSR31aEB7yd760EBqE4qvs5fb4YOWCm3ipfI01';
  
  try {
    // Fetch popular movies list
    const listRes = await fetch(
      `https://api.watchmode.com/v1/list-titles/?apiKey=${API_KEY}&types=movie&sort_by=popularity_desc&limit=12`,
      { next: { revalidate: 3600 } }
    );
    
    if (!listRes.ok) {
      console.error('Failed to fetch movies list');
      return [];
    }
    
    const listData = await listRes.json();
    
    if (!listData.titles || !Array.isArray(listData.titles)) {
      return [];
    }

    // Fetch details for each movie
    const detailedMovies = await Promise.all(
      listData.titles.map(async (title: any) => {
        try {
          const detailRes = await fetch(
            `https://api.watchmode.com/v1/title/${title.id}/details/?apiKey=${API_KEY}`,
            { next: { revalidate: 3600 } }
          );
          if (!detailRes.ok) return null;
          return await detailRes.json();
        } catch (err) {
          console.error(`Failed to fetch details for ${title.id}`, err);
          return null;
        }
      })
    );
    
    return detailedMovies.filter(Boolean) as MovieDetails[];
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <div className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase neon-text">
          Latest Movies
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Explore the most popular and trending movies right now. Discover your next favorite cinematic experience.
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-2">No movies found</h2>
          <p className="text-muted-foreground">We couldn&apos;t load the movies at this time. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="group relative flex flex-col bg-secondary/20 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-1"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-secondary/50">
                {movie.poster ? (
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Poster
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                {movie.user_rating && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold">{movie.user_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-grow p-5 relative z-10 -mt-16">
                <h3 className="text-xl font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                  {movie.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{movie.year || 'N/A'}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-grow">
                  {movie.plot_overview || 'No description available for this movie.'}
                </p>

                <Link href={`/movie/${movie.id}`} className="mt-auto">
                  <Button className="w-full bg-primary/90 hover:bg-primary text-white font-bold transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Watch Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
