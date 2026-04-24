'use client'

import { motion } from 'motion/react'
import { AdBanner } from '@/components/AdBanner'
import { useEffect, useState, useCallback } from 'react'
import { tmdb } from '@/lib/tmdb'
import { MovieCard } from '@/components/MovieCard'
import { Button } from '@/components/ui/button'

interface HubCategoryPageProps {
  title: string;
  subtitle?: string;
  fetcher: (page: number) => Promise<any>;
}

export function HubCategoryPage({ title, subtitle, fetcher }: HubCategoryPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async (pageToFetch: number) => {
    try {
      setIsLoading(true);
      const data = await fetcher(pageToFetch);
      
      const results = data.results || [];
      const formatted = results.map((m: any) => ({
        id: m.id,
        title: m.title || m.name,
        genre: m.genre_ids?.[0] ? "Premium" : "Entertainment",
        rating: m.vote_average?.toFixed(1) || "0.0",
        year: new Date(m.release_date || m.first_air_date || "").getFullYear() || "2024",
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        overview: m.overview
      }));

      setItems(prev => pageToFetch === 1 ? formatted : [...prev, ...formatted]);
      setHasMore(formatted.length > 0);
    } catch (error) {
      console.error(`Error fetching ${title}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, title]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block"
            >
              <span className="px-3 py-1 text-[10px] font-bold tracking-[0.3em] uppercase bg-primary/10 text-primary border border-primary/20 rounded-full mb-4">
                Service Hub Exclusive
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic"
            >
              {title}
            </motion.h1>
            
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-sm uppercase tracking-[0.2em] font-bold"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* Grid Section */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {items.map((item, i) => (
                <MovieCard
                  key={`${item.id}-${i}`}
                  movie={item}
                />
              ))}
            </div>

            {hasMore ? (
              <div className="flex justify-center pt-8">
                <Button 
                  onClick={loadMore} 
                  disabled={isLoading}
                  variant="outline"
                  className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 uppercase tracking-widest font-black italic"
                >
                  {isLoading ? "Loading..." : "Load More"}
                </Button>
              </div>
            ) : items.length > 0 && (
              <p className="text-center text-white/20 uppercase tracking-widest text-[10px] font-bold pt-8">
                End of Transmission
              </p>
            )}

            {items.length === 0 && !isLoading && (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                <p className="text-white/40 uppercase tracking-widest text-sm font-bold">No data found in this frequency</p>
              </div>
            )}
          </div>

          {/* Ad Placement - Requirement: "Category click hone ke baad open hota unke niche ads placements karo" */}
          <div className="pt-12 border-t border-white/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] flex-grow bg-white/5"></div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold italic">Promoted Content</span>
              <div className="h-[1px] flex-grow bg-white/5"></div>
            </div>
            <div className="flex justify-center w-full">
              <AdBanner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
