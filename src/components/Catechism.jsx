import React, { useState } from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Catechism() {
  const { lang } = useLanguage();
  const isAm = lang === 'am' || lang === 'gez';

  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Catechism Inquiry: ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:info@beheretsigestmary.org?subject=${subject}&body=${body}`;
  };

  const sectionTitle = isAm ? 'የትምህርተ ሃይማኖት መርሃ ግብር (Catechism)' : 'Catechism Class';

  return (
    <section id="catechism" className="services-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title">{sectionTitle}</h2>
      </Reveal>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem 2rem 2rem' }}>
        <Reveal direction="up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-dark)', maxWidth: '800px', margin: '0 auto' }}>
            {isAm ? (
              <>
                የቀድመ ክርስትና ትምህርት ፕሮግራማችን ግለሰቦች ወደ ኦርቶዶክስ እምነት በሚያደርጉት ጉዞ ላይ መመሪያ ለመስጠትና ክርስቶስን ማዕከል ያደረገ ሕይወት እንዲመሩ ለማዘጋጀት የተነደፈ ነው። ፕሮግራሙ ሁለት ዋና ዋና ክፍሎችን ያቀፈ ነው፦ <strong>የኦርቶዶክስ መሠረቶች (Orthodox Foundations)</strong> እና <strong>ኦርቶዶክሳዊ ሕይወት (Living Orthodox)</strong>።
              </>
            ) : (
              <>
                Our catechism program is designed to guide individuals on their journey into the Orthodox faith, equipping them to live a Christ-centered life. It consists of two key components: <strong>Orthodox Foundations</strong> &amp; <strong>Living Orthodox</strong>.
              </>
            )}
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          {/* Orthodox Foundations */}
          <Reveal as="div" direction="left" className="nested-content-card" style={{ borderTop: '4px solid var(--gold)' }}>
            <h3 className="nested-card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
              {isAm ? (
                <>የኦርቶዶክስ መሠረቶች<br/>(Orthodox Foundations)</>
              ) : (
                <>Orthodox<br/>Foundations</>
              )}
            </h3>
            <p className="nested-card-desc" style={{ marginBottom: '1.5rem' }}>
              {isAm ? (
                'የመሠረቶች ፕሮግራም ግለሰቦችን ለጥምቀት እና በቤተ ክርስቲያን ሕይወት ውስጥ ሙሉ ተሳትፎ እንዲኖራቸው ያዘጋጃል። በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን መሠረታዊ እምነቶች፣ ሥርዓቶች እና ትምህርቶች ላይ ጥልቅ ግንዛቤ እንዲጨብጡ ይጋበዛሉ።'
              ) : (
                'The Foundations Program prepares individuals for Baptism and full participation in the life of the Church. You’ll be invited to take a deep dive into the core beliefs, practices, and teachings of the Orthodox Church.'
              )}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: 'var(--text-dark)' }}>
              <li style={{ marginBottom: '0.8rem' }}>
                <strong>{isAm ? 'ለማን የተዘጋጀ ነው፦' : 'Who it’s for:'}</strong>{' '}
                {isAm ? 'ጥምቀትን ለሚፈልጉ እና በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነት ላይ ጠንካራ መሠረት ለመጣል ለሚሹ ማንኛውም ሰው።' : 'Anyone seeking Baptism and a solid foundation in the Ethiopian Orthodox Tewahedo faith.'}
              </li>
              <li style={{ marginBottom: '0.8rem' }}>
                <strong>{isAm ? 'የቆይታ ጊዜ፦' : 'Length:'}</strong>{' '}
                {isAm ? '14 ሳምንታት' : '14 weeks'}
              </li>
              <li style={{ marginBottom: '0.8rem' }}>
                <strong>{isAm ? 'የመጀመሪያ ቀናት፦' : 'Start dates:'}</strong>{' '}
                {isAm ? 'የመሠረቶች ፕሮግራም በበልግ (Spring) እና በመጸው (Fall) ወቅቶች ይሰጣል።' : 'The Foundations Program is offered in the Spring and Fall'}
              </li>
            </ul>
          </Reveal>

          {/* Living Orthodox */}
          <Reveal as="div" direction="right" className="nested-content-card" style={{ borderTop: '4px solid var(--gold)' }}>
            <h3 className="nested-card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
              {isAm ? (
                <>ኦርቶዶክሳዊ ሕይወት<br/>(Living Orthodox)</>
              ) : (
                <>Living<br/>Orthodox</>
              )}
            </h3>
            <p className="nested-card-desc" style={{ marginBottom: '1.5rem' }}>
              {isAm ? (
                'የኦርቶዶክሳዊ ሕይወት ፕሮግራም አስቀድመው ኦርቶዶክስ ለሆኑትም ሆነ የኦርቶዶክስ ክርስቲያናዊ ሕይወት ገጽታዎችን ለሚያጠኑ የተነደፈ፣ መጽሐፍ ቅዱስን መሠረት ያደረገ የአንድ ዓመት ጥናት ነው። ፕሮግራሙ በየሩብ ዓመቱ የተከፋፈሉትን የሚከተሉትን ጭብጦች ያጠቃልላል፦'
              ) : (
                'The Living Orthodox Program is a one-year Bible-based study designed both for those who are already Orthodox as well as those exploring aspects of Orthodox Christian life. The program covers the following themes, divided by quarter:'
              )}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: 'var(--text-dark)' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>{isAm ? 'ከጥር - መጋቢት፦' : 'January-March:'}</strong> {isAm ? 'ጸሎት' : 'Prayer'}
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>{isAm ? 'ከሚያዝያ - ግንቦት፦' : 'April-May:'}</strong> {isAm ? 'ጾም' : 'Fasting'}
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>{isAm ? 'ከሰኔ - መስከረም፦' : 'June-September:'}</strong> {isAm ? 'ምልጃ' : 'Intercession'}
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>{isAm ? 'ከጥቅምት - ታኅሣሥ፦' : 'October-December:'}</strong> {isAm ? 'ንስሐ እና ንስሐ አባት (ኑዛዜ)' : 'Repentance & Confession'}
              </li>
            </ul>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: 'var(--text-dark)' }}>
              <li style={{ marginBottom: '0.8rem' }}>
                <strong>{isAm ? 'ለማን የተዘጋጀ ነው፦' : 'Who it’s for:'}</strong>{' '}
                {isAm ? 'የኦርቶዶክሳዊ ሕይወት ፕሮግራም እምነታቸውን ለማሳደግ ለሚፈልጉ ወይም በመንፈሳዊ ጉዟቸው ላይ ድጋፍ ለሚሹ ሁሉ ክፍት ነው።' : 'The Living Orthodox Program is open to anyone seeking to grow their faith or looking for support in their spiritual journey.'}
              </li>
              <li style={{ marginBottom: '0.8rem' }}>
                <strong>{isAm ? 'የቆይታ ጊዜ፦' : 'Length:'}</strong>{' '}
                {isAm ? '1 ዓመት' : '1 year'}
              </li>
              <li style={{ marginBottom: '0.8rem' }}>
                <strong>{isAm ? 'የመጀመሪያ ቀናት፦' : 'Start dates:'}</strong>{' '}
                {isAm ? 'ይህ ፕሮግራም በእምነት ጉዞዎ ላይ የትም ቦታ ቢሆኑ፣ በዕለት ተዕለት ሕይወትዎ ውስጥ ያለዎትን የኦርቶዶክስ ግንዛቤ እና ተግባር ለማጥለቅ በማንኛውም ጊዜ ሊቀላቀሉት የሚችሉት ቀጣይነት ያለው ጥናት ነው።' : 'This program is an ongoing study that can be joined at any point to deepen your understanding and practice of Orthodoxy in daily life, regardless of where you are in your faith journey.'}
              </li>
            </ul>
          </Reveal>
        </div>

        {/* Contact Form */}
        <Reveal as="div" direction="up" className="form-container-card" style={{ maxWidth: '600px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--navy)', margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>
              {isAm ? 'ያግኙን' : 'Contact Us'}
            </h3>
            <h4 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.1rem', fontWeight: '500' }}>
              {isAm ? 'ጥያቄዎች አሉዎት? ያነጋግሩን!' : 'Have Questions? Get in touch!'}
            </h4>
          </div>
          
          <form onSubmit={handleSubmit} className="services-form" style={{ gridTemplateColumns: '1fr' }}>
            <label className="form-label-field">
              <span>{isAm ? 'ስም *' : 'Name *'}</span>
              <input type="text" required value={form.name} onChange={handleChange('name')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'ኢሜይል *' : 'Email *'}</span>
              <input type="email" required value={form.email} onChange={handleChange('email')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'መልእክት *' : 'Message *'}</span>
              <textarea required rows={4} value={form.message} onChange={handleChange('message')} className="form-textarea-field" />
            </label>

            <button type="submit" className="form-submit-btn">
              {isAm ? 'ጥያቄውን ላክ (Submit)' : 'Submit Inquiry'}
            </button>
          </form>
        </Reveal>

      </div>
    </section>
  );
}
