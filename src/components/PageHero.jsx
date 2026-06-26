'use client';

import React from 'react';
import Reveal from './Reveal';

export default function PageHero({ title, subtitle, bgImage }) {
  const style = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

  return (
    <section className="page-hero" style={style}>
      <div className="page-hero-overlay"></div>
      <Reveal className="page-hero-content" direction="up">
        <h1 className="page-hero-title">{title}</h1>
        {subtitle && <p className="page-hero-desc">{subtitle}</p>}
        <div className="page-hero-divider"></div>
      </Reveal>
    </section>
  );
}
