'use client';

import { Canvas, Scene, FracturedLogo } from '@/components/canvas';
import { NavigationLabel } from '@/components/dom';
import { Suspense, useState, useRef } from 'react';
import * as THREE from 'three';

export default function View() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [labelData, setLabelData] = useState<{
    label: string | null;
    position: { x: number; y: number } | null;
    isVisible: boolean;
  }>({
    label: null,
    position: null,
    isVisible: false,
  });

  // Handle navigation hover callback from FracturedLogo
  const handleNavigationHover = (
    piece: string | null,
    label: string | null,
    worldPosition: THREE.Vector3 | null
  ) => {
    if (!worldPosition || !label || !containerRef.current) {
      setLabelData({ label: null, position: null, isVisible: false });
      return;
    }

    // Get canvas element for viewport calculations
    const canvas = containerRef.current.querySelector('canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // Convert 3D world position to 2D screen position
    // This is a simplified projection - the actual camera projection is handled by Three.js
    // We'll use a rough estimate based on the world position
    const screenX = rect.left + rect.width / 2 + worldPosition.x * (rect.width / 8);
    const screenY = rect.top + rect.height / 2 - worldPosition.y * (rect.height / 8);

    setLabelData({
      label,
      position: { x: screenX, y: screenY },
      isVisible: true,
    });
  };

  // Handle navigation click callback
  const handleNavigationClick = (section: string) => {
    console.log(`Navigation clicked: ${section}`);
    // TODO: Implement navigation to section
    // Example: router.push(`/#${section}`) or scroll to section
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Three.js Canvas */}
      <Canvas className="w-full h-full">
        <Suspense fallback={null}>
          <Scene>
            {/* Interactive Fractured Logo */}
            <FracturedLogo
              path="/models/3d-logo.glb"
              position={[0, 0, 0]}
              scale={1}
              onNavigationHover={handleNavigationHover}
              onNavigationClick={handleNavigationClick}
            />
          </Scene>
        </Suspense>
      </Canvas>

      {/* HTML Overlay - Navigation Labels */}
      <NavigationLabel
        label={labelData.label}
        position={labelData.position}
        isVisible={labelData.isVisible}
      />
    </div>
  );
}
