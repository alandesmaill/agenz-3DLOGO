'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface ParticleAssemblyProps {
  targetPositions: THREE.Vector3[];
  isActive: boolean;
  onComplete?: () => void;
  particleCount?: number;
  duration?: number;
}

export default function ParticleAssembly({
  targetPositions,
  isActive,
  onComplete,
  particleCount = 1500,
  duration = 2.5,
}: ParticleAssemblyProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const progressRef = useRef(0);
  const hasCompletedRef = useRef(false);

  // Create particle system with positions, velocities, and target data
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    const targets = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);

    // Brand colors (cyan and green gradient)
    const color1 = new THREE.Color(0x00ffff); // Cyan
    const color2 = new THREE.Color(0x00e92c); // Green

    // Calculate how many particles for each part of the Z
    const topLineCount = Math.floor(particleCount * 0.33);
    const diagonalCount = Math.floor(particleCount * 0.34);
    const bottomLineCount = particleCount - topLineCount - diagonalCount;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      let startX, startY, startZ;

      // Form letter "Z" shape (smaller and more compact)
      if (i < topLineCount) {
        // Top horizontal line: left to right
        const t = i / topLineCount;
        startX = -1.2 + t * 2.4; // -1.2 to 1.2
        startY = 1.2;
        startZ = 2.0;
      } else if (i < topLineCount + diagonalCount) {
        // Diagonal line: top-right to bottom-left
        const t = (i - topLineCount) / diagonalCount;
        startX = 1.2 - t * 2.4; // 1.2 to -1.2
        startY = 1.2 - t * 2.4; // 1.2 to -1.2
        startZ = 2.0;
      } else {
        // Bottom horizontal line: left to right
        const t = (i - topLineCount - diagonalCount) / bottomLineCount;
        startX = -1.2 + t * 2.4; // -1.2 to 1.2
        startY = -1.2;
        startZ = 2.0;
      }

      // Add minimal randomness for tight Z formation
      startX += (Math.random() - 0.5) * 0.02;
      startY += (Math.random() - 0.5) * 0.02;
      startZ += (Math.random() - 0.5) * 0.02;

      positions[i3] = startX;
      positions[i3 + 1] = startY;
      positions[i3 + 2] = startZ;

      initialPositions[i3] = startX;
      initialPositions[i3 + 1] = startY;
      initialPositions[i3 + 2] = startZ;

      // Assign each particle to a random target position from the logo
      const targetIndex = Math.floor(Math.random() * targetPositions.length);
      const target = targetPositions[targetIndex];

      // Add slight randomness around target for organic look
      const offset = 0.15;
      targets[i3] = target.x + (Math.random() - 0.5) * offset;
      targets[i3 + 1] = target.y + (Math.random() - 0.5) * offset;
      targets[i3 + 2] = target.z + (Math.random() - 0.5) * offset;

      // Random velocities for initial floating
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      // Gradient color between cyan and green
      const color = color1.clone().lerp(color2, Math.random());
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Larger particle sizes for clearer Z
      sizes[i] = 0.06 + Math.random() * 0.04;
    }

    return {
      positions,
      colors,
      sizes,
      velocities,
      targets,
      initialPositions,
    };
  }, [particleCount, targetPositions]);

  // Animate particles to form logo
  useEffect(() => {
    if (isActive && !hasCompletedRef.current) {
      // Animate progress from 0 to 1
      gsap.to(progressRef, {
        current: 1,
        duration,
        ease: 'power2.inOut',
        onComplete: () => {
          hasCompletedRef.current = true;
          if (onComplete) {
            onComplete();
          }
        },
      });
    }
  }, [isActive, duration, onComplete]);

  // Update particle positions every frame
  useFrame((state) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    const progress = progressRef.current;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      if (progress < 1) {
        // Interpolate from initial position to target
        const easeProgress = progress; // Already eased by GSAP

        positions[i3] = THREE.MathUtils.lerp(
          particleData.initialPositions[i3],
          particleData.targets[i3],
          easeProgress
        );
        positions[i3 + 1] = THREE.MathUtils.lerp(
          particleData.initialPositions[i3 + 1],
          particleData.targets[i3 + 1],
          easeProgress
        );
        positions[i3 + 2] = THREE.MathUtils.lerp(
          particleData.initialPositions[i3 + 2],
          particleData.targets[i3 + 2],
          easeProgress
        );

        // Add some turbulence during assembly
        const turbulence = Math.sin(time * 3 + i * 0.1) * 0.05 * (1 - progress);
        positions[i3 + 1] += turbulence;
      } else {
        // After assembly, subtle floating motion
        const floatX = Math.sin(time * 0.5 + i * 0.1) * 0.01;
        const floatY = Math.cos(time * 0.7 + i * 0.2) * 0.01;

        positions[i3] = particleData.targets[i3] + floatX;
        positions[i3 + 1] = particleData.targets[i3 + 1] + floatY;
        positions[i3 + 2] = particleData.targets[i3 + 2];
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Fade out particles after assembly completes
    if (particlesRef.current.material instanceof THREE.PointsMaterial) {
      if (progress >= 0.9) {
        const fadeProgress = (progress - 0.9) / 0.1; // 0.9 to 1.0
        particlesRef.current.material.opacity = 1 - fadeProgress;
      }
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particleData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={particleData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}
