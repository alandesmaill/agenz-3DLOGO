'use client';

import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
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
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />

      {/* Lighting - Moderately reduced to prevent washout */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.4} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
      />

      {/* Environment - adds realistic lighting */}
      <Environment preset="studio" />

      {/* Children (your 3D objects) */}
      {children}
    </>
  );
}
