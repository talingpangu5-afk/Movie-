import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 1200,
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Taling Pangu | Discover Your Next Favorite Movie',
  description: 'Explore trending, popular, and top-rated movies. Watch trailers, check ratings, and find your next cinematic experience.',
  keywords: 'movies, cinema, trailers, tmdb, taling pangu, trending movies',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className} suppressHydrationWarning>
        {/* Adsterra Popunder Placeholder */}
        <Script 
          src="//pl26000000.highperformanceformat.com/aa/bb/cc/aabbcc11223344556677889900.js" 
          strategy="afterInteractive"
        />
        
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
