'use client';

import { useLanguage } from '@/context/LanguageContext';
import { usePreloader } from '@/hooks/usePreloader';
import Preloader from '@/components/Preloader';
import Hero from '@/components/Hero';
import About from '@/components/About';
import ParishOffice from '@/components/ParishOffice';

/**
 * The home page: three sections only — Hero, About Us, Parish Office.
 * Parish data (fathers, members) is fetched server-side and passed in.
 */
export default function HomeView({ fathers, members }) {
  const { lang } = useLanguage();
  const { progress, done, videoSrc } = usePreloader();

  return (
    <>
      <Preloader progress={progress} done={done} />
      <Hero lang={lang} videoSrc={videoSrc} />
      <About lang={lang} />
      <ParishOffice lang={lang} fathers={fathers} members={members} />
    </>
  );
}
