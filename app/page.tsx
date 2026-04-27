'use client';

import dynamic from 'next/dynamic';

const GalaxyJourney = dynamic(() => import('@/components/GalaxyJourney').then(mod => mod.GalaxyJourney), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-white animate-pulse uppercase tracking-[0.5em]">Loading Galaxy...</div>
    </div>
  )
});

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <GalaxyJourney />
    </main>
  );
}


