'use client';

import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

interface ModelProps {
  path: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  autoRotate?: boolean;
}

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

export default function Model({
  path,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  autoRotate = false,
}: ModelProps) {
  const modelRef = useRef<THREE.Group>(null);

  // Load the GLTF/GLB model
  const { scene } = useGLTF(path) as GLTFResult;

  // Auto-rotate animation
  useFrame((state, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

// Preload the model (optional but recommended)
// Usage: useGLTF.preload('/models/your-model.glb');
