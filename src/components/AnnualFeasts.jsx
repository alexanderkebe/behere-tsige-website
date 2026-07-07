import React from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function AnnualFeasts({ feasts = [] }) {
  const { lang } = useLanguage();
  
  if (!feasts || feasts.length === 0) return null;

  const isAm = lang === 'am' || lang === 'gez';
  const sectionTitle = isAm ? 'ዓመታዊ ዐቢይ በዓላት' : 'Major Annual Feasts';

  return (
    <section id="annual-feasts" className="annual-feasts-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title">{sectionTitle}</h2>
      </Reveal>
 
      <div className="feasts-container">
        {feasts.map((item, index) => {
          const dateStr = isAm ? item.date_am : item.date_en;
          const parts = dateStr ? dateStr.trim().split(/\s+/) : [];
          const month = parts[0] || '';
          const day = parts[1] || '';
          const title = isAm ? item.title_am : item.title_en;

          return (
            <Reveal key={item.id} delay={index * 40} direction="up" as="div" className="feast-row">
              <div className="feast-date-col">
                <div className="feast-calendar-badge">
                  <span className="feast-calendar-month">{month}</span>
                  <span className="feast-calendar-day">{day}</span>
                </div>
              </div>
              <div className="feast-info-col">
                <h3 className="feast-title-text">
                  {title}
                </h3>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
