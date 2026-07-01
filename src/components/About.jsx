'use client';

import React, { useState } from 'react';
import { DiamondOrnament } from './Icons';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';

const UI = {
  en: { showLess: 'Show Less', storyTag: 'Our Journey', storyTitle: 'The Historical Narrative', gallery: 'Add photos' },
  am: { showLess: 'ይዝጉ', storyTag: 'ከጉዞዋችን', storyTitle: 'የታሪክ ጉዞ', gallery: 'ፎቶዎች ጨምሩ' },
};

// Extended "Learn More" content containing the 5 timeline chapters
const EXTENDED = [
  {
    key: 'chapter1',
    images: ['/assets/about-1.jpg.png', '/assets/about-2.jpg.png'],
    en: {
      title: 'The Journey of the Tabot: Exile and Refuge in Sudan',
      full: `The sacred history of the church begins in Eritrea. In 1983, amid political upheaval and conflict, a massive wave of soldiers and civilians was forced to migrate to Sudan. They did not travel alone; they carried with them their deepest spiritual shield—the Tsellat (Tabot) of Saint Mary, along with the Tabot of Saint John the Apostle.

Upon arriving in the refugee camps of Sudan, the displaced community faced harsh conditions. Crowded and desperate, the people were plagued by frequent, highly contagious illnesses. In their suffering, they felt an urgent need to turn to God in prayer and began searching for a place of worship. It was during this dark hour that they made a profound discovery: Saint Mary’s Tabot was right there among them in the camp.`
    },
    am: {
      title: 'የጽላቷ ስደት፦ ከኤርትራ ወደ ሱዳን',
      full: `የቤተክርስቲያኗ ታሪክ የሚጀምረው በኤርትራ ምድር ነው። በ1975 ዓ.ም (እ.ኤ.አ በ1983) በነበረው የፖለቲካ እና የጦርነት አለመረጋጋት ምክንያት በርካታ ወታደሮችና የሲቪል ማኅበረሰብ አባላት ወደ ሱዳን ለመሰደድ ተገደው ነበር። ይሁን እንጂ ሕዝቡ ብቻውን አልተሰደደም፤ ታላቋን መንፈሳዊ ጋሻቸውን—የእመቤታችን ቅድስት ድንግል ማርያምን ታቦት ከነበቤ መለኮት ቅዱስ ዮሐንስ ወንጌላው ታቦት ጋር በክብር ይዘው ተጓዙ።

ስደተኞቹ ሱዳን በሚገኘው መጠለያ ጣቢያ በደረሱ ጊዜ አስቸጋሪ ሕይወት ገጠማቸው። በካምፑ ውስጥ በነበረው መጨናነቅ ምክንያት ሕዝቡ በተላላፊ በሽታዎች ክፉኛ መታመም ጀመረ። በዚህ በጭንቅ ሰዓት ህዝቡ ወደ ፈጣሪያቸው ለመጸለይ ቤተክርስቲያን መፈለግ ጀመሩ። ብዙም ሳይቆይ ግን የእመቤታችን የቅድስት ማርያም ታቦት እዚያው በመካከላቸው በስደት ካምፑ ውስጥ መኖሯን ተገነዘቡ።`
    }
  },
  {
    key: 'chapter2',
    images: ['/assets/about-3.jpg.png', '/assets/about-4.jpg.png'],
    en: {
      title: 'A Call for Clergy: Worship in the Wilderness',
      full: `With the Tabot discovered, a vital question arose: Who will be our priests? Who will be our deacons to practice our sacred traditions and administer the sacraments?

A dedicated man named Basha Bekele Woldemariam took it upon himself to search the camp. He combed through both the civilian refugees and the ranks of the soldiers, looking for those ordained in the faith. Remarkably, he found two priests and four deacons.

Resourceful and driven by pure faith, the community set to work with what little they had:
- They fashioned holy crosses out of metal roof panels (qorqorro).
- They constructed a small, humble shed (meqeyo) to shield the Tabot.
- They utilized discarded plastic bottles to hold the Holy Water (Tsebel).

Through these humble sacraments and unwavering prayers, a miracle occurred—the contagious illnesses ceased, and the people were healed.`
    },
    am: {
      title: 'የአገልግሎት ጥሪ፦ ካህናትና ዲያቆናት በምድረ በዳ',
      full: `ጸላቷ በመካከላቸው መኖሯ ከታወቀ በኋላ አንድ ትልቅ ጥያቄ ተነሳ፦ ሥርዓተ አምልኮቱን የሚያስፈጽሙ፣ ምስጢራተ ቤተክርስቲያንን የሚፈጽሙልን ካህናትና ዲያቆናት እነማን ይሆኑ?

በዚህ ጊዜ ባሻ በቀለ ወልደማርያም የተባሉ ታማኝ የቤተክርስቲያን ሰው ካህናትንና ዲያቆናትን በካምፑ ውስጥ ካሉ ወታደሮችና ማኅበረሰብ መካከል መፈለግ ጀመሩ። በፈጣሪ እርዳታም ሁለት ካህናት እና አራት ዲያቆናትን ማግኘት ቻሉ።

ማኅበረሰቡም ባላቸው አነስተኛ አቅም በታላቅ እምነት የሚከተሉትን አከናወኑ፦
- ከቆርቆሮ የብረት መስቀሎችን ሰሩ።
- ታቦቱ የሚያርፍበት ትንሽ መቃኞ (መቆያ) አዘጋጁ።
- በፕላስቲክ ሀይላንዶች ጸበል እየቀዱ መጠቀም ጀመሩ።

በዚህ በቅንነት በተደረገ ጸሎትና አገልግሎት ታላቅ ተአምር ሆነ፤ ሕዝቡን ያሰቃይ የነበረው ተላላፊ በሽታ ቆመ፣ የታመሙትም በጸበሉ ተፈወሱ።`
    }
  },
  {
    key: 'chapter3',
    images: ['/assets/about-2.jpg.png', '/assets/about-3.jpg.png'],
    en: {
      title: 'Answered Prayers: The Transition to Behera Tsige',
      full: `Meanwhile, back in Ethiopia, the faithful community living near Behera Tsige was in desperate need of a local church. Memhir Fisseha Gebrehiwot, a priest and the chairman (sebsabi) of the St. Gabriel Mahaber, took up their cause. He organized the community and petitioned the Patriarch to grant them a Tabot.

Hearing their cries, the Patriarch officially granted the community the very same Saint Mary Tabot that had protected the refugees in Sudan. Memhir Fisseha Gebrehiwot was rightfully appointed as the first head priest of the newly established church.`
    },
    am: {
      title: 'የጸሎት መልስ፦ ወደ ብሔረ ጽጌ የተደረገው ሽግግር',
      full: `በተመሳሳይ ጊዜ በአዲስ አበባ ብሔረ ጽጌ አካባቢ የሚኖሩት ምዕመናን የቤተክርስቲያን እጥረት ክፉኛ ተቸግረው ነበር። በዚህ ጊዜ የቅዱስ ገብርኤል ማኅበር ሰብሳቢ የነበሩት መምህር ፍሥሐ ገብረሕይወት የተባሉ አባት የምዕመኑን ጥያቄ በማደራጀት ታቦት እንዲሰጣቸው ለቅዱስ ፓትርያርኩ አመለከቱ።

ቅዱስ ፓትርያርኩም የሕዝቡን ልመና በመስማት፥ በሱዳን ምድር ስደተኞቹን ስትጠብቅ የነበረችውን ያችን ጽላት ለአካባቢው ምዕመናን እንድትሆን ፈቀዱ። መምህር ፍሥሐ ገብረሕይወትም የቤተክርስቲያኑ የመጀመሪያው የበላይ ጠባቂ ሆነው ተሾሙ።`
    }
  },
  {
    key: 'chapter4',
    images: ['/assets/about-1.jpg.png', '/assets/about-4.jpg.png'],
    en: {
      title: 'Building the First Sanctuary: A One-Day Miracle',
      full: `Determined to house the sacred Tabot properly, the local community rallied together. Using sheet metal roofing, they undertook an extraordinary one-day construction project. On Yekatit 26, 1986 (Ethiopian Calendar), they successfully completed the first meqagnio (temporary sanctuary).

The very next day, on Yekatit 27, 1986, His Grace Abune Barnabas (ብጹህ አቡነ ባርናባስ) blessed the grand opening, and the Consecration of the Church (Kidase Bet) was joyfully celebrated.`
    },
    am: {
      title: 'የአንድ ቀን ተአምር፦ የመጀመሪያው መቃኞ ግንባታ',
      full: `ታቦቱን በክብር ለማሳረፍ የአካባቢው ማኅበረሰብ ባደረገው ታላቅ ርብርብ፣ ከቆርቆሮ የተሰራ ጊዜያዊ መቃኞ በአንድ ቀን የመገንባት ታሪክ ተመዘገበ። በየካቲት 26 ቀን 1986 ዓ.ም የመጀመሪያው መቃኞ ተጠናቀቀ።

በማግስቱ የካቲት 27 ቀን 1986 ዓ.ም ብፁዕ አቡነ በርናባስ በተገኙበት በድምቀት ተከበረ፤ የቅዳሴ ቤቱም በዓልም በታላቅ ደስታ ተከበረ።`
    }
  },
  {
    key: 'chapter5',
    images: ['/assets/about-3.jpg.png', '/assets/about-2.jpg.png'],
    en: {
      title: 'Legacy: From Humble Beginnings to a Lasting Sanctuary',
      full: `As the congregation grew, so did the need for a permanent structure. In 1988, construction began on the grand, modern church building that stands today.

However, the church has never forgotten its roots. The very first metal meqagnio, built in a single day by the hands of faithful believers, still stands on the grounds today—fully functional and serving the community as the sacred house for Holy Water baptism (Tsebel Metemiqiya). It remains a living testament to a journey of survival, healing, and unstoppable faith.`
    },
    am: {
      title: 'መደምደሚያ፦ ከትህትና ወደ ዘላቂ ክብር',
      full: `የምዕመናን ቁጥር ከጊዜ ወደ ጊዜ እየጨመረ በመምጣቱ፣ ዘላቂና ሰፊ ሕንፃ መገንባት አስፈላጊ ስለሆነ በ1988 ዓ.ም አሁን የምናየው ዘመናዊ እና ታላቅ የቤተክርስቲያን ሕንፃ ግንባታ ተጀመረ።

ቤተክርስቲያኗ ዛሬ ላይ ትልቅ ደረጃ ብትደርስም ያለፈችበትን ታሪክ ግን መቼም አይረሳም። በምዕመናን እጅ በአንድ ቀን ውስጥ የተገነባው ያ የመጀመሪያው የቆርቆሮ መቃኞ ዛሬም ድረስ በቅጽሩ ውስጥ በክብር ቆሞ ይገኛል፤ በአሁኑ ወቅትም ማኅበረሰቡን እንደ ጸበል መጠመቂያ ሆኖ እያገለገለ ይገኛል። ይህ ስፍራ ለአሁኑ ትውልድ፣ የእግዚአብሔር ጥበቃ ሕያው ምስክር ነው።`
    }
  }
];

