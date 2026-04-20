'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'motion/react';
import { EntertainmentDropdown } from '@/components/EntertainmentDropdown';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Trending', href: '/trending', hasNotification: true },
    { name: 'Popular', href: '/popular' },
    { name: 'Top Rated', href: '/top-rated' },
    { name: 'Live News', href: '/news', isLive: true },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'h-16 glass-nav flowing-border shadow-2xl' 
          : 'h-20 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Film className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 neon-dot glow-pulse" />
            </div>
            <span className="text-white font-black text-2xl tracking-tighter group-hover:neon-red transition-all duration-300">
              TALING PANGU
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className={`nav-link-hover transition-all duration-300 hover:text-primary relative ${
                  pathname === link.href ? 'active-link' : 'text-white/70'
                }`}
              >
                {link.name}
                {link.hasNotification && (
                  <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-primary rounded-full glow-pulse" />
                )}
                {link.isLive && (
                  <span className="absolute -top-1 -right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                )}
              </Link>
            ))}
            
            <EntertainmentDropdown />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <form 
            onSubmit={handleSearch} 
            className={`relative flex items-center transition-all duration-500 ease-in-out ${
              isSearchExpanded ? 'w-64' : 'w-10 md:w-48'
            }`}
          >
            <Search 
              className="absolute left-3 w-4 h-4 text-muted-foreground z-10 cursor-pointer" 
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            />
            <Input 
              type="text" 
              placeholder="Search movies..." 
              className={`pl-10 h-10 bg-secondary/40 border border-white/10 rounded-full focus-visible:ring-primary focus-visible:border-primary transition-all duration-300 ${
                isSearchExpanded ? 'opacity-100' : 'opacity-0 md:opacity-100'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchExpanded(true)}
              onBlur={() => !searchQuery && setIsSearchExpanded(false)}
            />
          </form>

          <Sheet>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                <Menu className="w-6 h-6" />
              </Button>
            } />
            <SheetContent side="right" className="bg-[#0b0b0b]/95 backdrop-blur-xl border-l border-white/10 w-[300px]">
              <div className="flex flex-col gap-8 mt-12">
                <div className="flex items-center gap-2 mb-4">
                  <Film className="w-6 h-6 text-primary" />
                  <span className="text-white font-black text-xl tracking-tighter">TALING PANGU</span>
                </div>
                
                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name}
                      href={link.href} 
                      className={`text-lg font-bold uppercase tracking-widest transition-all duration-300 ${
                        pathname === link.href ? 'text-primary neon-red' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  
                  {/* Entertainment section for mobile as well or just the toggle */}
                  <div className="pt-2 border-t border-white/5">
                    <EntertainmentDropdown />
                  </div>

                  <Link href="/about" className="text-lg font-bold uppercase tracking-widest text-white/70 hover:text-white">About</Link>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Follow Us</p>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                      <Film className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
