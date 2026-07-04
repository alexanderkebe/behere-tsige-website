'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { track, setAnalyticsLang } from '../lib/analytics';

const LanguageContext = createContext(null);

/** App-wide language state (en | am), shared across all pages. */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');
  const langRef = useRef('en');

  const setLang = useCallback((next) => {
    if (next !== langRef.current) {
      setAnalyticsLang(next);
      track('language_switch', { from: langRef.current, to: next });
      langRef.current = next;
    }
    setLangState(next);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
