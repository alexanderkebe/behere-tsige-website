'use client';

/**
 * Lightweight visitor analytics. Events are queued and flushed in batches to
 * /api/track (sendBeacon on page hide so nothing is lost on navigation).
 * Every interaction on the site funnels through track():
 *   page_view, click, form_submit, language_switch, chat_message, …
 */

const SESSION_KEY = 'bt_session_id';
const FLUSH_MS = 4000;
const MAX_BATCH = 20;

let queue = [];
let timer = null;
let currentLang = 'en';

export function setAnalyticsLang(lang) {
  currentLang = lang;
}

export function getSessionId() {
  if (typeof window === 'undefined') return null;
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'no-storage';
  }
}

function send(events, useBeacon) {
  if (events.length === 0) return;
  const payload = JSON.stringify({ events });
  try {
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
      return;
    }
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never break the site */
  }
}

export function flush(useBeacon = false) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  const batch = queue.splice(0, queue.length);
  send(batch, useBeacon);
}

/** Record one interaction. Safe to call anywhere on the client. */
export function track(type, meta = {}) {
  if (typeof window === 'undefined') return;
  queue.push({
    type,
    page: window.location.pathname + window.location.hash,
    sessionId: getSessionId(),
    lang: currentLang,
    referrer: document.referrer || '',
    meta,
  });
  if (queue.length >= MAX_BATCH) flush();
  else if (!timer) timer = setTimeout(() => flush(), FLUSH_MS);
}
