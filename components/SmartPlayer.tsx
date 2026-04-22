'use client';

import React, { useState, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface SmartPlayerProps {
  trailerKey: string;
  title: string;
  aspectRatio?: 'video' | 'square' | 'portrait';
  autoPlay?: boolean;
}

export function SmartPlayer({ 
  trailerKey, 
  title, 
  aspectRatio = 'video',
  autoPlay = false 
}: SmartPlayerProps) {
  const [isStarted, setIsStarted] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);

  const thumbnailUrl = `https://i.ytimg.com/vi/${trailerKey}/maxresdefault.jpg`;
  
  const aspectClass = {
    'video': 'aspect-video',
    'square': 'aspect-square',
    'portrait': 'aspect-[2/3]'
  }[aspectRatio];

  return (
    <div className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden bg-black border border-white/10 group shadow-2xl`}>
      {!isStarted ? (
        <div 
          className="absolute inset-0 cursor-pointer"
          onClick={() => setIsStarted(true)}
        >
          <Image 
            src={thumbnailUrl}
            alt={`${title} Thumbnail`}
            fill
            className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
            priority={autoPlay}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.5)] group-hover:scale-125 transition-transform duration-300">
              <Play className="w-10 h-10 text-white fill-current translate-x-1" />
            </div>
            <p className="mt-4 text-white font-black uppercase tracking-[0.3em] text-[10px] drop-shadow-lg opacity-60 group-hover:opacity-100 transition-opacity">Streaming Archive Ready</p>
          </div>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest animate-pulse">Bypassing CDNs...</p>
            </div>
          )}
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&VQ=HD1080&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
            title={`${title} Trailer`}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoading(false)}
          />
        </>
      )}
    </div>
  );
}
