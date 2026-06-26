import React, { useState } from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Baptism() {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', message: '' });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Baptism Request: ${form.firstName} ${form.lastName}`);
    const body = encodeURIComponent(
      `Name: ${form.firstName} ${form.lastName}\nPhone: ${form.phone}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:info@beheretsigestmary.org?subject=${subject}&body=${body}`;
  };

  const isAm = lang === 'am';

  return (
    <section id="baptism" className="services-section">
      <Reveal className="services-heading">
        <div className="section-ornament">
          <DiamondOrnament />
        </div>
        <h2 className="services-title">{isAm ? 'የጥምቀት አገልግሎት' : 'Baptism Service'}</h2>
      </Reveal>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem 2rem 2rem' }}>
        
        <Reveal direction="up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <blockquote className="scripture-blockquote">
            {isAm 
              ? "«እውነት እውነት እልሃለሁ፥ ሰው ከውኃና ከመንፈስ ካልተወለደ በቀር ወደ እግዚአብሔር መንግሥት ሊገባ አይችልም» (ዮሐንስ ፫፥፭)።"
              : '"Truly, truly, I say to you, unless one is born of water and the Spirit, he cannot enter the kingdom of God" (John 3:5).'}
          </blockquote>
          
          <p style={{ lineHeight: '1.8', color: 'var(--text-dark)', maxWidth: '800px', margin: '0 auto' }}>
            {isAm 
              ? 'በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን ጥምቀት ወደ ክርስቲያናዊ ሕይወት መግቢያ የሆነ ጥልቅና አዲስ ፍጥረት የሚያደርግ ምሥጢር ነው። በጥምቀት አማኞች የክርስቶስ አካል በመሆን ከእግዚአብሔር ጋር ለዘላለም ለመኖር የቅድስና ጉዞ ይጀምራሉ። ልጅዎን ለማስጠመቅ ከፈለጉ፣ ወይም እርስዎ ያልተጠመቁ ከሆኑና መጠመቅ ከፈለጉ፣ እባክዎ ከታች ያለውን ቅጽ ይሙሉ::' 
              : 'Baptism in the Ethiopian Orthodox Tewahedo Church is a profound and transformative sacrament that marks the entry into the Christian life. Through baptism, believers are welcomed into the mystical body of Christ, embarking on a path of holiness and eternal communion with God. If you would like to have your child baptized, or if you are not baptized and would like to be, please complete the form below. We will respond to your request promptly.'}
          </p>
        </Reveal>

        <Reveal as="div" direction="up" className="form-container-card">
          <h3 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--navy)', fontFamily: 'var(--font-heading)' }}>
            {isAm ? 'የጥምቀት አገልግሎት መጠየቂያ ቅጽ' : 'Baptism Service Request Form'}
          </h3>
          
          <form onSubmit={handleSubmit} className="services-form">
            <label className="form-label-field">
              <span>{isAm ? 'ስም' : 'First Name'} *</span>
              <input type="text" required value={form.firstName} onChange={handleChange('firstName')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'የአባት ስም' : 'Last Name'} *</span>
              <input type="text" required value={form.lastName} onChange={handleChange('lastName')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'ስልክ' : 'Phone'} *</span>
              <input type="tel" required value={form.phone} onChange={handleChange('phone')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>{isAm ? 'ኢሜይል' : 'Email (Optional)'}</span>
              <input type="email" value={form.email} onChange={handleChange('email')} className="form-input-field" />
            </label>

            <label className="form-label-field form-full-width">
              <span>{isAm ? 'መልእክት' : 'Message'} *</span>
              <textarea required rows={4} value={form.message} onChange={handleChange('message')} className="form-textarea-field" />
            </label>

            <div className="form-full-width" style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button type="submit" className="form-submit-btn">
                {isAm ? 'ቅጹን ላክ' : 'Submit Request'}
              </button>
            </div>
          </form>
        </Reveal>

      </div>
    </section>
  );
}
