'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  id: string;
}

export function AdBanner({ id }: AdBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentBanner = bannerRef.current;
    if (!currentBanner) return;

    // Clear any existing content
    currentBanner.innerHTML = '';

    const script = document.createElement('script');
    const configScript = document.createElement('script');

    configScript.type = 'text/javascript';
    configScript.innerHTML = `
      atOptions = {
        'key' : '${id}',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    script.type = 'text/javascript';
    script.src = `//www.highperformanceformat.com/${id}/invoke.js`;

    currentBanner.appendChild(configScript);
    currentBanner.appendChild(script);

    return () => {
      if (currentBanner) {
        currentBanner.innerHTML = '';
      }
    };
  }, [id]);

  return (
    <div className="w-full flex justify-center overflow-hidden">
      <div ref={bannerRef} />
    </div>
  );
}
