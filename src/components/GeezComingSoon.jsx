'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function GeezComingSoon() {
  const { lang, setLang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lang === 'gez') {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [lang]);

  if (!visible) return null;

  const t = {
    title: 'ግዕዝ በሂደት ላይ ነው',
    desc: 'የግዕዝ ትርጉም አገልግሎት በቅርቡ ይጠናቀቃል። እስከዚያው ድረስ ገጹ በአማርኛ ቋንቋ ይቀርብልዎታል።',
    titleEn: 'Ge\'ez Support Coming Soon',
    descEn: 'The Ge\'ez translation is currently in progress. In the meantime, the content will be displayed in Amharic.',
    action: 'ወደ አማርኛ ተመለስ',
    actionEn: 'Switch to Amharic',
    close: 'እሺ'
  };

  const handleReturnToAm = () => {
    setLang('am');
  };

  return (
    <div className="geez-coming-soon-banner" style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 48px)',
      maxWidth: '560px',
      background: '#FAF7F0',
      color: '#0F1B3D',
      padding: '24px',
      borderRadius: '12px',
      border: '2px solid #C5A044',
      boxShadow: '0 15px 45px rgba(9, 16, 38, 0.25)',
      zIndex: 999999,
      fontFamily: 'var(--font-ui, sans-serif)',
      animation: 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUpFade {
          from { transform: translate(-50%, 30px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>⏳</span>
          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#0F1B3D', fontFamily: 'var(--font-heading, serif)' }}>
            {t.title} / {t.titleEn}
          </h4>
        </div>

        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: '#5A5A6A' }}>
          {t.desc}
        </p>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: '#5A5A6A', borderTop: '1px solid rgba(197, 160, 68, 0.15)', paddingTop: '10px' }}>
          {t.descEn}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
          <button
            onClick={handleReturnToAm}
            style={{
              background: 'transparent',
              border: '1px solid #C5A044',
              color: '#A47E2F',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.target.style.background = 'rgba(197, 160, 68, 0.05)'; }}
            onMouseOut={(e) => { e.target.style.background = 'transparent'; }}
          >
            {t.action} / {t.actionEn}
          </button>
          
          <button
            onClick={() => setVisible(false)}
            style={{
              background: '#0F1B3D',
              border: 'none',
              color: '#FFFFFF',
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.target.style.background = '#162550'; }}
            onMouseOut={(e) => { e.target.style.background = '#0F1B3D'; }}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
