'use client';

import Link from 'next/link';
import { Film, Youtube, Facebook, BookOpen } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-secondary/30 border-t py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tighter">
              <Film className="w-6 h-6 fill-primary" />
              <span>TALING PANGU</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Building and deploying scalable projects with focus on repositories and database architecture.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">{t('common.home')}</Link></li>
              <li><Link href="/trending" className="hover:text-primary transition-colors">{t('common.trending')}</Link></li>
              <li><Link href="/popular" className="hover:text-primary transition-colors">{t('common.popular')}</Link></li>
              <li><Link href="/top-rated" className="hover:text-primary transition-colors">{t('common.topRated')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">{t('common.about')}</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">{t('common.privacy')}</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary transition-colors">{t('common.disclaimer')}</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">{t('common.contact')}</Link></li>
              <li><Link href="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {/* YouTube */}
              <div className="relative group">
                <Link 
                  href="https://youtube.com/@mysteriousstory_studioai?si=aaEGH1tVd6Tgq_W9" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-red-600 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:text-white"
                >
                  <Youtube className="w-5 h-5" />
                </Link>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                  YouTube
                </span>
              </div>

              {/* Facebook */}
              <div className="relative group">
                <Link 
                  href="https://www.facebook.com/share/16pomwJTMG/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-blue-600 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] group-hover:text-white"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                  Facebook
                </span>
              </div>

              {/* Blogger */}
              <div className="relative group">
                <Link 
                  href="https://viralversepro.blogspot.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-orange-600 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(234,88,12,0.5)] group-hover:text-white"
                >
                  <BookOpen className="w-5 h-5" />
                </Link>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
                  Blog
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Taling Pangu. {t('footer.rightsReserved')} Built with Next.js and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
