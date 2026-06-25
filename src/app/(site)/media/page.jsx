'use client';

import { useLanguage } from '@/context/LanguageContext';
import Media from '@/components/Media';

export default function MediaPage() {
  const { lang } = useLanguage();
  return (
    <main className="site-page">
      <Media lang={lang} />
    </main>
  );
}
