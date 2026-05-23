import React from 'react';
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

const SOCIALS = [
  { id: 'social-youtube', label: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com/@BehereTsigeMekaneSelamStMary' },
  { id: 'social-facebook', label: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com/BehereTsigeMekaneSelamStMary' },
  { id: 'social-telegram', label: 'Telegram', icon: TelegramIcon, href: 'https://t.me/BehereTsigeMekaneSelam' },
  { id: 'social-instagram', label: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com/behere.tsige.st.mary' },
  { id: 'social-tiktok', label: 'TikTok', icon: TikTokIcon, href: 'https://tiktok.com/@beheretsige.st.mary' },
  { id: 'social-linkedin', label: 'LinkedIn', icon: LinkedInIcon, href: 'https://linkedin.com/company/beheretsige-st-mary' },
];

const CONTENT = {
  en: {
    description: 'Preserving the ancient traditions of the Ethiopian Orthodox Tewahedo Church while nurturing the spiritual growth of our community and providing a beacon of hope and grace.',
    colServices: 'Service Hours',
    colContact: 'Contact Us',
    colLinks: 'Quick Links',
    sundayKidase: 'Sunday Divine Liturgy (Kidase) - 5:00 AM',
    saturdayKidase: 'Saturday Kidase - 6:00 AM',
    weekdayKidase: 'Weekday Liturgy - 6:00 AM',
    address: 'Bihere Tsige Road, Gullele, Addis Ababa, Ethiopia',
    phone: 'Phone: +251 11 320 1234',
    email: 'Email: info@beheretsigestmary.org',
    links: [
      { label: 'Home', href: '#home' },
      { label: 'About Us', href: '#about' },
      { label: 'Services', href: '#services' },
      { label: 'Events', href: '#events' },
      { label: 'News', href: '#news' },
      { label: 'Donate', href: '#donate' },
    ],
    copyright: '© 2026 Bihere Tsige Mekane Selam Kidist Dengel Mariam Church. All rights reserved.',
  },
  am: {
    description: 'የማኅበረሰባችንን መንፈሳዊ እድገት እያሳደገ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያንን ጥንታዊ እምነት፣ ሥርዓትና ታሪክ ይጠብቃል።',
    colServices: 'የአምልኮ ሰዓታት',
    colContact: 'ያግኙን',
    colLinks: 'ፈጣን አገናኞች',
    sundayKidase: 'የእሑድ ቅዳሴ - ከጧቱ 11:00 ሰዓት ጀምሮ',
    saturdayKidase: 'የቅዳሜ ቅዳሴ - ከጧቱ 12:00 ሰዓት ጀምሮ',
    weekdayKidase: 'የዕለታት ቅዳሴ - ከጧቱ 12:00 ሰዓት ጀምሮ',
    address: 'የብሔረ ጽጌ መንገድ፣ ጉለሌ፣ አዲስ አበባ፣ ኢትዮጵያ',
    phone: 'ስልክ፡ +251 11 320 1234',
    email: 'ኢሜይል፡ info@beheretsigestmary.org',
    links: [
      { label: 'መነሻ', href: '#home' },
      { label: 'ስለ እኛ', href: '#about' },
      { label: 'አገልግሎቶች', href: '#services' },
      { label: 'መርሃ ግብራት', href: '#events' },
      { label: 'ዜና', href: '#news' },
      { label: 'ልገሳ', href: '#donate' },
    ],
    copyright: '© 2026 ብሔረ ጽጌ መካነ ሰላም ቅድስት ድንግል ማርያም ቤተ ክርስቲያን። መብቱ በሕግ የተጠበቀ ነው።',
  },
};

export default function Footer({ lang }) {
  const c = CONTENT[lang] || CONTENT.en;

  return (
    <footer id="footer" className="footer">
      <div className="footer-top">
        {/* Col 1: About Church */}
        <div className="footer-col footer-col-about">
          <img src="/assets/logo.png" alt="Church Logo" className="footer-logo" />
          <h3 className="footer-church-title">
            {lang === 'am'
              ? 'ብሔረ ጽጌ መካነ ሰላም ቅድስት ድንግል ማርያም ቤተ ክርስቲያን'
              : 'Bihere Tsige Mekane Selam St. Mary Church'}
          </h3>
          <p className="footer-church-desc">{c.description}</p>
        </div>

        {/* Col 2: Quick Links */}
        <div className="footer-col">
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
        </div>

        {/* Col 3: Services schedule */}
        <div className="footer-col">
          <h4 className="footer-col-title">{c.colServices}</h4>
          <ul className="footer-schedule">
            <li>{c.sundayKidase}</li>
            <li>{c.saturdayKidase}</li>
            <li>{c.weekdayKidase}</li>
          </ul>
        </div>

        {/* Col 4: Contact info */}
        <div className="footer-col">
          <h4 className="footer-col-title">{c.colContact}</h4>
          <div className="footer-contact">
            <p className="footer-contact-address">{c.address}</p>
            <p className="footer-contact-phone">{c.phone}</p>
            <p className="footer-contact-email">
              <a href="mailto:info@beheretsigestmary.org">{c.email}</a>
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">{c.copyright}</p>
        <div className="social-links" id="social-links">
          {SOCIALS.map((social) => {
            const IconComponent = social.icon;
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
      </div>
    </footer>
  );
}
