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
      className="relative h-[90vh] w-full overflow-hidden bg-black"
    >
      {/* Fallback / Loading Poster */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`poster-${currentMovie.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoReady ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={tmdb.getImageUrl(currentMovie.backdrop_path)}
            alt={currentMovie.title}
            fill
            priority
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      {/* Video Background */}
      {trailer && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 scale-150 pointer-events-none">
            <div id="hero-video" className="w-full h-full" />
          </div>
        </div>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 hero-gradient z-10" />
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-24 z-20">
        <div className="container mx-auto px-4 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentMovie.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-primary font-bold">
                <Star className="w-5 h-5 fill-primary" />
                <span>Trending Playlist • {currentIndex + 1}/{movies.length}</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter max-w-4xl text-shadow">
                {currentMovie.title}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl line-clamp-3 text-shadow">
                {currentMovie.overview}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {trailer ? (
              <TrailerModal 
                trailerKey={trailer.key} 
                title={currentMovie.title}
              >
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 h-14 rounded-full text-lg shadow-xl shadow-primary/20">
                  <Play className="w-6 h-6 mr-2 fill-white" />
                  Watch Now
                </Button>
              </TrailerModal>
            ) : (
              <Link href={`/movie/${currentMovie.id}`}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 h-14 rounded-full text-lg shadow-xl shadow-primary/20">
                  <Play className="w-6 h-6 mr-2 fill-white" />
                  Watch Now
                </Button>
              </Link>
            )}
            
            <Link href={`/movie/${currentMovie.id}`}>
              <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 font-bold px-10 h-14 rounded-full text-lg">
                <Info className="w-6 h-6 mr-2" />
                More Info
              </Button>
            </Link>

            <Button 
              size="lg" 
              variant="secondary" 
              onClick={handleNext}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 font-bold px-6 h-14 rounded-full text-lg"
            >
              Next Trailer
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>

            {/* Controls */}
            {trailer && (
              <div className="flex items-center gap-3 ml-auto">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={togglePlay}
                  className="rounded-full bg-black/40 border-white/20 hover:bg-black/60 text-white size-12"
                >
                  {isPlaying ? <Pause className="size-6" /> : <Play className="size-6 fill-white" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleMute}
                  className="rounded-full bg-black/40 border-white/20 hover:bg-black/60 text-white size-12"
                >
                  {isMuted ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-primary/30 w-full z-30">
        <motion.div 
          key={`progress-${currentMovie.id}`}
          initial={{ width: "0%" }}
          animate={{ width: isVideoReady ? "100%" : "0%" }}
          transition={{ duration: 30, ease: "linear" }} // Approximate trailer length or just visual
          className="h-full bg-primary"
        />
      </div>
    </section>
  );
}
