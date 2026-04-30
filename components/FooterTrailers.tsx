'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Film, Sparkles } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import Image from 'next/image';

export function FooterTrailers() {
  const [trailers, setTrailers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const data = await tmdb.getUpcoming(1);
        setTrailers(data.results.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch footer trailers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrailers();
  }, []);

  return (
    <div className="relative group/trailers mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-primary animate-pulse" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
            System_Trailers
          </h4>
        </div>
        <div className="flex items-center gap-1 text-[8px] font-mono text-primary/40 uppercase">
          <Sparkles className="w-2.5 h-2.5" />
          Live_Feed
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 snap-x">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[140px] aspect-video rounded-lg bg-white/5 animate-pulse border border-white/5" />
            ))
          ) : (
            trailers.map((movie) => (
              <motion.div
                key={movie.id}
                whileHover={{ scale: 1.05, y: -2 }}
                className="min-w-[140px] aspect-video relative rounded-lg overflow-hidden glass-card border border-white/5 snap-start group/card cursor-pointer shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <Image
                  src={tmdb.getImageUrl(movie.backdrop_path || movie.poster_path, 'w500')}
                  alt={movie.title}
                  fill
                  className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                  <Play className="w-6 h-6 fill-primary text-primary" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="text-[8px] font-black text-white uppercase truncate tracking-wide">
                    {movie.title}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Swipe Bar Indicator */}
        <div className="w-full h-8 flex flex-col items-center justify-center relative mt-2">
          <div className="w-full h-[1px] bg-white/5 absolute top-1/2 -translate-y-1/2" />
          <motion.div 
            animate={{ 
              x: ['-50%', '50%'],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              repeatType: "mirror"
            }}
            className="w-16 h-[2px] bg-primary relative z-10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] flex items-center justify-between px-1"
          >
            <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
          </motion.div>
          <div className="text-[6px] font-mono text-primary/40 uppercase tracking-[0.4em] mt-4">
            SYST_SCROLL_SENSE
          </div>
        </div>
      </div>
    </div>
  );
}
