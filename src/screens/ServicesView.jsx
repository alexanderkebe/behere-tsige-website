'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSection } from '@/context/ContentContext';
import AnnualFeasts from '@/components/AnnualFeasts';
import WeeklySchedule from '@/components/WeeklySchedule';
import Evangelism from '@/components/Evangelism';
import ProjectDejeselam from '@/components/ProjectDejeselam';
import SacramentsHub from '@/components/SacramentsHub';
import ChurchSchool from '@/components/ChurchSchool';
import Reveal from '@/components/Reveal';
import ScrollIndicator from '@/components/ScrollIndicator';
import { getCachedAsset } from '@/lib/assetCache';
import {
  WorshipIcon,
  FellowshipIcon,
  LogoCross,
  TeachingIcon,
  DiamondOrnament
} from '@/components/Icons';

// Mesob (traditional Ethiopian food basket) icon for Project Dejeselam.
// Same call signature as the SVG icons so it drops into the tab config.
function MesobIcon({ size = 32 }) {
  // The PNG's strokes are thin; stack tight gold drop-shadows in every
  // direction to visually thicken the lines to match the other icons.
  const g = 'var(--gold, #C5A044)';
  return (
    <img
      src="/assets/mesob-icon.png"
      alt=""
      width={size}
      height={size}
      style={{
        objectFit: 'contain',
        filter: `drop-shadow(0.6px 0 0 ${g}) drop-shadow(-0.6px 0 0 ${g}) drop-shadow(0 0.6px 0 ${g}) drop-shadow(0 -0.6px 0 ${g})`,
      }}
    />
  );
}

// Censer icon for Major Annual Feasts.
function CenserIcon({ size = 32 }) {
  const g = 'var(--gold, #C5A044)';
  return (
    <img
      src="/assets/censer-icon.png"
      alt=""
      width={size}
      height={size}
      style={{
        objectFit: 'contain',
        filter: `drop-shadow(0.6px 0 0 ${g}) drop-shadow(-0.6px 0 0 ${g}) drop-shadow(0 0.6px 0 ${g}) drop-shadow(0 -0.6px 0 ${g})`,
      }}
    />
  );
}

export default function ServicesView({
  settings,
  annualFeasts,
  weeklySchedule,
  sundaySchoolData,
  abnetData,
  evangelismData,
  memorialServices,
  fathers = [],
}) {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const updateSrc = () => {
      // Use the blob the splash preloader downloaded when available.
      setVideoSrc(
        getCachedAsset(mq.matches ? '/assets/services-hero-mobile.mp4' : '/assets/services-hero-pc.mp4')
      );
    };
    updateSrc();
    mq.addEventListener('change', updateSrc);
    return () => mq.removeEventListener('change', updateSrc);
  }, []);

  useEffect(() => {
    if (activeTab !== 'overview') {
      document.body.classList.add('services-dashboard-active');
    } else {
      document.body.classList.remove('services-dashboard-active');
    }
    return () => {
      document.body.classList.remove('services-dashboard-active');
    };
  }, [activeTab]);

  const isAm = lang === 'am';

  // Page copy is edited in /admin → Site Content → Services Page. Each tab's
  // label/description lives under section.tabs, keyed by the tab id below.
  const section = useSection('services');
  const c = (isAm ? section.am : section.en) || section.en;
  const tabCopy = (id) => {
    const tab = section.tabs?.[id];
    return (isAm ? tab?.am : tab?.en) || tab?.en || {};
  };

  const tabs = [
    { id: 'liturgy', icon: CenserIcon, component: <AnnualFeasts feasts={annualFeasts} /> },
    { id: 'weekly-schedule', icon: WorshipIcon, component: <WeeklySchedule schedule={weeklySchedule} /> },
    { id: 'evangelism', icon: FellowshipIcon, component: <Evangelism data={evangelismData} /> },
    { id: 'dejeselam', icon: MesobIcon, component: <ProjectDejeselam /> },
    {
      id: 'sacraments',
      icon: LogoCross,
      component: <SacramentsHub settings={settings} services={memorialServices} fathers={fathers} />,
    },
    { id: 'school', icon: TeachingIcon, component: <ChurchSchool lang={lang} /> },
  ].map((tab) => ({ ...tab, copy: tabCopy(tab.id) }));

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Smooth scroll content area to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // mode 1: Landing Page overview
  if (activeTab === 'overview') {
    return (
      <main className="services-page-main overflow-hidden">
        <section className="services-hero">
          {videoSrc && (
            <div className="services-hero-bg">
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            </div>
          )}
          <div className="services-hero-overlay"></div>
          <Reveal className="services-hero-content" direction="up">
            <span className="services-hero-tag">{c.heroTag}</span>
            <h1 className="services-hero-title">{c.heroTitle}</h1>
            <p className="services-hero-desc">{c.heroDescription}</p>
            <div className="services-hero-ornament">
              <DiamondOrnament />
            </div>
          </Reveal>
          <div className="services-hero-scroll-wrapper">
            <ScrollIndicator />
          </div>
        </section>

        <section className="services-overview-grid-section">
          <div className="services-overview-container">
            <Reveal className="services-overview-header" direction="up">
              <h2>{c.hubTitle}</h2>
              <p>{c.hubDescription}</p>
            </Reveal>

            <div className="services-overview-grid">
              {tabs.map((tab, idx) => {
                const IconComponent = tab.icon;
                return (
                  <Reveal key={tab.id} delay={idx * 80} direction="up" as="div" className="services-overview-card-wrapper">
                    <button
                      onClick={() => handleTabChange(tab.id)}
                      className="services-overview-card"
                    >
                      <div className="services-overview-card-icon">
                        <IconComponent size={32} />
                      </div>
                      <h3>{tab.copy.label}</h3>
                      <p>{tab.copy.description}</p>
                      <span className="services-overview-card-link">
                        {c.explore} &rarr;
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // mode 2: Interactive Split Dashboard layout
  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <main className="services-dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="services-sidebar">
        <div className="services-sidebar-sticky">
          <div className="services-sidebar-header">
            <button 
              onClick={() => handleTabChange('overview')}
              className="services-sidebar-back"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{c.allServices}</span>
            </button>
          </div>

          <div className="services-sidebar-menu">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`services-sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <div className="services-sidebar-item-icon">
                    <Icon size={20} />
                  </div>
                  <div className="services-sidebar-item-text">
                    <span className="sidebar-main-label">{tab.copy.label}</span>
                    <span className="sidebar-sub-label">{tab.copy.subLabel}</span>
                  </div>
                  {isActive && <div className="services-sidebar-active-indicator" />}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Mobile Top Tabs Navigation */}
      <div className="services-mobile-tabs-container">
        <div className="services-mobile-back-bar">
          <button 
            onClick={() => handleTabChange('overview')}
            className="services-sidebar-back"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{c.backToOverview}</span>
          </button>
        </div>
        <div className="services-mobile-tabs-scroll">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`services-mobile-tab-btn ${isActive ? 'active' : ''}`}
              >
                {tab.copy.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Frame */}
      <section className="services-dashboard-content">
        <div key={activeTab} className="services-dashboard-content-frame fade-in">
          {currentTab ? currentTab.component : null}
        </div>
      </section>
    </main>
  );
}

