'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface CubeProps {
  position?: [number, number, number];
  color?: string;
}

export default function Cube({ position = [0, 0, 0], color = '#ff6b6b' }: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Rotate the cube
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  // Handle click with GSAP animation
  const handleClick = () => {
    setClicked(!clicked);
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: clicked ? 1 : 1.5,
        y: clicked ? 1 : 1.5,
        z: clicked ? 1 : 1.5,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });
    }
  };

  // Handle hover with GSAP animation
  const handlePointerOver = () => {
    setHovered(true);
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: position[1] + 0.3,
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: position[1],
        duration: 0.2,
        ease: 'power2.out',
      });
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={hovered ? '#4ecdc4' : color}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  );
}
