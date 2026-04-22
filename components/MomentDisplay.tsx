'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function MomentDisplay() {
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem('captured_moment');
    if (savedPhoto) {
      setTimeout(() => setPhoto(savedPhoto), 0);
    }

    const handleUpdate = () => {
      const updatedPhoto = localStorage.getItem('captured_moment');
      setPhoto(updatedPhoto);
    };

    window.addEventListener('moment_captured', handleUpdate);
    return () => window.removeEventListener('moment_captured', handleUpdate);
  }, []);

  const handleRemove = () => {
    localStorage.removeItem('captured_moment');
    setPhoto(null);
    toast.info('Moment Removed');
  };

  if (!photo) return null;

  return (
    <div className="container mx-auto px-4 pt-24 md:pt-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative group"
      >
        <div className="relative overflow-hidden glass-card rounded-[2rem] border border-white/5 p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          {/* Subtle Glow Background */}
          <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-primary/5 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-primary/5 blur-[100px] pointer-events-none" />

          {/* Photo Frame */}
          <div className="relative shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-[1.5rem] overflow-hidden border-2 border-primary/20 shadow-[0_0_20px_rgba(229,9,20,0.15)] group-hover:border-primary/50 transition-colors duration-500">
            <img 
              src={photo} 
              alt="User Moment" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="flex-grow text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Matrix Sync</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">Your Moment</h3>
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Captured on {new Date().toLocaleDateString()}</p>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center backdrop-blur-md">
                  <User className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-[10px] font-mono text-white/60 tracking-wider">SECURED_LOCAL_STORAGE // AES_ENCRYPTED_PREVIEW</p>
            </div>
          </div>

          <Button
            onClick={handleRemove}
            variant="ghost"
            size="icon"
            className="md:absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
