import { useState, useEffect } from 'react';

/**
 * Preloads the critical hero assets before the site is revealed.
 *
 * - Only the asset that the current screen actually needs is downloaded:
 *   the looping video on large screens, the matching still image on
 *   tablet / mobile. Phones never pull the heavy video.
 * - Progress is driven by real downloaded bytes (via the streamed fetch)
 *   so slow connections see an honest progress bar.
 * - The video is downloaded once and handed back as an object URL, so the
 *   hero plays instantly with no second download.
 * - A safety timeout guarantees the user is never trapped behind the loader.
 */
const VIDEO_SRC = '/assets/hero-video-desktop.mp4';
const LARGE_QUERY = '(min-width: 1181px)';
const SAFETY_TIMEOUT = 20000;

export function usePreloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let createdUrl = null;

    const isLarge = window.matchMedia(LARGE_QUERY).matches;

    // Pick the one hero still that matches this screen.
    const heroImage = window.matchMedia('(max-width: 752px)').matches
      ? '/assets/hero-mobile.png'
      : window.matchMedia('(max-width: 1180px)').matches
        ? '/assets/hero-tablet.png'
        : '/assets/background.png';

    const imageSources = [heroImage, '/assets/logo.png'];

    // Weighted tasks so the big video dominates the progress bar honestly.
    const tasks = imageSources.map(() => ({ weight: 1, fraction: 0 }));
    const videoTask = isLarge ? { weight: 6, fraction: 0 } : null;
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

    const loadVideo = (src, task) =>
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
        .catch(() => {
          // Fall back to the poster image if the video can't be fetched.
          task.fraction = 1;
          update();
        });

    const jobs = imageSources.map((src, i) => loadImage(src, tasks[i]));
    if (videoTask) jobs.push(loadVideo(VIDEO_SRC, videoTask));

    const safety = setTimeout(() => {
      if (cancelled) return;
      if (createdUrl) setVideoSrc(createdUrl);
      setProgress(100);
      setDone(true);
    }, SAFETY_TIMEOUT);

    Promise.all(jobs).then(() => {
      if (cancelled) return;
      clearTimeout(safety);
      if (createdUrl) setVideoSrc(createdUrl);
      setProgress(100);
      // Brief beat so the user actually sees 100%.
      setTimeout(() => {
        if (!cancelled) setDone(true);
      }, 300);
    });

    return () => {
      cancelled = true;
      clearTimeout(safety);
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, []);

  return { progress, done, videoSrc };
}
