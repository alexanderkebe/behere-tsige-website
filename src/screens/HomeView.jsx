'use client';

import { useLanguage } from '@/context/LanguageContext';
import Hero from '@/components/Hero';
import About from '@/components/About';
import ParishOffice from '@/components/ParishOffice';

/**
 * The home page: three sections only — Hero, About Us, Parish Office.
 * Parish data (fathers, members) is fetched server-side and passed in.
 * The splash preloader is global (SiteChrome), so every page waits for
 * the shared asset set; the hero video comes from the preload cache.
 */
export default function HomeView({ fathers, members }) {
  const { lang } = useLanguage();

  return (
    <>
      <Hero lang={lang} />
      <About lang={lang} />
      <ParishOffice lang={lang} fathers={fathers} members={members} />
    </>
  );
}
