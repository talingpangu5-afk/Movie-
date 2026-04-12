'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AutoRefresh() {
  const router = useRouter();
  
  useEffect(() => {
    // Refresh the page data every 5 minutes
    const interval = setInterval(() => {
      router.refresh();
    }, 300000);
    
    return () => clearInterval(interval);
  }, [router]);
  
  return null;
}
