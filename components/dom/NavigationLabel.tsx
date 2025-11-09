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
    <div
      className="fixed pointer-events-none z-50 transition-all duration-200 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      {/* Minimal design with cyan accent */}
      <div className="relative">
        {/* Glowing dot indicator */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50" />

        {/* Label container */}
        <div className="bg-black/90 border-l-4 border-cyan-400 px-4 py-2 shadow-2xl">
          <p className="text-cyan-400 text-base font-semibold tracking-widest uppercase">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
