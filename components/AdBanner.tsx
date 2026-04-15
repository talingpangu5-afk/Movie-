'use client';

import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
  width?: string;
  height?: string;
}

export function AdBanner({ className = '', width = '728', height = '90' }: AdBannerProps) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if script is already loaded to avoid duplicates
    const scriptId = `ad-script-${width}-${height}`;
    if (document.getElementById(scriptId)) return;

    const container = adContainerRef.current;
    if (!container) return;

    // Create the options script
    const optionsScript = document.createElement('script');
    optionsScript.id = scriptId;
    optionsScript.innerHTML = `
      atOptions = {
        'key' : '1026be2f67d070ed95d941d9840c7084',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    // Create the invoke script
    const invokeScript = document.createElement('script');
    invokeScript.src = 'https://www.highperformanceformat.com/1026be2f67d070ed95d941d9840c7084/invoke.js';
    invokeScript.async = true;

    container.appendChild(optionsScript);
    container.appendChild(invokeScript);

    return () => {
      // Cleanup if necessary, though usually these scripts inject iframes that stay
    };
  }, []);

  return (
    <div className={`w-full flex justify-center mt-10 mb-6 ${className}`}>
      <div 
        ref={adContainerRef}
        style={{ maxWidth: `${width}px`, minHeight: `${height}px` }}
        className="relative w-full bg-[#0f0f0f] border border-white/5 rounded-lg overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      >
        {/* Placeholder/Loading State */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">Advertisement</span>
        </div>
        
        {/* The script will inject the iframe here */}
      </div>
    </div>
  );
}
