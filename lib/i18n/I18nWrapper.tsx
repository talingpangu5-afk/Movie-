'use client';

import { useTranslation } from './LanguageContext';
import { useEffect } from 'react';

export function I18nWrapper({ children }: { children: React.ReactNode }) {
  const { language, isLoading } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] z-[1000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-[10px] text-primary animate-pulse tracking-widest uppercase">
            Detecting Regional Matrix...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
