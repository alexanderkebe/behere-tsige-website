'use client';

import { useEffect } from 'react';

export default function ChatBubble() {
  useEffect(() => {
    const loadCrisp = () => {
      if (window.$crisp) return;
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || "3ad9b794-c2c3-4d4b-ae7f-5d4653556d11"; // Default fallbacks or env

      (function () {
        const d = document;
        const s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
      })();
    };

    // Check if already accepted
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent');
      if (consent === 'accepted') {
        loadCrisp();
        return;
      }

      // Listen for custom event if not yet accepted
      const handleConsentAccepted = () => {
        loadCrisp();
      };

      window.addEventListener('cookie-consent-accepted', handleConsentAccepted);
      return () => {
        window.removeEventListener('cookie-consent-accepted', handleConsentAccepted);
      };
    }
  }, []);

  return null;
}
