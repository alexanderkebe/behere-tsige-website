import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Reveal({
  children,
  className = '',
  delay: delayProp = 0,
  direction = 'up',
  as: Tag = 'div',
  threshold,
  rootMargin,
  once,
  ...rest
}) {
  const delay = Math.min(delayProp, 200);
  const [ref, { ready, visible, done }] = useScrollReveal({ threshold, rootMargin, once });

  const classes = [
    'reveal',
    `reveal-${direction}`,
    ready ? 'reveal-ready' : '',
    visible ? 'reveal-visible' : '',
    done ? 'reveal-done' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
