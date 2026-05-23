import React from 'react';
import { DiamondOrnament } from './Icons';

const CONTENT = {
  en: {
    sectionTag: 'Message & Blessings',
    sectionTitle: 'From Our Father',
    fatherTitle: 'Melake Genet Memhir Habtewold Tegegn',
    fatherRole: 'Head Priest',
    fatherMessage:
      '"May the grace of the Holy Trinity — Father, Son, and Holy Spirit — be upon all of you. Our church continues to grow in faith and love, serving as a beacon of hope for our community. Let us walk together in the light of our Lord."',
    newsTitle: 'Latest News',
    news: [
      {
        id: 'news-1',
        date: 'May 2026',
        title: 'Community Outreach Program',
        excerpt: 'Our parish launches a new community outreach program to support families in need through food donations and spiritual guidance.',
      },
      {
        id: 'news-2',
        date: 'April 2026',
        title: 'Youth Fellowship Revival',
        excerpt: 'A new youth fellowship program has been established, bringing young members together for Bible study, cultural activities, and spiritual growth.',
      },
      {
        id: 'news-3',
        date: 'March 2026',
        title: 'Church Renovation Complete',
        excerpt: 'The renovation of our prayer hall has been completed, featuring traditional Ethiopian Orthodox iconography and improved seating for our growing congregation.',
      },
    ],
  },
  am: {
    sectionTag: 'መልእክት እና ቡራኬ',
    sectionTitle: 'ከአባታችን',
    fatherTitle: 'መልዓከ ገነት መምህር ሃብተወልድ ተገኝ',
    fatherRole: 'ዋና ካህን',
    fatherMessage:
      '"የቅድስት ሥላሴ — አብ፣ ወልድ እና መንፈስ ቅዱስ — ጸጋ በሁላችሁ ላይ ይሁን። ቤተ ክርስቲያናችን በእምነት እና በፍቅር ማደጉን ቀጥሏል፣ ለማኅበረሰባችን የተስፋ ምሰሶ ሆኖ በማገልገል። በጌታችን ብርሃን አብረን እንጓዝ።"',
    newsTitle: 'ዜና',
    news: [
      {
        id: 'news-1',
        date: 'ግንቦት 2018',
        title: 'የማኅበረሰብ ተደራሽነት ፕሮግራም',
        excerpt: 'ደብራችን ችግረኞችን ለመርዳት የምግብ ልገሳ እና መንፈሳዊ ምክር አገልግሎት አዲስ ፕሮግራም ጀምሯል።',
      },
      {
        id: 'news-2',
        date: 'ሚያዝያ 2018',
        title: 'የወጣቶች ኅብረት ታድሷል',
        excerpt: 'አዲስ የወጣቶች ኅብረት ፕሮግራም ተቋቁሞ ወጣቶችን ለመጽሐፍ ቅዱስ ጥናት፣ ባህላዊ ተግባራት እና መንፈሳዊ ዕድገት ያሰባስባል።',
      },
      {
        id: 'news-3',
        date: 'መጋቢት 2018',
        title: 'የቤተ ክርስቲያን ዕድሳት ተጠናቀቀ',
        excerpt: 'የጸሎት አዳራሻችን ዕድሳት ተጠናቅቋል፣ ባህላዊ የኢትዮጵያ ኦርቶዶክስ ሥዕላትና ለዕድገታችን የተሻለ መቀመጫ ይዟል።',
      },
    ],
  },
};

/* Quote mark SVG */
const QuoteMark = () => (
  <svg viewBox="0 0 40 32" fill="none" className="quote-mark-svg">
    <path
      d="M0 20.8C0 12 5.6 5.6 16 0l2.4 4.8C12 8.8 9.6 13.6 9.6 16h6.4v16H0V20.8zM24 20.8C24 12 29.6 5.6 40 0l2.4 4.8C36 8.8 33.6 13.6 33.6 16H40v16H24V20.8z"
      fill="currentColor"
    />
  </svg>
);

export default function News({ lang }) {
  const c = CONTENT[lang] || CONTENT.en;

  return (
    <section id="news" className="news-section">
      {/* Section header */}
      <div className="news-header">
        <div className="about-tag-row">
          <span className="about-tag-line news-tag-line" />
          <span className="about-tag news-tag">{c.sectionTag}</span>
          <span className="about-tag-line news-tag-line" />
        </div>
        <div className="about-ornament"><DiamondOrnament /></div>
        <h2 className="news-section-title" id="news-section-title">{c.sectionTitle}</h2>
      </div>

      {/* Father's message */}
      <div className="father-card" id="father-message">
        <div className="father-quote-col">
          <QuoteMark />
          <blockquote className="father-quote">{c.fatherMessage}</blockquote>
          <div className="father-info">
            <div className="father-avatar">
              <img src="/assets/profile-pic-preist.png" alt={c.fatherTitle} className="father-avatar-img" />
            </div>
            <div>
              <div className="father-name">{c.fatherTitle}</div>
              <div className="father-role">{c.fatherRole}</div>
            </div>
          </div>
        </div>
      </div>

      {/* News cards */}
      <div className="news-grid-header">
        <DiamondOrnament />
        <h3 className="news-grid-title">{c.newsTitle}</h3>
      </div>

      <div className="news-grid" id="news-grid">
        {c.news.map((item) => (
          <article className="news-card" key={item.id} id={item.id}>
            <span className="news-card-date">{item.date}</span>
            <h4 className="news-card-title">{item.title}</h4>
            <p className="news-card-excerpt">{item.excerpt}</p>
            <div className="news-card-line" />
          </article>
        ))}
      </div>
    </section>
  );
}
