import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { TouchSidebar } from '@/components/TouchSidebar';

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
        {/* Ad Network Scripts */}
        <Script 
          src="https://pl29130382.profitablecpmratenetwork.com/0e/a6/ec/0ea6ecd798b47b004c6c8d3cf469ddc0.js" 
          strategy="afterInteractive"
        />
        
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <TouchSidebar />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
