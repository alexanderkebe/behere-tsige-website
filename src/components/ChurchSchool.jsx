import React from 'react';
import { DiamondOrnament } from './Icons';

/* ── SVG icons for the 4 Abnet levels ── */
const ReadingIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" style={{ width: 28, height: 28 }}>
    <path d="M8 6h10a2 2 0 012 2v24a2 2 0 00-2-2H8V6z" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M32 6H22a2 2 0 00-2 2v24a2 2 0 012-2h10V6z" stroke="#C5A044" strokeWidth="1.5" />
    <line x1="12" y1="14" x2="17" y2="14" stroke="#C5A044" strokeWidth="1.2" />
    <line x1="12" y1="18" x2="16" y2="18" stroke="#C5A044" strokeWidth="1.2" />
    <line x1="23" y1="14" x2="28" y2="14" stroke="#C5A044" strokeWidth="1.2" />
    <line x1="23" y1="18" x2="27" y2="18" stroke="#C5A044" strokeWidth="1.2" />
  </svg>
);

const LiturgyIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" style={{ width: 28, height: 28 }}>
    <path d="M20 4v32" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M10 14h20" stroke="#C5A044" strokeWidth="1.5" />
    <circle cx="20" cy="14" r="3" stroke="#C5A044" strokeWidth="1.2" />
    <path d="M14 28c0-4 6-6 6-6s6 2 6 6" stroke="#C5A044" strokeWidth="1.2" fill="none" />
    <circle cx="20" cy="4" r="2" fill="#C5A044" />
  </svg>
);

const HymnIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" style={{ width: 28, height: 28 }}>
    <path d="M14 8v20a4 4 0 11-4-4h4" stroke="#C5A044" strokeWidth="1.5" fill="none" />
    <path d="M14 8l14-4v20a4 4 0 11-4-4h4" stroke="#C5A044" strokeWidth="1.5" fill="none" />
    <circle cx="10" cy="28" r="4" stroke="#C5A044" strokeWidth="1.2" fill="none" />
    <circle cx="24" cy="24" r="4" stroke="#C5A044" strokeWidth="1.2" fill="none" />
  </svg>
);

const PoetryIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" style={{ width: 28, height: 28 }}>
    <path d="M8 8h18a2 2 0 012 2v20a2 2 0 01-2 2H8" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M8 8v24" stroke="#C5A044" strokeWidth="1.5" />
    <line x1="13" y1="14" x2="23" y2="14" stroke="#C5A044" strokeWidth="1.2" />
    <line x1="13" y1="18" x2="21" y2="18" stroke="#C5A044" strokeWidth="1.2" />
    <line x1="13" y1="22" x2="22" y2="22" stroke="#C5A044" strokeWidth="1.2" />
    <line x1="13" y1="26" x2="18" y2="26" stroke="#C5A044" strokeWidth="1.2" />
    <path d="M30 12l4 4-4 4" stroke="#C5A044" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/* ── SVG icons for the 4 Sunday School levels ── */
const BibleIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" style={{ width: 28, height: 28 }}>
    <path d="M12 6h16a2 2 0 012 2v24a2 2 0 01-2 2H12a2 2 0 01-2-2V8a2 2 0 012-2z" stroke="#C5A044" strokeWidth="1.5" />
    <line x1="14" y1="12" x2="26" y2="12" stroke="#C5A044" strokeWidth="1.2" />
    <line x1="14" y1="18" x2="26" y2="18" stroke="#C5A044" strokeWidth="1.2" />
    <line x1="14" y1="24" x2="22" y2="24" stroke="#C5A044" strokeWidth="1.2" />
  </svg>
);

const SpiritualHymnsIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" style={{ width: 28, height: 28 }}>
    <path d="M12 28a4 4 0 004-4V8h12v4H18v12a4 4 0 00-4 4 4 4 0 00-2 0z" stroke="#C5A044" strokeWidth="1.5" fill="none" />
  </svg>
);

const LiturgicalEdIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" style={{ width: 28, height: 28 }}>
    <path d="M20 6l-6 10h12l-6-10z" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M10 24h20M20 16v18M14 30h12" stroke="#C5A044" strokeWidth="1.5" />
  </svg>
);

const EthicsIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" style={{ width: 28, height: 28 }}>
    <path d="M12 16c0-4 4-6 8-2 4-4 8-2 8 2 0 6-8 12-8 12s-8-6-8-12z" stroke="#C5A044" strokeWidth="1.5" />
  </svg>
);

const ABNET_LEVELS = [
  { key: 'nibab', icon: ReadingIcon },
  { key: 'kidase', icon: LiturgyIcon },
  { key: 'zema', icon: HymnIcon },
  { key: 'kine', icon: PoetryIcon },
];

const SUNDAY_LEVELS = [
  { key: 'bible', icon: BibleIcon },
  { key: 'hymns', icon: SpiritualHymnsIcon },
  { key: 'liturgical', icon: LiturgicalEdIcon },
  { key: 'ethics', icon: EthicsIcon },
];

const CONTENT = {
  en: {
    sectionTag: 'Serve at Your Parish',
    sectionTitle: 'Church Education',
    abnet: {
      title: 'Traditional Church School',
      subtitle: 'Abnet School',
      intro: 'Preserving our sacred traditions by providing comprehensive religious education for all ages.',
      join: 'Join Now',
    },
    sundaySchool: {
      title: 'Sunday School',
      subtitle: 'Youth & Family',
      intro: 'Nurturing the next generation through biblical studies, cultural values, and spiritual fellowship tailored for children, youth, and families.',
      join: 'Join Now',
    },
    abnetLevels: {
      nibab: { title: 'Nibab (Reading)', desc: 'Learning Ge\'ez alphabet and basic prayers.' },
      kidase: { title: 'Kidase (Liturgy)', desc: 'Studying liturgical rites and sacred meanings.' },
      zema: { title: 'Zema (Hymns)', desc: 'Learning ancient church hymns and sacred melodies.' },
      kine: { title: 'Kine (Poetry)', desc: 'Advanced study of religious poetry and spiritual expression.' },
    },
    sundaySchoolLevels: {
      bible: { title: 'Bible Study', desc: 'Systematic study of scriptures and teachings.' },
      hymns: { title: 'Spiritual Hymns', desc: 'Learning traditional spiritual songs and chants.' },
      liturgical: { title: 'Liturgical Education', desc: 'Understanding church sacraments, rituals, and prayers.' },
      ethics: { title: 'Christian Life & Ethics', desc: 'Practical guidance on Christian values, family, and community service.' },
    },
  },
  am: {
    sectionTag: 'በደብርዎ ያገልግሉ',
    sectionTitle: 'ባህላዊ የቤተ ክርስቲያን ትምህርት ቤት',
    abnet: {
      title: 'የአቢነት ትምህርት',
      subtitle: 'ባህላዊ ትምህርት ቤት',
      intro: 'ለሁሉም ዕድሜ አጠቃላይ ሃይማኖታዊ ትምህርትን በማቅረብ ቅዱስ ወጎቻችንን እንጠብቃለን።',
      join: 'ይቀላቀሉ',
    },
    sundaySchool: {
      title: 'የሰንበት ትምህርት ቤት',
      subtitle: 'ወጣቶች እና ቤተሰብ',
      intro: 'ለልጆች፣ ወጣቶች እና ቤተሰቦች የተዘጋጀ የመጽሐፍ ቅዱስ ጥናት፣ ባህላዊ እሴቶች እና መንፈሳዊ ኅብረት።',
      join: 'ይቀላቀሉ',
    },
    abnetLevels: {
      nibab: { title: 'ንባብ', desc: 'የግእዝ ፊደል ማንበብ እና መሰረታዊ ጸሎቶችን መማር።' },
      kidase: { title: 'ቅዳሴ', desc: 'የቅዳሴ ሥርዓት እና ቅዱስ ትርጉሞቹን ማጥናት።' },
      zema: { title: 'ዜማ', desc: 'የቤተ ክርስቲያንን ጥንታዊ መዝሙሮች እና ቅዱስ ዜማዎችን መማር።' },
      kine: { title: 'ቅኔ', desc: 'የሃይማኖታዊ ግጥሞች እና የመንፈሳዊ ገለጻ የላቀ ጥናት።' },
    },
    sundaySchoolLevels: {
      bible: { title: 'መጽሐፍ ቅዱስ ጥናት', desc: 'የመጽሐፍ ቅዱስ ቃላትንና አስተምህሮዎችን በጥልቀት ማጥናት።' },
      hymns: { title: 'የመዝሙር ትምህርት', desc: 'የበዓላት እና የክብረ በዓላት መዝሙራትን መማር።' },
      liturgical: { title: 'የሥርዓተ አምልኮ ትምህርት', desc: 'የቤተ ክርስቲያንን ሥርዓትና የጸሎት መርሃ ግብር ማጥናት።' },
      ethics: { title: 'ክርስቲያናዊ ሥነ-ምግባር', desc: 'በክርስቲያናዊ ሥነ-ምግባርና ፍቅር ማኅበረሰቡን ማገልገል።' },
    },
  },
};

