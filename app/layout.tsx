import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import { TouchSidebar } from '@/components/TouchSidebar';
import { AdultTrigger } from '@/components/AdultTrigger';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://talingpangu.com'),
  title: 'NEURAL_STREAM v9.0 | AI Video Platform',
  description: 'A fully immersive futuristic AI-powered video platform with cinematic sci-fi HUD and holographic Jarvis-style interface.',
  keywords: 'ai, video, futuristic, jarvis, sci-fi, streaming, neural stream',
  verification: {
    google: 'WsPfjnR3zKFJ_WBOqopa39wfV-VtnJzercgWVf5eQPY',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans antialiased bg-[#050505] text-white" suppressHydrationWarning>
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
      </body>
    </html>
  );
}
