import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { AdScripts } from '@/components/AdScripts';
import { AdBanner } from '@/components/AdBanner';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 1200,
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Movie World | Discover Your Next Favorite Movie',
  description: 'Explore trending, popular, and top-rated movies. Watch trailers, check ratings, and find your next cinematic experience.',
  keywords: 'movies, cinema, trailers, tmdb, movie world, trending movies',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className} suppressHydrationWarning>
        <AdScripts />
        
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        
        {/* Sticky Bottom Banner */}
        <div className="fixed bottom-0 left-0 w-full z-[100] bg-black/80 backdrop-blur-md border-t border-primary/20 flex justify-center py-2 hidden md:flex">
          <AdBanner className="py-0" />
        </div>

        <Toaster position="top-center" />
      </body>
    </html>
  );
}
