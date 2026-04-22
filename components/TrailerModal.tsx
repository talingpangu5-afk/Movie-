'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TrailerModalProps {
  trailerKey: string | undefined;
  title: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactElement;
}

export function TrailerModal({ 
  trailerKey, 
  title, 
  variant = 'default', 
  size = 'lg',
  className,
  children 
}: TrailerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          children || (
            <Button 
              variant={variant} 
              size={size} 
              className={className}
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              Watch Trailer
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[900px] p-0 bg-black border-none overflow-hidden aspect-video">
        <DialogHeader className="sr-only">
          <DialogTitle>{title} Trailer</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-full flex items-center justify-center">
          {trailerKey ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&rel=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}&iv_load_policy=3&showinfo=0`}
                title={`${title} Trailer`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-white p-8 space-y-4">
              <Play className="w-16 h-16 opacity-20" />
              <p className="text-xl font-bold">Trailer not available</p>
              <p className="text-muted-foreground">We couldn&apos;t find a trailer for this movie.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
