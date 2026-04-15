'use client';

import React, { useEffect, useRef, useId } from 'react';

interface AdBannerProps {
  className?: string;
  width?: string;
  height?: string;
}

export function AdBanner({ className = '', width = '728', height = '90' }: AdBannerProps) {
  const adId = useId().replace(/:/g, '');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous content to ensure clean state on re-renders
    container.innerHTML = '';

    // Create a unique container for this specific ad instance
    const adWrapper = document.createElement('div');
    adWrapper.id = `adsterra-ad-${adId}`;
    adWrapper.style.width = '100%';
    adWrapper.style.height = '100%';
    adWrapper.style.display = 'flex';
    adWrapper.style.justifyContent = 'center';
    adWrapper.style.alignItems = 'center';
    container.appendChild(adWrapper);

    // Dynamic script injection
    const optionsScript = document.createElement('script');
    optionsScript.type = 'text/javascript';
    optionsScript.innerHTML = `
      atOptions = {
        'key' : '1026be2f67d070ed95d941d9840c7084',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `//www.highperformanceformat.com/1026be2f67d070ed95d941d9840c7084/invoke.js`;
    
    // Append scripts to the unique wrapper
    adWrapper.appendChild(optionsScript);
    adWrapper.appendChild(invokeScript);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [adId, width, height]);

  return (
    <div className={`w-full flex justify-center mt-10 mb-6 ${className}`}>
      <div 
        ref={containerRef}
        style={{ maxWidth: `${width}px`, minHeight: `${height}px` }}
        className="relative w-full bg-[#0f0f0f] border border-white/5 rounded-lg overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/10"
      >
        {/* Placeholder/Loading State */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-[10px] font-bold text-white/5 uppercase tracking-[0.2em] animate-pulse">
            Advertisement
          </span>
        </div>
      </div>
    </div>
  );
}
