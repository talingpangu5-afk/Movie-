'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, Info, Star, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieDetails, tmdb } from '@/lib/tmdb';
import { TrailerModal } from './TrailerModal';

interface HeroProps {
  movie: MovieDetails;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export function Hero({ movie }: HeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const isPlayingRef = useRef(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const trailer = movie.videos.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!trailer) return;

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(`hero-video-${movie.id}`, {
        events: {
          onReady: (event: any) => {
            setIsVideoReady(true);
            // Use current state values at time of ready
            if (event.target.playVideo) {
              event.target.playVideo();
              event.target.mute();
            }
          },
          onStateChange: (event: any) => {
            // Loop video
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    // Intersection Observer to pause when out of view
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
  }, [movie.id, trailer]);

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

  return (
    <section 
      ref={containerRef}
      className="relative h-[90vh] w-full overflow-hidden bg-black"
    >
      {/* Fallback / Loading Poster */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isVideoReady ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={tmdb.getImageUrl(movie.backdrop_path)}
          alt={movie.title}
          fill
          priority
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Video Background */}
      {trailer && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 scale-150 pointer-events-none">
            <iframe
              id={`hero-video-${movie.id}`}
              src={`https://www.youtube.com/embed/${trailer.key}?enablejsapi=1&autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0`}
              title={movie.title}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-24">
        <div className="container mx-auto px-4 space-y-6">
          <div className="flex items-center gap-2 text-primary font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Star className="w-5 h-5 fill-primary" />
            <span>Trending Today</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter max-w-4xl text-shadow animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {movie.title}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl line-clamp-3 text-shadow animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            {trailer ? (
              <TrailerModal 
                trailerKey={trailer.key} 
                title={movie.title}
              >
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 h-14 rounded-full text-lg shadow-xl shadow-primary/20">
                  <Play className="w-6 h-6 mr-2 fill-white" />
                  Watch Now
                </Button>
              </TrailerModal>
            ) : (
              <Link href={`/movie/${movie.id}`}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 h-14 rounded-full text-lg shadow-xl shadow-primary/20">
                  <Play className="w-6 h-6 mr-2 fill-white" />
                  Watch Now
                </Button>
              </Link>
            )}
            
            <Link href={`/movie/${movie.id}`}>
              <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 font-bold px-10 h-14 rounded-full text-lg">
                <Info className="w-6 h-6 mr-2" />
                More Info
              </Button>
            </Link>

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
    </section>
  );
}
