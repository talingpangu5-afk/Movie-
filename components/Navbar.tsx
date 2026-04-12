'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 py-2' : 'bg-gradient-to-b from-black/80 to-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 text-primary font-black text-3xl tracking-tighter hover:scale-105 transition-transform">
              <Film className="w-9 h-9 fill-primary" />
              <span className="drop-shadow-[0_0_10px_rgba(229,9,20,0.5)] uppercase">Movie</span>
            </Link>
            
            <div className="flex items-center gap-8 text-xs font-black uppercase tracking-widest">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/trending" className="hover:text-primary transition-colors">Trending</Link>
              <Link href="/popular" className="hover:text-primary transition-colors">Popular</Link>
              <Link href="/top-rated" className="hover:text-primary transition-colors">Top Rated</Link>
              <Link href="/developer" className="hover:text-primary transition-colors text-primary/60">Dev Hub</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="flex items-center relative group">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                type="text" 
                placeholder="Search movies..." 
                className="pl-10 w-72 bg-white/5 border-white/10 focus-visible:ring-primary focus-visible:bg-white/10 transition-all rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
      </nav>
      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
}
