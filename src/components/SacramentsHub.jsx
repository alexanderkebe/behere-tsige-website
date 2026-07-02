import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import Baptism from './Baptism';
import Catechism from './Catechism';
import Penance from './Penance';
import Memorial from './Memorial';

// Beautiful SVGs for sacraments
const BaptismIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="sacrament-card-icon">
    <path d="M32 8C20 22 20 34 32 52C44 34 44 22 32 8Z" stroke="var(--gold)" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(197, 160, 68, 0.05)" />
    <path d="M32 18V38" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 28H42" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 56H52" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const CatechismIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="sacrament-card-icon">
    <rect x="8" y="10" width="48" height="44" rx="4" stroke="var(--gold)" strokeWidth="2.5" fill="rgba(197, 160, 68, 0.05)" />
    <line x1="32" y1="10" x2="32" y2="54" stroke="var(--gold)" strokeWidth="2" />
    <line x1="16" y1="22" x2="26" y2="22" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="30" x2="26" y2="30" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="38" x2="26" y2="38" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="38" y1="22" x2="48" y2="22" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="38" y1="30" x2="48" y2="30" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="38" y1="38" x2="48" y2="38" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PenanceIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="sacrament-card-icon">
    <path d="M32 6V58" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
    <path d="M14 22H50" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="22" r="6" stroke="var(--gold)" strokeWidth="2.5" fill="var(--navy)" />
    <path d="M22 42C22 36 42 36 42 42" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MemorialIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="sacrament-card-icon">
    {/* Candle flame */}
    <path d="M32 6C30 14 34 18 32 24C30 18 34 14 32 6Z" fill="var(--gold)" opacity="0.9" />
    {/* Candle Body */}
    <rect x="26" y="24" width="12" height="34" rx="2" stroke="var(--gold)" strokeWidth="2.5" fill="rgba(197, 160, 68, 0.05)" />
    <line x1="26" y1="34" x2="38" y2="34" stroke="var(--gold)" strokeWidth="1.5" />
    <line x1="26" y1="44" x2="38" y2="44" stroke="var(--gold)" strokeWidth="1.5" />
  </svg>
);

export default function SacramentsHub({ settings, services }) {
  const { lang } = useLanguage();
  const [selected, setSelected] = useState(null);

  const isAm = lang === 'am';

  const title = isAm ? 'ቅዱሳት ምስጢራት' : 'Holy Sacraments';
  const subtitle = isAm 
    ? 'በአጥቢያ ቤተክርስቲያናችን የሚሰጡ ቅዱሳት ምስጢራትና መንፈሳዊ አገልግሎቶች' 
    : 'Sacramental and spiritual services offered at our parish';

  const sacraments = [
    {
      id: 'baptism',
      titleEn: 'Baptism',
      titleAm: 'ምስጢረ ጥምቀት',
      descEn: 'Sacrament of regeneration, ranking vastly in the Christian life',
      descAm: 'ዳግም ከውኃና ከመንፈስ ቅዱስ የምንወለድበት፣ በክርስትና ሕይወታችን ውስጥ የመጀመሪያውና መሠረታዊው ቅዱስ ምስጢር።',
      linkEn: 'LEARN MORE & REQUEST',
      linkAm: 'በዝርዝር ይረዱ እና አገልግሎቱን ይጠይቁ',
      icon: BaptismIcon,
      component: <Baptism />
    },
    {
      id: 'catechism',
      titleEn: 'CATECHISM',
      titleAm: 'የቀድመ ክርስትና ትምህርት',
      descEn: 'Programs guiding individuals into the Orthodox faith and a Christ-centered life.',
      descAm: 'ግለሰቦችን ወደ ኦርቶዶክስ እምነት ለመምራትና ክርስቶስን ማዕከል ያደረገ ሕይወት ለማዘጋጀት የተነደፉ መርሃ ግብሮች።',
      linkEn: 'LEARN MORE & REQUEST',
      linkAm: 'በዝርዝር ይረዱ እና አገልግሎቱን ይጠይቁ',
      icon: CatechismIcon,
      component: <Catechism />
    },
    {
      id: 'penance',
      titleEn: 'Penance & Confession',
      titleAm: 'ምስጢረ ንስሐና ኑዛዜ',
      descEn: 'Spiritual healing and reconciliation with God under a Penance Father',
      descAm: 'በንስሐ አባት መሪነት የሚገኝ መንፈሳዊ ፈውስና ከእግዚአብሔር ጋር የመታረቂያ መንገድ።',
      linkEn: 'LEARN MORE & REQUEST',
      linkAm: 'በዝርዝር ይውረዱ እና አገልግሎቱን ይጠይቁ',
      icon: PenanceIcon,
      component: <Penance settings={settings} />
    },
    {
      id: 'memorial',
      titleEn: 'Memorial Services',
      titleAm: 'ጸሎተ ፍትሐትና መታሰቢያ',
      descEn: 'Funeral prayers and support for families commemorating departed loved ones.',
      descAm: 'ያረፉ ወገኖቻቸውን በጸሎት ለሚያስቡ ቤተሰቦች የሚደረግ የፍትሐት ጸሎትና መንፈሳዊ ድጋፍ።',
      linkEn: 'LEARN MORE & REQUEST',
      linkAm: 'በዝርዝር ይውረዱ እና አገልግሎቱን ይጠይቁ',
      icon: MemorialIcon,
      component: <Memorial services={services} />
    }
  ];

  if (selected) {
    const activeSacrament = sacraments.find(s => s.id === selected);
    return (
      <div className="sacrament-active-view">
        <Reveal direction="up" delay={50} as="div" className="sacrament-back-bar">
          <button onClick={() => setSelected(null)} className="sacrament-back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{isAm ? 'ወደ ቅዱሳት ምስጢራት ይመለሱ' : 'Back to Sacraments'}</span>
          </button>
        </Reveal>
        <div className="sacrament-component-wrapper">
          {activeSacrament.component}
        </div>
      </div>
    );
  }

  return (
    <section id="sacraments-hub" className="services-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <span className="services-section-tag" style={{
          display: 'block',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          color: 'var(--gold-light)',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '0.5rem',
          textTransform: 'uppercase'
        }}>
          {isAm ? 'የብሔረ ጽጌ መካነ ሰላም ቅድስት ማርያም ቤተክርስቲያን' : 'BIHERE TSIGE MEKANE SELAM ST. MARY CHURCH'}
        </span>
        <h2 className="services-title">{title}</h2>
        <p className="services-subtitle-text" style={{ 
          color: 'var(--text-muted)', 
          textAlign: 'center', 
          maxWidth: '650px', 
          margin: '10px auto 0 auto',
          fontSize: '1.1rem',
          fontFamily: 'var(--font-body)',
          lineHeight: '1.6'
        }}>
          {subtitle}
        </p>
      </Reveal>

      <div className="sacraments-grid-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem 2rem 1.5rem' }}>
        <div className="sacraments-grid">
          {sacraments.map((s, index) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.id} delay={index * 100} direction="up" as="div" className="sacrament-card-item">
                <button onClick={() => setSelected(s.id)} className="sacrament-card">
                  <div className="sacrament-card-icon-container">
                    <Icon />
                  </div>
                  <h3 className="sacrament-card-title">
                    {isAm ? s.titleAm : s.titleEn}
                  </h3>
                  <p className="sacrament-card-desc">
                    {isAm ? s.descAm : s.descEn}
                  </p>
                  <span className="sacrament-card-link">
                    {isAm ? s.linkAm : s.linkEn} &rarr;
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
