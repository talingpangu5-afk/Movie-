'use client';

import { useEffect, useRef } from 'react';

interface AdNativeProps {
  className?: string;
}

export function AdNative({ className }: AdNativeProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.querySelector('script')) {
      const container = adRef.current;
      
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl29130365.profitablecpmratenetwork.com/97229860b04e823be4afd7fd18f7c502/invoke.js';
      
      container.appendChild(script);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <div ref={adRef} id="container-97229860b04e823be4afd7fd18f7c502" className="w-full" />
    </div>
  );
}
