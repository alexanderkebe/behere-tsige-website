import React, { useEffect, useState } from 'react';

/**
 * Full-screen branded loading overlay. Stays on top of the site while the
 * hero assets download, shows real progress, then fades out once `done`.
 */
export default function Preloader({ progress, done }) {
  const [hidden, setHidden] = useState(false);

  // Lock page scroll while loading.
  useEffect(() => {
    document.body.classList.toggle('no-scroll', !done);
    return () => document.body.classList.remove('no-scroll');
  }, [done]);

  // Unmount after the fade-out transition finishes.
  useEffect(() => {
    if (!done) return undefined;
    const t = setTimeout(() => setHidden(true), 800);
    return () => clearTimeout(t);
  }, [done]);

  if (hidden) return null;

  return (
    <div
      className={`preloader ${done ? 'preloader--hide' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="preloader-inner">
        <img src="/assets/logo.png" alt="" className="preloader-logo" />
        <div className="preloader-bar">
          <div className="preloader-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="preloader-pct">{progress}%</div>
      </div>
    </div>
  );
}
