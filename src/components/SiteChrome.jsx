'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatBubble from './ChatBubble';
import CookieConsent from './CookieConsent';
import GeezComingSoon from './GeezComingSoon';

/** Shared chrome for all public pages: navbar, page content, footer, wrapped
 *  in the active-language class that drives Amharic/English typography. */
export default function SiteChrome({ children }) {
  const { lang } = useLanguage();
  const className = lang === 'am' || lang === 'gez' ? 'lang-am' : 'lang-en';

  return (
    <div className={className}>
      <Navbar />
      {children}
      <Footer />
      <ChatBubble />
      <CookieConsent />
      <GeezComingSoon />
    </div>
  );
}
