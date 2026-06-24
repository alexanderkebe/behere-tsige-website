import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import ChurchSchool from '../components/ChurchSchool';
import News from '../components/News';
import Events from '../components/Events';
import Donate from '../components/Donate';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import { usePreloader } from '../hooks/usePreloader';

export default function Home() {
  const [lang, setLang] = useState('en');
  const { progress, done, videoSrc } = usePreloader();

  return (
    <div className={lang === 'am' ? 'lang-am' : 'lang-en'}>
      <Preloader progress={progress} done={done} />
      <Navbar lang={lang} setLang={setLang} />
      <Hero lang={lang} videoSrc={videoSrc} />
      <About lang={lang} />
      <Services lang={lang} />
      <ChurchSchool lang={lang} />
      <News lang={lang} />
      <Events lang={lang} />
      <Donate lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
