'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { SideSwipeTrigger } from './SideSwipeTrigger';
import { SciFiPlatform } from './SciFiPlatform';

export function SciFiInteractiveLayer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SideSwipeTrigger onClick={() => setIsOpen(true)} />
      
      <AnimatePresence>
        {isOpen && (
          <SciFiPlatform onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
