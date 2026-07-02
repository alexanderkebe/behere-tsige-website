'use client';

import React, { useState, useEffect } from 'react';
import Reveal from './Reveal';
import '@/styles/page-hero.css';

export default function PageHero({ title, subtitle, bgImage, videoSrcDesktop, videoSrcMobile }) {
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    if (!videoSrcDesktop && !videoSrcMobile) return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => {
      setVideoSrc(mq.matches ? (videoSrcMobile || videoSrcDesktop) : (videoSrcDesktop || videoSrcMobile));
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [videoSrcDesktop, videoSrcMobile]);

  const hasVideo = !!videoSrc;
  const style = !hasVideo && bgImage ? { backgroundImage: `url(${bgImage})` } : {};

  return (
    <section className={`page-hero ${hasVideo ? 'page-hero--has-video' : ''}`} style={style}>
      {hasVideo && (
        <div className="page-hero-video-bg">
          <video
            key={videoSrc}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </div>
      )}
      <div className="page-hero-overlay"></div>
      <Reveal className="page-hero-content" direction="up">
        <h1 className="page-hero-title">{title}</h1>
        {subtitle && <p className="page-hero-desc">{subtitle}</p>}
        <div className="page-hero-divider"></div>
      </Reveal>
    </section>
  );
}
