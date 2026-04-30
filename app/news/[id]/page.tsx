'use client';

import React, { useState, useEffect, use } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Bookmark, 
  Clock, 
  Globe, 
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NEWS_API_KEY = 'pub_a5cedc3a07254b8e8e10452a2a0d602d';

interface NewsArticle {
  article_id: string;
  title: string;
  link: string;
  description: string;
  content: string | null;
  pubDate: string;
  image_url: string | null;
  source_id: string;
  category: string[];
  creator: string[] | null;
}

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // NewsData.io doesn't have a direct "get by ID" endpoint for free tier
        // We search for the article using the ID or title. 
        // For this implementation, we'll try to find it in the latest news or search by ID if supported
        const decodedId = decodeURIComponent(id);
        const url = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&id=${decodedId}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'success' && data.results && data.results.length > 0) {
          setArticle(data.results[0]);
        } else {
          // Fallback: search by ID in the query if direct ID fetch fails
          const searchUrl = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${decodedId}`;
          const searchResponse = await fetch(searchUrl);
          const searchData = await searchResponse.json();
          
          if (searchData.status === 'success' && searchData.results && searchData.results.length > 0) {
            setArticle(searchData.results[0]);
          } else {
            throw new Error('Article not found');
          }
        }
      } catch (err) {
        console.error('Fetch article error:', err);
        setError('We couldn\'t find the article you\'re looking for.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center pt-20">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
        <p className="text-white/60 font-mono uppercase tracking-widest animate-pulse">Retrieving Article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center pt-20 px-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6 opacity-50" />
        <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Article Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          The article you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Button 
          onClick={() => router.push('/news')}
          className="bg-red-600 hover:bg-red-700 text-white px-8 rounded-full"
        >
          Back to News Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            href="/news" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-red-500 transition-colors font-bold uppercase text-xs tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </motion.div>

        {/* Article Header */}
        <article className="space-y-8">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-red-600 text-[10px] font-black text-white uppercase tracking-widest">
                {article.category?.[0] || 'Breaking News'}
              </span>
              <span className="flex items-center gap-1 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                <Globe className="w-3 h-3" />
                {article.source_id}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-y border-white/5 py-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                  <User className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Author</p>
                  <p className="text-sm font-bold text-white">{article.creator?.[0] || 'News Desk'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Calendar className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Published</p>
                  <p className="text-sm font-bold text-white">{new Date(article.pubDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Clock className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Reading Time</p>
                  <p className="text-sm font-bold text-white">4 min read</p>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {article.image_url && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <Image 
                src={article.image_url} 
                alt={article.title}
                fill
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
          )}

          {/* Article Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed mb-8 italic border-l-4 border-red-600 pl-6">
              {article.description}
            </p>
            
            <div className="text-lg text-white/70 leading-relaxed space-y-6 font-serif">
              {article.content ? (
                article.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <div className="bg-secondary/20 p-8 rounded-2xl border border-white/5 text-center space-y-4">
                  <p className="text-white/60 italic">
                    The full content of this article is available on the source website.
                  </p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8">
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      Read Full Article at {article.source_id}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <footer className="pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Source:</span>
              <a 
                href={article.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
              >
                {article.source_id}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </footer>
        </article>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
