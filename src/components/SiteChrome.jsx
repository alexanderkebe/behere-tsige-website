'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePreloader } from '@/hooks/usePreloader';
import Preloader from './Preloader';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import CookieConsent from './CookieConsent';
import GeezComingSoon from './GeezComingSoon';

/** Shared chrome for all public pages: navbar, page content, footer, wrapped
 *  in the active-language class that drives Amharic/English typography.
 *  The splash preloader lives here so EVERY page waits for the full asset
 *  set (all hero videos, logos, animations, content images, fonts). */
export default function SiteChrome({ children }) {
  const { lang } = useLanguage();
  const { progress, done } = usePreloader();
  const className = lang === 'am' || lang === 'gez' ? 'lang-am' : 'lang-en';

  return (
    <div className={className}>
      <Preloader progress={progress} done={done} />
      <Navbar />
      {children}
      <Footer />
      <ChatWidget />
      <CookieConsent />
      <GeezComingSoon />
    </div>
  );
}
