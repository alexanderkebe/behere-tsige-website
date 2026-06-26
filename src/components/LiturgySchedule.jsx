import React from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function LiturgySchedule({ schedule = [] }) {
  const { lang } = useLanguage();
  
  if (!schedule || schedule.length === 0) return null;

  const sectionTitle = lang === 'am' ? 'የቅዳሴ እና የጸሎት መርሃ ግብር' : 'Liturgy & Prayer Schedule';

  return (
    <section id="liturgy-schedule" className="liturgy-schedule-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title">{sectionTitle}</h2>
      </Reveal>

      <div className="schedule-container">
        {schedule.map((item, index) => (
          <Reveal key={item.id} delay={index * 50} direction="up" as="div" className="schedule-row">
            <div className="schedule-info-col">
              <h3 className="schedule-row-title">
                {lang === 'am' ? item.title_am || item.title_en : item.title_en}
              </h3>
              {(item.note_am || item.note_en) && (
                <p className="schedule-row-note">
                  {lang === 'am' ? item.note_am : item.note_en}
                </p>
              )}
            </div>
            <div className="schedule-time-col">
              <span className="schedule-row-day">
                {item.day_of_week.charAt(0).toUpperCase() + item.day_of_week.slice(1)}
              </span>
              <span className="schedule-row-time">
                {item.start_time}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
