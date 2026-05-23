import React from 'react';
import Reveal from './Reveal';
import {
  DiamondOrnament,
  WorshipIcon,
  TeachingIcon,
  ServingIcon,
  FellowshipIcon,
} from './Icons';
import { useContent } from '../context/ContentContext';

const SERVICES_DATA = [
  { id: 'service-worship', icon: WorshipIcon, key: 'worship' },
  { id: 'service-teaching', icon: TeachingIcon, key: 'teaching' },
  { id: 'service-serving', icon: ServingIcon, key: 'serving' },
  { id: 'service-fellowship', icon: FellowshipIcon, key: 'fellowship' },
];

export default function Services({ lang }) {
  const { content } = useContent();
  const c = content.services[lang] || content.services.en;

  return (
    <section id="services" className="services-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title" id="services-title">{c.title}</h2>
      </Reveal>

      <div className="services-grid" id="services-grid">
        {SERVICES_DATA.map((service, index) => {
          const IconComponent = service.icon;
          const serviceText = c[service.key];
          return (
            <React.Fragment key={service.id}>
              {index > 0 && <div className="service-divider" />}
              <Reveal
                as="div"
                className="service-card"
                id={service.id}
                delay={index * 100}
                direction="up"
              >
                <div className="service-icon-ring">
                  <IconComponent />
                </div>
                <div className="service-text">
                  <h3>{serviceText.title}</h3>
                  <p>{serviceText.description}</p>
                </div>
              </Reveal>
            </React.Fragment>
          );
        })}
      </div>

      <Reveal className="services-bottom-divider" delay={400}>
        <span className="divider-line dark"></span>
        <DiamondOrnament />
        <span className="divider-line dark"></span>
      </Reveal>
    </section>
  );
}
