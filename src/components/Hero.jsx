import React, { useEffect, useState } from 'react';
import { TinyCross, DiamondOrnament } from './Icons';
import { useContent } from '../context/ContentContext';

// Returns the active screen tier: 'large' (> 1180px), 'phone' (<= 752px),
// or 'tablet' (in between). Large and phone use looping videos; tablet uses
// the still image.
function useScreenTier() {
  const largeQuery = '(min-width: 1181px)';
  const phoneQuery = '(max-width: 752px)';
  const resolve = () =>
    window.matchMedia(largeQuery).matches
      ? 'large'
      : window.matchMedia(phoneQuery).matches
        ? 'phone'
        : 'tablet';
  const [tier, setTier] = useState(resolve);
  useEffect(() => {
    const largeMq = window.matchMedia(largeQuery);
    const phoneMq = window.matchMedia(phoneQuery);
    const update = () => setTier(resolve());
    largeMq.addEventListener('change', update);
    phoneMq.addEventListener('change', update);
    return () => {
      largeMq.removeEventListener('change', update);
      phoneMq.removeEventListener('change', update);
    };
  }, []);
  return tier;
}

export default function Hero({ lang, videoSrc }) {
  const { content } = useContent();
  const c = content.hero[lang] || content.hero.en;
  const tier = useScreenTier();
  const poster =
    tier === 'phone'
      ? '/assets/hero-mobile.png'
      : tier === 'tablet'
        ? '/assets/hero-tablet.png'
        : '/assets/background.png';

  return (
    <section id="home" className="hero">
      <div className="hero-bg hero-bg-animate">
        {videoSrc ? (
          <video
            className="hero-bg-video"
            src={videoSrc}
            poster={poster}
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

          {c.welcome && (
            <div className="hero-welcome animate-fade-in-up delay-3">
              {c.welcome}
            </div>
          )}

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
