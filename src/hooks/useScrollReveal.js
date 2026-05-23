import { useLayoutEffect, useRef, useState } from 'react';

function isElementInView(el, margin = 80) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh - margin && rect.bottom > margin;
}

export function useScrollReveal({
  threshold = 0.08,
  rootMargin = '80px 0px 80px 0px',
  once = true,
} = {}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setReady(true);
      setVisible(true);
      setDone(true);
      return;
    }

    setReady(true);

    if (isElementInView(el)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!visible || done || !el) return;

    const delay = parseInt(getComputedStyle(el).getPropertyValue('--reveal-delay'), 10) || 0;
    const duration = 650;
    const timer = setTimeout(() => setDone(true), delay + duration + 50);

    return () => clearTimeout(timer);
  }, [visible, done]);

  return [ref, { ready, visible, done }];
}
