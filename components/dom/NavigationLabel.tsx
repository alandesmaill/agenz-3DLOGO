'use client';

import { useEffect, useState } from 'react';

interface NavigationLabelProps {
  label: string | null;
  position: { x: number; y: number } | null;
  isVisible: boolean;
}

export default function NavigationLabel({
  label,
  position,
  isVisible,
}: NavigationLabelProps) {
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    if (isVisible && position) {
      setOpacity(1);
      setScale(1);
    } else {
      setOpacity(0);
      setScale(0.8);
    }
  }, [isVisible, position]);

  if (!label || !position) return null;

  return (
    <>
      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(0, 255, 255, 0.3),
              0 0 40px rgba(0, 255, 255, 0.2),
              inset 0 0 20px rgba(0, 255, 255, 0.1);
          }
          50% {
            box-shadow:
              0 0 30px rgba(0, 255, 255, 0.5),
              0 0 60px rgba(0, 255, 255, 0.3),
              inset 0 0 30px rgba(0, 255, 255, 0.2);
          }
        }

        .liquid-glass {
          background:
            linear-gradient(
              135deg,
              rgba(0, 255, 255, 0.2) 0%,
              rgba(0, 233, 44, 0.15) 50%,
              rgba(0, 255, 255, 0.2) 100%
            ),
            rgba(0, 10, 20, 0.95);
          backdrop-filter: blur(10px) saturate(180%);
          -webkit-backdrop-filter: blur(10px) saturate(180%);
          border: 2px solid rgba(0, 255, 255, 0.6);
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .shimmer-overlay {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }

        /* Fallback for browsers without backdrop-filter */
        @supports not (backdrop-filter: blur(10px)) {
          .liquid-glass {
            background: rgba(0, 10, 20, 0.98);
          }
        }
      `}</style>

      <div
        className="fixed pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {/* Premium Liquid Glass Design */}
        <div className="relative">
          {/* Pulsing dot indicator with glow */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse">
            <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping" />
          </div>

          {/* Liquid Glass Container */}
          <div className="liquid-glass rounded-xl px-6 py-3 relative overflow-hidden">
            {/* Inner highlight (top edge) */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            {/* Shimmer animation overlay */}
            <div className="shimmer-overlay absolute inset-0 rounded-xl" />

            {/* Label text */}
            <p
              className="relative text-base font-bold tracking-[0.3em] uppercase"
              style={{
                color: '#00ffff',
                textShadow: `
                  0 0 10px rgba(0, 255, 255, 1),
                  0 0 20px rgba(0, 255, 255, 0.8),
                  0 0 30px rgba(0, 255, 255, 0.6),
                  0 1px 0 rgba(0, 0, 0, 0.8),
                  0 -1px 0 rgba(0, 0, 0, 0.8),
                  1px 0 0 rgba(0, 0, 0, 0.8),
                  -1px 0 0 rgba(0, 0, 0, 0.8)
                `,
              }}
            >
              {label}
            </p>

            {/* Bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
          </div>

          {/* Outer glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 blur-xl -z-10" />
        </div>
      </div>
    </>
  );
}
