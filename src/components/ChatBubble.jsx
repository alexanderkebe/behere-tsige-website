'use client';

import { useEffect } from 'react';

export default function ChatBubble() {
  useEffect(() => {
    // If Crisp is already loaded, don't reload it
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
  }, []);

  return null;
}
