import React, { useState } from 'react';
import Reveal from './Reveal';
import { DiamondOrnament } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function Catechism() {
  const { lang } = useLanguage();
  const isAm = lang === 'am';

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
            Our catechism program is designed to guide individuals on their journey into the Orthodox faith, equipping them to live a Christ-centered life. It consists of two key components: <strong>Orthodox Foundations</strong> &amp; <strong>Living Orthodox</strong>.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          {/* Orthodox Foundations */}
          <Reveal as="div" direction="left" className="nested-content-card" style={{ borderTop: '4px solid var(--gold)' }}>
            <h3 className="nested-card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
              Orthodox<br/>Foundations
            </h3>
            <p className="nested-card-desc" style={{ marginBottom: '1.5rem' }}>
              The Foundations Program prepares individuals for Baptism and full participation in the life of the Church. You’ll be invited to take a deep dive into the core beliefs, practices, and teachings of the Orthodox Church.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: 'var(--text-dark)' }}>
              <li style={{ marginBottom: '0.8rem' }}><strong>Who it’s for:</strong> Anyone seeking Baptism and a solid foundation in the Ethiopian Orthodox Tewahedo faith.</li>
              <li style={{ marginBottom: '0.8rem' }}><strong>Length:</strong> 14 weeks</li>
              <li style={{ marginBottom: '0.8rem' }}><strong>Start dates:</strong> The Foundations Program is offered in the Spring and Fall</li>
            </ul>
          </Reveal>

          {/* Living Orthodox */}
          <Reveal as="div" direction="right" className="nested-content-card" style={{ borderTop: '4px solid var(--gold)' }}>
            <h3 className="nested-card-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
              Living<br/>Orthodox
            </h3>
            <p className="nested-card-desc" style={{ marginBottom: '1.5rem' }}>
              The Living Orthodox Program is a one-year Bible-based study designed both for those who are already Orthodox as well as those exploring aspects of Orthodox Christian life. The program covers the following themes, divided by quarter:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: 'var(--text-dark)' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>January-March:</strong> Prayer</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>April-May:</strong> Fasting</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>June-September:</strong> Intercession</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>October-December:</strong> Repentance &amp; Confession</li>
            </ul>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', color: 'var(--text-dark)' }}>
              <li style={{ marginBottom: '0.8rem' }}><strong>Who it’s for:</strong> The Living Orthodox Program is open to anyone seeking to grow their faith or looking for support in their spiritual journey.</li>
              <li style={{ marginBottom: '0.8rem' }}><strong>Length:</strong> 1 year</li>
              <li style={{ marginBottom: '0.8rem' }}><strong>Start dates:</strong> This program is an ongoing study that can be joined at any point to deepen your understanding and practice of Orthodoxy in daily life, regardless of where you are in your faith journey.</li>
            </ul>
          </Reveal>
        </div>

        {/* Contact Form */}
        <Reveal as="div" direction="up" className="form-container-card" style={{ maxWidth: '600px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--navy)', margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Contact Us</h3>
            <h4 style={{ margin: 0, color: 'var(--text-dark)', fontSize: '1.1rem', fontWeight: '500' }}>Have Questions? Get in touch!</h4>
          </div>
          
          <form onSubmit={handleSubmit} className="services-form" style={{ gridTemplateColumns: '1fr' }}>
            <label className="form-label-field">
              <span>Name *</span>
              <input type="text" required value={form.name} onChange={handleChange('name')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>Email *</span>
              <input type="email" required value={form.email} onChange={handleChange('email')} className="form-input-field" />
            </label>

            <label className="form-label-field">
              <span>Message *</span>
              <textarea required rows={4} value={form.message} onChange={handleChange('message')} className="form-textarea-field" />
            </label>

            <button type="submit" className="form-submit-btn">
              Submit Inquiry
            </button>
          </form>
        </Reveal>

      </div>
    </section>
  );
}
