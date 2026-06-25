'use client';

import React, { useState } from 'react';
import { DiamondOrnament } from './Icons';
import Reveal from './Reveal';

const HEAD = {
  en: { tag: 'About Us', title: 'About Behere Tsige St. Mary', readMore: 'Read more', readLess: 'Show less', gallery: 'Add photos' },
  am: { tag: 'ስለ እኛ', title: 'ስለ ብሔረ ጽጌ ቅድስት ማርያም', readMore: 'ተጨማሪ ያንብቡ', readLess: 'ይዝጉ', gallery: 'ፎቶዎች ጨምሩ' },
};

// Boilerplate (generated) content — to be made editable from the admin later.
const SECTIONS = [
  {
    key: 'vision',
    images: ['/assets/about-1.jpg.png', '/assets/about-2.jpg.png'],
    en: {
      title: 'Vision',
      teaser: 'To shine as a beacon of the Ethiopian Orthodox Tewahedo faith for generations to come.',
      full: 'Our vision is to be a spiritual home where every soul is drawn closer to God — a beacon of the Ethiopian Orthodox Tewahedo faith that preserves the apostolic tradition while embracing every generation. We long to see a community rooted in prayer, strengthened in love, and shining the light of Christ to the world around us.',
    },
    am: {
      title: 'ራዕይ',
      teaser: 'ለትውልድ የሚተላለፍ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነት ብርሃን ሆኖ መቆም።',
      full: 'ራዕያችን እያንዳንዱ ነፍስ ወደ እግዚአብሔር የሚቀርብበት መንፈሳዊ ቤት መሆን ነው — ሐዋርያዊ ትውፊትን ጠብቆ ለሁሉም ትውልድ የሚደርስ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነት ብርሃን። በጸሎት የጸና፣ በፍቅር የበረታ፣ የክርስቶስን ብርሃን ለአካባቢው የሚያበራ ማኅበረሰብ ለማየት እንናፍቃለን።',
    },
  },
  {
    key: 'mission',
    images: ['/assets/about-3.jpg.png', '/assets/about-4.jpg.png'],
    en: {
      title: 'Mission',
      teaser: 'To preserve the faith, teach the Gospel, and serve our community in love.',
      full: 'Our mission is to preserve the apostolic faith and the sacred traditions of the Ethiopian Orthodox Tewahedo Church, to teach the Gospel to all ages, to administer the holy sacraments, and to serve our community and those in need with the love of Christ.',
    },
    am: {
      title: 'ተልዕኮ',
      teaser: 'እምነትን መጠበቅ፣ ወንጌልን ማስተማር እና ማኅበረሰብን በፍቅር ማገልገል።',
      full: 'ተልዕኮአችን የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያንን ሐዋርያዊ እምነትና ቅዱስ ትውፊት መጠበቅ፣ ለሁሉም ዕድሜ ወንጌልን ማስተማር፣ ቅዱሳት ምሥጢራትን ማከናወን፣ እንዲሁም ማኅበረሰባችንንና ችግረኞችን በክርስቶስ ፍቅር ማገልገል ነው።',
    },
  },
  {
    key: 'community',
    images: ['/assets/about-2.jpg.png', '/assets/about-3.jpg.png'],
    en: {
      title: 'Our Community',
      teaser: 'A welcoming family of believers from every walk of life.',
      full: 'Our community is a welcoming family of believers — families, youth, elders, and newcomers — united in worship and fellowship. From Sunday school to choir, from charitable outreach to feast-day celebrations, there is a place for everyone to belong, to grow, and to serve.',
    },
    am: {
      title: 'የእኛ ማህበረሰብ',
      teaser: 'ከየአቅጣጫው የተሰባሰበ እንግዳ ተቀባይ የምእመናን ቤተሰብ።',
      full: 'ማኅበረሰባችን እንግዳ ተቀባይ የምእመናን ቤተሰብ ነው — ቤተሰቦች፣ ወጣቶች፣ አረጋውያንና አዲስ መጤዎች በአምልኮና በኅብረት የተሰባሰቡበት። ከሰንበት ትምህርት ቤት እስከ መዘምራን፣ ከበጎ አድራጎት እስከ የበዓላት አከባበር — ለሁሉም የሚሆን ቦታ፣ የማደግና የማገልገል ዕድል አለ።',
    },
  },
  {
    key: 'history',
    images: ['/assets/about-1.jpg.png', '/assets/about-4.jpg.png'],
    en: {
      title: 'History',
      teaser: 'Grown over five decades from a small congregation into a thriving parish.',
      full: 'Established over five decades ago by a small group of faithful believers, our parish has grown into a thriving spiritual home for thousands. Through years of dedication, our community has built and renovated its sanctuary, expanded its schools, and carried forward the ancient traditions of the Ethiopian Orthodox Tewahedo Church.',
    },
    am: {
      title: 'ታሪክ',
      teaser: 'ከትንሽ ጉባኤ ተነስቶ በአምስት አስርት ዓመታት ያደገ ደብር።',
      full: 'ከአምስት አስርት ዓመታት በፊት በጥቂት ምእመናን የተመሰረተው ደብራችን ዛሬ ለሺዎች መንፈሳዊ ቤት ሆኖ አድጓል። በዓመታት ጥረት ማኅበረሰባችን ቤተ መቅደሱን ሠርቶና አድሶ፣ ትምህርት ቤቶቹን አስፍቶ፣ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያንን ጥንታዊ ትውፊት አስቀጥሏል።',
    },
  },
];

export default function About({ lang }) {
  const h = HEAD[lang] || HEAD.en;
  const [open, setOpen] = useState({});
  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <section id="about" className="about-section">
      <Reveal className="about-head">
        <div className="about-tag-row">
          <span className="about-tag-line" />
          <span className="about-tag">{h.tag}</span>
          <span className="about-tag-line" />
        </div>
        <div className="about-ornament"><DiamondOrnament /></div>
        <h2 className="about-x-title">{h.title}</h2>
      </Reveal>

      <div className="about-accordion">
        {SECTIONS.map((s, i) => {
          const c = s[lang] || s.en;
          const isOpen = !!open[s.key];
          return (
            <Reveal className={`about-acc-item ${isOpen ? 'open' : ''}`} key={s.key} delay={i * 70}>
              <button
                className="about-acc-header"
                onClick={() => toggle(s.key)}
                aria-expanded={isOpen}
              >
                <span className="about-acc-title">{c.title}</span>
                <span className="about-acc-chevron">{isOpen ? '−' : '+'}</span>
              </button>

              <p className="about-acc-teaser">{c.teaser}</p>

              {isOpen && (
                <div className="about-acc-body">
                  <p className="about-acc-full">{c.full}</p>
                  <div className="about-acc-gallery">
                    {s.images.map((src, idx) => (
                      <div className="about-acc-slot" key={idx}>
                        <img src={src} alt="" loading="lazy" />
                      </div>
                    ))}
                    <div className="about-acc-slot about-acc-add" aria-hidden="true">
                      <span>＋ {h.gallery}</span>
                    </div>
                  </div>
                </div>
              )}

              <button className="about-readmore" onClick={() => toggle(s.key)}>
                {isOpen ? h.readLess : h.readMore}
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
