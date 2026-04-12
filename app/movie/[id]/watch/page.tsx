'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Lock, ShieldCheck, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdBanner } from '@/components/AdBanner';
import { AdNative } from '@/components/AdNative';
import { tmdb, MovieDetails } from '@/lib/tmdb';
import Image from 'next/image';

export default function WatchPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const directLink = "https://www.profitablecpmratenetwork.com/xhh6ge039?key=807476d0bfc69921208717114f0095bf";

  useEffect(() => {
    if (id) {
      tmdb.getMovieDetails(id as string).then(setMovie);
    }
  }, [id]);

  const handlePlayClick = () => {
    // Redirect to direct ad on first click
    window.open(directLink, '_blank');
    
    // After a short delay, show the "player"
    setTimeout(() => {
      setShowOverlay(false);
      setIsPlaying(true);
    }, 1000);
  };

  if (!movie) return <div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4 space-y-8">
        {/* Breadcrumbs/Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-white">
            Watching: <span className="text-primary">{movie.title}</span>
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-500" /> Secure Server</span>
            <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4 text-yellow-500" /> HD Quality Available</span>
          </div>
        </div>

        {/* Player Container */}
        <div className="relative aspect-video w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-secondary/5 group">
          {showOverlay ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md transition-all">
              <div className="relative">
                <Button 
                  onClick={handlePlayClick}
                  className="relative w-24 h-24 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl transition-transform hover:scale-110"
                >
                  <Play className="w-10 h-10 fill-white ml-1" />
                </Button>
              </div>
              <p className="mt-6 text-xl font-black text-white tracking-widest uppercase animate-pulse">Click to Play HD</p>
            </div>
          ) : null}
          
          {/* Fake Player Content */}
          <div className="absolute inset-0 z-10">
            {isPlaying ? (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md px-6">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/40">
                    <Lock className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Server Verification Required</h2>
                  <p className="text-muted-foreground text-sm">To maintain high-speed streaming, please complete a quick verification to unlock the full movie.</p>
                  <Button 
                    onClick={() => window.open(directLink, '_blank')}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-xl shadow-[0_0_20px_rgba(229,9,20,0.3)]"
                  >
                    VERIFY & WATCH NOW
                  </Button>
                </div>
              </div>
            ) : (
              <Image
                src={tmdb.getImageUrl(movie.backdrop_path)}
                alt={movie.title}
                fill
                className="object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          {/* Player UI Elements */}
          <div className="absolute bottom-0 left-0 w-full p-6 z-30 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="h-1 w-64 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/3 shadow-[0_0_10px_#e50914]" />
              </div>
              <span className="text-xs text-white font-mono">00:00 / {movie.runtime}:00</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Download className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 rounded bg-primary/80 text-[10px] font-bold flex items-center justify-center text-white">HD</div>
            </div>
          </div>
        </div>

        {/* Ads Section */}
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="ad-container">
            <AdBanner />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                <Download className="w-6 h-6" />
                Download Links
              </h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.open(directLink, '_blank')}
                  variant="outline" 
                  className="w-full justify-between h-16 border-white/10 hover:bg-primary/10 rounded-xl"
                >
                  <span className="font-bold">Download 4K Ultra HD</span>
                  <Badge className="bg-primary">12.4 GB</Badge>
                </Button>
                <Button 
                  onClick={() => window.open(directLink, '_blank')}
                  variant="outline" 
                  className="w-full justify-between h-16 border-white/10 hover:bg-primary/10 rounded-xl"
                >
                  <span className="font-bold">Download 1080p Full HD</span>
                  <Badge className="bg-blue-600">2.8 GB</Badge>
                </Button>
              </div>
              
              <div className="ad-container">
                <AdBanner />
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-black text-primary uppercase tracking-tighter">Recommended</h3>
              <div className="ad-container">
                <AdNative />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${className}`}>
      {children}
    </span>
  );
}
