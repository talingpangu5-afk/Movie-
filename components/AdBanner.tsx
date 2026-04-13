'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  id: string;
  width?: string;
  height?: string;
}

export function AdBanner({ id, width = '728', height = '90' }: AdBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentBanner = bannerRef.current;
    if (!currentBanner) return;

    // Clear any existing content
    currentBanner.innerHTML = '';

    // Create an iframe to sandbox the ad script and its global variables
    const iframe = document.createElement('iframe');
    iframe.width = width;
    iframe.height = height;
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.style.maxWidth = '100%';
    iframe.style.height = `${height}px`;
    
    currentBanner.appendChild(iframe);

    const adCode = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: ${height}px; overflow: hidden; }
          </style>
        </head>
        <body>
          <div id="ad-target"></div>
          <script type="text/javascript">
            atOptions = {
              'key' : '${id}',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://www.highperformanceformat.com/${id}/invoke.js"></script>
        </body>
      </html>
    `;

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(adCode);
      doc.close();
    }

    return () => {
      if (currentBanner) {
        currentBanner.innerHTML = '';
      }
    };
  }, [id]);

  return (
    <div className="w-full flex flex-col items-center gap-2 py-6">
      <div className="flex items-center gap-2">
        <div className="h-[1px] w-8 bg-white/10" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Sponsored</span>
        <div className="h-[1px] w-8 bg-white/10" />
      </div>
      
      <div className="relative w-full flex justify-center overflow-hidden min-h-[90px] bg-secondary/5 rounded-xl border border-white/5 group">
        {/* Fallback / Loading State */}
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/30 font-medium pointer-events-none group-hover:text-muted-foreground/50 transition-colors">
          Advertisement
        </div>
        
        {/* Ad Container with Responsive Scaling */}
        <div 
          ref={bannerRef} 
          className="relative z-10 flex justify-center items-center w-full max-w-full overflow-hidden"
        />
      </div>
    </div>
  );
}
