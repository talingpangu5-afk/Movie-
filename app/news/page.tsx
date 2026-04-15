'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, 
  Globe, 
  Cpu, 
  Film, 
  Trophy, 
  TrendingUp, 
  RefreshCw, 
  ExternalLink, 
  Clock,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const NEWS_API_KEY = 'pub_a5cedc3a07254b8e8e10452a2a0d602d';
const REFRESH_INTERVAL = 60000; // 60 seconds

interface NewsArticle {
  article_id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image_url: string | null;
  source_id: string;
  category: string[];
  country: string[];
  language: string;
}

const CATEGORIES = [
  { id: 'top', name: 'Top Headlines', icon: TrendingUp, params: { category: 'top' } },
  { id: 'india', name: 'India', icon: Globe, params: { country: 'in' } },
  { id: 'world', name: 'World', icon: Globe, params: { category: 'world' } },
  { id: 'technology', name: 'Technology', icon: Cpu, params: { category: 'technology' } },
  { id: 'entertainment', name: 'Entertainment', icon: Film, params: { category: 'entertainment' } },
  { id: 'sports', name: 'Sports', icon: Trophy, params: { category: 'sports' } },
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchNews = useCallback(async (category = activeCategory) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&language=en`;
      
      if (category.params.category) {
        url += `&category=${category.params.category}`;
      }
      if (category.params.country) {
        url += `&country=${category.params.country}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'success') {
        setNews(data.results || []);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (err) {
      console.error('News fetch error:', err);
      setError('Failed to load live news. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(() => fetchNews(), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const handleCategoryChange = (category: typeof CATEGORIES[0]) => {
    setActiveCategory(category);
    setNews([]); // Clear current news to show loading state
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              LIVE UPDATES
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">News</span> Feed
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <span className="mx-2">•</span>
              <span className="text-red-500/80 font-medium">Auto-refreshing every 60s</span>
            </div>
          </div>

          <Button 
            onClick={() => fetchNews()} 
            disabled={isLoading}
            variant="outline" 
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full px-6"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Feed
          </Button>
        </div>

        {/* Categories Sidebar/Top Bar */}
        <div className="flex overflow-x-auto pb-4 mb-10 gap-3 no-scrollbar snap-x">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 snap-start whitespace-nowrap border ${
                  isActive 
                    ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' 
                    : 'bg-secondary/40 border-white/5 text-white/60 hover:text-white hover:bg-secondary/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {isLoading && news.length === 0 ? (
              // Loading Skeletons
              [...Array(6)].map((_, i) => (
                <div key={`skeleton-${i}`} className="bg-secondary/20 rounded-2xl border border-white/5 overflow-hidden animate-pulse h-[450px]">
                  <div className="h-52 bg-white/5" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-white/10 rounded w-1/4" />
                    <div className="h-8 bg-white/10 rounded w-full" />
                    <div className="h-20 bg-white/10 rounded w-full" />
                    <div className="h-10 bg-white/10 rounded w-1/3 mt-auto" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h3 className="text-2xl font-bold text-white mb-2">{error}</h3>
                <p className="text-muted-foreground mb-8">There was a problem connecting to the news server.</p>
                <Button onClick={() => fetchNews()} className="bg-red-600 hover:bg-red-700 text-white px-8 rounded-full">
                  Try Again
                </Button>
              </div>
            ) : news.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                <Newspaper className="w-16 h-16 text-white/20 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No news available</h3>
                <p className="text-muted-foreground">We couldn&apos;t find any news articles for this category right now.</p>
              </div>
            ) : (
              news.map((article, index) => (
                <motion.div
                  key={article.article_id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-secondary/20 rounded-2xl border border-white/5 overflow-hidden hover:border-red-500/30 hover:bg-secondary/30 transition-all duration-500 flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-900/20 to-black flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-white/10" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                        {article.source_id}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      {article.category?.[0] || 'General'}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                      {article.description || 'No description available for this breaking news story.'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        {new Date(article.pubDate).toLocaleDateString()}
                      </span>
                      <a 
                        href={article.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-bold text-white hover:text-red-500 transition-colors group/link"
                      >
                        READ MORE
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
