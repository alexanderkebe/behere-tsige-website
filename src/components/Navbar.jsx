'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, ChevronDown, Check } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useLanguage } from '@/context/LanguageContext';

const NAV_ITEMS_EN = [
  { label: 'HOME', href: '/' },
  { label: 'SERVICES', href: '/services' },
  { label: 'EVENTS', href: '/events' },
  { label: 'MEDIA', href: '/media' },
  { label: 'ARTICLES', href: '/articles' },
  { label: 'CONTACT US', href: '/contact' },
  { label: 'DONATE', href: '/donate', donate: true },
];

const NAV_ITEMS_AM = [
  { label: 'መነሻ ገጽ', href: '/' },
  { label: 'አገልግሎቶች', href: '/services' },
  { label: 'መርሐ ግብራት', href: '/events' },
  { label: 'ሚዲያ', href: '/media' },
  { label: 'ጽሑፎች', href: '/articles' },
  { label: 'ያግኙን', href: '/contact' },
  { label: 'መባዕ', href: '/donate', donate: true },
];

const LANGS = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'am', label: 'Amharic', native: 'አማርኛ' },
  { code: 'gez', label: 'Ge\'ez', native: 'ግዕዝ' },
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = (lang === 'am' || lang === 'gez') ? NAV_ITEMS_AM : NAV_ITEMS_EN;
  const activeLang = LANGS.find((l) => l.code === lang) || LANGS[0];

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (href) => {
    const base = basePath(href);
    if (base === '/') return pathname === '/';
    return pathname === base || pathname.startsWith(base + '/');
  };

  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      <header className={`header header-entrance ${scrolled ? 'scrolled' : ''}`} id="main-header">
        <nav className="nav" id="main-nav">
          <Link href="/" className="nav-logo nav-logo-entrance" id="nav-logo" onClick={handleNavClick}>
            <img src="/assets/logo.png" alt="Bihere Tsige Mekane Selam Kidist Dengel Mariam Church logo" className="logo-img" />
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
            <div className="lang-dropdown-container" ref={dropdownRef}>
              <button
                type="button"
                className={`btn-lang ${dropdownOpen ? 'is-active' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
                aria-label={`Select language. Current: ${activeLang.label}`}
                id="btn-lang"
              >
                <Globe size={15} className="lang-globe-icon" />
                <span>{activeLang.native}</span>
                <ChevronDown size={11} className={`lang-chevron-icon ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <ul className="lang-dropdown-menu" role="listbox" aria-label="Language options">
                  {LANGS.map((l) => (
                    <li key={l.code} role="option" aria-selected={l.code === lang}>
                      <button
                        type="button"
                        className={`lang-dropdown-item ${l.code === lang ? 'selected' : ''}`}
                        onClick={() => {
                          setLang(l.code);
                          setDropdownOpen(false);
                        }}
                      >
                        <span className="lang-item-text">{l.native}</span>
                        {l.code === lang && <Check size={13} className="lang-check-icon" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className={`mobile-menu-toggle ${mobileOpen ? 'is-open' : ''}`}
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
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
