import React from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Evangelism({ data }) {
  const { lang } = useLanguage();
  
  if (!data) return null;
  const { programs = [], sermons = [] } = data;

  const sectionTitle = lang === 'am' ? 'የስብከተ ወንጌል አገልግሎት' : 'Evangelism & Sermons';
  const programsTitle = lang === 'am' ? 'መደበኛ መርሃ ግብሮች' : 'Regular Programs';
  const sermonsTitle = lang === 'am' ? 'ስብከቶች' : 'Recent Sermons';

  return (
    <section id="evangelism" className="services-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title">{sectionTitle}</h2>
      </Reveal>

      <Reveal className="evangelism-welcome" delay={100} direction="up" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2rem auto', padding: '0 1rem' }}>
        <blockquote className="scripture-blockquote">
          {lang === 'am' 
            ? '“ቀንበሬን በላያችሁ ተሸከሙ ከእኔም ተማሩ፥ እኔ የዋህ በልቤም ትሑት ነኝና፥ ለነፍሳችሁም ዕረፍት ታገኛላችሁ፤” — ማቴዎስ 11፥29'
            : '“Take My yoke upon you and learn from Me, for I am gentle and lowly in heart, and you will find rest for your souls.” — Matthew 11:29'}
        </blockquote>
        
        <h3 style={{ marginBottom: '1rem', color: 'var(--navy)', fontFamily: 'var(--font-heading)', fontSize: '1.6rem' }}>
          {lang === 'am' ? 'መጥተው ይማሩ' : 'Come and Learn'}
        </h3>
        
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-dark)', opacity: 0.85, marginBottom: '1rem' }}>
          {lang === 'am'
            ? 'ኑ በእያንዳንዱ ሰርክ የሕይወት መንገድ የነፍስ እረፍትና የእግዚአብሔር ፍቅር የተገለጠበትን ቅዱስ ወንጌልን አብረን እንማር።'
            : 'There is a Gospel teaching every evening, accompanied by prayers and spiritual hymns. On weekends and church holidays, the teaching continues after the Divine Liturgy.'}
        </p>
        
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-dark)', opacity: 0.85 }}>
          {lang === 'am'
            ? 'ጸጋው ከበዛላቸው ዐይን የደብራችን መምህራንና ከተጋባዥ ዘማርያን ጋር ዝግጅታችንን ጨርሰን የዕርስዎን መምጣት በጉጉት እንጠብቃለን ።'
            : 'Whether you are beginning your journey of faith or seeking to deepen your understanding of God\'s Word, you are warmly invited to join us. Come, learn the Gospel, worship with the Church, and grow in the grace and knowledge of our Lord.'}
        </p>
      </Reveal>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem 2rem 2rem' }}>
        {programs.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--navy)', fontFamily: 'var(--font-heading)', fontSize: '1.6rem' }}>{programsTitle}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {programs.map((prog, i) => (
                <Reveal key={prog.id} delay={i * 100} direction="up" as="div" className="nested-content-card">
                  <h4 className="nested-card-title">{lang === 'am' ? prog.title_am || prog.title_en : prog.title_en}</h4>
                  <p className="nested-card-desc">{lang === 'am' ? prog.description_am || prog.description_en : prog.description_en}</p>
                  {prog.schedule && <div style={{ marginTop: '1rem', fontWeight: 'bold', color: 'var(--gold-dark)', fontSize: '0.95rem' }}>🕒 {prog.schedule}</div>}
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {sermons.length > 0 && (
          <div>
            <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--navy)', fontFamily: 'var(--font-heading)', fontSize: '1.6rem' }}>{sermonsTitle}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {sermons.map((sermon, i) => (
                <Reveal key={sermon.id} delay={i * 100} direction="up" as="div" className="nested-content-card">
                  <h4 className="nested-card-title">{lang === 'am' ? sermon.title_am || sermon.title_en : sermon.title_en}</h4>
                  <a href={sermon.youtube_url} target="_blank" rel="noopener noreferrer" style={{
                    display: 'inline-block', marginTop: '1rem', color: '#c00', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.95rem'
                  }}>
                    ▶ Watch on YouTube
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
