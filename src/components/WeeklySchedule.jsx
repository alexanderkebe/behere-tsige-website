import React from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';

function formatDay(val, isAm) {
  if (!val) return '';
  if (!isAm) {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
  
  const translations = {
    'monday': 'ሰኞ',
    'tuesday': 'ማክሰኞ',
    'wednesday': 'ረቡዕ',
    'thursday': 'ሐሙስ',
    'friday': 'አርብ',
    'saturday': 'ቅዳሜ',
    'sunday': 'እሑድ',
    'meskerem': 'መስከረም',
    'tekemt': 'ጥቅምት',
    'hidar': 'ኅዳር',
    'tahsas': 'ታኅሣሥ',
    'tir': 'ጥር',
    'yekatit': 'የካቲት',
    'megabit': 'መጋቢት',
    'miazia': 'ሚያዚያ',
    'genbot': 'ግንቦት',
    'sene': 'ሰኔ',
    'hamle': 'ሐምሌ',
    'nehase': 'ነሐሴ',
    'pagume': 'ጳግሜ'
  };

  const lowerVal = val.toLowerCase().trim();
  if (translations[lowerVal]) {
    return translations[lowerVal];
  }

  const words = lowerVal.split(/\s+/);
  const translated = words.map(w => translations[w] || w);
  return translated.join(' ');
}

export default function WeeklySchedule({ schedule = [] }) {
  const { lang } = useLanguage();
  
  const isAm = lang === 'am' || lang === 'gez';
  const sectionTitle = isAm ? 'የሳምንቱ ቁመታት' : 'Weekly Liturgical Schedule';
  const noEventsText = isAm 
    ? 'በዚህ ሳምንት ምንም መርሃ ግብሮች የሉም።' 
    : 'There are no events scheduled for this week.';

  return (
    <section id="weekly-schedule" className="weekly-schedule-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title">{sectionTitle}</h2>
      </Reveal>
 
      <div className="weekly-container">
        {!schedule || schedule.length === 0 ? (
          <Reveal delay={100} direction="up" as="div" className="weekly-no-events">
            <p>{noEventsText}</p>
          </Reveal>
        ) : (
          schedule.map((item, index) => (
            <Reveal key={item.id} delay={index * 50} direction="up" as="div" className="weekly-row">
              <div className="weekly-info-col">
                <h3 className="weekly-row-title">
                  {lang === 'am' ? item.title_am || item.title_en : item.title_en}
                </h3>
                {(item.note_am || item.note_en) && (
                  <p className="weekly-row-note">
                    {lang === 'am' ? item.note_am : item.note_en}
                  </p>
                )}
              </div>
              <div className="weekly-time-col">
                <span className="weekly-row-day">
                  {formatDay(item.day_of_week, isAm)}
                </span>
                <span className="weekly-row-time">
                  {item.start_time ? item.start_time.substring(0, 5) : ''}
                </span>
              </div>
            </Reveal>
          ))
        )}
      </div>
    </section>
  );
}
