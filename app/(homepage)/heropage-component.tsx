'use client'

import React, { useState, useEffect } from "react";

const TypewriterText = ({ text, delay = 100 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="text-3xl font-bold text-white">
      {displayText}
      {showCursor && currentIndex < text.length && <span className="animate-pulse">|</span>}
    </span>
  );
};

export function WavyBackgroundDemo() {
  return (
    <div className="h-[90vh] bg-black flex items-center justify-center relative overflow-hidden">
        <TypewriterText text="why not?" delay={150} />
    </div>
  );
}