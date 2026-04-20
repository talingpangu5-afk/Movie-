'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Film, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TVShow {
  show: {
    id: number;
    name: string;
    image?: {
      medium: string;
      original: string;
    };
    summary?: string;
    url: string;
  };
}

export function EntertainmentDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [shows, setShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && shows.length === 0) {
      fetchEntertainment();
    }
  }, [isOpen, shows.length]);

  const fetchEntertainment = async () => {
    setLoading(true);
    setError(null);
    try {
      // User requested Money Heist search specifically
      const response = await fetch('https://api.tvmaze.com/search/shows?q=money%20heist', {
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setShows(data);
    } catch (err) {
      setError('System failure while fetching transmission data.');
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html?: string) => {
    if (!html) return 'No summary available.';
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div 
      className="relative"
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onMouseEnter={() => setIsOpen(true)}
        className={`nav-link-hover transition-all duration-300 hover:text-primary relative uppercase tracking-widest text-sm font-bold flex items-center gap-1 ${
          isOpen ? 'text-primary' : 'text-white/70'
        }`}
      >
        Entertainment
        <div className={`w-1.5 h-1.5 rounded-full bg-primary glow-pulse ml-1 ${isOpen ? 'opacity-100' : 'opacity-40'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-4 w-[90vw] md:w-[600px] lg:w-[800px] bg-[#0c0c0c]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden z-[100]"
          >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Film className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tighter uppercase italic">Entertainment Hub</h3>
                      <p className="text-[10px] text-white/30 tracking-[0.3em] font-bold uppercase">Dynamic Transmission</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/40 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {loading ? (
                  <div className="h-[300px] flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-xs font-mono text-primary/50 animate-pulse lowercase tracking-widest">Scanning blockchain for data...</p>
                  </div>
                ) : error ? (
                  <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
                      <X className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-sm text-red-500/80 max-w-xs">{error}</p>
                    <Button onClick={fetchEntertainment} variant="outline" className="border-white/10 hover:bg-white/5">
                      Retry Transmission
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {shows.map(({ show }) => (
                      <motion.a
                        key={show.id}
                        href={show.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        className="group flex gap-4 p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
                      >
                        <div className="relative w-24 h-32 shrink-0 rounded-lg overflow-hidden border border-white/5">
                          <Image
                            src={show.image?.medium || 'https://picsum.photos/seed/show/300/400'}
                            alt={show.name}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex flex-col justify-center space-y-2">
                          <h4 className="font-black tracking-tight text-white group-hover:text-primary transition-colors leading-tight uppercase">
                            {show.name}
                          </h4>
                          <p className="text-[11px] text-white/50 line-clamp-3 leading-relaxed">
                            {stripHtml(show.summary)}
                          </p>
                          <div className="flex items-center text-[10px] font-bold text-primary italic uppercase tracking-widest gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View details <ChevronRight className="w-3 h-3" />
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-primary/5 p-4 border-t border-white/5 flex items-center justify-center">
                <span className="text-[9px] font-bold text-primary/60 uppercase tracking-[0.5em]">Powered by TVmaze Digital Network</span>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
