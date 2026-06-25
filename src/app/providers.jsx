'use client';

import React from 'react';
import { ContentProvider } from '../context/ContentContext';

/**
 * Client-side providers shared across all routes. Lives in the root layout so
 * every page has access to site content via the ContentContext.
 */
export default function Providers({ children }) {
  return <ContentProvider>{children}</ContentProvider>;
}
