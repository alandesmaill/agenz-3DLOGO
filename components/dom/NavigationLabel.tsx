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

  useEffect(() => {
    if (isVisible && position) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }, [isVisible, position]);

  if (!label || !position) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-opacity duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-6 py-3 shadow-2xl">
        <p className="text-white text-xl font-bold tracking-wider drop-shadow-lg">
          {label}
        </p>
      </div>
    </div>
  );
}
