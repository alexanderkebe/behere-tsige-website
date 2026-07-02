import React, { useEffect, useState } from 'react';
import { TinyCross, DiamondOrnament } from './Icons';
import { useContent } from '../context/ContentContext';
import ScrollIndicator from './ScrollIndicator';

// Returns the active screen tier: 'large' (> 1180px), 'phone' (<= 752px),
// or 'tablet' (in between). Large and phone use looping videos; tablet uses
// the still image.
function useScreenTier() {
  const largeQuery = '(min-width: 1181px)';
  const phoneQuery = '(max-width: 752px)';
  // SSR-safe default; corrected on mount once matchMedia is available.
  const [tier, setTier] = useState('large');
  useEffect(() => {
    const largeMq = window.matchMedia(largeQuery);
    const phoneMq = window.matchMedia(phoneQuery);
    const resolve = () =>
      largeMq.matches ? 'large' : phoneMq.matches ? 'phone' : 'tablet';
    const update = () => setTier(resolve());
    update();
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

  const activeVideoSrc = videoSrc || (
    tier === 'phone'
      ? '/assets/hero-mobile.mp4'
      : tier === 'large'
        ? '/assets/hero-video-desktop.mp4'
        : '/assets/hero-tablet-video.mp4'
  );

  return (
    <section id="home" className="hero">
      <div className="hero-bg hero-bg-animate">
        {activeVideoSrc ? (
          <video
            className="hero-bg-video"
            src={activeVideoSrc}
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

      <div className="hero-scroll-indicator-wrapper animate-fade-in delay-5">
        <ScrollIndicator hideOnTouch />
      </div>

      <div className="hero-bottom-shape hero-shape-entrance">
        <img src="/assets/bottom-shape.png" alt="" loading="eager" />
      </div>
    </section>
  );
}
