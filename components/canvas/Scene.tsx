'use client';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
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

      {/* Lighting */}

      {/* Ambient floor - high enough that dark pieces stay readable */}
      <ambientLight intensity={0.9} />

      {/* Key light from top-right - main illumination */}
      <directionalLight position={[8, 10, 6]} intensity={1.6} />

      {/* Front fill - straight-on, ensures all forward-facing surfaces are lit */}
      <directionalLight position={[0, 0, 10]} intensity={1.2} />

      {/* Cyan fill light - front-left, mirrors rim for full brand envelope */}
      <pointLight position={[-3, 2, 4]} intensity={1.5} color="#00ffff" distance={14} />

      {/* Cyan rim light - back-right, creates a glowing edge separation */}
      <pointLight position={[4, 1, -4]} intensity={1.5} color="#00ffff" distance={12} />

      {/* Bottom fill so lower pieces don't go black */}
      <directionalLight position={[0, -6, 4]} intensity={0.6} />

      {/* Children (your 3D objects) */}
      {children}

      {/* Post-processing Effects */}
      <EffectComposer>
        <Bloom
          intensity={0.35}
          luminanceThreshold={0.80}
          luminanceSmoothing={0.3}
          height={200}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
