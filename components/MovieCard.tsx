import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Movie, tmdb } from '@/lib/tmdb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const rating = movie.vote_average.toFixed(1);
  const releaseYear = new Date(movie.release_date || movie.first_air_date || '').getFullYear() || 'N/A';

  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="group relative overflow-hidden border-none bg-transparent movie-card-hover glass-card">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={tmdb.getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title || movie.name || 'Movie Poster'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
            sizes="200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <Badge className="w-fit mb-2 bg-primary hover:bg-primary shadow-[0_0_10px_rgba(229,9,20,0.5)]">
              <Star className="w-3 h-3 mr-1 fill-white" />
              {rating}
            </Badge>
            <h3 className="text-white font-black text-sm line-clamp-2 leading-tight uppercase tracking-tighter">{movie.title || movie.name}</h3>
          </div>
        </div>
        <CardContent className="p-3 bg-black/60 backdrop-blur-sm">
          <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title || movie.name}
          </h3>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{releaseYear}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
