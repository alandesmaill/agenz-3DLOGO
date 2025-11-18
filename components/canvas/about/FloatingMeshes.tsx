'use client';

import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { gsap } from 'gsap';

const ACCENT_COLORS = ['#8A2BE2', '#FF1493', '#FFFF00', '#DC143C'];
const r = THREE.MathUtils.randFloatSpread;

interface FloatingMeshesProps {
  totalCount?: number;
  transparentCount?: number;
  isMobile?: boolean;
}

interface SphereData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  phase: number;
}

export default function FloatingMeshes({
  totalCount = 18,
  transparentCount = 5,
  isMobile = false,
}: FloatingMeshesProps) {
  const normalGroupRef = useRef<THREE.Group>(null);
  const transparentGroupRef = useRef<THREE.Group>(null);
  const sphereDataRef = useRef<SphereData[]>([]);
  const colorsRef = useRef<Float32Array>();

  const [currentAccentIndex, setCurrentAccentIndex] = useState(0);

  const normalCount = totalCount - transparentCount;

  // Initialize sphere data and colors
  const { colors } = useMemo(() => {
    const colors = new Float32Array(normalCount * 3);
    const color = new THREE.Color();
    const sphereData: SphereData[] = [];

    for (let i = 0; i < totalCount; i++) {
      sphereData.push({
        position: new THREE.Vector3(r(isMobile ? 10 : 20), r(10), r(20)),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        scale: isMobile ? 0.8 : 1,
        phase: Math.random() * Math.PI * 2,
      });

      if (i < normalCount) {
        // First few are black, rest are accent colored
        if ((!isMobile && i < 7) || (isMobile && i < 4)) {
          colors.set(color.set('#1A1A1A').toArray(), i * 3);
        } else {
          colors.set(color.set(ACCENT_COLORS[0]).toArray(), i * 3);
        }
      }
    }

    sphereDataRef.current = sphereData;
    colorsRef.current = colors;

    return { colors };
  }, [isMobile, normalCount, totalCount]);

  // Color cycling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAccentIndex((prevIndex) => (prevIndex + 1) % ACCENT_COLORS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Smooth floating animation
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Animate normal spheres
    if (normalGroupRef.current) {
      normalGroupRef.current.children.forEach((sphere, i) => {
        const data = sphereDataRef.current[i];
        if (!data) return;

        // Smooth sinusoidal floating motion
        const floatX = Math.sin(time * 0.3 + data.phase) * 2;
        const floatY = Math.cos(time * 0.4 + data.phase * 1.3) * 2;
        const floatZ = Math.sin(time * 0.35 + data.phase * 0.7) * 2;

        sphere.position.x = data.position.x + floatX;
        sphere.position.y = data.position.y + floatY;
        sphere.position.z = data.position.z + floatZ;

        // Gentle rotation
        sphere.rotation.x += delta * 0.2;
        sphere.rotation.y += delta * 0.3;
      });

      // Update colors with smooth transition using GSAP
      if (colorsRef.current) {
        const targetColor = new THREE.Color(ACCENT_COLORS[currentAccentIndex]);
        const startIndex = isMobile ? 4 : 7;

        for (let i = startIndex; i < normalCount; i++) {
          const currentColor = new THREE.Color().fromArray(
            colorsRef.current.slice(i * 3, (i + 1) * 3)
          );

          // Smooth color interpolation
          currentColor.lerp(targetColor, delta * 0.5);
          colorsRef.current.set(currentColor.toArray(), i * 3);
        }

        // Mark colors as needing update
        const instancedMesh = normalGroupRef.current.children[0] as THREE.InstancedMesh;
        if (instancedMesh?.geometry?.attributes?.color) {
          instancedMesh.geometry.attributes.color.needsUpdate = true;
        }
      }
    }

    // Animate transparent spheres
    if (transparentGroupRef.current) {
      transparentGroupRef.current.children.forEach((sphere, i) => {
        const dataIndex = normalCount + i;
        const data = sphereDataRef.current[dataIndex];
        if (!data) return;

        // Slightly different motion for transparent spheres
        const floatX = Math.cos(time * 0.25 + data.phase) * 2.5;
        const floatY = Math.sin(time * 0.35 + data.phase * 1.5) * 2.5;
        const floatZ = Math.cos(time * 0.3 + data.phase * 0.8) * 2.5;

        sphere.position.x = data.position.x + floatX;
        sphere.position.y = data.position.y + floatY;
        sphere.position.z = data.position.z + floatZ;

        // Gentle rotation
        sphere.rotation.x += delta * 0.15;
        sphere.rotation.y += delta * 0.25;
      });
    }
  });

  return (
    <>
      {/* Normal colored spheres */}
      <group ref={normalGroupRef}>
        <instancedMesh args={[undefined, undefined, normalCount]} castShadow receiveShadow>
          <sphereGeometry args={[1, 32, 32]}>
            <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
          </sphereGeometry>
          <meshStandardMaterial vertexColors roughness={0.5} metalness={0.2} />
        </instancedMesh>
      </group>

      {/* Transparent glass spheres */}
      <group ref={transparentGroupRef}>
        {Array.from({ length: transparentCount }).map((_, i) => {
          const data = sphereDataRef.current[normalCount + i];
          if (!data) return null;

          return (
            <mesh
              key={i}
              position={data.position}
              scale={data.scale}
              castShadow
              receiveShadow
            >
              <sphereGeometry args={[1, 32, 32]} />
              <MeshTransmissionMaterial
                samples={10}
                transmission={1.0}
                roughness={0}
                thickness={4}
                ior={1.5}
                chromaticAberration={0.06}
                anisotropy={0.2}
                distortion={0}
                distortionScale={0.3}
                temporalDistortion={0.5}
                clearcoat={1}
                attenuationDistance={0.5}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}
