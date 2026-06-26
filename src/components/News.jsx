import React from 'react';
import { DiamondOrnament } from './Icons';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';
import PageHero from './PageHero';

const QuoteMark = () => (
  <svg viewBox="0 0 40 32" fill="none" className="quote-mark-svg">
    <path
      d="M0 20.8C0 12 5.6 5.6 16 0l2.4 4.8C12 8.8 9.6 13.6 9.6 16h6.4v16H0V20.8zM24 20.8C24 12 29.6 5.6 40 0l2.4 4.8C36 8.8 33.6 13.6 33.6 16H40v16H24V20.8z"
      fill="currentColor"
    />
  </svg>
);

export default function News({ lang }) {
  const { content } = useContent();
  const c = content.news[lang] || content.news.en;

  const isAm = lang === 'am';
  const heroTitle = isAm ? 'መንፈሳዊ ጽሑፎች እና ትምህርቶች' : 'Spiritual Articles & Homilies';
  const heroSubtitle = isAm ? 'ከደብራችን አባቶች እና መምህራን የተዘጋጁ መንፈሳዊ ትምህርቶች እና መጣጥፎች' : 'Read teachings and articles from our parish fathers and teachers.';

  return (
    <div className="articles-container-wrapper">
      <PageHero title={heroTitle} subtitle={heroSubtitle} />
      
      <section id="articles" className="news-section" style={{ paddingTop: '4rem' }}>


      <Reveal className="father-card" id="father-message" delay={100}>
        <div className="father-quote-col">
          <QuoteMark />
          <blockquote className="father-quote">{c.fatherMessage}</blockquote>
          <div className="father-info">
            <div className="father-avatar">
              <img src="/assets/profile-pic-preist.png" alt={c.fatherTitle} className="father-avatar-img" />
            </div>
            <div>
              <div className="father-name">{c.fatherTitle}</div>
              <div className="father-role">{c.fatherRole}</div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="news-grid-header" delay={150}>
        <DiamondOrnament />
        <h3 className="news-grid-title">{c.newsTitle}</h3>
      </Reveal>

      <div className="news-grid" id="news-grid">
        {c.news.map((item, index) => (
          <Reveal as="article" className="news-card" key={item.id} id={item.id} delay={index * 120}>
            <span className="news-card-date">{item.date}</span>
            <h4 className="news-card-title">{item.title}</h4>
            <p className="news-card-excerpt">{item.excerpt}</p>
            <div className="news-card-line" />
          </Reveal>
        ))}
      </div>
    </section>
    </div>
  );
}
