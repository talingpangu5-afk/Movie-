'use client';

import { useState, useEffect, useCallback } from 'react';

export type QualityLevel = 'auto' | 'low' | 'standard' | 'high' | 'ultra';

export interface QualityConfig {
  label: string;
  tmdbPosterSize: string;
  tmdbBackdropSize: string;
  ytQuality: string;
}

const QUALITY_MAP: Record<Exclude<QualityLevel, 'auto'>, QualityConfig> = {
  low: {
    label: '480p',
    tmdbPosterSize: 'w185',
    tmdbBackdropSize: 'w300',
    ytQuality: 'small',
  },
  standard: {
    label: '720p',
    tmdbPosterSize: 'w342',
    tmdbBackdropSize: 'w780',
    ytQuality: 'medium',
  },
  high: {
    label: '1080p',
    tmdbPosterSize: 'w500',
    tmdbBackdropSize: 'w1280',
    ytQuality: 'hd720',
  },
  ultra: {
    label: '8K Ultra',
    tmdbPosterSize: 'original',
    tmdbBackdropSize: 'original',
    ytQuality: 'hd1080',
  },
};

export function useNeuralQuality() {
  const [level, setLevel] = useState<QualityLevel>('auto');
  const [detectedLevel, setDetectedLevel] = useState<Exclude<QualityLevel, 'auto'>>('high');

  useEffect(() => {
    const detectQuality = () => {
      if (typeof window === 'undefined') return;
      
      // Check for network info API
      const nav = window.navigator as any;
      const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
      
      if (conn) {
        const effectiveType = conn.effectiveType;
        if (effectiveType === '4g') {
          setDetectedLevel('high');
        } else if (effectiveType === '3g') {
          setDetectedLevel('standard');
        } else {
          setDetectedLevel('low');
        }

        // If data saver is on
        if (conn.saveData) {
          setDetectedLevel('low');
        }
      }
    };

    detectQuality();
    
    // Listen for changes
    const nav = window.navigator as any;
    const conn = nav.connection;
    if (conn) {
      conn.addEventListener('change', detectQuality);
      return () => conn.removeEventListener('change', detectQuality);
    }
  }, []);

  const currentLevel = level === 'auto' ? detectedLevel : level;
  const config = QUALITY_MAP[currentLevel] || QUALITY_MAP.high;

  const updateLevel = useCallback((newLevel: QualityLevel) => {
    setLevel(newLevel);
    if (typeof window !== 'undefined') {
      localStorage.setItem('neural-quality-level', newLevel);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neural-quality-level') as QualityLevel;
      if (saved && (saved === 'auto' || (QUALITY_MAP as any)[saved])) {
        // Defer to avoid cascading renders warning
        requestAnimationFrame(() => setLevel(saved));
      }
    }
  }, []);

  return {
    level,
    detectedLevel,
    currentLevel,
    config,
    updateLevel,
    isAuto: level === 'auto',
  };
}
