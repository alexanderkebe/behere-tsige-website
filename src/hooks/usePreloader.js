import { useEffect, useState } from 'react';
import { setCachedAsset } from '../lib/assetCache';

/**
 * Preloads EVERY page's critical assets before the site is revealed — the
 * hero videos of all pages, the logos and shared images, every image found in
 * the site content (galleries, news…), the donate animation, and the web
 * fonts. The splash screen stays up until all of it has arrived.
 *
 * - Screen-aware: each device downloads only the video variant it will play
 *   (desktop vs tablet vs mobile), for every page.
 * - Progress is driven by real downloaded bytes for the videos (streamed
 *   fetch), so slow connections see an honest bar.
 * - Videos are kept as blob object URLs in the asset cache; the hero of each
 *   page plays instantly with no second download.
 * - Nothing can hang the splash forever: videos retry a few times and then
 *   yield, images/fonts/animations count as done even on error.
 *
 * The whole run is a module-level singleton, so it happens exactly once per
 * page load no matter how many components mount the hook.
 */

// Home hero (three tiers — must match Hero.jsx)
const HOME_VIDEOS = {
  large: '/assets/hero-home-pc.mp4',
  tablet: '/assets/hero-home-pc.mp4',
  phone: '/assets/home-hero-mobile.mp4',
};

// Every other page's hero video, desktop + mobile (must match the screens)
const PAGE_VIDEOS = [
  { desktop: '/assets/services-hero-pc.mp4', mobile: '/assets/services-hero-mobile.mp4' },
  { desktop: '/assets/article-hero-pc.mp4', mobile: '/assets/article-hero-mobile.mp4' },
  { desktop: '/assets/events-hero-pc.mp4', mobile: '/assets/events-hero-mobile.mp4' },
  { desktop: '/assets/media-hero-pc.mp4', mobile: '/assets/media-hero-mobile.mp4' },
  { desktop: '/assets/donate-hero-pc.mp4', mobile: '/assets/donate-hero-mobile.mp4' },
  { desktop: '/assets/contact-hero-pc.mp4', mobile: '/assets/contact-hero-mobile.mp4' },
];

// Shared images referenced directly in components
const STATIC_IMAGES = [
  '/assets/logo.png',
  '/assets/logo-footer.png',
  '/assets/profile-pic-preist.png',
  '/assets/crisp-avatar.png',
];

// The donate page's Lottie animation
const EXTRA_FETCHES = [
  'https://lottie.host/4cb383b7-968d-4393-a253-53f10e722ec9/jrE6AvzmWd.lottie',
];

const LARGE_QUERY = '(min-width: 1181px)';
const PHONE_QUERY = '(max-width: 752px)';
const PAGE_MOBILE_QUERY = '(max-width: 768px)';

const IMAGE_RE = /\.(png|jpe?g|webp|gif|svg|avif)$/i;

/** Walk any JSON value and collect /assets/ image paths (content galleries…). */
function collectContentImages(value, out) {
  if (typeof value === 'string') {
    if (value.startsWith('/assets/') && IMAGE_RE.test(value)) out.add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) collectContentImages(v, out);
    return;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectContentImages(v, out);
  }
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

  // Stream a video with byte-level progress; keep it as a blob object URL so
  // the page's hero plays instantly. A few retries, then give up gracefully
  // (the <video> tag will stream it normally instead).
  const loadVideo = (src) => {
    const task = newTask(6);
    const attempt = (attemptsLeft) =>
      fetch(src)
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
          if (attemptsLeft <= 0) {
            // Give up on caching this one; don't hold the whole site hostage.
            task.fraction = 1;
            update();
            return undefined;
          }
          task.fraction = 0;
          update();
          return new Promise((resolve) =>
            setTimeout(() => resolve(attempt(attemptsLeft - 1)), 1500)
          );
        });
    return attempt(3);
  };

  const loadFetch = (url) => {
    const task = newTask(1);
    return fetch(url)
      .then((res) => res.blob())
      .catch(() => {})
      .then(() => {
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

  // Site content: wait for it AND harvest every image it references.
  const loadContentImages = () => {
    const task = newTask(1);
    return fetch('/api/content')
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((content) => {
        task.fraction = 1;
        update();
        if (!content) return undefined;
        const found = new Set();
        collectContentImages(content, found);
        for (const src of STATIC_IMAGES) found.delete(src); // already queued
        return Promise.all([...found].map((src) => loadImage(src)));
      });
  };

  const isLarge = window.matchMedia(LARGE_QUERY).matches;
  const isPhone = window.matchMedia(PHONE_QUERY).matches;
  const pageMobile = window.matchMedia(PAGE_MOBILE_QUERY).matches;

  const videos = [
    isLarge ? HOME_VIDEOS.large : isPhone ? HOME_VIDEOS.phone : HOME_VIDEOS.tablet,
    ...PAGE_VIDEOS.map((v) => (pageMobile ? v.mobile : v.desktop)),
  ];

  const jobs = [
    ...STATIC_IMAGES.map(loadImage),
    ...videos.map(loadVideo),
    ...EXTRA_FETCHES.map(loadFetch),
    loadFonts(),
    loadContentImages(),
  ];

  Promise.all(jobs).then(() => {
    state.progress = 100;
    notify();
    // Brief beat so the user actually sees 100%.
    setTimeout(() => {
      state.done = true;
      notify();
    }, 300);
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
