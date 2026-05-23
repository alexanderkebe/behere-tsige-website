import React, { useState, useEffect, useRef } from 'react';
import { DiamondOrnament } from './Icons';

const GALLERY_IMAGES = [
  {
    src: '/assets/about-1.jpg.png',
    en: 'Our faithful parish community gathering in prayer and celebration.',
    am: 'ምዕመናን በጸሎት እና በዓላት ላይ በአንድነት ሲሳተፉ።',
  },
  {
    src: '/assets/about-2.jpg.png',
    en: 'Inside the sanctuary, reflecting ancient Orthodox iconography.',
    am: 'በቅድስት ሥላሴ ሥዕላት ያጌጠው የቤተ መቅደሱ ውስጣዊ እይታ።',
  },
  {
    src: '/assets/about-3.jpg.png',
    en: 'Celebrating traditional Ethiopian Orthodox liturgical ceremonies.',
    am: 'ጥንታዊ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ሥርዓተ አምልኮ።',
  },
  {
    src: '/assets/about-4.jpg.png',
    en: 'Parish members and children participating in spiritual services.',
    am: 'የደብሩ ምዕመናንና ሕፃናት በሰንበት መርሃ ግብር ሲሳተፉ።',
  },
];

const CONTENT = {
  en: {
    tag: 'Our Heritage',
    heading: 'About Us & History',
    body1:
      'Bihere Tsige Mekane Selam Kidist Dengel Mariam Church stands as a beacon of Ethiopian Orthodox Tewahedo faith. Established over five decades ago, our parish has been a spiritual home for thousands of faithful believers.',
    body2:
      'The name "Bihere Tsige" (Land of Grace) reflects our mission to be a place where God\'s grace flows abundantly. Our church preserves the ancient traditions of the Ethiopian Orthodox Tewahedo Church while nurturing the spiritual growth of our community.',
    learnMore: 'Learn More',
    galleryTitle: 'Parish Life Gallery',
  },
  am: {
    tag: 'ታሪካችን',
    heading: 'ስለ እኛ እና ታሪካችን',
    body1:
      'ብሔረ ጽጌ መካነ ሰላም ቅድስት ድንግል ማርያም ቤተ ክርስቲያን የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነት ምሰሶ ሆና ትቆማለች። ከሃምሳ ዓመት በፊት የተቋቋመ ደብራችን ለሺዎች ምዕመናን መንፈሳዊ ቤት ሆኖ አገልግሏል።',
    body2:
      '"ብሔረ ጽጌ" (የጸጋ ምድር) የሚለው ስም የእግዚአብሔር ጸጋ በብዛት የሚፈስበት ስፍራ ለመሆን ያለንን ተልዕኮ ያንጸባርቃል። ቤተ ክርስቲያናችን የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ጥንታዊ ወጎችን እየጠበቀ ማኅበረሰባችንን መንፈሳዊ እድገት ያሳድጋል።',
    learnMore: 'ተጨማሪ ይወቁ',
    galleryTitle: 'የደብራችን ሕይወት ምስሎች',
  },
};

export default function About({ lang }) {
  const content = CONTENT[lang] || CONTENT.en;
  const [slideIdx, setSlideIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  /* Intersection observer for scroll-in animations */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const prevSlide = () =>
    setSlideIdx((i) => (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  const nextSlide = () =>
    setSlideIdx((i) => (i + 1) % GALLERY_IMAGES.length);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      {/* ── Text column ── */}
      <div className={`about-text-col ${visible ? 'about-visible' : ''}`}>
        {/* Tag */}
        <div className="about-tag-row">
          <span className="about-tag-line" />
          <span className="about-tag">{content.tag}</span>
          <span className="about-tag-line" />
        </div>

        {/* Ornament */}
        <div className="about-ornament">
          <DiamondOrnament />
        </div>

        <h2 className="about-heading" id="about-heading">{content.heading}</h2>

        <p className="about-body">{content.body1}</p>
        <p className="about-body">{content.body2}</p>

        <a href="#about-more" className="btn-learn-more" id="btn-learn-more">
          {content.learnMore}
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className="learn-more-arrow">
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </a>
      </div>

      {/* ── Premium In-Place Carousel ── */}
      <div className={`about-gallery-carousel-wrap ${visible ? 'about-visible' : ''}`}>
        <h3 className="carousel-section-title">{content.galleryTitle}</h3>
        
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
      </div>
    </section>
  );
}
