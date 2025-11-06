'use client';

import { Canvas as ThreeCanvas } from '@react-three/fiber';
import { ReactNode } from 'react';

interface CanvasProps {
  children: ReactNode;
  className?: string;
}

export default function Canvas({ children, className = '' }: CanvasProps) {
  return (
    <ThreeCanvas
      className={className}
      camera={{
        position: [0, 0, 5],
        fov: 75,
        near: 0.1,
        far: 1000,
      }}
      gl={{
        antialias: true,
        alpha: true,
      }}
      dpr={[1, 2]}
    >
      {children}
    </ThreeCanvas>
  );
}
