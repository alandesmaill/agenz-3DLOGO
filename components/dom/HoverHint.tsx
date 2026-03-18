'use client';

import { useEffect, useState } from 'react';

interface HoverHintProps {
  isVisible: boolean;
  isDecomposed?: boolean;
  onNavigationClick?: (section: string) => void;
}

export default function HoverHint({ isVisible, isDecomposed = false }: HoverHintProps) {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'click the logo';
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Typing animation
  useEffect(() => {
    if (!isVisible || isDecomposed) {
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
    }, 80);

    return () => clearInterval(typingInterval);
  }, [isVisible, isDecomposed]);

  const hidden = !isVisible || isDecomposed;

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${
        hidden
          ? 'opacity-0 scale-75 translate-y-3 blur-sm pointer-events-none'
          : 'opacity-100 scale-100 translate-y-0 blur-none'
      }`}
    >
      <div className="bg-black text-white rounded-full flex items-center shadow-lg px-6 py-3 gap-3">
        {/* Mouse icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isTypingComplete ? 'animate-bounce' : ''}
        >
          <path
            d="M5 9a7 7 0 0 1 14 0v6a7 7 0 0 1-14 0V9Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 3v7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M5 10h14"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>

        <span className="text-sm font-medium tracking-wide">
          {displayText}
          {!isTypingComplete && <span className="animate-pulse">|</span>}
        </span>
      </div>
    </div>
  );
}
