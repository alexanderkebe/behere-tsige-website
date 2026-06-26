'use client';

import React from 'react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { useLanguage } from '@/context/LanguageContext';
import { DiamondOrnament } from '@/components/Icons';
import '@/styles/media.css';

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

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'youtube': return '🔴';
      case 'facebook': return '🔵';
      case 'telegram': return '✈️';
      default: return '🌐';
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
            {socialChannels.map((chan, idx) => (
              <Reveal 
                key={chan.id} 
                delay={idx * 80} 
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
                  {getPlatformIcon(chan.platform)}
                </div>
                <h3>{isAm ? chan.title_am || chan.title_en : chan.title_en}</h3>
                <span className="media-channel-badge">{chan.platform.toUpperCase()}</span>
                <span className="media-channel-action-label" aria-hidden="true">{t.viewChannel} &rarr;</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
