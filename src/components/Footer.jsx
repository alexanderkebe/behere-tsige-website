'use client';

import React from 'react';
import Reveal from './Reveal';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import {
  FacebookIcon,
  TelegramIcon,
  InstagramIcon,
  TikTokIcon,
  LinkedInIcon,
} from './Icons';

// Custom SVG YouTube Icon
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.018 0 12 0 12s0 3.982.502 5.837a3.003 3.003 0 002.11 2.11c1.858.508 9.388.508 9.388.508s7.53 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.982 24 12 24 12s0-3.982-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SOCIAL_ICONS = {
  'social-youtube': YoutubeIcon,
  'social-facebook': FacebookIcon,
  'social-telegram': TelegramIcon,
  'social-instagram': InstagramIcon,
  'social-tiktok': TikTokIcon,
  'social-linkedin': LinkedInIcon,
};

export default function Footer() {
  const { lang } = useLanguage();
  const { content } = useContent();
  const c = content.footer[lang] || content.footer.en;
  const socials = content.socials;

  return (
    <footer id="footer" className="footer">
      <div className="footer-top">
        {/* Col 1: About Church */}
        <Reveal className="footer-col footer-col-about" direction="up" delay={0}>
          <img src="/assets/logo-v2.png" alt="Church Logo" className="footer-logo" />
          <h3 className="footer-church-title">
            {lang === 'am'
              ? 'ብሔረ ጽጌ መካነ ሰላም ቅድስት ድንግል ማርያም ቤተ ክርስቲያን'
              : 'Bihere Tsige Mekane Selam St. Mary Church'}
          </h3>
          <p className="footer-church-desc">{c.description}</p>
        </Reveal>

        {/* Col 2: Quick Links */}
        <Reveal className="footer-col" direction="up" delay={80}>
          <h4 className="footer-col-title">{c.colLinks}</h4>
          <ul className="footer-links">
            {c.links.map((link, i) => (
              <li key={i}>
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Col 3: Services schedule */}
        <Reveal className="footer-col" direction="up" delay={160}>
          <h4 className="footer-col-title">{c.colServices}</h4>
          <ul className="footer-schedule">
            <li>{c.sundayKidase}</li>
            <li>{c.saturdayKidase}</li>
            <li>{c.weekdayKidase}</li>
          </ul>
        </Reveal>

        {/* Col 4: Contact info */}
        <Reveal className="footer-col" direction="up" delay={240}>
          <h4 className="footer-col-title">{c.colContact}</h4>
          <div className="footer-contact">
            <p className="footer-contact-address">{c.address}</p>
            <p className="footer-contact-phone">{c.phone}</p>
            <p className="footer-contact-email">
              <a href="mailto:info@beheretsigestmary.org">{c.email}</a>
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal className="footer-bottom" delay={120}>
        <p className="footer-copyright">{c.copyright}</p>
        <div className="social-links" id="social-links">
          {socials.map((social) => {
            const IconComponent = SOCIAL_ICONS[social.id] || YoutubeIcon;
            return (
              <a
                key={social.id}
                href={social.href}
                className="social-icon"
                id={social.id}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconComponent />
              </a>
            );
          })}
        </div>
      </Reveal>
    </footer>
  );
}
