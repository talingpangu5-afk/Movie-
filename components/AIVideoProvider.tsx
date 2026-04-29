'use client';

import React, { useState } from 'react';
import { UIVideoTrigger } from './UIVideoTrigger';
import { AIVideoUniverse } from './AIVideoUniverse';
import { AnimatePresence } from 'motion/react';

export function AIVideoProvider() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <UIVideoTrigger onClick={() => setIsOpen(true)} />
      <AnimatePresence>
        {isOpen && (
          <AIVideoUniverse 
            isOpen={isOpen} 
            onClose={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
