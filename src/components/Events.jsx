import React from 'react';
import { DiamondOrnament } from './Icons';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';

export default function Events({ lang }) {
  const { content } = useContent();
  const c = content.events[lang] || content.events.en;

  return (
    <section id="events" className="events-section">
      {/* Section header */}
      <Reveal className="events-header">
        <div className="about-tag-row">
          <span className="about-tag-line" />
          <span className="about-tag">{c.sectionTag}</span>
          <span className="about-tag-line" />
        </div>
        <div className="about-ornament"><DiamondOrnament /></div>
        <h2 className="events-section-title" id="events-section-title">{c.sectionTitle}</h2>
        <p className="events-intro">{c.intro}</p>
      </Reveal>

      {/* Events Grid */}
      <div className="events-grid" id="events-grid">
        {c.events.map((event, index) => (
          <Reveal
            as="div"
            key={event.id}
            className={`event-card ${event.isMain ? 'main-event-card' : ''}`}
            id={event.id}
            delay={index * 120}
          >
            {event.isMain && (
              <span className="main-event-badge">{c.mainFeastBadge}</span>
            )}
            
            <div className="event-date-wrapper">
              <span className="event-date-label">{event.date}</span>
            </div>

            <h3 className="event-card-title">{event.title}</h3>
            <p className="event-card-desc">{event.description}</p>
            
            <button className={`btn-event-more ${event.isMain ? 'btn-event-more-main' : ''}`}>
              {c.learnMore}
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" className="learn-more-arrow">
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
