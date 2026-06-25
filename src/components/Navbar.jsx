'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlobeIcon } from './Icons';
import MobileMenu from './MobileMenu';
import { useLanguage } from '@/context/LanguageContext';

const NAV_ITEMS_EN = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/#about' },
  { label: 'SERVICES', href: '/services' },
  { label: 'EVENTS', href: '/events' },
  { label: 'MEDIA', href: '/media' },
  { label: 'ARTICLES', href: '/articles' },
  { label: 'CONTACT US', href: '/contact' },
  { label: 'DONATE', href: '/donate', donate: true },
];

const NAV_ITEMS_AM = [
  { label: 'ዋና ገጽ', href: '/' },
  { label: 'ስለ ብሔረ ጽጌ ማርያም', href: '/#about' },
  { label: 'አገልግሎት', href: '/services' },
  { label: 'ቀጣይ ዝግጅቶች', href: '/events' },
  { label: 'ሚዲያ', href: '/media' },
  { label: 'ከሊቃውንት መጣጥፍ', href: '/articles' },
  { label: 'ያግኙን', href: '/contact' },
  { label: 'ይለግሱ', href: '/donate', donate: true },
];

// '/services' -> '/services' ; '/#about' -> '/' ; '/' -> '/'
function basePath(href) {
  const path = href.split('#')[0];
  return path === '' ? '/' : path;
}

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = lang === 'am' ? NAV_ITEMS_AM : NAV_ITEMS_EN;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href) => {
    const base = basePath(href);
    if (base === '/') return pathname === '/';
    return pathname === base || pathname.startsWith(base + '/');
  };

  const toggleLang = () => setLang(lang === 'am' ? 'en' : 'am');
  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      <header className={`header header-entrance ${scrolled ? 'scrolled' : ''}`} id="main-header">
        <nav className="nav" id="main-nav">
          <Link href="/" className="nav-logo nav-logo-entrance" id="nav-logo" onClick={handleNavClick}>
            <img src="/assets/logo.png" alt="Logo" className="logo-img" />
          </Link>

          <ul className="nav-links" id="nav-links">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`nav-link ${item.donate ? 'nav-link-donate' : ''} ${isActive(item.href) ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button
              className="btn-lang"
              onClick={toggleLang}
              aria-label="Toggle Language"
              id="btn-lang"
            >
              <GlobeIcon size={16} />
              <span>{lang === 'am' ? 'EN' : 'አማ'}</span>
            </button>

            <button
              className={`mobile-menu-toggle ${mobileOpen ? 'is-open' : ''}`}
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileOpen(true)}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        pathname={pathname}
        onNavClick={handleNavClick}
      />
    </>
  );
}
