'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LiturgySchedule from '@/components/LiturgySchedule';
import Evangelism from '@/components/Evangelism';
import ProjectDejeselam from '@/components/ProjectDejeselam';
import SacramentsHub from '@/components/SacramentsHub';
import ChurchSchool from '@/components/ChurchSchool';
import Reveal from '@/components/Reveal';
import {
  WorshipIcon,
  FellowshipIcon,
  CalendarIcon,
  LogoCross,
  TeachingIcon,
  DiamondOrnament
} from '@/components/Icons';

export default function ServicesView({
  settings,
  liturgySchedule,
  sundaySchoolData,
  abnetData,
  evangelismData,
  memorialServices,
}) {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  const isAm = lang === 'am';

  const tabs = [
    {
      id: 'liturgy',
      labelEn: 'Liturgy & Worship',
      labelAm: 'ቅዳሴና አምልኮ',
      descEn: 'Join our daily prayers, Mahlet, and Sunday Divine Liturgy services.',
      descAm: 'በዕለታዊ ጸሎቶች፣ ማኅሌት እና በደማቁ የእሑድ ቅዳሴ መርሃ ግብር ላይ ይሳተፉ።',
      subLabelEn: 'Daily Prayers & Sunday Kidase',
      subLabelAm: 'ዕለታዊ ጸሎት እና ቅዳሴ',
      icon: WorshipIcon,
      component: <LiturgySchedule schedule={liturgySchedule} />
    },
    {
      id: 'evangelism',
      labelEn: 'Gospel & Sermons',
      labelAm: 'ወንጌልና ስብከቶች',
      descEn: 'Explore our nightly gospel teachings, seasonal sermons, and youth programs.',
      descAm: 'የዕለት ማታ የወንጌል ትምህርቶች፣ ወቅታዊ ስብከቶች እና መዝሙራት መርሃ ግብር።',
      subLabelEn: 'Nightly Teachings & Sermons',
      subLabelAm: 'የወንጌል ስብከትና መርሃ ግብር',
      icon: FellowshipIcon,
      component: <Evangelism data={evangelismData} />
    },
    {
      id: 'dejeselam',
      labelEn: 'Project Dejeselam',
      labelAm: 'የደጀ ሰላም ፕሮጀክት',
      descEn: 'Join our daily charity feeding program, sponsor meals, and select available dates.',
      descAm: 'በቤተ ክርስቲያን ደጃፍ የሚገኙ የተቸገሩ ወገኖችን በዕለት ማዕድ ለመደገፍ የበረከት ቀን ይምረጡ።',
      subLabelEn: 'Feed the Needy (Matthew 25)',
      subLabelAm: 'ለተቸገሩት የዕለት ማዕድ ማጋራት',
      icon: CalendarIcon,
      component: <ProjectDejeselam />
    },
    {
      id: 'sacraments',
      labelEn: 'Holy Sacraments',
      labelAm: 'ቅዱሳት ምስጢራት',
      descEn: 'Register and request for Holy Baptism, Catechism, Confession, and Memorial services.',
      descAm: 'የጥምቀት፣ የትምህርተ ሃይማኖት፣ የንስሐ አባቶች እና የፍትሐት ጸሎት አገልግሎት መጠየቂያ ቅጾች።',
      subLabelEn: 'Baptism, Penance, Fithat',
      subLabelAm: 'ጥምቀት፣ ንስሐ እና ፍትሐት',
      icon: LogoCross,
      component: <SacramentsHub settings={settings} services={memorialServices} />
    },
    {
      id: 'school',
      labelEn: 'Church Education',
      labelAm: 'የቤተክርስቲያን ትምህርት',
      descEn: 'Discover traditional Abnet (Ge\'ez poetry, hymns) and modern Sunday School classes.',
      descAm: 'የፊደል፣ የዜማ፣ የቅኔ የአብነት ትምህርት እና የህፃናት/ወጣቶች ሰንበት ትምህርት ቤቶች።',
      subLabelEn: 'Abnet & Sunday School',
      subLabelAm: 'የአብነትና የሰንበት ትምህርት ቤት',
      icon: TeachingIcon,
      component: <ChurchSchool lang={lang} />
    }
  ];

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
          <div className="services-hero-overlay"></div>
          <Reveal className="services-hero-content" direction="up">
            <span className="services-hero-tag">
              {isAm ? 'ቤተ መቅደስ እና አገልግሎት' : 'SANCTUARY & SERVICES'}
            </span>
            <h1 className="services-hero-title">
              {isAm ? 'የደብራችን መንፈሳዊ አገልግሎቶች' : 'Spiritual Services & Ministries'}
            </h1>
            <p className="services-hero-desc">
              {isAm 
                ? '«የእግዚአብሔር ማደሪያ ሰላማዊትና የቅዱሳኑ ማረፊያ ናት...» ጥንታዊውን የቤተ ክርስቲያን ሥርዓትና ትውፊት ጠብቀን በጸሎት፣ በምስጢራትና በትምህርት እናገለግላለን።' 
                : 'Preserving ancient traditions, we serve our community through daily prayers, Holy Sacraments, educational programs, and local charity outreach.'}
            </p>
            <div className="services-hero-ornament">
              <DiamondOrnament />
            </div>
          </Reveal>
        </section>

        <section className="services-overview-grid-section">
          <div className="services-overview-container">
            <Reveal className="services-overview-header" direction="up">
              <h2>{isAm ? 'የአገልግሎት ዘርፎች' : 'Our Service Hub'}</h2>
              <p>{isAm ? 'ለመለኮታዊ አገልግሎት፣ ለመማር፣ ለመጸለይ እና በቸርነት ለመሳተፍ ከታች ካሉት አንዱን ይምረጡ' : 'Select a service below to view detailed schedules, curriculum, or register.'}</p>
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
                      <h3>{isAm ? tab.labelAm : tab.labelEn}</h3>
                      <p>{isAm ? tab.descAm : tab.descEn}</p>
                      <span className="services-overview-card-link">
                        {isAm ? 'አገልግሎቱን ይክፈቱ' : 'Explore Service'} &rarr;
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
              <span>{isAm ? 'ዋና አገልግሎቶች' : 'All Services'}</span>
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
                    <span className="sidebar-main-label">
                      {isAm ? tab.labelAm : tab.labelEn}
                    </span>
                    <span className="sidebar-sub-label">
                      {isAm ? tab.subLabelAm : tab.subLabelEn}
                    </span>
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
            <span>{isAm ? 'ወደ መጀመሪያው ይመለሱ' : 'Back to Overview'}</span>
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
                {isAm ? tab.labelAm : tab.labelEn}
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

