'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.querySelector('iframe')) {
      const container = adRef.current;
      
      // Clear any existing content
      container.innerHTML = '';
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        atOptions = {
          'key' : '1026be2f67d070ed95d941d9840c7084',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://www.highperformanceformat.com/1026be2f67d070ed95d941d9840c7084/invoke.js';
      
      container.appendChild(script);
      container.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <div ref={adRef} className="w-full flex justify-center" />
    </div>
  );
}
