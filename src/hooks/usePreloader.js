import { useEffect, useState } from 'react';
import { setCachedAsset } from '../lib/assetCache';

/**
 * Preloads only what the CURRENT page needs before the splash lifts: the web
 * fonts, the shared logo, and this page's hero video. Nothing else — other
 * pages' videos and content images load on demand after the site is visible.
 *
 * - The splash can never outstay its welcome: a hard cap (MAX_SPLASH_MS)
 *   reveals the site even if the video is still downloading; the hero
 *   <video> element then streams it normally.
 * - On slow connections (Save-Data or 2G) the video wait is skipped entirely
 *   so low-bandwidth users see the site immediately.
 * - A fully downloaded video is kept as a blob object URL in the asset cache
 *   so the hero plays instantly with no second download.
 *
 * The whole run is a module-level singleton, so it happens exactly once per
 * page load no matter how many components mount the hook.
 */

// Longest the splash may stay up, even if downloads are unfinished.
const MAX_SPLASH_MS = 4000;

// Home hero (three tiers — must match Hero.jsx)
const HOME_VIDEOS = {
  large: '/assets/hero-home-pc.mp4',
  tablet: '/assets/hero-home-pc.mp4',
  phone: '/assets/home-hero-mobile.mp4',
};

// Hero video per route prefix, desktop + mobile (must match the screens)
const ROUTE_VIDEOS = {
  '/services': { desktop: '/assets/services-hero-pc.mp4', mobile: '/assets/services-hero-mobile.mp4' },
  '/articles': { desktop: '/assets/article-hero-pc.mp4', mobile: '/assets/article-hero-mobile.mp4' },
  '/events': { desktop: '/assets/events-hero-pc.mp4', mobile: '/assets/events-hero-mobile.mp4' },
  '/media': { desktop: '/assets/media-hero-pc.mp4', mobile: '/assets/media-hero-mobile.mp4' },
  '/donate': { desktop: '/assets/donate-hero-pc.mp4', mobile: '/assets/donate-hero-mobile.mp4' },
  '/contact': { desktop: '/assets/contact-hero-pc.mp4', mobile: '/assets/contact-hero-mobile.mp4' },
};

const LARGE_QUERY = '(min-width: 1181px)';
const PHONE_QUERY = '(max-width: 752px)';
const PAGE_MOBILE_QUERY = '(max-width: 768px)';

/** The hero video the current page will actually play, or null. */
function currentPageVideo() {
  const path = window.location.pathname;
  if (path === '/') {
    const isLarge = window.matchMedia(LARGE_QUERY).matches;
    const isPhone = window.matchMedia(PHONE_QUERY).matches;
    return isLarge ? HOME_VIDEOS.large : isPhone ? HOME_VIDEOS.phone : HOME_VIDEOS.tablet;
  }
  const entry = Object.entries(ROUTE_VIDEOS).find(([prefix]) => path.startsWith(prefix));
  if (!entry) return null;
  const mobile = window.matchMedia(PAGE_MOBILE_QUERY).matches;
  return mobile ? entry[1].mobile : entry[1].desktop;
}

/** True when the visitor asked for less data or is on a very slow link. */
function isConstrainedConnection() {
  const conn = navigator.connection;
  if (!conn) return false;
  return conn.saveData === true || /(^|-)2g/.test(conn.effectiveType || '');
}

/* ---------- singleton run (once per page load) ---------- */

let run = null;

function startRun() {
  const state = {
    progress: 0,
    done: false,
    listeners: new Set(),
  };

  const notify = () => {
    for (const l of state.listeners) l();
  };

  const tasks = [];
  const newTask = (weight) => {
    const t = { weight, fraction: 0 };
    tasks.push(t);
    return t;
  };

  const update = () => {
    if (state.done) return;
    const totalWeight = tasks.reduce((s, t) => s + t.weight, 0) || 1;
    const acc = tasks.reduce((s, t) => s + t.weight * t.fraction, 0);
    state.progress = Math.min(100, Math.round((acc / totalWeight) * 100));
    notify();
  };

  const loadImage = (src) => {
    const task = newTask(1);
    return new Promise((resolve) => {
      const img = new Image();
      const finish = () => {
        task.fraction = 1;
        update();
        resolve();
      };
      img.onload = finish;
      img.onerror = finish; // a missing image must never stall the splash
      img.src = src;
    });
  };

  // Stream the video with byte-level progress; keep it as a blob object URL
  // so the hero plays instantly. Aborted by the reveal cap — the <video> tag
  // streams it normally in that case.
  const abort = new AbortController();
  const loadVideo = (src) => {
    const task = newTask(6);
    return fetch(src, { signal: abort.signal })
      .then((res) => {
        if (!res.ok || !res.body) throw new Error(`bad response for ${src}`);
        const total = Number(res.headers.get('Content-Length')) || 0;
        const reader = res.body.getReader();
        const chunks = [];
        let received = 0;
        const pump = () =>
          reader.read().then(({ done: streamDone, value }) => {
            if (streamDone) {
              return new Blob(chunks, {
                type: res.headers.get('Content-Type') || 'video/mp4',
              });
            }
            chunks.push(value);
            received += value.length;
            if (total) task.fraction = Math.min(1, received / total);
            update();
            return pump();
          });
        return pump();
      })
      .then((blob) => {
        setCachedAsset(src, URL.createObjectURL(blob));
        task.fraction = 1;
        update();
      })
      .catch(() => {
        // Give up gracefully; never hold the site hostage.
        task.fraction = 1;
        update();
      });
  };

  const loadFonts = () => {
    const task = newTask(1);
    const ready =
      typeof document !== 'undefined' && document.fonts?.ready
        ? document.fonts.ready
        : Promise.resolve();
    return ready.catch(() => {}).then(() => {
      task.fraction = 1;
      update();
    });
  };

  const finish = () => {
    if (state.done) return;
    state.progress = 100;
    state.done = true;
    notify();
  };

  const jobs = [loadImage('/assets/logo.png'), loadFonts()];

  const video = currentPageVideo();
  if (video && !isConstrainedConnection()) jobs.push(loadVideo(video));

  // Reveal when everything critical is ready — after a brief beat so the
  // user actually sees 100% — or when the cap fires, whichever comes first.
  const cap = setTimeout(() => {
    abort.abort();
    finish();
  }, MAX_SPLASH_MS);

  Promise.all(jobs).then(() => {
    clearTimeout(cap);
    state.progress = 100;
    notify();
    setTimeout(finish, 300);
  });

  return state;
}

export function usePreloader() {
  const [, force] = useState(0);

  useEffect(() => {
    if (!run) run = startRun();
    const listener = () => force((n) => n + 1);
    run.listeners.add(listener);
    listener();
    return () => run.listeners.delete(listener);
  }, []);

  return {
    progress: run ? run.progress : 0,
    done: run ? run.done : false,
  };
}
