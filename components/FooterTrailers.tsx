'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Film, ChevronRight, Sparkles } from 'lucide-react';
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
    <div className="mt-8 relative group/trailers overflow-hidden">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-primary animate-pulse" />
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
            System_Trailers <span className="text-primary/50 text-[8px] font-mono">NODE_77</span>
          </h4>
        </div>
        <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="flex items-center gap-1 text-[9px] font-mono text-primary/40 uppercase">
          <Sparkles className="w-2.5 h-2.5" />
          Neural_Ingest
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2 snap-x">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="min-w-[180px] aspect-video rounded-xl bg-white/5 animate-pulse border border-white/5" />
          ))
        ) : (
          trailers.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.05, y: -5 }}
              className="min-w-[180px] lg:min-w-[220px] aspect-video relative rounded-xl overflow-hidden glass-card border border-white/5 snap-start group/card cursor-pointer shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              <Image
                src={tmdb.getImageUrl(movie.backdrop_path || movie.poster_path, 'w500')}
                alt={movie.title}
                fill
                className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                <div className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">
                  <Play className="w-5 h-5 fill-black ml-1" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-[10px] font-black text-white uppercase truncate tracking-wide">
                  {movie.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[7px] font-mono text-primary bg-primary/10 px-1 rounded">TRAILER</span>
                  <span className="text-[7px] font-mono text-white/40 uppercase">{movie.release_date}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Swipe Bar Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          animate={{ x: [-96, 96] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-full bg-primary/40 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
        />
      </div>
    </div>
  );
}
