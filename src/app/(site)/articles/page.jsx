'use client';

import { useLanguage } from '@/context/LanguageContext';
import News from '@/components/News';

export default function ArticlesPage() {
  const { lang } = useLanguage();
  return (
    <main className="site-page">
      <News lang={lang} />
    </main>
  );
}
