'use client';

import React from 'react';
import JarvisPlatform from '@/components/JarvisPlatform';
import { AutoRefresh } from '@/components/AutoRefresh';
import { AdManager } from '@/components/AdManager';

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <AutoRefresh />
      <AdManager />
      
      {/* Cinematic AI Video Platform */}
      <JarvisPlatform />
      
      {/* 
        Hiding standard footer/navbar is handled by 
        JarvisPlatform being fixed or absorbing the space.
        The layout still has them, so we can either
        keep them or make them contextual.
      */}
    </div>
  );
}
