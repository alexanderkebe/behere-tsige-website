'use client';

import { useLanguage } from '@/context/LanguageContext';
import Contact from '@/components/Contact';

export default function ContactPage() {
  const { lang } = useLanguage();
  return (
    <main className="site-page">
      <Contact lang={lang} />
    </main>
  );
}
