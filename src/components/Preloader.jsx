import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
      <div className="preloader-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <img src="/assets/logo.png" alt="" className="preloader-logo" style={{ marginBottom: '5px' }} />
        <div className="lottie-golden" style={{ width: '130px', height: '130px' }}>
          <DotLottieReact
            src="https://lottie.host/4cb383b7-968d-4393-a253-53f10e722ec9/jrE6AvzmWd.lottie"
            loop
            autoplay
          />
        </div>
        <div className="preloader-pct" style={{ marginTop: '5px', fontSize: '1rem', fontWeight: 600, color: 'var(--navy)' }}>{progress}%</div>
      </div>
    </div>
  );
}
