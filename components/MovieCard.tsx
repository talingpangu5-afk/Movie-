'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';
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
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/movie/${movie.id}`}>
        <Card className="group relative overflow-hidden border-none bg-transparent movie-card-hover">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
            <Image
              src={tmdb.getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title || movie.name || 'Movie Poster'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              referrerPolicy="no-referrer"
              sizes="(max-width: 768px) 50vw, 200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <Badge className="w-fit mb-2 bg-primary hover:bg-primary">
                <Star className="w-3 h-3 mr-1 fill-white" />
                {rating}
              </Badge>
              <h3 className="text-white font-bold text-sm line-clamp-2">{movie.title || movie.name}</h3>
            </div>
          </div>
          <CardContent className="p-2">
            <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {movie.title || movie.name}
            </h3>
            <p className="text-xs text-muted-foreground">{releaseYear}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
