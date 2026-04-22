import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { TouchSidebar } from '@/components/TouchSidebar';
import { AdultTrigger } from '@/components/AdultTrigger';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { I18nWrapper } from '@/lib/i18n/I18nWrapper';

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
      <head>
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <LanguageProvider>
          <I18nWrapper>
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
            <AdultTrigger />
            <Toaster position="top-center" />
          </I18nWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
