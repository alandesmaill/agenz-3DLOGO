'use client';

import { useEffect, useState, useMemo } from 'react';

interface LoadingScreenProps {
  progress: number;
  isLoaded: boolean;
}

export default function LoadingScreen({ progress, isLoaded }: LoadingScreenProps) {
  const [opacity, setOpacity] = useState(1);
  const [shouldRender, setShouldRender] = useState(true);

  // Smooth progress for animation (prevents jumpy clip-path)
  const [smoothProgress, setSmoothProgress] = useState(0);

  useEffect(() => {
    // Smoothly animate towards target progress
    const animateProgress = () => {
      setSmoothProgress((prev) => {
        const diff = progress - prev;
        if (Math.abs(diff) < 0.5) return progress;
        return prev + diff * 0.1; // Ease towards target
      });
    };

    const interval = setInterval(animateProgress, 16); // ~60fps
    return () => clearInterval(interval);
  }, [progress]);

  // Fade out when loaded
  useEffect(() => {
    if (isLoaded) {
      const fadeTimer = setTimeout(() => {
        setOpacity(0);
      }, 300);

      const unmountTimer = setTimeout(() => {
        setShouldRender(false);
      }, 1100); // After fade completes

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isLoaded]);

  // Calculate clip-path based on progress (reveal from left to right)
  const clipPath = useMemo(() => {
    const revealPercent = Math.min(smoothProgress, 100);
    return `inset(0 ${100 - revealPercent}% 0 0)`;
  }, [smoothProgress]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0, 233, 44, 0.10) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 100% 0%, rgba(0, 255, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 10% 100%, rgba(0, 233, 44, 0.08) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(0, 255, 255, 0.07) 0%, transparent 50%), #050505',
        opacity,
        transition: 'opacity 0.8s ease-out',
        willChange: 'opacity',
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Logo Container */}
        <div className="relative w-[280px] sm:w-[320px] md:w-[400px] h-auto">
          {/* Background logo (gray silhouette) */}
          <svg
            viewBox="0 0 762.91 141.27"
            className="w-full h-auto"
            aria-hidden="true"
          >
            <g fill="rgba(255,255,255,0.08)">
              <g>
                <path d="M311.7,53.81v63.53c-14.49,14.49-31.96,23.82-64.92,23.82-36.13,0-73.46-19.06-73.46-70.68S211.44,0,248.77,0s54.79,16.08,58.76,20.45l-29.18,30.57c-4.37-4.37-14.1-9.13-26.6-9.13-14.29,0-26.4,9.53-26.4,28.39s10.13,29.38,26.8,29.38c8.34,0,15.09-1.59,19.26-5.36v-4.96h-25.02v-35.54h65.32Z"/>
                <path d="M431.12,0v40.1h-52.17v10.64h49.51v39.07h-49.51v10.84h52.18v40.61h-104.75V0h104.74Z"/>
                <path d="M501.66,0l33.14,69.76s-1.23-15.55-1.23-21.89V0h51.76v141.26h-55.85l-33.14-70.27s1.23,14.52,1.23,22.3v47.98h-51.76V0h55.85Z"/>
              </g>
              <path d="M56.26,141.27H0L101.33,0h57.05L56.26,141.27ZM107.71,0h50.67s.26,141.26.26,141.26h-50.93V0Z"/>
              <polygon points="600.02 0 600.02 42.34 659.28 42.34 617.61 87.42 682.03 87.42 762.91 0 600.02 0"/>
              <polygon points="680.89 53.85 600.02 141.27 636.54 141.26 762.91 141.26 762.91 98.93 703.65 98.93 745.32 53.85 680.89 53.85"/>
            </g>
          </svg>

          {/* Foreground logo (black, revealed by clip-path) */}
          <svg
            viewBox="0 0 762.91 141.27"
            className="absolute inset-0 w-full h-auto"
            style={{
              clipPath,
              transition: 'clip-path 0.1s ease-out',
              willChange: 'clip-path',
            }}
            aria-label="Agenz logo loading"
          >
            <defs>
              <linearGradient id="loading-gradient" x1="774.99" y1="43.71" x2="670.25" y2="43.71" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#00e92c"/>
                <stop offset="1" stopColor="aqua"/>
              </linearGradient>
            </defs>
            <g>
              <g fill="#ffffff">
                <path d="M311.7,53.81v63.53c-14.49,14.49-31.96,23.82-64.92,23.82-36.13,0-73.46-19.06-73.46-70.68S211.44,0,248.77,0s54.79,16.08,58.76,20.45l-29.18,30.57c-4.37-4.37-14.1-9.13-26.6-9.13-14.29,0-26.4,9.53-26.4,28.39s10.13,29.38,26.8,29.38c8.34,0,15.09-1.59,19.26-5.36v-4.96h-25.02v-35.54h65.32Z"/>
                <path d="M431.12,0v40.1h-52.17v10.64h49.51v39.07h-49.51v10.84h52.18v40.61h-104.75V0h104.74Z"/>
                <path d="M501.66,0l33.14,69.76s-1.23-15.55-1.23-21.89V0h51.76v141.26h-55.85l-33.14-70.27s1.23,14.52,1.23,22.3v47.98h-51.76V0h55.85Z"/>
              </g>
              <path fill="#ffffff" d="M56.26,141.27H0L101.33,0h57.05L56.26,141.27ZM107.71,0h50.67s.26,141.26.26,141.26h-50.93V0Z"/>
              <polygon fill="url(#loading-gradient)" points="600.02 0 600.02 42.34 659.28 42.34 617.61 87.42 682.03 87.42 762.91 0 600.02 0"/>
              <polygon fill="#ffffff" points="680.89 53.85 600.02 141.27 636.54 141.26 762.91 141.26 762.91 98.93 703.65 98.93 745.32 53.85 680.89 53.85"/>
            </g>
          </svg>
        </div>

        {/* Minimal progress indicator */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {/* Progress bar */}
          <div className="w-[200px] h-[2px] bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{
                width: `${smoothProgress}%`,
                transition: 'width 0.1s ease-out',
              }}
            />
          </div>

          {/* Progress text */}
          <span className="text-sm text-white/60 font-medium tracking-wider">
            {Math.round(smoothProgress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