export default function ChurchSchool({ lang }) {
  const c = CONTENT[lang] || CONTENT.en;

  return (
    <section id="church-school" className="cs-section">
      {/* Section header */}
      <div className="cs-header">
        <div className="about-tag-row">
          <span className="about-tag-line" />
          <span className="about-tag">{c.sectionTag}</span>
          <span className="about-tag-line" />
        </div>
        <div className="about-ornament"><DiamondOrnament /></div>
        <h2 className="cs-section-title" id="cs-section-title">{c.sectionTitle}</h2>
      </div>

      {/* Two program cards */}
      <div className="cs-grid">
        {/* ─── Abnet School ─── */}
        <div className="cs-card" id="cs-abnet">
          <div className="cs-card-header">
            <LiturgyIcon />
            <div>
              <span className="cs-card-subtitle">{c.abnet.subtitle}</span>
              <h3 className="cs-card-title">{c.abnet.title}</h3>
            </div>
          </div>
          <p className="cs-card-intro">{c.abnet.intro}</p>

          {/* 4 Abnet levels */}
          <div className="cs-levels">
            {ABNET_LEVELS.map((level) => {
              const IconComp = level.icon;
              const lv = c.abnetLevels[level.key];
              return (
                <div className="cs-level" key={level.key} id={`cs-level-${level.key}`}>
                  <div className="cs-level-icon"><IconComp /></div>
                  <div className="cs-level-text">
                    <h4>{lv.title}</h4>
                    <p>{lv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cs-card-actions">
            <a href="#abnet-join" className="cs-btn cs-btn-filled cs-btn-full">{c.abnet.join}</a>
          </div>
        </div>

        {/* ─── Sunday School ─── */}
        <div className="cs-card" id="cs-sunday-school">
          <div className="cs-card-header">
            <BibleIcon />
            <div>
              <span className="cs-card-subtitle">{c.sundaySchool.subtitle}</span>
              <h3 className="cs-card-title">{c.sundaySchool.title}</h3>
            </div>
          </div>
          <p className="cs-card-intro">{c.sundaySchool.intro}</p>

          {/* 4 Sunday School levels */}
          <div className="cs-levels">
            {SUNDAY_LEVELS.map((level) => {
              const IconComp = level.icon;
              const lv = c.sundaySchoolLevels[level.key];
              return (
                <div className="cs-level" key={level.key} id={`cs-level-${level.key}`}>
                  <div className="cs-level-icon"><IconComp /></div>
                  <div className="cs-level-text">
                    <h4>{lv.title}</h4>
                    <p>{lv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cs-card-actions">
            <a href="#sunday-join" className="cs-btn cs-btn-filled cs-btn-full">{c.sundaySchool.join}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
