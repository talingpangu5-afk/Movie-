'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type Language = {
  code: string;
  name: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
];

const COUNTRY_TO_LANG: Record<string, string> = {
  'IN': 'hi',
  'BD': 'bn',
  'ES': 'es',
  'MX': 'es',
  'AR': 'es',
  'FR': 'fr',
  'SA': 'ar',
  'AE': 'ar',
  'EG': 'ar',
  'CN': 'zh',
  'RU': 'ru',
  'BR': 'pt',
  'PT': 'pt',
  'DE': 'de',
  'AT': 'de',
  'JP': 'ja',
  'KR': 'ko',
  'PK': 'ur',
  'ID': 'id',
  'TR': 'tr',
  'IT': 'it',
  'VN': 'vi',
  'TH': 'th',
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Admin routes exclusion
  const isAdminRoute = pathname?.startsWith('/admin');

  const loadTranslations = async (lang: string) => {
    try {
      const res = await fetch(`/locales/${lang}.json`);
      if (!res.ok) throw new Error('Failed to load translations');
      const data = await res.json();
      setTranslations(data);
    } catch (error) {
      console.error('Translation load error:', error);
      // Fallback to English
      if (lang !== 'en') {
        const resEn = await fetch('/locales/en.json');
        const dataEn = await resEn.json();
        setTranslations(dataEn);
      }
    }
  };

  const detectLanguage = async () => {
    // 1. Local storage
    const saved = localStorage.getItem('user-language');
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }

    // 2. Geolocation proxy
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      const countryCode = data.country_code;
      const detected = COUNTRY_TO_LANG[countryCode];
      if (detected) return detected;
    } catch (e) {
      console.error('IP detection error:', e);
    }

    // 3. Browser language
    const browserLang = navigator.language.split('-')[0];
    if (SUPPORTED_LANGUAGES.some(l => l.code === browserLang)) {
      return browserLang;
    }

    return 'en';
  };

  useEffect(() => {
    if (isAdminRoute) {
      setLanguageState('en');
      loadTranslations('en').finally(() => setIsLoading(false));
      return;
    }

    const init = async () => {
      const lang = await detectLanguage();
      setLanguageState(lang);
      await loadTranslations(lang);
      setIsLoading(false);
    };

    init();
  }, [isAdminRoute]);

  const setLanguage = async (lang: string) => {
    if (isAdminRoute) return; // Keep admin in English
    
    setIsLoading(true);
    setLanguageState(lang);
    localStorage.setItem('user-language', lang);
    await loadTranslations(lang);
    setIsLoading(false);
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (!value || typeof value !== 'object') break;
      value = value[k];
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
