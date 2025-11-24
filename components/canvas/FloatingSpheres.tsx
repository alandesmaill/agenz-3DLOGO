'use client';

import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { InstancedRigidBodies, RapierRigidBody } from '@react-three/rapier';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';
import { useFrame } from '@react-three/fiber';

// Brand accent colors - cyan and green theme
const accents = ['#00ffff', '#00e92c', '#00d4aa', '#00b8ff'];

const r = THREE.MathUtils.randFloatSpread;

interface FloatingSpheresProps {
  totalCount?: number;
  transparentCount?: number;
  // Responsive spread controls
  positionSpread?: { x: number; y: number; z: number };
  motionSpread?: { x: number; y: number; z: number };
}

interface SphereInstance {
  key: string;
  position: [number, number, number];
  scale: number;
}

export default function FloatingSpheres({
  totalCount = 18,
  transparentCount = 5,
  // Default spread values (desktop)
  positionSpread = { x: 20, y: 10, z: 20 },
  motionSpread = { x: 40, y: 10, z: 10 },
}: FloatingSpheresProps) {
  // Refs for physics bodies
  const apiNormal = useRef<RapierRigidBody[]>([]);
  const apiTransparent = useRef<RapierRigidBody[]>([]);
  const sphereRef = useRef<THREE.InstancedMesh>(null);

  const [currentAccentIndex, setCurrentAccentIndex] = useState(0);

  const normalCount = totalCount - transparentCount;

  const { factors, xFactors, yFactors, zFactors, normalInstances, transparentInstances, colors } = useMemo(() => {
    const factors: number[] = [];
    const xFactors: number[] = [];
    const yFactors: number[] = [];
    const zFactors: number[] = [];
    const normalInstances: SphereInstance[] = [];
    const transparentInstances: SphereInstance[] = [];
    const colors = new Float32Array(normalCount * 3);
    const color = new THREE.Color();

    for (let i = 0; i < totalCount; i++) {
      const instance: SphereInstance = {
        key: `instance_${i}`,
        position: [r(positionSpread.x), r(positionSpread.y), r(positionSpread.z)],
        scale: 1,
      };

      factors.push(THREE.MathUtils.randInt(20, 100));
      xFactors.push(THREE.MathUtils.randFloatSpread(motionSpread.x));
      yFactors.push(THREE.MathUtils.randFloatSpread(motionSpread.y));
      zFactors.push(THREE.MathUtils.randFloatSpread(motionSpread.z));

      if (i < normalCount) {
        normalInstances.push(instance);
        // First 7 spheres are dark, rest are accent colored
        if (i < 7) {
          colors.set(color.set('#1A1A1A').toArray(), i * 3);
        } else {
          colors.set(color.set(accents[0]).toArray(), i * 3);
        }
      } else {
        transparentInstances.push(instance);
      }
    }

    return { factors, xFactors, yFactors, zFactors, normalInstances, transparentInstances, colors };
  }, [normalCount, totalCount, positionSpread, motionSpread]);

  // Cycle through accent colors every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAccentIndex((prevIndex) => (prevIndex + 1) % accents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    const delta = state.clock.getDelta();

    // Animate normal spheres
    if (apiNormal.current && apiNormal.current.length > 0) {
      apiNormal.current.forEach((body: RapierRigidBody, i: number) => {
        if (body) {
          const t = factors[i] + state.clock.elapsedTime * 0.25;

          const targetPosition = new THREE.Vector3(
            Math.cos(t) + Math.sin(t * 1) / 10 + xFactors[i] + Math.cos((t / 10) * factors[i]) + (Math.sin(t * 1) * factors[i]) / 10,
            Math.sin(t) + Math.cos(t * 2) / 10 + yFactors[i] + Math.sin((t / 10) * factors[i]) + (Math.cos(t * 2) * factors[i]) / 10,
            Math.sin(t) + Math.cos(t * 2) / 10 + zFactors[i] + Math.cos((t / 10) * factors[i]) + (Math.sin(t * 3) * factors[i]) / 4,
          );

          const apiTranslation = body.translation();
          const currentPosition = new THREE.Vector3(apiTranslation.x, apiTranslation.y, apiTranslation.z);
          const direction = new THREE.Vector3().subVectors(targetPosition, currentPosition);
          const forceMagnitude = 0.5;
          const force = direction.normalize().multiplyScalar(forceMagnitude);

          body.applyImpulse(force, true);
        }
      });

      // Update accent colors with smooth easing
      const newColor = new THREE.Color(accents[currentAccentIndex]);
      for (let i = 7; i < normalCount; i++) {
        const currentColor = new THREE.Color().fromArray(Array.from(colors.slice(i * 3, (i + 1) * 3)));
        easing.dampC(currentColor, newColor, 0.1, delta);
        colors.set(currentColor.toArray(), i * 3);
      }

      if (sphereRef.current && sphereRef.current.geometry.attributes.color) {
        sphereRef.current.geometry.attributes.color.needsUpdate = true;
      }
    }

    // Animate transparent spheres
    if (apiTransparent.current && apiTransparent.current.length > 0) {
      apiTransparent.current.forEach((body: RapierRigidBody, i: number) => {
        if (body) {
          const t = factors[normalCount + i] + state.clock.elapsedTime * 0.25;

          const targetPosition = new THREE.Vector3(
            Math.cos(t) + Math.sin(t * 1) / 10 + xFactors[normalCount + i] + Math.cos((t / 10) * factors[normalCount + i]) + (Math.sin(t * 1) * factors[normalCount + i]) / 10,
            Math.sin(t) + Math.cos(t * 2) / 10 + yFactors[normalCount + i] + Math.sin((t / 10) * factors[normalCount + i]) + (Math.cos(t * 2) * factors[normalCount + i]) / 10,
            Math.sin(t) + Math.cos(t * 2) / 10 + zFactors[normalCount + i] + Math.cos((t / 10) * factors[normalCount + i]) + (Math.sin(t * 3) * factors[normalCount + i]) / 4,
          );

          const apiTranslation = body.translation();
          const currentPosition = new THREE.Vector3(apiTranslation.x, apiTranslation.y, apiTranslation.z);
          const direction = new THREE.Vector3().subVectors(targetPosition, currentPosition);
          const forceMagnitude = 0.5;
          const force = direction.normalize().multiplyScalar(forceMagnitude);

          body.applyImpulse(force, true);
        }
      });
    }
  });

  return (
    <>
      {/* Normal colored spheres */}
      <InstancedRigidBodies
        type="dynamic"
        ref={apiNormal}
        colliders="ball"
        instances={normalInstances}
        linearDamping={50}
        angularDamping={50}
        friction={0.1}
      >
        <instancedMesh
          ref={sphereRef}
          castShadow
          receiveShadow
          args={[undefined, undefined, normalCount]}
        >
          <sphereGeometry args={[1, 32, 32]}>
            <instancedBufferAttribute attach="attributes-color" args={[colors, 3]} />
          </sphereGeometry>
          <meshStandardMaterial vertexColors roughness={0.5} metalness={0.2} />
        </instancedMesh>
      </InstancedRigidBodies>

      {/* Transparent glass spheres */}
      <InstancedRigidBodies
        type="dynamic"
        ref={apiTransparent}
        colliders="ball"
        instances={transparentInstances}
        linearDamping={50}
        angularDamping={50}
        friction={0.1}
      >
        <instancedMesh
          castShadow
          receiveShadow
          args={[undefined, undefined, transparentCount]}
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
            displacementScale={0.3}
            temporalDistortion={0.5}
            clearcoat={1}
            attenuationDistance={0.5}
          />
        </instancedMesh>
      </InstancedRigidBodies>
    </>
  );
}
