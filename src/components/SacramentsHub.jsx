import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import Baptism from './Baptism';
import Catechism from './Catechism';
import Penance from './Penance';
import Memorial from './Memorial';

// Beautiful SVGs for sacraments
// Beautiful SVGs for sacraments (designed specifically for Ethiopian Orthodox context)
const BaptismIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="sacrament-card-icon">
    <path d="M12 40 C12 50, 52 50, 52 40 L48 24 H16 L12 40 Z" fill="rgba(197, 160, 68, 0.05)" stroke="var(--gold)" strokeWidth="2.5" />
    <path d="M24 48 L20 58 H44 L40 48" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 28 C22 26, 26 30, 30 28 C34 26, 38 30, 42 28 C46 26, 48 28, 48 28" stroke="var(--gold)" strokeWidth="1.5" />
    <path d="M32 8 V24 M24 14 H40" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="32" cy="14" r="3" stroke="var(--gold)" strokeWidth="1.5" />
  </svg>
);

const CatechismIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="sacrament-card-icon">
    <path d="M32 50 C26 46, 12 46, 8 48 V14 C12 12, 26 12, 32 16 C38 12, 52 12, 56 14 V48 C52 46, 38 46, 32 50 Z" fill="rgba(197, 160, 68, 0.05)" stroke="var(--gold)" strokeWidth="2.5" />
    <path d="M32 16 V50" stroke="var(--gold)" strokeWidth="2" />
    <path d="M44 22 V34 M38 28 H50" stroke="var(--gold)" strokeWidth="1.5" />
    <circle cx="44" cy="28" r="2" stroke="var(--gold)" strokeWidth="1" />
    <path d="M20 22 H12 M20 28 H12 M20 34 H12" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const PenanceIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="sacrament-card-icon">
    <path d="M32 40 V58" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
    <rect x="27" y="52" width="10" height="6" rx="1" fill="none" stroke="var(--gold)" strokeWidth="2" />
    <path d="M32 12 V40 M18 26 H46" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="26" r="6" stroke="var(--gold)" strokeWidth="2" fill="var(--navy)" />
    <path d="M32 12 L35 15 H29 Z M18 26 L21 23 V29 Z M46 26 L43 23 V29 Z" fill="var(--gold)" />
    <path d="M12 12 L20 18 M52 12 L44 18 M12 40 L20 34 M52 40 L44 34" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const MemorialIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="sacrament-card-icon">
    <path d="M32 26 C22 26, 20 42, 32 46 C44 42, 42 26, 32 26 Z" fill="rgba(197, 160, 68, 0.05)" stroke="var(--gold)" strokeWidth="2.5" />
    <path d="M24 26 C24 16, 40 16, 40 26" stroke="var(--gold)" strokeWidth="2" />
    <path d="M32 12 V16" stroke="var(--gold)" strokeWidth="2" />
    <path d="M22 26 L30 6 M42 26 L34 6 M32 26 L32 6" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    <circle cx="32" cy="6" r="3" stroke="var(--gold)" strokeWidth="1.5" />
    <path d="M26 12 C24 8, 28 6, 26 4 M38 12 C36 8, 40 6, 38 4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export default function SacramentsHub({ settings, services, fathers = [] }) {
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
      component: <Penance settings={settings} fathers={fathers} />
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
