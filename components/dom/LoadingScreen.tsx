'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  progress: number;
  isLoaded: boolean;
}

export default function LoadingScreen({ progress, isLoaded }: LoadingScreenProps) {
  const [opacity, setOpacity] = useState(1);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Animate progress counter
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          return Math.min(prev + 2, progress);
        }
        return prev;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [progress]);

  // Fade out when loaded
  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        setOpacity(0);
      }, 500);
    }
  }, [isLoaded]);

  if (isLoaded && opacity === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000"
      style={{ opacity }}
    >
      <div className="text-center">
        {/* Animated loading ring */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>

          {/* Animated progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 72}`}
              strokeDashoffset={`${2 * Math.PI * 72 * (1 - progress / 100)}`}
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e92c" />
                <stop offset="100%" stopColor="#00ffff" />
              </linearGradient>
            </defs>
          </svg>

          {/* Percentage counter */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-5xl font-bold bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent"
            >
              {Math.round(displayProgress)}%
            </span>
          </div>
        </div>

        {/* Loading text */}
        <div className="relative">
          <h2 className="text-2xl font-bold mb-2 text-white tracking-wider">
            LOADING EXPERIENCE
          </h2>

          {/* Animated dots */}
          <div className="flex justify-center gap-2 mt-4">
            <div
              className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 w-64 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00e92c] to-[#00ffff] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
