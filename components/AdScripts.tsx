'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export function AdScripts() {
  useEffect(() => {
    // First click redirect logic
    const handleFirstClick = () => {
      const hasClicked = sessionStorage.getItem('first_click_redirect');
      if (!hasClicked) {
        sessionStorage.setItem('first_click_redirect', 'true');
        window.open('https://www.profitablecpmratenetwork.com/xhh6ge039?key=807476d0bfc69921208717114f0095bf', '_blank');
      }
    };

    document.addEventListener('click', handleFirstClick);
    return () => document.removeEventListener('click', handleFirstClick);
  }, []);

  return (
    <>
      {/* Script 1 */}
      <Script 
        src="https://pl29130382.profitablecpmratenetwork.com/0e/a6/ec/0ea6ecd798b47b004c6c8d3cf469ddc0.js" 
        strategy="afterInteractive"
      />
      {/* Script 2 */}
      <Script 
        src="https://pl29130363.profitablecpmratenetwork.com/8e/e4/af/8ee4af4e6fa56d7e559558324d7b848d.js" 
        strategy="afterInteractive"
      />
    </>
  );
}
