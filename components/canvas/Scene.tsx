'use client';

import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
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

      {/* Lighting - Simplified for better performance */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} castShadow />
      <directionalLight position={[-5, -5, -3]} intensity={0.3} />

      {/* Environment - adds realistic lighting */}
      <Environment preset="studio" />

      {/* Children (your 3D objects) */}
      {children}

      {/* Post-processing Effects - Optimized for comfort and performance */}
      <EffectComposer>
        {/* Bloom effect - MUCH reduced to prevent eye strain */}
        <Bloom
          intensity={0.15}
          luminanceThreshold={0.95}
          luminanceSmoothing={0.5}
          height={100}
          mipmapBlur
        />

        {/* Vignette for depth - reduced darkness */}
        <Vignette
          offset={0.3}
          darkness={0.3}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}
