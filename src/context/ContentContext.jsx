import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import defaultContent from '../data/defaultContent';

const ContentContext = createContext(null);

async function fetchContent() {
  try {
    const res = await fetch('/api/content');
    if (res.ok) return res.json();
  } catch {
    /* API unavailable */
  }
  try {
    const res = await fetch('/content.json');
    if (res.ok) return res.json();
  } catch {
    /* static fallback unavailable */
  }
  return defaultContent;
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await fetchContent();
    setContent(data);
    return data;
  }, []);

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [reload]);

  const value = useMemo(
    () => ({ content, setContent, reload, loading }),
    [content, loading, reload]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export function useSection(section) {
  const { content } = useContent();
  return content[section];
}
