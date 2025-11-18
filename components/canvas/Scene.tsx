'use client';

import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ReactNode } from 'react';

interface SceneProps {
  children?: ReactNode;
}

export default function Scene({ children }: SceneProps) {
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />

      {/* Controls */}
      <OrbitControls
        target={[0.4, 1, 0]}
        enableDamping
        dampingFactor={0.08}
        minDistance={2}
        maxDistance={10}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />

      {/* Lighting - Optimized for dark surfaces on white background */}

      {/* Bright ambient fill - increased for dark surfaces visibility */}
      <ambientLight intensity={2.0} />

      {/* Key directional light from top - no shadows */}
      <directionalLight position={[10, 10, 5]} intensity={1.0} />

      {/* Fill light from side - subtle depth */}
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />

      {/* Rim/back light - separates dark pieces from white background */}
      <directionalLight position={[0, 5, -10]} intensity={0.8} />

      {/* Environment - adds realistic reflections */}
      <Environment preset="city" />

      {/* Children (your 3D objects) */}
      {children}

      {/* Post-processing Effects - Enhanced bloom for brand colors */}
      <EffectComposer>
        {/* Bloom effect - Make cyan/green brand colors glow */}
        <Bloom
          intensity={0.2}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.5}
          height={100}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
