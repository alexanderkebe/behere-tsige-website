import React, { useState } from 'react';
import { DiamondOrnament } from './Icons';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';

export default function About({ lang }) {
  const { content } = useContent();
  const contentText = content.about[lang] || content.about.en;
  const GALLERY_IMAGES = content.about.gallery;
  const [slideIdx, setSlideIdx] = useState(0);

  const prevSlide = () =>
    setSlideIdx((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  const nextSlide = () =>
    setSlideIdx((i) => (i + 1) % GALLERY_IMAGES.length);

  return (
    <section id="about" className="about-section">
      {/* ── Text column ── */}
      <Reveal className="about-text-col" direction="left">
        {/* Tag */}
        <div className="about-tag-row">
          <span className="about-tag-line" />
          <span className="about-tag">{contentText.tag}</span>
          <span className="about-tag-line" />
        </div>

        {/* Ornament */}
        <div className="about-ornament">
          <DiamondOrnament />
        </div>

        <h2 className="about-heading" id="about-heading">{contentText.heading}</h2>

        <p className="about-body">{contentText.body1}</p>
        <p className="about-body">{contentText.body2}</p>

        <a href="#about-more" className="btn-learn-more" id="btn-learn-more">
          {contentText.learnMore}
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className="learn-more-arrow">
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </a>
      </Reveal>

      {/* ── Premium In-Place Carousel ── */}
      <Reveal className="about-gallery-carousel-wrap" direction="right" delay={120}>
        <h3 className="carousel-section-title">{contentText.galleryTitle}</h3>
        
        <div className="about-carousel" id="about-gallery-carousel">
          {/* Navigation Arrows */}
          <button className="carousel-arrow carousel-arrow-prev" onClick={prevSlide} aria-label="Previous slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button className="carousel-arrow carousel-arrow-next" onClick={nextSlide} aria-label="Next slide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>

          {/* Slides Container */}
          <div className="carousel-slides-container">
            {GALLERY_IMAGES.map((img, i) => (
              <div 
                key={i} 
                className={`carousel-slide ${i === slideIdx ? 'active' : ''}`}
                aria-hidden={i !== slideIdx}
              >
                <img src={img.src} alt={lang === 'am' ? img.am : img.en} className="carousel-img" loading="lazy" />
                <div className="carousel-caption">
                  <p>{lang === 'am' ? img.am : img.en}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Indicators / Dots */}
          <div className="carousel-indicators">
            {GALLERY_IMAGES.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === slideIdx ? 'active' : ''}`}
                onClick={() => setSlideIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
