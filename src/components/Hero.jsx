import React from 'react';
import { TinyCross, DiamondOrnament } from './Icons';
import { useContent } from '../context/ContentContext';

export default function Hero({ lang }) {
  const { content } = useContent();
  const c = content.hero[lang] || content.hero.en;

  return (
    <section id="home" className="hero">
      <div className="hero-bg hero-bg-animate">
        <picture>
          <source media="(max-width: 752px)" srcSet="/assets/hero-mobile.png" />
          <source media="(max-width: 1180px)" srcSet="/assets/hero-tablet.png" />
          <img src="/assets/background.png" alt="EOTC Church Background" loading="eager" className="hero-bg-img" />
        </picture>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-tiny-cross animate-fade-in delay-1">
            <TinyCross />
          </div>

          <div className="hero-bubble animate-fade-in-up delay-2">
            {c.bubble}
          </div>

          <h1 className="hero-title animate-fade-in-up delay-3" id="hero-title">
            {c.title}
          </h1>

          <p className="hero-description animate-fade-in-up delay-4">
            {c.description}
          </p>

          <div className="hero-divider animate-fade-in delay-5">
            <span className="divider-line"></span>
            <DiamondOrnament />
            <span className="divider-line"></span>
          </div>
        </div>
      </div>

      <div className="hero-bottom-shape hero-shape-entrance">
        <img src="/assets/bottom-shape.png" alt="" loading="eager" />
      </div>
    </section>
  );
}
