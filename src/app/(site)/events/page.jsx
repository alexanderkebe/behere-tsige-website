'use client';

import { useLanguage } from '@/context/LanguageContext';
import Events from '@/components/Events';

export default function EventsPage() {
  const { lang } = useLanguage();
  return (
    <main className="site-page">
      <Events lang={lang} />
    </main>
  );
}
