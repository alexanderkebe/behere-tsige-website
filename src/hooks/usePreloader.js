import { useState, useEffect } from 'react';

/**
 * Preloads the critical hero assets before the site is revealed.
 *
 * - Only the asset that the current screen actually needs is downloaded:
 *   the desktop video on large screens, the tablet video on tablets, and the
 *   mobile video on phones. Each screen pulls exactly one video.
 * - Progress is driven by real downloaded bytes (via the streamed fetch)
 *   so slow connections see an honest progress bar.
 * - The video is downloaded once and handed back as an object URL, so the
 *   hero plays instantly with no second download.
 * - Videos only: if a fetch fails it retries until it succeeds, so the hero
 *   never falls back to a still image.
 */
const DESKTOP_VIDEO_SRC = '/assets/hero-video-desktop.mp4';
const TABLET_VIDEO_SRC = '/assets/hero-tablet-video.mp4';
const MOBILE_VIDEO_SRC = '/assets/hero-mobile.mp4';
const LARGE_QUERY = '(min-width: 1181px)';
const PHONE_QUERY = '(max-width: 752px)';

export function usePreloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let createdUrl = null;

    const isLarge = window.matchMedia(LARGE_QUERY).matches;
    const isPhone = window.matchMedia(PHONE_QUERY).matches;

    // Each screen tier gets its own looping video. Videos only — the hero
    // never falls back to a still image, so no poster is preloaded.
    const videoToLoad = isLarge
      ? DESKTOP_VIDEO_SRC
      : isPhone
        ? MOBILE_VIDEO_SRC
        : TABLET_VIDEO_SRC;

    const imageSources = ['/assets/logo.png'];

    // Weighted tasks so the big video dominates the progress bar honestly.
    const tasks = imageSources.map(() => ({ weight: 1, fraction: 0 }));
    const videoTask = videoToLoad ? { weight: 6, fraction: 0 } : null;
    if (videoTask) tasks.push(videoTask);

    const totalWeight = tasks.reduce((sum, t) => sum + t.weight, 0);
    const update = () => {
      if (cancelled) return;
      const acc = tasks.reduce((sum, t) => sum + t.weight * t.fraction, 0);
      setProgress(Math.min(100, Math.round((acc / totalWeight) * 100)));
    };

    const loadImage = (src, task) =>
      new Promise((resolve) => {
        const img = new Image();
        const finish = () => {
          task.fraction = 1;
          update();
          resolve();
        };
        img.onload = finish;
        img.onerror = finish; // never stall on a missing asset
        img.src = src;
      });

    // Fetch the video with unlimited retries: the hero shows video only, so
    // the loader simply keeps trying until the download succeeds.
    const loadVideo = (src, task) => {
      const attempt = () =>
        fetch(src)
          .then((res) => {
            if (!res.ok || !res.body) throw new Error('bad video response');
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
                task.fraction = total ? Math.min(1, received / total) : task.fraction;
                update();
                return pump();
              });
            return pump();
          })
          .then((blob) => {
            createdUrl = URL.createObjectURL(blob);
            task.fraction = 1;
            update();
          })
          .catch(
            () =>
              new Promise((resolve) => {
                if (cancelled) return resolve();
                // Reset partial progress and retry after a short pause.
                task.fraction = 0;
                update();
                setTimeout(() => resolve(cancelled ? undefined : attempt()), 2000);
              })
          );
      return attempt();
    };

    const jobs = imageSources.map((src, i) => loadImage(src, tasks[i]));
    if (videoTask) jobs.push(loadVideo(videoToLoad, videoTask));

    Promise.all(jobs).then(() => {
      if (cancelled) return;
      if (createdUrl) setVideoSrc(createdUrl);
      setProgress(100);
      // Brief beat so the user actually sees 100%.
      setTimeout(() => {
        if (!cancelled) setDone(true);
      }, 300);
    });

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, []);

  return { progress, done, videoSrc };
}
