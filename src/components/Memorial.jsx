import React, { useState } from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Memorial({ services = [] }) {
  const { lang } = useLanguage();
  const isAm = lang === 'am';

  const [form, setForm] = useState({
    sponsorName: '',
    departedName: '',
    phone: '',
    email: '',
    preferredDate: '',
    message: ''
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Memorial Service Request: ${form.departedName}`);
    const body = encodeURIComponent(
      `Sponsor Name: ${form.sponsorName}\n` +
      `Departed Soul Name: ${form.departedName}\n` +
      `Phone: ${form.phone}\n` +
      `Email: ${form.email}\n` +
      `Preferred Date: ${form.preferredDate}\n\n` +
      `Message/Names to be read:\n${form.message}`
    );
    window.location.href = `mailto:info@beheretsigestmary.org?subject=${subject}&body=${body}`;
  };

  const sectionTitle = isAm ? 'የፍትሐት እና የጸሎት አገልግሎት' : 'Memorial Services';
  const introText = isAm 
    ? 'ፍትሐት (የመታሰቢያ ጸሎት) ከዚህ ዓለም በሞት ለተለዩ ወገኖች በቤተ ክርስቲያን ሥርዓት መሠረት የሚደረግ የፍትሐትና የምሕረት ጸሎት ነው። እግዚአብሔር ለሟቹ ነፍስ ዕረፍተ መንግሥተ ሰማያትን እንዲሰጥና ለቤተሰቡ መጽናናትን እንዲሰጥ የሚጸለይ የፍቅር አገልግሎት ነው። የፍትሐት ጸሎት ለማስደረግ ከፈለጉ እባክዎ ከታች ያለውን ቅጽ ይሙሉ::'
    : 'Fithat (Memorial Service) is a sacred prayer offered by the Church for the repose of the souls of the departed, asking our Lord to forgive their transgressions and welcome them into His Heavenly Kingdom. It is also a source of comfort and grace for the family. To request a memorial service, please complete the form below.';

  const hasPackages = services && services.length > 0;

  return (
    <section id="memorial" className="services-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title">{sectionTitle}</h2>
      </Reveal>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem 2rem 2rem' }}>
        
        {/* Intro */}
        <Reveal direction="up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <blockquote style={{ 
            fontSize: '1.25rem', 
            fontStyle: 'italic', 
            color: 'var(--gold-dark)',
            borderLeft: '4px solid var(--gold)',
            paddingLeft: '1rem',
            margin: '0 auto 1.5rem auto',
            maxWidth: '800px',
            textAlign: 'left'
          }}>
            {isAm 
              ? '«ጌታ ሆይ፥ ለእነዚህ ዕረፍትን ስጣቸው የዘላለም ብርሃንም ያብራላቸው።»'
              : '"O Lord, grant rest to their souls, and let perpetual light shine upon them."'}
          </blockquote>
          
          <p style={{ lineHeight: '1.8', color: 'var(--text-dark)', maxWidth: '800px', margin: '0 auto' }}>
            {introText}
          </p>
        </Reveal>

        {/* Custom Pricing Packages if any exist */}
        {hasPackages && (
          <Reveal as="div" direction="up" style={{ marginBottom: '4rem' }}>
            <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--navy)', textAlign: 'center', marginBottom: '1.5rem' }}>
              {isAm ? 'አገልግሎቶችና ፓኬጆች' : 'Memorial Packages'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              {services.map((service, i) => (
                <div key={service.id} style={{
                  background: 'white', padding: '1.5rem', borderRadius: '8px', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.03)', textAlign: 'center',
                  border: '1px solid rgba(197, 160, 68, 0.15)'
                }}>
                  <h3 style={{ color: 'var(--gold-dark)', marginBottom: '0.5rem' }}>
                    {isAm ? service.name_am || service.name_en : service.name_en}
                  </h3>
                  <p style={{ margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    {lang === 'am' ? service.description_am || service.description_en : service.description_en}
                  </p>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--navy)' }}>
                    {service.price} {service.currency}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Request Form */}
        <Reveal as="div" direction="up" style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(15,27,61,0.04)', border: '1px solid rgba(197,160,68,0.15)', maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--navy)', fontFamily: 'var(--font-heading)' }}>
            {isAm ? 'የፍትሐት ጸሎት መጠየቂያ ቅጽ' : 'Memorial Service Request Form'}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <label className="contact-field" style={{ display: 'block' }}>
              <span className="contact-field-label">{isAm ? 'የአስቀዳሹ/ስፖንሰር ሙሉ ስም' : 'Sponsor Full Name'} *</span>
              <input type="text" required value={form.sponsorName} onChange={handleChange('sponsorName')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </label>

            <label className="contact-field" style={{ display: 'block' }}>
              <span className="contact-field-label">{isAm ? 'የሟች ስም (የክርስትና/ዓለማዊ ስም)' : 'Departed Soul Name'} *</span>
              <input type="text" required value={form.departedName} onChange={handleChange('departedName')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </label>

            <label className="contact-field" style={{ display: 'block' }}>
              <span className="contact-field-label">{isAm ? 'ስልክ ቁጥር' : 'Phone'} *</span>
              <input type="tel" required value={form.phone} onChange={handleChange('phone')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </label>

            <label className="contact-field" style={{ display: 'block' }}>
              <span className="contact-field-label">{isAm ? 'የሚመርጡት ቀን' : 'Preferred Date'} *</span>
              <input type="date" required value={form.preferredDate} onChange={handleChange('preferredDate')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </label>

            <label className="contact-field" style={{ display: 'block', gridColumn: '1 / -1' }}>
              <span className="contact-field-label">{isAm ? 'ኢሜይል' : 'Email (Optional)'}</span>
              <input type="email" value={form.email} onChange={handleChange('email')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </label>

            <label className="contact-field" style={{ display: 'block', gridColumn: '1 / -1' }}>
              <span className="contact-field-label">{isAm ? 'ተጨማሪ መረጃ ወይም የሚነበቡ ስሞች' : 'Names to be Read / Message'}</span>
              <textarea rows={4} value={form.message} onChange={handleChange('message')} className="contact-input" style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }} />
            </label>

            <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '1rem' }}>
              <button type="submit" className="btn-contact-send" style={{ 
                backgroundColor: 'var(--navy)', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem'
              }}>
                {isAm ? 'ቅጹን ላክ' : 'Submit Memorial Request'}
              </button>
            </div>
          </form>
        </Reveal>

      </div>
    </section>
  );
}
