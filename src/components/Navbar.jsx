import React, { useState, useEffect } from 'react';
import { GlobeIcon } from './Icons';
import MobileMenu from './MobileMenu';

const NAV_ITEMS_EN = [
  { label: 'HOME', href: '#home' },
  { label: 'ABOUT US', href: '#about' },
  { label: 'SERVICES', href: '#services' },
  { label: 'EVENTS', href: '#events' },
  { label: 'NEWS', href: '#news' },
  { label: 'DONATE', href: '#donate', donate: true },
];

const NAV_ITEMS_AM = [
  { label: 'መነሻ', href: '#home' },
  { label: 'ስለ እኛ', href: '#about' },
  { label: 'አገልግሎቶች', href: '#services' },
  { label: 'መርሃ ግብራት', href: '#events' },
  { label: 'ዜና', href: '#news' },
  { label: 'ልገሳ', href: '#donate', donate: true },
];

export default function Navbar({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');

  const navItems = lang === 'am' ? NAV_ITEMS_AM : NAV_ITEMS_EN;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (href) => {
    setActiveLink(href);
    setMobileOpen(false);
  };

  const toggleLang = () => {
    setLang(lang === 'am' ? 'en' : 'am');
  };

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`} id="main-header">
        <nav className="nav" id="main-nav">
          <a href="#home" className="nav-logo" id="nav-logo" onClick={() => handleNavClick('#home')}>
            <img src="/assets/logo.png" alt="Logo" className="logo-img" />
          </a>

          <ul className="nav-links" id="nav-links">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`nav-link ${item.donate ? 'nav-link-donate' : ''} ${activeLink === item.href ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </a>
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
              className="mobile-menu-toggle"
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
        activeLink={activeLink}
        onNavClick={handleNavClick}
        lang={lang}
      />
    </>
  );
}

