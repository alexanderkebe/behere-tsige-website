'use client';

import React, { useState } from 'react';
import { DiamondOrnament } from './Icons';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';

const UI = {
  en: { showLess: 'Show Less', storyTag: 'Our Story', storyTitle: 'Vision, Mission & Our Journey', gallery: 'Add photos' },
  am: { showLess: 'ይዝጉ', storyTag: 'ታሪካችን', storyTitle: 'ራዕይ፣ ተልዕኮ እና ጉዟችን', gallery: 'ፎቶዎች ጨምሩ' },
};

// Extended "Learn More" content — generated boilerplate, editable from the admin later.
const EXTENDED = [
  {
    key: 'vision',
    images: ['/assets/about-1.jpg.png', '/assets/about-2.jpg.png'],
    en: { title: 'Vision', full: 'To be a spiritual home where every soul is drawn closer to God — a beacon of the Ethiopian Orthodox Tewahedo faith that preserves the apostolic tradition while embracing every generation, rooted in prayer and shining the light of Christ to the world around us.' },
    am: { title: 'ራዕይ', full: 'እያንዳንዱ ነፍስ ወደ እግዚአብሔር የሚቀርብበት መንፈሳዊ ቤት መሆን — ሐዋርያዊ ትውፊትን ጠብቆ ለሁሉም ትውልድ የሚደርስ፣ በጸሎት የጸና፣ የክርስቶስን ብርሃን ለአካባቢው የሚያበራ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነት ብርሃን መሆን።' },
  },
  {
    key: 'mission',
    images: ['/assets/about-3.jpg.png', '/assets/about-4.jpg.png'],
    en: { title: 'Mission', full: 'To preserve the apostolic faith and sacred traditions of the Ethiopian Orthodox Tewahedo Church, to teach the Gospel to all ages, to administer the holy sacraments, and to serve our community and those in need with the love of Christ.' },
    am: { title: 'ተልዕኮ', full: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያንን ሐዋርያዊ እምነትና ቅዱስ ትውፊት መጠበቅ፣ ለሁሉም ዕድሜ ወንጌልን ማስተማር፣ ቅዱሳት ምሥጢራትን ማከናወን፣ እንዲሁም ማኅበረሰባችንንና ችግረኞችን በክርስቶስ ፍቅር ማገልገል።' },
  },
  {
    key: 'community',
    images: ['/assets/about-2.jpg.png', '/assets/about-3.jpg.png'],
    en: { title: 'Our Community', full: 'A welcoming family of believers — families, youth, elders, and newcomers — united in worship and fellowship. From Sunday school to choir, from charitable outreach to feast-day celebrations, there is a place for everyone to belong, to grow, and to serve.' },
    am: { title: 'የእኛ ማህበረሰብ', full: 'እንግዳ ተቀባይ የምእመናን ቤተሰብ — ቤተሰቦች፣ ወጣቶች፣ አረጋውያንና አዲስ መጤዎች በአምልኮና በኅብረት የተሰባሰቡበት። ከሰንበት ትምህርት ቤት እስከ መዘምራን፣ ከበጎ አድራጎት እስከ የበዓላት አከባበር — ለሁሉም የሚሆን ቦታ አለ።' },
  },
  {
    key: 'history',
    images: ['/assets/about-1.jpg.png', '/assets/about-4.jpg.png'],
    en: { title: 'History', full: 'Established over five decades ago by a small group of faithful believers, our parish has grown into a thriving spiritual home for thousands. Through years of dedication, our community has built and renovated its sanctuary, expanded its schools, and carried forward the ancient traditions of the Church.' },
    am: { title: 'ታሪክ', full: 'ከአምስት አስርት ዓመታት በፊት በጥቂት ምእመናን የተመሰረተው ደብራችን ዛሬ ለሺዎች መንፈሳዊ ቤት ሆኖ አድጓል። በዓመታት ጥረት ማኅበረሰባችን ቤተ መቅደሱን ሠርቶና አድሶ፣ ትምህርት ቤቶቹን አስፍቶ፣ የቤተ ክርስቲያንን ጥንታዊ ትውፊት አስቀጥሏል።' },
  },
];

export default function About({ lang }) {
  const { content } = useContent();
  const c = content.about[lang] || content.about.en;
  const GALLERY_IMAGES = content.about.gallery;
  const ui = UI[lang] || UI.en;

  const [slideIdx, setSlideIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const prevSlide = () =>
    setSlideIdx((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  const nextSlide = () =>
    setSlideIdx((i) => (i + 1) % GALLERY_IMAGES.length);

  return (
    <section id="about" className="about-section">
      <div className="about-main">
        {/* ── Text column ── */}
        <Reveal className="about-text-col" direction="left">
          <div className="about-tag-row">
            <span className="about-tag-line" />
            <span className="about-tag">{c.tag}</span>
            <span className="about-tag-line" />
          </div>

          <div className="about-ornament">
            <DiamondOrnament />
          </div>

          <h2 className="about-heading" id="about-heading">{c.heading}</h2>

          <p className="about-body">{c.body1}</p>
          <p className="about-body">{c.body2}</p>

          <button
            type="button"
            className="btn-learn-more"
            id="btn-learn-more"
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? ui.showLess : c.learnMore}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className={`learn-more-arrow ${expanded ? 'is-open' : ''}`}>
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </button>
        </Reveal>

        {/* ── Parish Life Gallery carousel ── */}
        <Reveal className="about-gallery-carousel-wrap" direction="right" delay={120}>
          <h3 className="carousel-section-title">{c.galleryTitle}</h3>

          <div className="about-carousel" id="about-gallery-carousel">
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
      </div>

      {/* ── Extended content, revealed by "Learn More" ── */}
      {expanded && (
        <div className="about-extended" id="about-more">
          <Reveal className="about-extended-head">
            <div className="about-tag-row about-tag-center">
              <span className="about-tag-line" />
              <span className="about-tag">{ui.storyTag}</span>
              <span className="about-tag-line" />
            </div>
            <h3 className="about-extended-title">{ui.storyTitle}</h3>
          </Reveal>

          <div className="about-extended-list" style={{ display: 'flex', flexDirection: 'column', gap: '100px', marginTop: '60px' }}>
            {EXTENDED.map((s, i) => {
              const t = s[lang] || s.en;
              return (
                <div className="about-main" key={s.key}>
                  <Reveal className="about-text-col" direction="left" delay={i * 80}>
                    <div className="about-ornament">
                      <DiamondOrnament />
                    </div>
                    <h3 className="about-heading" style={{ fontSize: '2.2rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>{t.title}</h3>
                    <p className="about-body">{t.full}</p>
                  </Reveal>

                  <Reveal className="about-gallery-carousel-wrap" direction="right" delay={i * 80 + 120}>
                    <div className="about-feature-gallery" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: 0 }}>
                      {s.images.map((src, idx) => (
                        <div className="about-feature-thumb" key={idx} style={{ aspectRatio: '4 / 5', borderRadius: '16px', boxShadow: '0 10px 30px rgba(15, 27, 61, 0.08)' }}>
                          <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
