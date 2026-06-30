'use client';

import React, { useState, useEffect } from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import {
  DiamondOrnament,
  FacebookIcon,
  TelegramIcon,
  InstagramIcon,
  TikTokIcon,
} from '@/components/Icons';
import '@/styles/media.css';

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.018 0 12 0 12s0 3.982.502 5.837a3.003 3.003 0 002.11 2.11c1.858.508 9.388.508 9.388.508s7.53 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.982 24 12 24 12s0-3.982-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const QrCodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <rect x="3" y="3" width="5" height="5" rx="1" />
    <rect x="16" y="3" width="5" height="5" rx="1" />
    <rect x="3" y="16" width="5" height="5" rx="1" />
    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
    <path d="M21 21v.01" />
    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
    <path d="M3 12h.01" />
    <path d="M12 3h.01" />
    <path d="M12 16v.01" />
    <path d="M16 12h1" />
    <path d="M21 12v.01" />
    <path d="M12 21v-1" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const PLATFORM_ICONS = {
  youtube: YoutubeIcon,
  facebook: FacebookIcon,
  telegram: TelegramIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
};

export default function MediaView({ initialMediaLinks = [] }) {
  const { lang } = useLanguage();
  const isAm = lang === 'am';
  const [toastMessage, setToastMessage] = useState('');

  const t = {
    tag: isAm ? 'ማህበራዊ ሚዲያ እና ስርጭቶች' : 'Media & Streaming',
    title: isAm ? 'የደብራችን ሚዲያ ማዕከል' : 'Media Portal',
    subtitle: isAm ? 'ቀጥታ ስርጭቶች፣ ትምህርቶች እና ይፋዊ ማህበራዊ ድረ-ገጾች' : 'Connect with our parish online through live streaming and official social media platforms.',
    heading: isAm ? 'ይፋዊ ማህበራዊ ድረ-ገጾቻችን' : 'Our Official Channels',
    liveTitle: isAm ? 'ቀጥታ ስርጭት (በማህበራዊ ሚዲያ)' : 'Live Broadcasts',
    liveNotice: isAm ? 'በአሁኑ ጊዜ የሚተላለፍ ቀጥታ ስርጭት የለም።' : 'No active live broadcast at the moment.',
    liveBadge: isAm ? 'ቀጥታ ስርጭት' : 'LIVE',
    viewChannel: isAm ? 'ቻናሉን ይጎብኙ' : 'Visit Channel',
    profileTitle: isAm ? 'መካነ ሰላም ብሔረ ጽጌ ቅድስት ማርያም ይፋዊ ሚዲያ' : "Mekane Selam Behere Tsege St. Mary's Official Media",
    profileSubtitle: isAm ? 'ቤተሰብ በመሆን ይተባበሩን።' : 'Partner with us by staying connected.',
    scriptureQuote: isAm ? '"ሁለት ወይም ሦስት በስሜ በሚሰበሰቡበት በዚያ በመካከላቸው እሆናለሁና።"' : '"For where two or three are gathered in my name, there am I among them."',
    scriptureRef: isAm ? '— ማቴዎስ 18፥20' : '— Matthew 18:20',
    contactTitle: isAm ? 'ያግኙን' : 'Contact Us',
    phoneLabel: isAm ? 'ስልክ' : 'Phone',
    emailLabel: isAm ? 'ኢሜይል' : 'Email',
    callBtn: isAm ? 'ይደውሉ' : 'Call',
    smsBtn: isAm ? 'መልዕክት' : 'SMS',
    writeBtn: isAm ? 'ይጻፉ' : 'Email',
    copyBtn: isAm ? 'ይቅዱ' : 'Copy',
    openBtn: isAm ? 'ይክፈቱ' : 'Open',
    copyLinkBtn: isAm ? 'ሊንክ ይቅዱ' : 'Copy Link',
    shareTitle: isAm ? 'አጋሩ እና ያሸንፉ' : 'Share & Support',
    shareDesc: isAm ? 'ለጓደኞችዎና ለቤተሰብዎ በማጋራት የቤተክርስቲያናችንን ሚዲያ ያግዙ!' : 'Support our church media by sharing this portal with your friends and family!',
    scanLabel: isAm ? 'ለመክፈት ይቃኙ' : 'Scan to open',
    shareBtn: isAm ? 'አጋሩ' : 'Share',
    telegramBtn: isAm ? 'ቴሌግራም' : 'Telegram',
    whatsappBtn: isAm ? 'ዋትስአፕ' : 'WhatsApp',
    facebookBtn: isAm ? 'ፌስቡክ' : 'Facebook',
    copiedText: isAm ? 'ኮፒ ተደርጓል!' : 'Copied to clipboard!',
  };

  const handleCopyLink = (url, label) => {
    navigator.clipboard.writeText(url).then(() => {
      setToastMessage(`${label ? label + ': ' : ''}${t.copiedText}`);
      setTimeout(() => setToastMessage(''), 3000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t.profileTitle,
        text: t.profileSubtitle,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      handleCopyLink(window.location.href, isAm ? 'የሚዲያ ሊንክ' : 'Media Link');
    }
  };

  // Group by live status
  const liveStreams = initialMediaLinks.filter(m => m.is_live);
  const socialChannels = initialMediaLinks.filter(m => !m.is_live);

  return (
    <div className="media-page-view">
      <PageHero
        title={t.title}
        subtitle={t.subtitle}
      />

      <div className="media-content-wrapper">
        {/* Profile Card & Scripture Quote - Inspired by Socials App */}
        <div className="media-profile-section-container">
          <Reveal className="media-profile-card-glass" direction="up">
            <div className="media-profile-avatar-wrapper">
              <img 
                src="/assets/logo-footer.png" 
                alt="Church Logo" 
                className="media-profile-avatar-img" 
              />
            </div>
            <h2 className="media-profile-title">{t.profileTitle}</h2>
            <p className="media-profile-subtitle">{t.profileSubtitle}</p>
          </Reveal>

          <Reveal className="media-quote-card-glass" direction="up" delay={50}>
            <blockquote className="media-quote-text">
              <p>{t.scriptureQuote}</p>
              <footer className="media-quote-footer">{t.scriptureRef}</footer>
            </blockquote>
          </Reveal>
        </div>

        {/* Live Stream / Latest Video Section */}
        <section className="media-live-section">
          <div className="media-container">
            <Reveal className="media-section-header">
              {liveStreams.length > 0 && <span className="live-status-dot"></span>}
              <h2>{liveStreams.length > 0 ? t.liveTitle : (isAm ? 'የቅርብ ጊዜ ቪዲዮ' : 'Latest Video')}</h2>
            </Reveal>

            {liveStreams.length === 0 ? (
              <Reveal className="media-youtube-latest-card-glass" direction="up">
                <div className="media-youtube-embed-container">
                  <iframe
                    src="https://www.youtube.com/embed?listType=playlist&list=UU6y3U09CboUBl6GdPxLlevw"
                    title="Latest YouTube Upload"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </Reveal>
            ) : (
              <div className="media-live-grid">
                {liveStreams.map((stream, idx) => (
                  <Reveal key={stream.id} delay={idx * 100} className="media-live-card-glass" as="div" direction="up">
                    <div className="media-live-badge-overlay">{t.liveBadge}</div>
                    <div className="media-live-content">
                      <h3>{isAm ? stream.title_am || stream.title_en : stream.title_en}</h3>
                      <div className="media-live-actions">
                        <a 
                          href={stream.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="media-btn-primary"
                        >
                          {t.viewChannel} &rarr;
                        </a>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Share & Support Widget - Inspired by Socials App */}
        <div className="media-container">
          <Reveal className="media-share-widget-glass" direction="up" delay={80}>
            <div className="media-share-header">
              <div className="share-gift-icon-container">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                  <rect x="3" y="8" width="18" height="4" rx="1" />
                  <path d="M12 8v13" />
                  <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                  <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                </svg>
              </div>
              <div className="share-header-text">
                <h3>{t.shareTitle}</h3>
                <p>{t.shareDesc}</p>
              </div>
            </div>

            <div className="media-share-body">
              <div className="share-qr-section">
                {/* SVG QR Code representation for reliability */}
                <div className="share-qr-box">
                  <svg viewBox="0 0 100 100" fill="currentColor" width="90" height="90" aria-hidden="true" className="share-qr-svg">
                    {/* Outer Position blocks */}
                    <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                    <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                    <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                    {/* Alighment block */}
                    <path d="M75,75 h10 v10 h-10 z" />
                    {/* Dummy QR Noise */}
                    <path d="M40,0 h10 v10 h-10 z M40,20 h10 v10 h-10 z M55,10 h10 v15 h-10 z M45,45 h15 v10 h-15 z M35,60 h10 v25 h-10 z M55,70 h15 v10 h-15 z M85,45 h10 v20 h-10 z M65,35 h15 v10 h-15 z M0,45 h20 v10 h-20 z M80,85 h15 v10 h-15 z" />
                  </svg>
                </div>
                <div className="share-qr-label">
                  <QrCodeIcon />
                  <span>{t.scanLabel}</span>
                </div>
              </div>

              <div className="share-actions-section">
                <button className="media-btn-primary w-full" onClick={handleShare}>
                  <ShareIcon />
                  {t.shareBtn}
                </button>

                <div className="share-grid-buttons">
                  <button 
                    onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(t.profileTitle)}`, '_blank')}
                    className="share-grid-btn"
                  >
                    <SendIcon />
                    <span>{t.telegramBtn}</span>
                  </button>

                  <button 
                    onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(t.profileTitle + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`, '_blank')}
                    className="share-grid-btn"
                  >
                    <WhatsappIcon />
                    <span>{t.whatsappBtn}</span>
                  </button>

                  <button 
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank')}
                    className="share-grid-btn"
                  >
                    <FacebookIcon />
                    <span>{t.facebookBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Social Channels Section */}
        <section className="media-channels-section">
          <div className="media-container">
            <Reveal className="media-section-header">
              <div className="about-tag-row" style={{ justifyContent: 'center' }}>
                <span className="about-tag-line" />
                <span className="about-tag">{t.tag}</span>
                <span className="about-tag-line" />
              </div>
              <div className="about-ornament"><DiamondOrnament /></div>
              <h2>{t.heading}</h2>
            </Reveal>

            <div className="media-channels-grid-glass">
              {socialChannels.map((chan, idx) => {
                const Icon = PLATFORM_ICONS[chan.platform?.toLowerCase()] || YoutubeIcon;
                const platformName = chan.platform ? chan.platform.charAt(0).toUpperCase() + chan.platform.slice(1) : '';
                return (
                  <Reveal
                    key={chan.id}
                    delay={idx * 50}
                    className={`media-channel-card-glass platform-${chan.platform?.toLowerCase()}`}
                    as="div"
                    direction="up"
                  >
                    <div className="media-card-main-info">
                      <div className="media-channel-icon-circle" aria-hidden="true">
                        <Icon />
                      </div>
                      <div className="media-channel-text-info">
                        <h3>{isAm ? chan.title_am || chan.title_en : chan.title_en || chan.title_am}</h3>
                        {chan.handle && <span className="media-channel-handle">{chan.handle}</span>}
                      </div>
                    </div>

                    <div className="media-card-action-row">
                      <a 
                        href={chan.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="media-card-btn-action btn-open"
                      >
                        {t.openBtn}
                      </a>
                      <button 
                        onClick={() => handleCopyLink(chan.url, platformName)}
                        className="media-card-btn-action btn-copy"
                      >
                        {t.copyLinkBtn}
                      </button>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Copy Toast Alert */}
      {toastMessage && (
        <div className="media-toast-alert">
          <span className="toast-check-icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

