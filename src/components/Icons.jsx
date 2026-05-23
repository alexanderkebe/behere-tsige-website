import React from 'react';

export const LogoCross = ({ className = '', size = 40 }) => (
  <svg
    className={`logo-cross ${className}`}
    viewBox="0 0 40 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: size * 0.8, height: size }}
  >
    <line x1="20" y1="2" x2="20" y2="48" stroke="#C5A044" strokeWidth="2.5" />
    <line x1="8" y1="16" x2="32" y2="16" stroke="#C5A044" strokeWidth="2.5" />
    <circle cx="20" cy="2" r="2" fill="#C5A044" />
    <circle cx="20" cy="48" r="2" fill="#C5A044" />
    <circle cx="8" cy="16" r="2" fill="#C5A044" />
    <circle cx="32" cy="16" r="2" fill="#C5A044" />
    <circle cx="20" cy="16" r="3" fill="none" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M20 6 L22 8 L20 10 L18 8 Z" fill="#C5A044" />
    <path d="M20 38 L22 40 L20 42 L18 40 Z" fill="#C5A044" />
    <path d="M12 16 L14 18 L12 20 L10 18 Z" fill="#C5A044" />
    <path d="M28 16 L30 18 L28 20 L26 18 Z" fill="#C5A044" />
  </svg>
);

export const OrnateCross = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 60 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: 50, height: 80 }}
  >
    <line x1="30" y1="0" x2="30" y2="90" stroke="#C5A044" strokeWidth="2" />
    <line x1="10" y1="25" x2="50" y2="25" stroke="#C5A044" strokeWidth="2" />
    <circle cx="30" cy="5" r="3" fill="none" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M30 0 L32 3 L30 6 L28 3 Z" fill="#C5A044" opacity="0.6" />
    <circle cx="30" cy="85" r="3" fill="none" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M30 82 L32 85 L30 88 L28 85 Z" fill="#C5A044" opacity="0.6" />
    <circle cx="13" cy="25" r="3" fill="none" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M10 25 L13 23 L16 25 L13 27 Z" fill="#C5A044" opacity="0.6" />
    <circle cx="47" cy="25" r="3" fill="none" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M44 25 L47 23 L50 25 L47 27 Z" fill="#C5A044" opacity="0.6" />
    <circle cx="30" cy="25" r="5" fill="none" stroke="#C5A044" strokeWidth="1.5" />
    <circle cx="30" cy="25" r="2" fill="#C5A044" />
  </svg>
);

export const TinyCross = ({ className = '', size = 20 }) => (
  <svg
    className={`tiny-cross ${className}`}
    viewBox="0 0 24 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: size * 0.8, height: size }}
  >
    <line x1="12" y1="2" x2="12" y2="28" stroke="#C5A044" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="5" y1="10" x2="19" y2="10" stroke="#C5A044" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="12" cy="10" r="1.5" fill="#C5A044" />
  </svg>
);

export const DonateCross = ({ className = '' }) => (
  <svg className={`donate-cross ${className}`} viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
    <line x1="8" y1="2" x2="8" y2="14" stroke="#C5A044" strokeWidth="2" />
    <line x1="2" y1="6" x2="14" y2="6" stroke="#C5A044" strokeWidth="2" />
  </svg>
);

