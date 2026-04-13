'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, Info, Star, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { MovieDetails, tmdb } from '@/lib/tmdb';
import { TrailerModal } from './TrailerModal';

interface HeroProps {
  movies: MovieDetails[];
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export function Hero({ movies }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentMovie = movies[currentIndex];
  const trailer = currentMovie?.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const handleNext = useCallback(() => {
    setIsVideoReady(false);
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!trailer) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.loadVideoById({
          videoId: trailer.key,
          startSeconds: 0,
        });
        return;
      }

      playerRef.current = new window.YT.Player(`hero-video`, {
        videoId: trailer.key,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          showinfo: 0,
        },
        events: {
          onReady: (event: any) => {
            setIsVideoReady(true);
            event.target.playVideo();
            event.target.mute();
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              handleNext();
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!playerRef.current) return;
        if (entry.isIntersecting) {
          if (isPlayingRef.current) playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [currentIndex, trailer, handleNext]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  if (!currentMovie) return null;

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Cinematic Background with Slow Zoom */}
      <div className="absolute inset-0 z-0 animate-cinematic-zoom">
        <AnimatePresence mode="wait">
          <motion.div 
            key={`poster-${currentMovie.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVideoReady ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src={tmdb.getImageUrl(currentMovie.backdrop_path)}
              alt={currentMovie.title}
              fill
              priority
              className="object-cover brightness-75"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Video Background */}
        {trailer && (
          <div className={`absolute inset-0 transition-opacity duration-1500 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 scale-[1.35] pointer-events-none">
              <div id="hero-video" className="w-full h-full" />
            </div>
          </div>
        )}
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-transparent to-black/20" />
      
      {/* Subtle Light Effect Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.1),transparent_70%)]" />

      {/* Top Right Controls */}
      <div className="absolute top-24 right-8 z-30 flex items-center gap-4">
        {trailer && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleMute}
            className="rounded-full glass-morphism text-white border-white/20 size-12 hover:bg-white/20 transition-all"
          >
            {isMuted ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />}
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center z-20">
        <div className="container mx-auto px-4 md:px-12 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentMovie.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl space-y-6"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-sm uppercase tracking-widest animate-float glow-primary"
              >
                <Star className="w-4 h-4 fill-primary" />
                Trending Now
              </motion.div>
              
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white uppercase leading-[0.9] text-glow">
                {currentMovie.title}
              </h1>
              
              <p className="text-lg md:text-2xl text-gray-300 max-w-2xl line-clamp-3 text-shadow font-medium leading-relaxed">
                {currentMovie.overview}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            {trailer ? (
              <TrailerModal 
                trailerKey={trailer.key} 
                title={currentMovie.title}
              >
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary text-white font-black px-12 h-16 rounded-full text-xl shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 glow-primary">
                  <Play className="w-7 h-7 mr-3 fill-white" />
                  WATCH NOW
                </Button>
              </TrailerModal>
            ) : (
              <Link href={`/movie/${currentMovie.id}`} className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-gradient-to-r from-primary to-red-700 hover:from-red-700 hover:to-primary text-white font-black px-12 h-16 rounded-full text-xl shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95 glow-primary">
                  <Play className="w-7 h-7 mr-3 fill-white" />
                  WATCH NOW
                </Button>
              </Link>
            )}
            
            <Link href={`/movie/${currentMovie.id}`} className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full glass-morphism hover:bg-white/20 text-white border border-white/20 font-bold px-10 h-16 rounded-full text-xl transition-all hover:scale-105 active:scale-95">
                <Info className="w-7 h-7 mr-3" />
                MORE INFO
              </Button>
            </Link>

            <Button 
              size="lg" 
              variant="secondary" 
              onClick={handleNext}
              className="w-full sm:w-auto glass-morphism hover:bg-white/20 text-white border border-white/20 font-bold px-8 h-16 rounded-full text-xl transition-all hover:scale-105 active:scale-95"
            >
              NEXT TRAILER
              <ChevronRight className="w-7 h-7 ml-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Fade for Smooth Transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" />

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-white/10 w-full z-30">
        <motion.div 
          key={`progress-${currentMovie.id}`}
          initial={{ width: "0%" }}
          animate={{ width: isVideoReady ? "100%" : "0%" }}
          transition={{ duration: 30, ease: "linear" }}
          className="h-full bg-primary glow-primary"
        />
      </div>
    </section>
  );
}
