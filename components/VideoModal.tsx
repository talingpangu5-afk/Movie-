'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2, ExternalLink, AlertCircle, ShieldOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  const [isIframeBlocked, setIsIframeBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Defer state updates to avoid cascading render warning
      const nextTick = setTimeout(() => {
        setIsLoading(true);
        setIsIframeBlocked(false);
      }, 0);
      
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => {
        clearTimeout(nextTick);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-8"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-6xl aspect-video bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(229,9,20,0.2)]"
        >
          {/* Header */}
          <div className="absolute top-0 inset-x-0 h-20 px-8 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <div className="bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white animate-pulse">
                Live Stream
              </div>
              <h3 className="text-white font-bold text-lg tracking-tight truncate max-w-[200px] md:max-w-md uppercase">{title}</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-white/5 hover:bg-white/10"
                onClick={() => window.open(videoUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 text-white/60" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-primary/20 hover:bg-primary/40 group"
                onClick={onClose}
              >
                <X className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Video Container */}
          <div className="w-full h-full relative">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0a0a]">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-white/40 text-xs font-mono tracking-[0.3em] uppercase animate-pulse">Syncing Encrypted Stream...</p>
              </div>
            )}

            {isIframeBlocked ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="p-6 bg-red-500/10 rounded-3xl border border-red-500/20">
                  <ShieldOff className="w-16 h-16 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Stream Restricted</h4>
                  <p className="text-white/40 text-sm max-w-sm mx-auto font-medium leading-relaxed">
                    The source provider has restricted embedding. Please use the direct link to view content.
                  </p>
                </div>
                <Button 
                   onClick={() => window.open(videoUrl, '_blank')}
                   className="bg-primary text-white hover:bg-primary/80 rounded-full px-8 py-6 font-black uppercase tracking-widest italic"
                >
                  Open in New Tab
                </Button>
              </div>
            ) : (
              <iframe
                src={videoUrl}
                className="w-full h-full border-none"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                onError={() => setIsIframeBlocked(true)}
              />
            )}
          </div>

          {/* Footer Info */}
          <div className="absolute bottom-0 inset-x-0 h-24 px-8 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between pointer-events-none">
             <div className="flex items-center gap-6">
                <div className="flex flex-col">
                   <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Bitrate</span>
                   <span className="text-xs text-primary font-mono font-bold">8192kbps // 4K</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                   <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Latency</span>
                   <span className="text-xs text-green-500 font-mono font-bold">42ms</span>
                </div>
             </div>
             
             <div className="flex items-center gap-2 opacity-50">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-[9px] text-white font-black uppercase tracking-widest">Secure Handshake: V.2.1-N</span>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
