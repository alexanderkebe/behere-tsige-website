'use client';

import React from 'react';
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
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
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

  const t = {
    tag: isAm ? 'ማህበራዊ ሚዲያ እና ስርጭቶች' : 'Media & Streaming',
    title: isAm ? 'የደብራችን ሚዲያ ማዕከል' : 'Media Portal',
    subtitle: isAm ? 'ቀጥታ ስርጭቶች፣ ትምህርቶች እና ይፋዊ ማህበራዊ ድረ-ገጾች' : 'Connect with our parish online through live streaming and official social media platforms.',
    heading: isAm ? 'ይፋዊ ማህበራዊ ድረ-ገጾቻችን' : 'Our Official Channels',
    liveTitle: isAm ? 'ቀጥታ ስርጭት (በማህበራዊ ሚዲያ)' : 'Live Broadcasts',
    liveNotice: isAm ? 'በአሁኑ ጊዜ የሚተላለፍ ቀጥታ ስርጭት የለም።' : 'No active live broadcast at the moment.',
    liveBadge: isAm ? 'ቀጥታ ስርጭት' : 'LIVE',
    viewChannel: isAm ? 'ቻናሉን ይጎብኙ' : 'Visit Channel',
    platformText: isAm ? 'ማህበረሰብ' : 'Platform'
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

      {/* Live Stream Section */}
      <section className="media-live-section">
        <div className="media-container">
          <Reveal className="media-section-header">
            <span className="live-status-dot"></span>
            <h2>{t.liveTitle}</h2>
          </Reveal>

          {liveStreams.length === 0 ? (
            <Reveal className="media-live-empty" direction="up">
              <p>{t.liveNotice}</p>
            </Reveal>
          ) : (
            <div className="media-live-grid">
              {liveStreams.map((stream, idx) => (
                <Reveal key={stream.id} delay={idx * 100} className="media-live-card" as="div" direction="up">
                  <div className="media-live-badge-overlay">{t.liveBadge}</div>
                  <div className="media-live-content">
                    <h3>{isAm ? stream.title_am || stream.title_en : stream.title_en}</h3>
                    <a 
                      href={stream.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="media-live-btn" 
                      aria-label={isAm 
                        ? `የ${stream.title_am || stream.title_en} ቀጥታ ስርጭት ይመልከቱ (በአዲስ መስኮት ይከፈታል)` 
                        : `Watch live stream of ${stream.title_en} (opens in a new window)`
                      }
                    >
                      {t.viewChannel} &rarr;
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Social channels section */}
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

          <div className="media-channels-grid">
            {socialChannels.map((chan, idx) => {
              const Icon = PLATFORM_ICONS[chan.platform?.toLowerCase()] || YoutubeIcon;
              return (
                <Reveal
                  key={chan.id}
                  delay={idx * 70}
                  className={`media-channel-card platform-${chan.platform}`}
                  as="a"
                  href={chan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  direction="up"
                  aria-label={isAm
                    ? `የ${chan.title_am || chan.title_en} የ${chan.platform} ገጽ (በአዲስ መስኮት ይከፈታል)`
                    : `Visit ${chan.title_en} on ${chan.platform} (opens in a new window)`
                  }
                >
                  <div className="media-channel-icon" aria-hidden="true">
                    <Icon />
                  </div>
                  <div className="media-channel-info">
                    <h3>{isAm ? chan.title_am || chan.title_en : chan.title_en}</h3>
                    {chan.handle && <span className="media-channel-handle">{chan.handle}</span>}
                  </div>
                  <span className="media-channel-action-label" aria-hidden="true">{t.viewChannel} &rarr;</span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
