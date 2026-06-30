'use client';

import React, { useState } from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { DiamondOrnament } from '@/components/Icons';
import { createClient } from '@/lib/supabase/client';
import '@/styles/contact.css';

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon-svg" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon-svg" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon-svg" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="contact-icon-svg" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

export default function ContactView() {
  const { lang } = useLanguage();
  const isAm = lang === 'am';

  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [toastMessage, setToastMessage] = useState('');

  const t = {
    tag: isAm ? 'ያግኙን' : 'Reach Us',
    title: isAm ? 'የደብሩ ጽሕፈት ቤት' : 'Parish Contacts',
    subtitle: isAm ? 'በእምነት እና በፍቅር እናገለግልዎታለን' : 'We are here to serve you in faith, love, and fellowship.',
    infoHeading: isAm ? 'የመገናኛ መረጃ' : 'Contact Information',
    addressLabel: isAm ? 'አድራሻ' : 'Address',
    address: isAm ? 'የብሔረ ጽጌ መንገድ፣ ጉለሌ፣ አዲስ አበባ፣ ኢትዮጵያ' : 'Bihere Tsige Road, Gullele, Addis Ababa, Ethiopia',
    phoneLabel: isAm ? 'ስልክ' : 'Phone',
    phone: '+251 11 320 1234',
    emailLabel: isAm ? 'ኢሜይል' : 'Email',
    email: 'info@beheretsigestmary.org',
    hoursLabel: isAm ? 'የቢሮ ሰዓታት' : 'Office Hours',
    hours: isAm ? 'ከሰኞ – ቅዳሜ፡ ከጠዋቱ 2:00 – ከቀኑ 11:00' : 'Mon – Sat: 8:00 AM – 5:00 PM',
    formHeading: isAm ? 'መልእክት ይላኩልን' : 'Send a Message',
    nameLabel: isAm ? 'ሙሉ ስም' : 'Your Name',
    namePlaceholder: isAm ? 'ሙሉ ስምዎን እዚህ ያስገቡ' : 'Enter your full name',
    phoneLabelField: isAm ? 'ስልክ ቁጥር' : 'Phone Number',
    phonePlaceholder: isAm ? 'ስልክ ቁጥርዎን ያስገቡ' : 'Enter your phone number',
    emailFieldLabel: isAm ? 'ኢሜይል አድራሻ' : 'Email Address',
    emailPlaceholder: isAm ? 'you@example.com' : 'you@example.com',
    subjectFieldLabel: isAm ? 'ጉዳዩ' : 'Subject',
    subjectPlaceholder: isAm ? 'የመልእክቱን ርዕስ ያስገቡ' : 'Enter subject of your message',
    messageLabel: isAm ? 'መልእክት' : 'Message',
    messagePlaceholder: isAm ? 'መልእክትዎን እዚህ ይጻፉ...' : 'Type your message here...',
    sendLabel: isAm ? 'መልእክት ላክ' : 'Submit Message',
    sending: isAm ? 'በመላክ ላይ...' : 'Sending Message...',
    success: isAm ? 'ስለ ላኩልን እናመሰግናለን! መልእክትዎ ደርሶናል፤ በቅርቡ እናገኝዎታለን።' : 'Thank you for reaching out! Your message has been received, and we will contact you shortly.',
    errorMsg: isAm ? 'የሆነ ስህተት ተፈጥሯል፤ እባክዎን እንደገና ይሞክሩ።' : 'An error occurred while sending your message. Please try again.',
    callBtn: isAm ? 'ይደውሉ' : 'Call',
    smsBtn: isAm ? 'መልዕክት' : 'SMS',
    writeBtn: isAm ? 'ይጻፉ' : 'Email',
    copyBtn: isAm ? 'ይቅዱ' : 'Copy',
    copiedText: isAm ? 'ኮፒ ተደርጓል!' : 'Copied to clipboard!'
  };

  const handleCopyLink = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage(`${label ? label + ': ' : ''}${t.copiedText}`);
      setTimeout(() => setToastMessage(''), 3000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: form.name,
          phone: form.phone || null,
          email: form.email,
          subject: form.subject || null,
          message: form.message,
          status: 'new'
        });

      if (error) throw error;
      
      setStatus('sent');
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact submission error:', err);
      setStatus('error');
    }
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent('Gullele, Addis Ababa, Ethiopia')}&output=embed`;

  return (
    <div className="contact-page-view">
      <PageHero
        title={t.title}
        subtitle={t.subtitle}
      />

      <section className="contact-main-section">
        <div className="contact-container">
          
          {/* Glassmorphic Contact Cards */}
          <div className="contact-cards-grid">
            {/* Phone Card */}
            <Reveal className="contact-card-glass" direction="up" delay={0}>
              <div className="contact-card-header">
                <div className="contact-icon-circle phone">
                  <PhoneIcon />
                </div>
                <div className="contact-info-text">
                  <h3>{t.phoneLabel}</h3>
                  <p>{t.phone}</p>
                </div>
              </div>
              <div className="contact-card-actions">
                <a href={`tel:${t.phone.replace(/\\s+/g, '')}`} className="contact-btn-action call">
                  {t.callBtn}
                </a>
                <a href={`sms:${t.phone.replace(/\\s+/g, '')}`} className="contact-btn-action sms">
                  {t.smsBtn}
                </a>
              </div>
            </Reveal>

            {/* Email Card */}
            <Reveal className="contact-card-glass" direction="up" delay={60}>
              <div className="contact-card-header">
                <div className="contact-icon-circle email">
                  <MailIcon />
                </div>
                <div className="contact-info-text">
                  <h3>{t.emailLabel}</h3>
                  <p className="email-text">{t.email}</p>
                </div>
              </div>
              <div className="contact-card-actions">
                <a href={`mailto:${t.email}`} className="contact-btn-action email-btn">
                  {t.writeBtn}
                </a>
                <button 
                  onClick={() => handleCopyLink(t.email, t.emailLabel)} 
                  className="contact-btn-action copy"
                >
                  {t.copyBtn}
                </button>
              </div>
            </Reveal>
          </div>

          <div className="contact-grid">
            
            {/* Left: Info Card & Map */}
            <Reveal className="contact-info-panel" direction="left">
              <h3 className="contact-subhead">{t.infoHeading}</h3>
              
              <ul className="contact-details-list">
                <li className="contact-detail-item">
                  <div className="contact-icon-frame"><PinIcon /></div>
                  <div className="contact-text-frame">
                    <span className="contact-item-label">{t.addressLabel}</span>
                    <span className="contact-item-value">{t.address}</span>
                  </div>
                </li>

                <li className="contact-detail-item">
                  <div className="contact-icon-frame"><ClockIcon /></div>
                  <div className="contact-text-frame">
                    <span className="contact-item-label">{t.hoursLabel}</span>
                    <span className="contact-item-value">{t.hours}</span>
                  </div>
                </li>
              </ul>

              <div className="contact-map-frame">
                <iframe
                  title={isAm ? "የቤተክርስቲያን መገኛ ካርታ" : "Church Location Map"}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Reveal>

            {/* Right: Message Form */}
            <Reveal className="contact-form-panel" direction="right" as="form" onSubmit={handleSubmit}>
              <h3 className="contact-subhead">{t.formHeading}</h3>

              <label htmlFor="contact-name" className="form-label-field">
                <span>{t.nameLabel} *</span>
                <input
                  id="contact-name"
                  type="text"
                  required
                  aria-required="true"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder={t.namePlaceholder}
                  className="form-input-field"
                />
              </label>

              <div className="contact-form-row">
                <label htmlFor="contact-email" className="form-label-field">
                  <span>{t.emailFieldLabel} *</span>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    aria-required="true"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder={t.emailPlaceholder}
                    className="form-input-field"
                  />
                </label>

                <label htmlFor="contact-phone" className="form-label-field">
                  <span>{t.phoneLabelField}</span>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    placeholder={t.phonePlaceholder}
                    className="form-input-field"
                  />
                </label>
              </div>

              <label htmlFor="contact-subject" className="form-label-field">
                <span>{t.subjectFieldLabel}</span>
                <input
                  id="contact-subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange('subject')}
                  placeholder={t.subjectPlaceholder}
                  className="form-input-field"
                />
              </label>

              <label htmlFor="contact-message" className="form-label-field">
                <span>{t.messageLabel} *</span>
                <textarea
                  id="contact-message"
                  required
                  aria-required="true"
                  rows={5}
                  value={form.message}
                  onChange={handleChange('message')}
                  placeholder={t.messagePlaceholder}
                  className="form-textarea-field"
                />
              </label>

              {status === 'sent' && <p className="form-success-text">{t.success}</p>}
              {status === 'error' && <p className="form-error-text">{t.errorMsg}</p>}

              <button type="submit" className="form-submit-btn" disabled={status === 'sending'}>
                {status === 'sending' ? t.sending : t.sendLabel}
              </button>
            </Reveal>

          </div>
        </div>
      </section>

      {/* Copy Toast Alert */}
      {toastMessage && (
        <div className="contact-toast-alert">
          <span className="toast-check-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
