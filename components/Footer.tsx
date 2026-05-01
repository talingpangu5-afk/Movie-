'use client';

import Link from 'next/link';
import { Film, Youtube, Facebook, BookOpen, Lock } from 'lucide-react';
import { FooterTrailers } from './FooterTrailers';
import { useState } from 'react';
import { AdultVerificationModal } from './AdultVerificationModal';

export function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="bg-secondary/30 border-t py-12 mt-20 relative overflow-hidden backdrop-blur-xl">
      <AdultVerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tighter hover:scale-105 transition-transform origin-left">
              <Film className="w-6 h-6 fill-primary" />
              <span>TALING PANGU</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Building and deploying scalable projects with focus on repositories and database architecture.
            </p>

            {/* 18+ Swipe/Vault Section */}
            <div className="pt-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative block w-full bg-black/40 backdrop-blur-2xl border border-white/5 rounded-2xl p-4 overflow-hidden hover:border-primary/50 transition-all duration-500 text-left"
              >
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black text-primary border border-primary px-1.5 py-0.5 rounded uppercase">Restricted</span>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <span className="text-xl font-black italic uppercase text-primary">18+</span>
                  </div>
                  <div>
                    <h5 className="text-white font-black uppercase text-sm tracking-tighter flex items-center gap-2">
                       Noir Vault
                       <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </h5>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">18+ Swipe to Access Vault</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] bg-primary group-hover:w-full transition-all duration-700 w-0" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white/80 uppercase tracking-[0.2em] text-[10px]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all" /> Home</Link></li>
              <li><Link href="/trending" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all" /> Trending</Link></li>
              <li><Link href="/popular" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all" /> Popular</Link></li>
              <li><Link href="/top-rated" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all" /> Top Rated</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white/80 uppercase tracking-[0.2em] text-[10px]">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
            </ul>
          </div>

          <div className="md:col-span-1 space-y-6">
            <div>
              <h4 className="font-bold mb-4 text-white/80 uppercase tracking-[0.2em] text-[10px]">Follow Us</h4>
              <div className="flex gap-3">
                {/* YouTube */}
                <Link 
                  href="https://youtube.com/@mysteriousstory_studioai?si=aaEGH1tVd6Tgq_W9" 
                  target="_blank"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600/20 hover:border-red-500/50 transition-all group"
                >
                  <Youtube className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:text-red-500" />
                </Link>
                {/* Facebook */}
                <Link 
                  href="https://www.facebook.com/share/16pomwJTMG/" 
                  target="_blank"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600/20 hover:border-blue-500/50 transition-all group"
                >
                  <Facebook className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:text-blue-500" />
                </Link>
                {/* Blog */}
                <Link 
                  href="https://viralversepro.blogspot.com/" 
                  target="_blank"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-600/20 hover:border-orange-500/50 transition-all group"
                >
                  <BookOpen className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:text-orange-500" />
                </Link>
              </div>
            </div>

            {/* Neural Trailers Ingested Feed */}
            <FooterTrailers />
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground uppercase tracking-widest font-mono">
          <p>© {new Date().getFullYear()} Taling Pangu. SYSTEM_V.1.04</p>
          <div className="flex items-center gap-6">
             <span className="animate-pulse text-primary/40 text-[10px]">● DB_SYNC_ACTIVE</span>
             <span className="text-[10px]">AI_STUDIO_APPLET</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
