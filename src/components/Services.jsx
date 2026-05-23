import React from 'react';
import {
  DiamondOrnament,
  WorshipIcon,
  TeachingIcon,
  ServingIcon,
  FellowshipIcon,
} from './Icons';

const SERVICES_DATA = [
  { id: 'service-worship', icon: WorshipIcon, key: 'worship' },
  { id: 'service-teaching', icon: TeachingIcon, key: 'teaching' },
  { id: 'service-serving', icon: ServingIcon, key: 'serving' },
  { id: 'service-fellowship', icon: FellowshipIcon, key: 'fellowship' },
];

const TRANSLATIONS = {
  en: {
    title: 'OUR SERVICES',
    worship: {
      title: 'WORSHIP',
      description: 'Experience the joy of worship and connect with God.',
    },
    teaching: {
      title: 'TEACHING',
      description: 'Growing in faith through the Word of God.',
    },
    serving: {
      title: 'SERVING',
      description: 'Serving our community with love and compassion.',
    },
    fellowship: {
      title: 'FELLOWSHIP',
      description: 'Building relationships and growing together.',
    },
  },
  am: {
    title: 'አገልግሎቶቻችን',
    worship: {
      title: 'አምልኮ',
      description: 'የአምልኮን ደስታ ይለማመዱ እና ከእግዚአብሔር ጋር ይገናኙ።',
    },
    teaching: {
      title: 'ትምህርት',
      description: 'በእግዚአብሔር ቃል በኩል በእምነት ማደግ።',
    },
    serving: {
      title: 'ማኅበረሰብ አገልግሎት',
      description: 'ማኅበረሰባችንን በፍቅር እና በራኅራኄ ማገልገል።',
    },
    fellowship: {
      title: 'ኅብረት',
      description: 'ግንኙነቶችን መገንባት እና አብሮ ማደግ።',
    },
  },
};

export default function Services({ lang }) {
  const content = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <section id="services" className="services-section">
      <div className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title" id="services-title">{content.title}</h2>
      </div>

      <div className="services-grid" id="services-grid">
        {SERVICES_DATA.map((service, index) => {
          const IconComponent = service.icon;
          const serviceText = content[service.key];
          return (
            <React.Fragment key={service.id}>
              {index > 0 && <div className="service-divider" />}
              <div className="service-card" id={service.id}>
                <div className="service-icon-ring">
                  <IconComponent />
                </div>
                <div className="service-text">
                  <h3>{serviceText.title}</h3>
                  <p>{serviceText.description}</p>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="services-bottom-divider">
        <span className="divider-line dark"></span>
        <DiamondOrnament />
        <span className="divider-line dark"></span>
      </div>
    </section>
  );
}

