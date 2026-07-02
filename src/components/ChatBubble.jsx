'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const CRISP_WEBSITE_ID =
  process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || 'e20af823-5e2f-431a-810a-ff799e285ad8';

export default function ChatBubble() {
  const { lang } = useLanguage();
  // Ge'ez falls back to Amharic; anything else is English.
  const locale = lang === 'en' ? 'en' : 'am';

  useEffect(() => {
    const loadCrisp = () => {
      const existing = document.getElementById('crisp-chat-script');
      if (existing) {
        // Locale changed after load: tear the widget down and reboot it
        // in the new language (Crisp reads the locale only at boot).
        existing.remove();
        document.querySelector('.crisp-client')?.remove();
        delete window.$crisp;
      }

      window.CRISP_RUNTIME_CONFIG = { locale };
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

      const s = document.createElement('script');
      s.id = 'crisp-chat-script';
      s.src = 'https://client.crisp.chat/l.js';
      s.async = 1;
      document.getElementsByTagName('head')[0].appendChild(s);
    };

    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent');
      if (consent === 'accepted') {
        loadCrisp();
        return undefined;
      }

      const handleConsentAccepted = () => loadCrisp();
      window.addEventListener('cookie-consent-accepted', handleConsentAccepted);
      return () => window.removeEventListener('cookie-consent-accepted', handleConsentAccepted);
    }
    return undefined;
  }, [locale]);

  return null;
}
