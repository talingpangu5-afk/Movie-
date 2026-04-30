'use client';

import React, { useState, useEffect } from 'react';
import { JarvisPlatform } from './JarvisPlatform';

export function JarvisManager() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-jarvis', handleOpen);
    return () => window.removeEventListener('open-jarvis', handleOpen);
  }, []);

  return (
    <JarvisPlatform 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
    />
  );
}
