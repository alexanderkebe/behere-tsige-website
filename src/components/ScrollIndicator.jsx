'use client';

import React, { useState, useEffect } from 'react';

export default function ScrollIndicator() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect if the device has a coarse pointer (touch screen)
    const checkTouch = () => {
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      const hasTouchPoints = navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasCoarsePointer || hasTouchPoints);
    };
    checkTouch();
  }, []);

  return (
    <div className="scroll-indicator-container">
      {isTouchDevice ? (
        <div className="scroll-indicator-finger-wrapper">
          <div className="scroll-indicator-finger-container">
            <div className="scroll-indicator-finger-dot"></div>
            <svg 
              width="26" 
              height="36" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="scroll-indicator-finger"
            >
              <path d="M12 11V3a1 1 0 0 1 2 0v8M14 11V8.5a1 1 0 0 1 2 0V11M16 11V9a1 1 0 0 1 2 0v2M10 11V6a1 1 0 0 1 2 0v5M8 11v4c0 2.5 2 4.5 4.5 4.5h2.5c2.5 0 4.5-2 4.5-4.5V11a1 1 0 0 0-1-1h-12a1 1 0 0 0-1 1z" />
            </svg>
          </div>
          <span className="scroll-indicator-text">Swipe to Explore</span>
        </div>
      ) : (
        <div className="scroll-indicator-mouse-wrapper">
          <div className="scroll-indicator-mouse"></div>
          <span className="scroll-indicator-text">Scroll to Explore</span>
        </div>
      )}
    </div>
  );
}
