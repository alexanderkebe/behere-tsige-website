'use client';

import React from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  PersonIcon,
  ChurchIcon,
  NewsIcon,
  CalendarIcon,
} from './Icons';

/* Heart-with-cross donate icon */
const DonateIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C5A044" strokeWidth="1.5" style={{ width: 22, height: 22 }}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    <line x1="12" y1="9" x2="12" y2="15" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
);

const MOBILE_ICONS = {
  '/': HomeIcon,
  '/services': ChurchIcon,
  '/events': CalendarIcon,
  '/media': NewsIcon,
  '/articles': NewsIcon,
  '/contact': PersonIcon,
  '/donate': DonateIcon,
};

function basePath(href) {
  const path = href.split('#')[0];
  return path === '' ? '/' : path;
}

export default function MobileMenu({ isOpen, onClose, navItems, pathname, onNavClick }) {
  const isActive = (href) => {
    const base = basePath(href);
    if (base === '/') return pathname === '/';
    return pathname === base || pathname.startsWith(base + '/');
  };

  return (
    <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} id="mobile-menu-overlay">
      <div className="mobile-overlay-header">
        <div className="nav-logo">
          <img src="/assets/logo.png" alt="Logo" className="logo-img" />
        </div>
        <button
          className="mobile-close-btn"
          id="mobile-menu-close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        </button>
      </div>

      <ul className={`mobile-nav-links ${isOpen ? 'mobile-nav-links-open' : ''}`}>
        {navItems.map((item, index) => {
          const IconComponent = MOBILE_ICONS[item.href] || HomeIcon;
          return (
            <li
              key={item.href}
              className={`mobile-nav-item${item.donate ? ' mobile-nav-donate' : ''}`}
              style={{ '--mobile-item-delay': `${index * 60 + 80}ms` }}
            >
              <IconComponent />
              <Link
                href={item.href}
                className={`mobile-nav-link ${isActive(item.href) ? 'active' : ''}`}
                onClick={onNavClick}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
