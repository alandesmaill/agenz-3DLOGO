'use client';

import { Canvas as ThreeCanvas } from '@react-three/fiber';
import { ReactNode, useEffect, useState } from 'react';

interface CanvasProps {
  children: ReactNode;
  className?: string;
}

export default function Canvas({ children, className = '' }: CanvasProps) {
  // NOTE: Camera settings below are overridden by Scene.tsx PerspectiveCamera with makeDefault prop
  // This configuration serves as fallback only. Scene.tsx controls the active camera.
  const [cameraSettings, setCameraSettings] = useState({
    position: [0, 0, 5] as [number, number, number],
    fov: 75,
  });

  useEffect(() => {
    const updateCameraSettings = () => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 1920;

      if (width < 768) {
        // Mobile - pull back and wider FOV
        setCameraSettings({ position: [0, 0, 6], fov: 85 });
      } else if (width < 1024) {
        // Tablet
        setCameraSettings({ position: [0, 0, 5.5], fov: 80 });
      } else {
        // Desktop
        setCameraSettings({ position: [0, 0, 5], fov: 75 });
      }
    };

    updateCameraSettings();
    window.addEventListener('resize', updateCameraSettings);
    return () => window.removeEventListener('resize', updateCameraSettings);
  }, []);

  return (
    <ThreeCanvas
      className={className}
      camera={{
        position: cameraSettings.position,
        fov: cameraSettings.fov,
        near: 0.1,
        far: 1000,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      {children}
    </ThreeCanvas>
  );
}
