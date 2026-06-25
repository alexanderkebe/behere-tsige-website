'use client';

import { useLanguage } from '@/context/LanguageContext';
import Services from '@/components/Services';
import ChurchSchool from '@/components/ChurchSchool';

export default function ServicesPage() {
  const { lang } = useLanguage();
  return (
    <main className="site-page">
      <Services lang={lang} />
      <ChurchSchool lang={lang} />
    </main>
  );
}
