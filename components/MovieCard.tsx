'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { Movie, tmdb } from '@/lib/tmdb';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const rating = movie.vote_average?.toFixed(1) || 'N/A';
  const releaseYear = new Date(movie.release_date || movie.first_air_date || '').getFullYear() || 'N/A';
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(tmdb.getImageUrl(movie.poster_path, 'w500'));
  const fallbackImg = '/placeholder-movie.jpg';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/movie/${movie.id}`}>
        <Card className="group relative overflow-hidden border-none bg-transparent movie-card-hover">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary/20">
            {isLoading && (
              <div className="absolute inset-0 z-10">
                <Skeleton className="w-full h-full rounded-none" />
              </div>
            )}
            
            <Image
              src={imgSrc}
              alt={movie.title || movie.name || 'Movie Poster'}
              fill
              loading="lazy"
              className={`object-cover transition-all duration-500 group-hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              referrerPolicy="no-referrer"
              sizes="(max-width: 768px) 50vw, 200px"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setImgSrc(fallbackImg);
                setIsLoading(false);
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
              <Badge className="w-fit mb-2 bg-primary hover:bg-primary">
                <Star className="w-3 h-3 mr-1 fill-white" />
                {rating}
              </Badge>
              <h3 className="text-white font-bold text-sm line-clamp-2">{movie.title || movie.name}</h3>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
              </div>
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
