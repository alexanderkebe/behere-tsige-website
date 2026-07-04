'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track, flush } from '@/lib/analytics';

/**
 * Site-wide interaction recorder. Mounted once in Providers, it captures:
 *  - page_view on every route change
 *  - click on any link or button (label + destination)
 *  - form_submit on any form (form name/id, never field values)
 * Admin pages are excluded so staff activity doesn't pollute analytics.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // Page views
  useEffect(() => {
    if (!pathname || isAdmin) return;
    track('page_view');
  }, [pathname, isAdmin]);

  // Clicks + form submits + flush on leave
  useEffect(() => {
    if (isAdmin) return;

    const onClick = (e) => {
      const el = e.target.closest('a, button');
      if (!el) return;
      const label = (el.getAttribute('aria-label') || el.textContent || '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 120);
      const meta = { label, tag: el.tagName.toLowerCase() };
      const href = el.getAttribute('href');
      if (href) meta.href = href.slice(0, 300);
      if (el.id) meta.id = el.id;
      track('click', meta);
    };

    const onSubmit = (e) => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      track('form_submit', {
        form: form.getAttribute('name') || form.id || form.className.split(' ')[0] || 'form',
        action: (form.getAttribute('action') || '').slice(0, 200),
      });
      flush();
    };

    const onHide = () => flush(true);
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') onHide();
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('submit', onSubmit, true);
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('submit', onSubmit, true);
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isAdmin]);

  return null;
}