export const ButtonCross = () => (
  <svg className="btn-cross" viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
    <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="2" />
    <line x1="2" y1="6" x2="14" y2="6" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const DiamondOrnament = ({ className = '' }) => (
  <svg className={`divider-ornament ${className}`} viewBox="0 0 30 16" fill="none" style={{ width: 24, height: 14 }}>
    <path d="M15 0 L20 8 L15 16 L10 8 Z" fill="#C5A044" />
    <path d="M8 6 L10 8 L8 10 L6 8 Z" fill="#C5A044" opacity="0.7" />
    <path d="M22 6 L24 8 L22 10 L20 8 Z" fill="#C5A044" opacity="0.7" />
  </svg>
);

// Service icons
export const WorshipIcon = () => (
  <svg viewBox="0 0 40 50" fill="none" style={{ width: 28, height: 28 }}>
    <line x1="20" y1="5" x2="20" y2="45" stroke="#C5A044" strokeWidth="2" />
    <line x1="10" y1="18" x2="30" y2="18" stroke="#C5A044" strokeWidth="2" />
    <circle cx="20" cy="5" r="2" fill="#C5A044" />
    <circle cx="20" cy="45" r="2" fill="#C5A044" />
    <circle cx="10" cy="18" r="2" fill="#C5A044" />
    <circle cx="30" cy="18" r="2" fill="#C5A044" />
  </svg>
);

export const TeachingIcon = () => (
  <svg viewBox="0 0 40 36" fill="none" style={{ width: 28, height: 28 }}>
    <rect x="4" y="4" width="32" height="28" rx="2" stroke="#C5A044" strokeWidth="2" fill="none" />
    <line x1="20" y1="4" x2="20" y2="32" stroke="#C5A044" strokeWidth="2" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="#C5A044" strokeWidth="1.5" />
    <line x1="8" y1="17" x2="16" y2="17" stroke="#C5A044" strokeWidth="1.5" />
    <line x1="8" y1="22" x2="16" y2="22" stroke="#C5A044" strokeWidth="1.5" />
    <line x1="24" y1="12" x2="32" y2="12" stroke="#C5A044" strokeWidth="1.5" />
    <line x1="24" y1="17" x2="32" y2="17" stroke="#C5A044" strokeWidth="1.5" />
    <line x1="24" y1="22" x2="32" y2="22" stroke="#C5A044" strokeWidth="1.5" />
  </svg>
);

export const ServingIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" style={{ width: 28, height: 28 }}>
    <path d="M10 30 Q10 20 20 15 Q30 20 30 30" stroke="#C5A044" strokeWidth="2" fill="none" />
    <path d="M20 12 Q17 8 14 10 Q11 12 14 16 L20 22 L26 16 Q29 12 26 10 Q23 8 20 12Z" stroke="#C5A044" strokeWidth="1.5" fill="none" />
    <line x1="6" y1="30" x2="14" y2="30" stroke="#C5A044" strokeWidth="2" />
    <line x1="26" y1="30" x2="34" y2="30" stroke="#C5A044" strokeWidth="2" />
  </svg>
);

export const FellowshipIcon = () => (
  <svg viewBox="0 0 44 36" fill="none" style={{ width: 28, height: 28 }}>
    <circle cx="22" cy="8" r="4" stroke="#C5A044" strokeWidth="1.5" fill="none" />
    <path d="M14 28 Q14 18 22 16 Q30 18 30 28" stroke="#C5A044" strokeWidth="1.5" fill="none" />
    <circle cx="10" cy="12" r="3" stroke="#C5A044" strokeWidth="1.5" fill="none" />
    <path d="M4 28 Q4 20 10 18" stroke="#C5A044" strokeWidth="1.5" fill="none" />
    <circle cx="34" cy="12" r="3" stroke="#C5A044" strokeWidth="1.5" fill="none" />
    <path d="M40 28 Q40 20 34 18" stroke="#C5A044" strokeWidth="1.5" fill="none" />
  </svg>
);

// Social media icons
export const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.787l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
  </svg>
);

export const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.11a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.54z" />
  </svg>
);

export const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// Mobile menu nav icons
export const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C5A044" strokeWidth="1.5" style={{ width: 22, height: 22 }}>
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0V15a1 1 0 011-1h2a1 1 0 011 1v3" />
  </svg>
);

export const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C5A044" strokeWidth="1.5" style={{ width: 22, height: 22 }}>
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const ChurchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C5A044" strokeWidth="1.5" style={{ width: 22, height: 22 }}>
    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

export const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C5A044" strokeWidth="1.5" style={{ width: 22, height: 22 }}>
    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const NewsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C5A044" strokeWidth="1.5" style={{ width: 22, height: 22 }}>
    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

export const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C5A044" strokeWidth="1.5" style={{ width: 22, height: 22 }}>
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C5A044" strokeWidth="1.5" style={{ width: 22, height: 22 }}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const GlobeIcon = ({ className = '', size = 18 }) => (
  <svg
    className={`globe-icon ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: size, height: size }}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

