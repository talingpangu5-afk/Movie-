'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdBanner } from './AdBanner';

export function AdManager() {
  const [showPopup, setShowPopup] = useState(false);
  const [showSticky, setShowSticky] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Sticky Bottom Ad (Mobile) */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-[60] md:hidden bg-background/95 backdrop-blur-md border-t p-2 flex flex-col items-center gap-1 shadow-2xl">
          <div className="flex justify-between w-full px-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Sponsored</span>
            <button onClick={() => setShowSticky(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full h-[50px] flex justify-center overflow-hidden">
            {/* Using a smaller format for mobile sticky */}
            <AdBanner width="320" height="50" />
          </div>
        </div>
      )}

      {/* Popup Ad */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-secondary p-6 rounded-2xl max-w-lg w-full shadow-2xl border border-white/10 flex flex-col items-center gap-4">
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute -top-3 -right-3 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Sponsored Content</span>
            <h3 className="text-xl font-bold text-center">Exclusive Offer for You!</h3>
            <div className="w-full min-h-[250px] bg-black/20 rounded-xl flex items-center justify-center overflow-hidden">
               <AdBanner width="300" height="250" />
            </div>
            <Button onClick={() => setShowPopup(false)} className="w-full font-bold h-12 rounded-xl">
              Continue to Website
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