// Helper function to format timeline content with paragraphs and bullet lists
function formatTimelineText(text) {
  if (!text) return null;
  const paragraphs = text.split('\n\n');
  return paragraphs.map((para, i) => {
    // If the paragraph is a bullet list (contains lines starting with '- ')
    if (para.includes('\n- ') || para.startsWith('- ')) {
      const items = para
        .split('\n')
        .map((line) => line.replace(/^-\s*/, '').trim())
        .filter(Boolean);
      return (
        <ul className="timeline-list" key={i}>
          {items.map((item, idx) => (
            <li key={idx} className="timeline-list-item">
              <span className="timeline-list-bullet">✦</span>
              <span className="timeline-list-text">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p className="about-body timeline-paragraph" key={i}>
        {para}
      </p>
    );
  });
}

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
          {c.body2 && <p className="about-body">{c.body2}</p>}

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

          <div className="about-timeline-wrap">
            <div className="about-timeline-line" />

            <div className="about-extended-list">
              {EXTENDED.map((s, i) => {
                const t = s[lang] || s.en;
                const isReversed = i % 2 === 1;
                return (
                  <div className={`about-main timeline-item ${isReversed ? 'about-main-reverse' : ''}`} key={s.key}>
                    
                    {/* Timeline dot/node */}
                    <div className="timeline-node">
                      <div className="timeline-node-dot">
                        <span className="timeline-node-inner" />
                      </div>
                    </div>

                    <Reveal className="about-text-col timeline-text-card" direction={isReversed ? "right" : "left"} delay={i * 80}>
                      <div className="about-ornament">
                        <DiamondOrnament />
                      </div>
                      <span className="timeline-chapter-label">{lang === 'am' ? `ምዕራፍ ${i + 1}` : `Chapter ${i + 1}`}</span>
                      <h3 className="about-heading timeline-heading">{t.title}</h3>
                      <div className="timeline-body-content">
                        {formatTimelineText(t.full)}
                      </div>
                    </Reveal>

                    <Reveal className="about-gallery-carousel-wrap timeline-gallery-card" direction={isReversed ? "left" : "right"} delay={i * 80 + 120}>
                      <div className="about-overlap-gallery">
                        <div className="about-overlap-bg">
                          <img src={s.images[0]} alt="" loading="lazy" />
                        </div>
                        {s.images[1] && (
                          <div className="about-overlap-fg">
                            <img src={s.images[1]} alt="" loading="lazy" />
                          </div>
                        )}
                      </div>
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
