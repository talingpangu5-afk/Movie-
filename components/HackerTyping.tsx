'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export function HackerTyping() {
  const { t } = useTranslation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const MESSAGES = React.useMemo(() => [
    t('hero.initializing'),
    t('hero.connecting'),
    "Accessing Flux Network metadata...",
    "Bypassing firewalls...",
    t('hero.loadingModules'),
    t('hero.accessGranted'),
    t('hero.welcome')
  ], [t]);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleType = () => {
      const fullText = MESSAGES[currentMessageIndex];
      
      if (!isDeleting) {
        // Typing
        const nextText = fullText.substring(0, currentText.length + 1);
        setCurrentText(nextText);
        setTypingSpeed(100);
        
        if (nextText === fullText) {
          setIsDeleting(true);
          setTypingSpeed(3000); // Pause at the end
        }
      } else {
        // Deleting
        const nextText = fullText.substring(0, currentText.length - 1);
        setCurrentText(nextText);
        setTypingSpeed(30); // Faster deletion
        
        if (nextText === '') {
          setIsDeleting(false);
          setCurrentMessageIndex((prev) => (prev + 1) % MESSAGES.length);
          setTypingSpeed(500); // Pause before next message
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentMessageIndex, typingSpeed, MESSAGES]);

  return (
    <div className="absolute top-[85px] left-1/2 -translate-x-1/2 z-30 pointer-events-none w-full max-w-xl text-center">
      <div 
        className="font-mono text-[#00ff9f] text-[10px] md:text-xs uppercase tracking-[0.3em] font-black drop-shadow-[0_0_15px_rgba(0,255,159,0.4)] px-4"
        style={{ textShadow: '0 0 8px rgba(0,255,159,0.8)' }}
      >
        <span className="opacity-40 mr-2 text-[8px] animate-pulse">SYSTEM_LOG //</span>
        <span className="relative">
          {currentText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="inline-block w-1.5 h-3 md:h-4 bg-[#00ff9f] ml-1 align-middle"
          />
        </span>
      </div>
    </div>
  );
}
