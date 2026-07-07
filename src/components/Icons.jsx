import React from 'react';
import { 
  BookOpen, 
  HandHelping, 
  Home, 
  User, 
  Church, 
  Play, 
  Newspaper, 
  Mail, 
  Calendar, 
  Globe 
} from 'lucide-react';

// Authentic Ethiopian Orthodox Cross (Axum/Lalibela style)
export const LogoCross = ({ className = '', size = 40, ...props }) => (
  <svg
    className={`logo-cross ${className}`}
    viewBox="0 0 40 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: size * 0.8, height: size }}
    {...props}
  >
    <path d="M20 2V48M7 16H33" stroke="#C5A044" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M20 10L26 16L20 22L14 16Z" fill="none" stroke="#C5A044" strokeWidth="2" />
    <path d="M20 2C18.5 2 17 3.5 17 5C17 6.5 18.5 8 20 8C21.5 8 23 6.5 23 5C23 3.5 21.5 2 20 2Z" fill="none" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M7 16C7 14.5 5.5 13 4 13C2.5 13 1 14.5 1 16C1 17.5 2.5 19 4 19C5.5 19 7 17.5 7 16Z" fill="none" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M33 16C33 14.5 34.5 13 36 13C37.5 13 39 14.5 39 16C39 17.5 37.5 19 36 19C34.5 19 33 17.5 33 16Z" fill="none" stroke="#C5A044" strokeWidth="1.5" />
    <path d="M14 10C12 8 8 12 10 14" stroke="#C5A044" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M26 10C28 8 32 12 30 14" stroke="#C5A044" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 22C12 24 8 20 10 18" stroke="#C5A044" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M26 22C28 24 32 20 30 18" stroke="#C5A044" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Large Ethiopian Processional Cross (Gondar/Lalibela style)
export const OrnateCross = ({ className = '', ...props }) => (
  <svg
    className={className}
    viewBox="0 0 60 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: 50, height: 80 }}
    {...props}
  >
    <path d="M30 5V85M12 28H48" stroke="#C5A044" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 5C45 5 50 20 48 28C46 36 30 45 30 45" stroke="#C5A044" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M30 5C15 5 10 20 12 28C14 36 30 45 30 45" stroke="#C5A044" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M20 70L30 60L40 70L30 80Z" fill="none" stroke="#C5A044" strokeWidth="2" />
    <circle cx="30" cy="28" r="6" stroke="#C5A044" strokeWidth="2" />
    <path d="M30 22V34M24 28H36" stroke="#C5A044" strokeWidth="1.5" />
  </svg>
);

// Small Ethiopian Cross with trefoil/loop ends
export const TinyCross = ({ className = '', size = 20, ...props }) => (
  <svg
    className={`tiny-cross ${className}`}
    viewBox="0 0 24 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: size * 0.8, height: size }}
    {...props}
  >
    <path d="M12 2V28M5 10H19" stroke="#C5A044" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="10" r="1.5" fill="#C5A044" />
    <circle cx="12" cy="2" r="1.5" fill="#C5A044" />
    <circle cx="5" cy="10" r="1.5" fill="#C5A044" />
    <circle cx="19" cy="10" r="1.5" fill="#C5A044" />
  </svg>
);

// Equal arm design for UI cross buttons
export const DonateCross = ({ className = '', ...props }) => (
  <svg className={`donate-cross ${className}`} viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }} {...props}>
    <path d="M8 2V14M2 8H14" stroke="#C5A044" strokeWidth="2" strokeLinecap="round" />
    <circle cx="8" cy="8" r="1.5" fill="#C5A044" />
  </svg>
);

export const ButtonCross = (props) => (
  <svg className="btn-cross" viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }} {...props}>
    <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DiamondOrnament = ({ className = '', ...props }) => (
  <svg className={`divider-ornament ${className}`} viewBox="0 0 30 16" fill="none" style={{ width: 24, height: 14 }} {...props}>
    <path d="M15 0 L20 8 L15 16 L10 8 Z" fill="#C5A044" />
    <path d="M8 6 L10 8 L8 10 L6 8 Z" fill="#C5A044" opacity="0.7" />
    <path d="M22 6 L24 8 L22 10 L20 8 Z" fill="#C5A044" opacity="0.7" />
  </svg>
);

