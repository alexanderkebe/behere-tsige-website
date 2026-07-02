import React, { useState } from 'react';
import { DiamondOrnament } from './Icons';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

export default function Contact({ lang }) {
  const { content } = useContent();
  const ct = content.contact;
  const c = ct[lang] || ct.en;
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Website message from ${form.name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${ct.email}?subject=${subject}&body=${body}`;
  };

  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.153860725416!2d38.74985757449817!3d8.957966690097901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b83f1f6181b5f%3A0x6047c0b4f2c0bbb6!2zQmloZXJlIFRzaWdlIFN0LiBNYXJpYW0gQ2h1cmNoIHwg4Yml4YiE4Yio4Yy94YyMIOGJheGLteGIteGJtSDhiJvhiK3hi6vhiJ0g4Ymk4Ymw4Yqt4Yir4Yi14Ym14Yur4YqV!5e0!3m2!1sen!2sus!4v1782997484374!5m2!1sen!2sus`;

  return (
    <section id="contact" className="contact-section">
      <Reveal className="contact-header">
        <div className="about-tag-row">
          <span className="about-tag-line" />
          <span className="about-tag">{c.sectionTag}</span>
          <span className="about-tag-line" />
        </div>
        <div className="about-ornament"><DiamondOrnament /></div>
        <h2 className="contact-section-title" id="contact-section-title">{c.sectionTitle}</h2>
        <p className="contact-intro">{c.intro}</p>
      </Reveal>

      <div className="contact-grid">
        {/* Info + map */}
        <Reveal className="contact-info" delay={80}>
          <h3 className="contact-info-heading">{c.infoHeading}</h3>

          <ul className="contact-info-list">
            <li className="contact-info-item">
              <span className="contact-info-icon"><PinIcon /></span>
              <div>
                <span className="contact-info-label">{c.addressLabel}</span>
                <span className="contact-info-value">{c.address}</span>
              </div>
            </li>
            <li className="contact-info-item">
              <span className="contact-info-icon"><PhoneIcon /></span>
              <div>
                <span className="contact-info-label">{c.phoneLabel}</span>
                <a className="contact-info-value" href={`tel:${ct.phone.replace(/\s+/g, '')}`}>{ct.phone}</a>
              </div>
            </li>
            <li className="contact-info-item">
              <span className="contact-info-icon"><MailIcon /></span>
              <div>
                <span className="contact-info-label">{c.emailLabel}</span>
                <a className="contact-info-value" href={`mailto:${ct.email}`}>{ct.email}</a>
              </div>
            </li>
            <li className="contact-info-item">
              <span className="contact-info-icon"><ClockIcon /></span>
              <div>
                <span className="contact-info-label">{c.hoursLabel}</span>
                <span className="contact-info-value">{c.hours}</span>
              </div>
            </li>
          </ul>

          <div className="contact-map">
            <iframe
              title="Church location map"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

        {/* Message form */}
        <Reveal as="form" className="contact-form" delay={160} onSubmit={handleSubmit}>
          <h3 className="contact-form-heading">{c.formHeading}</h3>

          <label className="contact-field">
            <span className="contact-field-label">{c.nameLabel}</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={handleChange('name')}
              placeholder={c.namePlaceholder}
              className="contact-input"
            />
          </label>

          <label className="contact-field">
            <span className="contact-field-label">{c.emailFieldLabel}</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={handleChange('email')}
              placeholder={c.emailPlaceholder}
              className="contact-input"
            />
          </label>

          <label className="contact-field">
            <span className="contact-field-label">{c.messageLabel}</span>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={handleChange('message')}
              placeholder={c.messagePlaceholder}
              className="contact-input contact-textarea"
            />
          </label>

          <button type="submit" className="btn-contact-send">
            {c.sendLabel}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" className="learn-more-arrow">
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
