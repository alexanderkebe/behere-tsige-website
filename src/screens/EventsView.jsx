'use client';

import React, { useState, useEffect } from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { DiamondOrnament } from '@/components/Icons';
import '@/styles/events.css';

export default function EventsView({ initialEvents = [] }) {
  const { lang } = useLanguage();
  const isAm = lang === 'am';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all | feasts | regular
  const [selectedEvent, setSelectedEvent] = useState(null);

  const t = {
    tag: isAm ? 'የቤተ ክርስቲያን መርሃ ግብሮች' : 'Church Calendar',
    title: isAm ? 'መንፈሳዊ በዓላትና መርሃ ግብሮች' : 'Parish Events & Feasts',
    subtitle: isAm ? 'በደብራችን የሚካሄዱ በዓላት፣ ኮንፈረንሶች እና መንፈሳዊ መርሃ ግብሮች' : 'Join us for our upcoming feasts, conferences, and spiritual gatherings.',
    upcomingTitle: isAm ? 'ቀጣይ በዓላትና መርሃ ግብሮች' : 'Upcoming Gatherings',
    noEvents: isAm ? 'ተስማሚ መርሃ ግብር አልተገኘም።' : 'No matching events scheduled at this time.',
    mainFeast: isAm ? 'ታላቅ ዓመታዊ በዓል' : 'Main Annual Feast',
    location: isAm ? 'ቦታ' : 'Location',
    time: isAm ? 'ሰዓት' : 'Time',
    date: isAm ? 'ቀን' : 'Date',
    learnMore: isAm ? 'የበለጠ ለመረዳት' : 'Learn More',
    searchPlaceholder: isAm ? 'መርሃ ግብሮችን በስም ወይም በዝርዝር ፈልግ...' : 'Search events by title or description...',
    tabAll: isAm ? 'ሁሉም መርሃ ግብሮች' : 'All Events',
    tabFeasts: isAm ? 'ዓመታዊ በዓላት' : 'Main Feasts',
    tabRegular: isAm ? 'ሌሎች መርሃ ግብሮች' : 'Other Events',
    close: isAm ? 'ዝጋ' : 'Close',
    viewLocation: isAm ? 'በካርታ ላይ አሳይ' : 'View on Map',
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedEvent(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return dateStr;
      return dateObj.toLocaleDateString(isAm ? 'am-ET' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getCalendarDate = (dateStr) => {
    if (!dateStr) return { month: '', day: '' };
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return { month: '', day: '' };
      
      const month = dateObj.toLocaleDateString(isAm ? 'am-ET' : 'en-US', { month: 'short' }).replace('.', '');
      const day = dateObj.getDate();
      return { month, day };
    } catch (e) {
      return { month: '', day: '' };
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const parts = timeStr.split(':');
      if (parts.length < 2) return timeStr;
      const hour = Number(parts[0]);
      const min = parts[1];
      if (isNaN(hour)) return timeStr;
      
      const ampm = hour >= 12 ? (isAm ? 'ከሰዓት' : 'PM') : (isAm ? 'ጠዋት' : 'AM');
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${min} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };

  // Filter events based on active tab and search query
  const filteredEvents = initialEvents.filter((event) => {
    const title = (isAm ? event.title_am || event.title_en : event.title_en || event.title_am) || '';
    const desc = (isAm ? event.description_am || event.description_en : event.description_en || event.description_am) || '';
    const matchesSearch = 
      title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'feasts') {
      return event.is_main && matchesSearch;
    }
    if (activeTab === 'regular') {
      return !event.is_main && matchesSearch;
    }
    return matchesSearch;
  });

  // Featured event is the first main event (only shown on 'all' tab when not searching)
  const showFeatured = activeTab === 'all' && searchQuery === '';
  const featuredEvent = showFeatured ? filteredEvents.find(e => e.is_main) : null;
  
  // Remaining events (exclude the featured one if it is displayed in the featured slot)
  const gridEvents = featuredEvent 
    ? filteredEvents.filter(e => e.id !== featuredEvent.id)
    : filteredEvents;

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

          {/* Interactive Filters */}
          <div className="events-filter-bar">
            <div className="events-search-wrapper">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="events-search-input"
              />
              {searchQuery && (
                <button 
                  className="search-clear-btn" 
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="events-tabs">
              <button
                className={`events-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                {t.tabAll}
              </button>
              <button
                className={`events-tab-btn ${activeTab === 'feasts' ? 'active' : ''}`}
                onClick={() => setActiveTab('feasts')}
              >
                {t.tabFeasts}
              </button>
              <button
                className={`events-tab-btn ${activeTab === 'regular' ? 'active' : ''}`}
                onClick={() => setActiveTab('regular')}
              >
                {t.tabRegular}
              </button>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="events-empty-container">
              <p className="events-empty-notice">{t.noEvents}</p>
            </div>
          ) : (
            <div className="events-layout-container">
              {/* Highlight main event if applicable */}
              {featuredEvent && (
                <Reveal className="event-card main-event-featured" as="div" direction="up">
                  <div className="event-card-content">
                    <div className="event-card-top">
                      <span className="main-event-badge-label">{t.mainFeast}</span>
                      <div className="calendar-badge-wrapper">
                        {(() => {
                          const { month, day } = getCalendarDate(featuredEvent.event_date);
                          return month && day ? (
                            <div className="calendar-badge">
                              <span className="calendar-badge-month">{month}</span>
                              <span className="calendar-badge-day">{day}</span>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </div>

                    <div className="event-date-row">
                      <span className="event-date-text">
                        <span aria-hidden="true" className="meta-icon">📅</span>
                        {formatDate(featuredEvent.event_date)}
                      </span>
                      {featuredEvent.start_time && (
                        <span className="event-time-text">
                          <span aria-hidden="true" className="meta-icon">⏰</span>
                          {formatTime(featuredEvent.start_time)}
                        </span>
                      )}
                    </div>

                    <h3 className="event-title-highlight">
                      {isAm ? featuredEvent.title_am || featuredEvent.title_en : featuredEvent.title_en || featuredEvent.title_am}
                    </h3>
                    
                    <p className="event-desc-text text-truncate-3">
                      {isAm ? featuredEvent.description_am || featuredEvent.description_en : featuredEvent.description_en || featuredEvent.description_am}
                    </p>
                    
                    <div className="event-details-meta">
                      {(featuredEvent.location_en || featuredEvent.location_am) && (
                        <div className="event-meta-item">
                          <span aria-hidden="true" className="meta-icon">📍</span>
                          <strong>{t.location}:</strong> {isAm ? featuredEvent.location_am || featuredEvent.location_en : featuredEvent.location_en || featuredEvent.location_am}
                        </div>
                      )}
                    </div>

                    <button 
                      className="btn-event-more btn-event-more-main"
                      onClick={() => setSelectedEvent(featuredEvent)}
                    >
                      {t.learnMore}
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" className="learn-more-arrow">
                        <path d="M4 10h12M11 5l5 5-5 5" />
                      </svg>
                    </button>
                  </div>

                  <div className="event-poster-wrapper" onClick={() => setSelectedEvent(featuredEvent)}>
                    {featuredEvent.poster_url ? (
                      <img 
                        src={featuredEvent.poster_url} 
                        alt={isAm ? featuredEvent.title_am : featuredEvent.title_en} 
                        className="event-poster-img" 
                      />
                    ) : (
                      <div className="event-poster-placeholder">
                        <DiamondOrnament />
                      </div>
                    )}
                  </div>
                </Reveal>
              )}

              {/* Grid of other events */}
              {gridEvents.length > 0 && (
                <div className="events-secondary-grid">
                  {gridEvents.map((event, idx) => (
                    <Reveal key={event.id} delay={idx * 50} className={`event-card secondary-event ${event.is_main ? 'has-badge' : ''}`} as="div" direction="up">
                      <div className="event-secondary-poster-container" onClick={() => setSelectedEvent(event)}>
                        {event.is_main && (
                          <span className="secondary-card-badge">{t.mainFeast}</span>
                        )}
                        <div className="card-calendar-badge-position">
                          {(() => {
                            const { month, day } = getCalendarDate(event.event_date);
                            return month && day ? (
                              <div className="calendar-badge small">
                                <span className="calendar-badge-month">{month}</span>
                                <span className="calendar-badge-day">{day}</span>
                              </div>
                            ) : null;
                          })()}
                        </div>
                        {event.poster_url ? (
                          <div className="event-secondary-poster">
                            <img 
                              src={event.poster_url} 
                              alt={isAm ? event.title_am : event.title_en} 
                            />
                          </div>
                        ) : (
                          <div className="event-secondary-placeholder">
                            <DiamondOrnament />
                          </div>
                        )}
                      </div>

                      <div className="event-secondary-content">
                        <div className="event-date-badge">
                          <span>📅 {formatDate(event.event_date)}</span>
                          {event.start_time && <span className="time-badge"> · ⏰ {formatTime(event.start_time)}</span>}
                        </div>
                        
                        <h3>{isAm ? event.title_am || event.title_en : event.title_en || event.title_am}</h3>
                        
                        <p className="text-truncate-2">
                          {isAm ? event.description_am || event.description_en : event.description_en || event.description_am}
                        </p>
                        
                        {(event.location_en || event.location_am) && (
                          <div className="event-card-location">
                            <span>📍 {isAm ? event.location_am || event.location_en : event.location_en || event.location_am}</span>
                          </div>
                        )}

                        <button 
                          className="btn-event-more"
                          onClick={() => setSelectedEvent(event)}
                        >
                          {t.learnMore}
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" className="learn-more-arrow">
                            <path d="M4 10h12M11 5l5 5-5 5" />
                          </svg>
                        </button>
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
