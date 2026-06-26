'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function CookieConsent() {
  const { lang } = useLanguage();
  const isAm = lang === 'am';
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const choice = localStorage.getItem('cookie-consent');
    if (!choice) {
      // Show banner after a slight delay
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cookie-consent-accepted'));
    }
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  const t = {
    text: isAm 
      ? 'ይህ ድረ-ገጽ የተሻለ አገልግሎት ለመስጠት ኩኪዎችን (cookies) ይጠቀማል። ገጻችንን በመጠቀም በኩኪዎች አጠቃቀማችን ተስማምተዋል።' 
      : 'This website uses cookies to ensure you get the best experience on our website. By continuing to browse, you agree to our use of cookies.',
    accept: isAm ? 'እስማማለሁ' : 'Accept',
    decline: isAm ? 'አልስማማም' : 'Decline'
  };

  return (
    <div className="cookie-consent-banner" style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      right: '24px',
      maxWidth: '480px',
      background: '#0F1B3D',
      color: '#FFFFFF',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid rgba(197, 160, 68, 0.3)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'var(--font-ui, sans-serif)',
      animation: 'slideUp 0.4s ease-out'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
      <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: '1.6', color: 'rgba(248, 246, 240, 0.9)' }}>
        {t.text}
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button 
          onClick={decline}
          style={{
            background: 'transparent',
            border: '1px solid rgba(248, 246, 240, 0.4)',
            color: 'rgba(248, 246, 240, 0.8)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.target.style.background = 'rgba(248, 246, 240, 0.05)'; }}
          onMouseOut={(e) => { e.target.style.background = 'transparent'; }}
        >
          {t.decline}
        </button>
        
        <button 
          onClick={accept}
          style={{
            background: '#C5A044',
            border: 'none',
            color: '#FFFFFF',
            padding: '8px 20px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(197, 160, 68, 0.25)',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.target.style.background = '#d4b865'; }}
          onMouseOut={(e) => { e.target.style.background = '#C5A044'; }}
        >
          {t.accept}
        </button>
      </div>
    </div>
  );
}
