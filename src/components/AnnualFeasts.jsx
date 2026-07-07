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
 
      <div className="feasts-grid">
        {feasts.map((item, index) => {
          const dateStr = isAm ? item.date_am : item.date_en;
          const parts = dateStr ? dateStr.trim().split(/\s+/) : [];
          const month = parts[0] || '';
          const day = parts[1] || '';
          const title = isAm ? item.title_am : item.title_en;

          return (
            <Reveal key={item.id} delay={index * 40} direction="up" as="div" className="calendar-card">
              <div className="calendar-header">
                <span className="calendar-month">{month}</span>
              </div>
              <div className="calendar-body">
                <div className="calendar-day-circle">
                  <span className="calendar-day">{day}</span>
                </div>
                <div className="calendar-divider">
                  <span className="divider-line"></span>
                  <span className="divider-dot"></span>
                  <span className="divider-line"></span>
                </div>
                <h3 className="calendar-feast-title">
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
