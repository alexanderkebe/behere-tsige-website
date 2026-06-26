import React, { useState } from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';

const PENANCE_STEPS = [
  {
    title: 'Find a Penance Father',
    desc: 'In the Ethiopian Orthodox Tewahedo Church, the "Penance Father" is often referred to as the priest or father-confessor. This priest plays a crucial role in the sacrament of Penance, where he listens to the penitent\'s confession, offers spiritual guidance, and grants absolution in the name of the Holy Trinity. If you don\'t have a penance father, the church highly recommends to explore and get your own penance father from your parish.',
  },
  {
    title: 'Confess Sins',
    desc: 'The penitent confesses their sins to the priest, acknowledging their wrongdoings and expressing genuine remorse.',
    links: [
      { label: '📱 Use this app as a guide (for first-timers)', url: 'https://www.confessionplanner.copticcollection.com/' },
      { label: '📄 Download the Confession Guide PDF', url: '/assets/confession pdf.pdf' },
      { label: '📖 Buy the Confession Book on Amazon', url: 'https://www.amazon.com/Holy-Mystery-Confession-confession-teenagers/dp/B0F5QBN5W3' },
    ]
  },
  {
    title: 'Get a Prayer of Repentance',
    desc: 'The priest leads the penitent in a prayer asking for God\'s forgiveness. This prayer often includes asking for the Holy Spirit to guide and strengthen the penitent in their journey of repentance.'
  },
  {
    title: 'Get Absolution',
    desc: 'The priest pronounces absolution, declaring that the penitent\'s sins are forgiven in the name of the Holy Trinity.'
  },
  {
    title: 'Receive a Penitential Acts',
    desc: 'The penitent may be assigned certain acts of penance, such as fasting, prayer, or almsgiving, to demonstrate their commitment to turning away from sin and living a more righteous life.'
  },
  {
    title: 'Get Blessed',
    desc: 'The priest concludes the sacrament with a blessing, encouraging the penitent to continue their spiritual journey with faith and devotion.'
  }
];

export default function Penance({ settings = {} }) {
  const { lang } = useLanguage();
  const penanceInfo = settings.penance_resources || {};
  
  const isAm = lang === 'am';
  const sectionTitle = isAm ? 'ምሥጢረ ንስሐ (Penance Services)' : 'Penance Services';

  const [form, setForm] = useState({ name: '', phone: '', email: '', preferredFather: '', message: '' });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Father Confessor Request: ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nPreferred Father: ${form.preferredFather || 'No preference'}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:info@beheretsigestmary.org?subject=${subject}&body=${body}`;
  };

  return (
    <section id="penance" className="services-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title">{sectionTitle}</h2>
      </Reveal>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Intro */}
        <Reveal direction="up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'var(--text-dark)', margin: 0 }}>
            {isAm ? 'ወደ ንስሐ አገልግሎት ገጻችን እንኳን በደህና መጡ። ይህም አገልግሎት ምዕመናን ኃጢአታቸውን ለካህን ተናዘው ሥርየት የሚያገኙበት ነው። ግለሰቦች ይቅርታን እንዲያገኙ እና ወደ ጸጋ ሁኔታ እንዲመለሱ የሚረዳ መንገድ ነው፣ በተለይም ቅዱስ ቁርባንን ከመቀበላቸው በፊት።' : 'Welcome to our penance services Page. The service allows believers to confess their sins to a priest and receive absolution. It\'s a way for individuals to seek forgiveness and return to a state of grace, especially before participating in the Holy Communion.'}
          </p>
        </Reveal>

        {/* Process Steps */}
        <div style={{ position: 'relative' }}>
          <h3 style={{ textAlign: 'center', color: 'var(--navy)', fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '2.5rem' }}>
            {isAm ? 'የንስሐ ሂደት (Penance Process)' : 'Penance Process'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {PENANCE_STEPS.map((step, index) => (
              <Reveal key={index} delay={index * 100} direction={index % 2 === 0 ? 'left' : 'right'} as="div" className="nested-content-card" style={{
                display: 'flex',
                gap: '1.5rem',
                borderLeft: '4px solid var(--gold)',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  minWidth: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--navy)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {index + 1}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--navy)', fontFamily: 'var(--font-heading)' }}>{step.title}</h4>
                  <p style={{ margin: '0', lineHeight: '1.7', color: 'var(--text-dark)', opacity: 0.85 }}>{step.desc}</p>
                  
                  {step.links && (
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {step.links.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-block',
                          color: 'var(--gold-dark)',
                          textDecoration: 'none',
                          fontWeight: '600',
                          padding: '0.4rem 0.8rem',
                          backgroundColor: 'rgba(197, 160, 68, 0.08)',
                          borderRadius: '4px',
                          border: '1px solid rgba(197, 160, 68, 0.2)',
                          fontSize: '0.9rem',
                          width: 'fit-content'
                        }}>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <Reveal as="div" direction="up" className="form-container-card" style={{ maxWidth: '600px', marginTop: '3.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--navy)', margin: '0 0 1rem 0', fontSize: '1.6rem', fontFamily: 'var(--font-heading)' }}>
              {isAm ? 'ከነፍስ አባት ጋር ይገናኙ' : 'Get in Contact with a Father Confessor'}
            </h3>
            <blockquote className="scripture-blockquote" style={{ margin: '0 0 1.5rem 0' }}>
              {isAm 
                ? '«እርስ በርሳችሁ በኃጢአታችሁ ተናዘዙ፥ ትፈወሱም ዘንድ እያንዳንዱ ስለ ሌላው ይጸልይ።» — ያዕቆብ ፭፥፲፮' 
                : '“Therefore confess your sins to each other and pray for each other so that you may be healed.” — James 5:16'}
            </blockquote>
            <p style={{ color: 'var(--text-dark)', lineHeight: '1.6', fontSize: '0.95rem', opacity: 0.85 }}>
              {isAm 
                ? 'በእምነት ያነጋግሩን። በንስሐ ምሥጢር እንዲመሩዎት የነፍስ አባት ያነጋግርዎታል።' 
                : 'Reach out in confidence. A father confessor will contact you to guide you in the sacrament of penance.'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="services-form" style={{ gridTemplateColumns: '1fr' }}>
            <label className="form-label-field">
              <span>{isAm ? 'ስም' : 'Your Name'} *</span>
              <input type="text" required value={form.name} onChange={handleChange('name')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'ስልክ' : 'Phone'} *</span>
              <input type="tel" required value={form.phone} onChange={handleChange('phone')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'ኢሜይል' : 'Email'} *</span>
              <input type="email" required value={form.email} onChange={handleChange('email')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'የሚመርጡት አባት (አማራጭ)' : 'Preferred Father (optional)'}</span>
              <select value={form.preferredFather} onChange={handleChange('preferredFather')} className="form-select-field">
                <option value="">{isAm ? 'ምንም ምርጫ የለኝም' : 'No preference'}</option>
              </select>
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'መልእክት' : 'Message'} *</span>
              <textarea required rows={4} value={form.message} onChange={handleChange('message')} className="form-textarea-field" />
            </label>

            <button type="submit" className="form-submit-btn">
              {isAm ? 'ጥያቄውን ላክ' : 'Send Request'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
