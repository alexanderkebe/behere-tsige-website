import React from 'react';
import { TinyCross, DiamondOrnament } from './Icons';

const HERO_CONTENT = {
  en: {
    bubble: 'Welcome to Behere Tsige',
    title: 'Mekane Selam St. Mary',
    description: 'A sacred place of faith, fellowship, and spiritual growth established in the tradition of the Ethiopian Orthodox Tewahedo Church.'
  },
  am: {
    bubble: 'እንኳን ወደ ብሔረ ጽጌ በደህና መጡ',
    title: 'መካነ ሰላም ቅድስት ድንግል ማርያም',
    description: 'በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ወግ የተመሰረተ የእምነት፣ የኅብረት እና የመንፈሳዊ እድገት ቅዱስ ስፍራ'
  }
};

export default function Hero({ lang }) {
  const content = HERO_CONTENT[lang] || HERO_CONTENT.en;

  return (
    <section id="home" className="hero">
      {/* Background landscape image */}
      <div className="hero-bg">
        <picture>
          <source media="(max-width: 752px)" srcSet="/assets/hero-mobile.png" />
          <source media="(max-width: 1180px)" srcSet="/assets/hero-tablet.png" />
          <img src="/assets/background.png" alt="EOTC Church Background" loading="eager" />
        </picture>
      </div>

      {/* Main content */}
      <div className="hero-content">
        {/* Center: Text block */}
        <div className="hero-text">
          <div className="hero-tiny-cross animate-fade-in delay-1">
            <TinyCross />
          </div>

          <div className="hero-bubble animate-fade-in-up delay-2">
            {content.bubble}
          </div>

          <h1 className="hero-title animate-fade-in-up delay-3" id="hero-title">
            {content.title}
          </h1>

          <p className="hero-description animate-fade-in-up delay-4">
            {content.description}
          </p>

          <div className="hero-divider animate-fade-in delay-5">
            <span className="divider-line"></span>
            <DiamondOrnament />
            <span className="divider-line"></span>
          </div>
        </div>
      </div>

      {/* Curved navy+gold transition shape */}
      <div className="hero-bottom-shape">
        <img src="/assets/bottom-shape.png" alt="" loading="eager" />
      </div>
    </section>
  );
}

