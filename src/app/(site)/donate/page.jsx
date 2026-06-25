'use client';

import { useLanguage } from '@/context/LanguageContext';
import Donate from '@/components/Donate';

export default function DonatePage() {
  const { lang } = useLanguage();
  return (
    <main className="site-page">
      <Donate lang={lang} />
    </main>
  );
}
