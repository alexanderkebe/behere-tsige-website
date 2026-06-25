'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Navbar from './Navbar';
import Footer from './Footer';

/** Shared chrome for all public pages: navbar, page content, footer, wrapped
 *  in the active-language class that drives Amharic/English typography. */
export default function SiteChrome({ children }) {
  const { lang } = useLanguage();
  return (
    <div className={lang === 'am' ? 'lang-am' : 'lang-en'}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
