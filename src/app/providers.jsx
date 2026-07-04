'use client';

import React from 'react';
import { ContentProvider } from '../context/ContentContext';
import { LanguageProvider } from '../context/LanguageContext';
import AnalyticsTracker from '../components/AnalyticsTracker';

/**
 * Client-side providers shared across all routes. Lives in the root layout so
 * every page has access to site content and the active language.
 */
export default function Providers({ children }) {
  return (
    <LanguageProvider>
      <ContentProvider>
        <AnalyticsTracker />
        {children}
      </ContentProvider>
    </LanguageProvider>
  );
}
