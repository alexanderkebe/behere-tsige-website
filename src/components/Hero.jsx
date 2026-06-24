import React, { useEffect, useState } from 'react';
import { TinyCross, DiamondOrnament } from './Icons';
import { useContent } from '../context/ContentContext';

// True on large screens (> 1180px), where the looping hero video is used.
function useIsLargeScreen() {
  const query = '(min-width: 1181px)';
  const [isLarge, setIsLarge] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setIsLarge(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isLarge;
}

export default function Hero({ lang, videoSrc }) {
  const { content } = useContent();
  const c = content.hero[lang] || content.hero.en;
  const isLarge = useIsLargeScreen();

  return (
    <section id="home" className="hero">
      <div className="hero-bg hero-bg-animate">
        {isLarge && videoSrc ? (
          <video
            className="hero-bg-video"
            src={videoSrc}
            poster="/assets/background.png"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        ) : (
          <picture>
            <source media="(max-width: 752px)" srcSet="/assets/hero-mobile.png" />
            <source media="(max-width: 1180px)" srcSet="/assets/hero-tablet.png" />
            <img src="/assets/background.png" alt="EOTC Church Background" loading="eager" className="hero-bg-img" />
          </picture>
        )}
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
