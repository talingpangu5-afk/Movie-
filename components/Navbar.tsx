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
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md border-b' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter">
            <Film className="w-8 h-8 fill-primary" />
            <span>TALING PANGU</span>
          </Link>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/trending" className="hover:text-primary transition-colors">Trending</Link>
            <Link href="/popular" className="hover:text-primary transition-colors">Popular</Link>
            <Link href="/top-rated" className="hover:text-primary transition-colors">Top Rated</Link>
            <Link href="/developer" className="hover:text-primary transition-colors">Developer</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search movies..." 
              className="pl-10 w-64 bg-secondary/50 border-none focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="hidden">
            <Sheet>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            } />
            <SheetContent side="right" className="bg-background border-l">
              <div className="flex flex-col gap-6 mt-8">
                <form onSubmit={handleSearch} className="flex items-center relative">
                  <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-10 w-full bg-secondary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                <Link href="/" className="text-lg font-medium hover:text-primary">Home</Link>
                <Link href="/trending" className="text-lg font-medium hover:text-primary">Trending</Link>
                <Link href="/popular" className="text-lg font-medium hover:text-primary">Popular</Link>
                <Link href="/top-rated" className="text-lg font-medium hover:text-primary">Top Rated</Link>
                <Link href="/developer" className="text-lg font-medium hover:text-primary">Developer</Link>
                <Link href="/about" className="text-lg font-medium hover:text-primary">About</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </nav>
);
}
