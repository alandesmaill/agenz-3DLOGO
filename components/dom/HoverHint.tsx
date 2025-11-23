'use client';

import { useEffect, useState } from 'react';

interface HoverHintProps {
  isVisible: boolean;
}

export default function HoverHint({ isVisible }: HoverHintProps) {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'hover the logo';
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (!isVisible) {
      setDisplayText('');
      setIsTypingComplete(false);
      return;
    }

    let currentIndex = 0;
    setDisplayText('');
    setIsTypingComplete(false);

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 80); // Typing speed

    return () => clearInterval(typingInterval);
  }, [isVisible]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-lg">
        {/* Cursor/Pointer Icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${isTypingComplete ? 'animate-bounce' : ''}`}
        >
          <path
            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
            fill="currentColor"
          />
        </svg>

        {/* Typing Text */}
        <span className="text-sm font-medium tracking-wide">
          {displayText}
          {!isTypingComplete && (
            <span className="animate-pulse">|</span>
          )}
        </span>
      </div>
    </div>
  );
}