// Custom Censer (Incense Burner) Icon for Liturgy & Worship
export const WorshipIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C5A044"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 28, height: 28 }}
    {...props}
  >
    {/* Chains */}
    <path d="M12 2v9" />
    <path d="M7 3l2 8" />
    <path d="M17 3l-2 8" />
    
    {/* Lid with small cross */}
    <path d="M9 11c0-2.5 6-2.5 6 0" />
    <path d="M12 6.5v2M11 7.5h2" />
    
    {/* Censer Bowl Body */}
    <path d="M5 11h14v2H5z" />
    <path d="M6 13c0 3.5 2.5 6 6 6s6-2.5 6-6" />
    
    {/* Foot/Pedestal */}
    <path d="M10 19l-1 3h6l-1-3" />
    
    {/* Little bells/ornaments on chains */}
    <circle cx="8" cy="7" r="1.2" fill="#C5A044" stroke="none" />
    <circle cx="12" cy="5" r="1.2" fill="#C5A044" stroke="none" />
    <circle cx="16" cy="7" r="1.2" fill="#C5A044" stroke="none" />
  </svg>
);
export const TeachingIcon = (props) => <BookOpen stroke="#C5A044" strokeWidth={2} style={{ width: 28, height: 28 }} {...props} />;
export const ServingIcon = (props) => <HandHelping stroke="#C5A044" strokeWidth={2} style={{ width: 28, height: 28 }} {...props} />;
// Custom Church Podium (Lectern/Pulpit) Icon for Gospel & Sermons
export const FellowshipIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#C5A044"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 28, height: 28 }}
    {...props}
  >
    {/* Open Book/Bible on top */}
    <path d="M12 5c-1-1-2.5-1-3-1H5v3h4c.5 0 2 0 3 1" />
    <path d="M12 5c1-1 2.5-1 3-1h4v3h-4c-.5 0-2 0-3 1" />
    
    {/* Lectern Slanted Stand */}
    <path d="M4 8h16" />
    
    {/* Central Pillar */}
    <path d="M10 8v11" />
    <path d="M14 8v11" />
    
    {/* Decorative Cross on the Pillar */}
    <path d="M12 11v4" />
    <path d="M10.5 12.5h3" />
    
    {/* Base */}
    <path d="M6 19h12" />
    <path d="M4 21h16" />
  </svg>
);

// Custom Social Media Icons (since Lucide React does not export brand icons)
export const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }} {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }} {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }} {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const TelegramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }} {...props}>
    <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.787l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
  </svg>
);

export const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }} {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }} {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.11a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.54z" />
  </svg>
);

// Mobile menu nav icons routed to Lucide React
export const HomeIcon = (props) => <Home stroke="#C5A044" strokeWidth={1.5} style={{ width: 22, height: 22 }} {...props} />;
export const PersonIcon = (props) => <User stroke="#C5A044" strokeWidth={1.5} style={{ width: 22, height: 22 }} {...props} />;
export const ChurchIcon = (props) => <Church stroke="#C5A044" strokeWidth={1.5} style={{ width: 22, height: 22 }} {...props} />;
export const PlayIcon = (props) => <Play stroke="#C5A044" strokeWidth={1.5} style={{ width: 22, height: 22 }} {...props} />;
export const NewsIcon = (props) => <Newspaper stroke="#C5A044" strokeWidth={1.5} style={{ width: 22, height: 22 }} {...props} />;
export const MailIcon = (props) => <Mail stroke="#C5A044" strokeWidth={1.5} style={{ width: 22, height: 22 }} {...props} />;
export const CalendarIcon = (props) => <Calendar stroke="#C5A044" strokeWidth={1.5} style={{ width: 22, height: 22 }} {...props} />;
export const GlobeIcon = ({ size = 18, ...props }) => <Globe stroke="currentColor" strokeWidth={1.8} style={{ width: size, height: size }} {...props} />;
