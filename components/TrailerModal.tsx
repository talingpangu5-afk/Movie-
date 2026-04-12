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
  children?: React.ReactNode;
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

  if (!trailerKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={
        (children as React.ReactElement) || (
          <Button 
            variant={variant} 
            size={size} 
            className={className}
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            Watch Trailer
          </Button>
        )
      } />
      <DialogContent className="sm:max-w-[900px] p-0 bg-black border-none overflow-hidden aspect-video">
        <DialogHeader className="sr-only">
          <DialogTitle>{title} Trailer</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            title={`${title} Trailer`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
