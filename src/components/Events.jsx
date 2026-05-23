import React from 'react';
import { DiamondOrnament } from './Icons';

const CONTENT = {
  en: {
    sectionTag: 'Parish Events',
    sectionTitle: 'Annual Parish Celebrations',
    intro: 'We celebrate the sacred feast days of our Lady Saint Virgin Mary throughout the year.',
    learnMore: 'Learn More',
    mainFeastBadge: 'Main Feast',
    events: [
      {
        id: 'event-1',
        title: 'ኅዳር ጽጌ (Hidar Tsige)',
        date: 'November 30 (ኅዳር 21)',
        description: 'The main annual parish feast celebrating Our Lady Mary, Land of Grace (Bihere Tsige). Includes liturgical services, spiritual poetry (Qene), and a colorful procession.',
        isMain: true,
      },
      {
        id: 'event-2',
        title: 'ግንቦት ልደታ (Ginbot Lidet)',
        date: 'May 9 (ግንቦት 1)',
        description: 'Celebrating the birth of the Blessed Virgin Mary, Mother of God. A day filled with special divine liturgy and spiritual fellowship.',
        isMain: false,
      },
      {
        id: 'event-3',
        title: 'ነሐሴ ማርያም (Nehase Mariam)',
        date: 'August 22 (ነሐሴ 16)',
        description: 'Dormition and Assumption of the Blessed Virgin Mary. Marks the culmination of the 16-day Filseta Fasting with sacred liturgy.',
        isMain: false,
      },
    ],
  },
  am: {
    sectionTag: 'የደብር በዓላት',
    sectionTitle: 'ዓመታዊ የደብር በዓላት',
    intro: 'በዓመቱ ውስጥ የእመቤታችን ቅድስት ድንግል ማርያም ቅዱስ በዓላትን በደመቀ ሁኔታ እናከብራለን።',
    learnMore: 'ተጨማሪ ይወቁ',
    mainFeastBadge: 'ዋና በዓል',
    events: [
      {
        id: 'event-1',
        title: 'ኅዳር ጽጌ',
        date: 'ኅዳር 21 (November 30)',
        description: 'የደብራችን ዋና ዓመታዊ በዓል። እመቤታችን ቅድስት ድንግል ማርያምን በብሔረ ጽጌ ስም የምናስብበት፣ በዝማሬ፣ በቅኔ እና በታላቅ መንፈሳዊ ሥነ-ሥርዓት የሚከበር ታላቅ በዓል።',
        isMain: true,
      },
      {
        id: 'event-2',
        title: 'ግንቦት ልደታ',
        date: 'ግንቦት 1 (May 9)',
        description: 'የእመቤታችን የቅድስት ድንግል ማርያም ልደት በታላቅ መንፈሳዊ ጉባኤ እና በቅዳሴ ጸሎት የሚከበርበት የተቀደሰ ዕለት።',
        isMain: false,
      },
      {
        id: 'event-3',
        title: 'ነሐሴ ማርያም',
        date: 'ነሐሴ 16 (August 22)',
        description: 'የእመቤታችን የቅድስት ድንግል ማርያም ትንሣኤና ዕርገት (ፍልሰታ በዓል ፍጻሜ) በጸሎትና በቅዱስ ቍርባን የምናከብርበት ዕለት።',
        isMain: false,
      },
    ],
  },
};

export default function Events({ lang }) {
  const c = CONTENT[lang] || CONTENT.en;

  return (
    <section id="events" className="events-section">
      {/* Section header */}
      <div className="events-header">
        <div className="about-tag-row">
          <span className="about-tag-line" />
          <span className="about-tag">{c.sectionTag}</span>
          <span className="about-tag-line" />
        </div>
        <div className="about-ornament"><DiamondOrnament /></div>
        <h2 className="events-section-title" id="events-section-title">{c.sectionTitle}</h2>
        <p className="events-intro">{c.intro}</p>
      </div>

      {/* Events Grid */}
      <div className="events-grid" id="events-grid">
        {c.events.map((event) => (
          <div 
            key={event.id} 
            className={`event-card ${event.isMain ? 'main-event-card' : ''}`}
            id={event.id}
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
          </div>
        ))}
      </div>
    </section>
  );
}
