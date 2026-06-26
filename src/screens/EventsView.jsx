'use client';

import React from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { DiamondOrnament } from '@/components/Icons';
import '@/styles/events.css';

export default function EventsView({ initialEvents = [] }) {
  const { lang } = useLanguage();
  const isAm = lang === 'am';

  const t = {
    tag: isAm ? 'የቤተ ክርስቲያን መርሃ ግብሮች' : 'Church Calendar',
    title: isAm ? 'መንፈሳዊ በዓላትና መርሃ ግብሮች' : 'Parish Events & Feasts',
    subtitle: isAm ? 'በደብራችን የሚካሄዱ በዓላት፣ ኮንፈረንሶች እና መንፈሳዊ መርሃ ግብሮች' : 'Join us for our upcoming feasts, conferences, and spiritual gatherings.',
    upcomingTitle: isAm ? 'ቀጣይ በዓላትና መርሃ ግብሮች' : 'Upcoming Gatherings',
    noEvents: isAm ? 'በአሁኑ ጊዜ ምንም የተቀደሰ መርሃ ግብር የለም።' : 'No upcoming events scheduled at this time.',
    mainFeast: isAm ? 'ታላቅ ዓመታዊ በዓል' : 'Main Annual Feast',
    location: isAm ? 'ቦታ' : 'Location',
    time: isAm ? 'ሰዓት' : 'Time',
    date: isAm ? 'ቀን' : 'Date',
    learnMore: isAm ? 'የበለጠ ለመረዳት' : 'Learn More'
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString(isAm ? 'am-ET' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    // timeStr is HH:MM:SS, parse it
    const [h, m] = timeStr.split(':');
    const hour = Number(h);
    const ampm = hour >= 12 ? (isAm ? 'ከሰዓት' : 'PM') : (isAm ? 'ጠዋት' : 'AM');
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  // Group events into main events and regular events
  const mainEvents = initialEvents.filter(e => e.is_main);
  const otherEvents = initialEvents.filter(e => !e.is_main);

  return (
    <div className="events-page-view">
      <PageHero
        title={t.title}
        subtitle={t.subtitle}
      />

      <section className="events-content-section">
        <div className="events-content-container">
          <Reveal className="events-section-header">
            <div className="about-tag-row" style={{ justifyContent: 'center' }}>
              <span className="about-tag-line" />
              <span className="about-tag">{t.tag}</span>
              <span className="about-tag-line" />
            </div>
            <div className="about-ornament"><DiamondOrnament /></div>
            <h2>{t.upcomingTitle}</h2>
          </Reveal>

          {initialEvents.length === 0 ? (
            <p className="events-empty-notice">{t.noEvents}</p>
          ) : (
            <div className="events-layout-grid">
              {/* Highlight main events first */}
              {mainEvents.map((event, idx) => (
                <Reveal key={event.id} delay={idx * 100} className="event-card main-event-featured" as="div" direction="up">
                  <div className="event-card-banner">
                    <span className="main-event-badge-label">{t.mainFeast}</span>
                  </div>
                  <div className="event-card-content">
                    <div className="event-date-row">
                      <span className="event-date-text">📅 {formatDate(event.event_date)}</span>
                      {event.start_time && <span className="event-time-text">⏰ {formatTime(event.start_time)}</span>}
                    </div>
                    <h3 className="event-title-highlight">{isAm ? event.title_am || event.title_en : event.title_en}</h3>
                    <p className="event-desc-text">{isAm ? event.description_am || event.description_en : event.description_en}</p>
                    
                    <div className="event-details-meta">
                      {event.location_en && (
                        <div className="event-meta-item">
                          <strong>📍 {t.location}:</strong> {isAm ? event.location_am || event.location_en : event.location_en}
                        </div>
                      )}
                    </div>
                  </div>
                  {event.poster_url && (
                    <div className="event-poster-wrapper">
                      <img src={event.poster_url} alt="" className="event-poster-img" />
                    </div>
                  )}
                </Reveal>
              ))}

              {/* Grid of other events */}
              {otherEvents.length > 0 && (
                <div className="events-secondary-grid">
                  {otherEvents.map((event, idx) => (
                    <Reveal key={event.id} delay={idx * 80} className="event-card secondary-event" as="div" direction="up">
                      {event.poster_url && (
                        <div className="event-secondary-poster">
                          <img src={event.poster_url} alt="" />
                        </div>
                      )}
                      <div className="event-secondary-content">
                        <div className="event-date-badge">
                          <span>{formatDate(event.event_date)}</span>
                          {event.start_time && <span className="time-badge"> · {formatTime(event.start_time)}</span>}
                        </div>
                        <h3>{isAm ? event.title_am || event.title_en : event.title_en}</h3>
                        <p>{isAm ? event.description_am || event.description_en : event.description_en}</p>
                        
                        {(event.location_en || event.location_am) && (
                          <div className="event-card-location">
                            <span>📍 {isAm ? event.location_am || event.location_en : event.location_en}</span>
                          </div>
                        )}
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
