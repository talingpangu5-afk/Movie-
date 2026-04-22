'use client';

import React, { useState, useEffect } from 'react';
import { Play, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SmartPlayer } from '@/components/SmartPlayer';

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
      <DialogContent className="sm:max-w-[900px] p-0 bg-black border-none overflow-hidden aspect-video shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{title} Trailer</DialogTitle>
        </DialogHeader>
        
        {trailerKey ? (
          <div className="w-full h-full">
            <SmartPlayer key={trailerKey} trailerKey={trailerKey} title={title} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-white h-full p-8 space-y-4">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <AlertCircle className="w-16 h-16 text-primary/40" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Trailer Unavailable</h3>
              <p className="text-muted-foreground font-medium">Remote archive for this entry is restricted or missing.</p>
            </div>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-full px-8">Return to Dossier</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
