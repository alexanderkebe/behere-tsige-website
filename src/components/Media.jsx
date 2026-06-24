import React from 'react';
import { DiamondOrnament } from './Icons';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="media-play-icon">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function Media({ lang }) {
  const { content } = useContent();
  const m = content.media;
  const c = m[lang] || m.en;

  return (
    <section id="media" className="media-section">
      <Reveal className="media-header">
        <div className="about-tag-row">
          <span className="about-tag-line" />
          <span className="about-tag">{c.sectionTag}</span>
          <span className="about-tag-line" />
        </div>
        <div className="about-ornament"><DiamondOrnament /></div>
        <h2 className="media-section-title" id="media-section-title">{c.sectionTitle}</h2>
        <p className="media-intro">{c.intro}</p>
      </Reveal>

      <div className="media-grid" id="media-grid">
        {m.items.map((item, index) => {
          const t = item[lang] || item.en;
          return (
            <Reveal
              as="a"
              key={item.id}
              id={item.id}
              className="media-card"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              delay={index * 120}
            >
              <div className="media-thumb">
                <img src={item.thumb} alt={t.title} loading="lazy" />
                <span className="media-thumb-overlay" />
                <span className="media-play"><PlayIcon /></span>
                <span className="media-type">{t.type}</span>
              </div>
              <h3 className="media-card-title">{t.title}</h3>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="media-cta" delay={120}>
        <a
          className="btn-media-all"
          href={m.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {c.viewAll}
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className="learn-more-arrow">
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </a>
      </Reveal>
    </section>
  );
}
