'use client';

import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { label: 'About', section: 'about' },
  { label: 'Works', section: 'works' },
  { label: 'Services', section: 'services' },
  { label: 'Contact', section: 'contact' },
];

interface HoverHintProps {
  isVisible: boolean;
  isDecomposed?: boolean;
  onNavigationClick?: (section: string) => void;
}

export default function HoverHint({ isVisible, isDecomposed = false, onNavigationClick }: HoverHintProps) {
  const [displayText, setDisplayText] = useState('');
  const fullText = 'click the logo';
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [navReady, setNavReady] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (!isVisible) {
      setDisplayText('');
      setIsTypingComplete(false);
      return;
    }

    // Skip typing if already decomposed
    if (isDecomposed) return;

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
  }, [isVisible, isDecomposed]);

  // Transition from hint mode to nav mode
  useEffect(() => {
    if (!isDecomposed) {
      setShowNav(false);
      setNavReady(false);
      return;
    }

    // Wait for hint text fade-out, then swap to nav
    const swapTimer = setTimeout(() => {
      setShowNav(true);
      // Trigger staggered entrance after mount
      requestAnimationFrame(() => {
        setNavReady(true);
      });
    }, 400);

    return () => clearTimeout(swapTimer);
  }, [isDecomposed]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-black text-white rounded-full flex items-center shadow-lg overflow-hidden">
        {/* Hint mode */}
        {!showNav && (
          <div
            className={`px-6 py-3 flex items-center gap-3 transition-all duration-300 ${
              isDecomposed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {/* Cursor/Pointer Icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`${isTypingComplete ? 'animate-bounce' : ''}`}
            >
              {/* Mouse body */}
              <path
                d="M5 9a7 7 0 0 1 14 0v6a7 7 0 0 1-14 0V9Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              {/* Center divider line */}
              <path
                d="M12 3v7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Left/right click divider */}
              <path
                d="M5 10h14"
                stroke="currentColor"
                strokeWidth="1.5"
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
        )}

        {/* Nav mode */}
        {showNav && (
          <div className="flex items-center gap-1 px-2 py-1.5">
            {NAV_ITEMS.map((item, index) => (
              <button
                key={item.section}
                onClick={() => onNavigationClick?.(item.section)}
                className="px-4 py-2.5 text-sm font-medium tracking-wide text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                style={{
                  opacity: navReady ? 1 : 0,
                  transform: navReady ? 'translateY(0)' : 'translateY(8px)',
                  transition: `opacity 300ms ${index * 80}ms, transform 300ms ${index * 80}ms`,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
