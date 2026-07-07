'use client';

import React, { useState, useEffect } from 'react';
import Reveal from '@/components/Reveal';
import PageHero from '@/components/PageHero';
import { useLanguage } from '@/context/LanguageContext';
import { useSection } from '@/context/ContentContext';
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

  // Page copy is edited in /admin → Site Content → Media Page.
  const section = useSection('media');
  const t = (isAm ? section.am : section.en) || section.en;

  const handleCopyLink = (url, label) => {
    navigator.clipboard.writeText(url).then(() => {
      setToastMessage(`${label ? label + ': ' : ''}${t.copiedText}`);
      setTimeout(() => setToastMessage(''), 3000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  // Group by live status
  const liveStreams = initialMediaLinks.filter(m => m.is_live);
  const socialChannels = initialMediaLinks.filter(m => !m.is_live);

  return (
    <div className="media-page-view">
      <PageHero
        title={t.profileTitle}
        subtitle={t.profileSubtitle}
        videoSrcDesktop="/assets/media-hero-pc.mp4"
        videoSrcMobile="/assets/media-hero-mobile.mp4"
      />
      <div className="media-content-wrapper" style={{ paddingTop: '3.5rem' }}>
        {/* Scripture Quote */}
        <div className="media-profile-section-container">
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
              <h2>{liveStreams.length > 0 ? t.liveTitle : t.latestVideo}</h2>
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

