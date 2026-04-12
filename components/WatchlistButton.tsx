'use client';

import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WatchlistButtonProps {
  movieTitle: string;
  className?: string;
}

export function WatchlistButton({ movieTitle, className }: WatchlistButtonProps) {
  const [isAdded, setIsAdded] = useState(false);

  const handleToggle = () => {
    setIsAdded(!isAdded);
    if (!isAdded) {
      toast.success(`${movieTitle} added to your watchlist!`);
    } else {
      toast.info(`${movieTitle} removed from your watchlist.`);
    }
  };

  return (
    <Button 
      variant={isAdded ? "secondary" : "outline"} 
      size="lg" 
      className={`h-14 px-8 rounded-full border-2 font-bold ${className}`}
      onClick={handleToggle}
    >
      {isAdded ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          In Watchlist
        </>
      ) : (
        <>
          <Plus className="w-5 h-5 mr-2" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
}
