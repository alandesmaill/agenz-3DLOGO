'use client';

import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { gsap } from 'gsap';

export interface FracturedLogoHandle {
  navigateToSection: (section: string) => void;
}

interface FracturedLogoProps {
  path: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  onNavigationHover?: (piece: string | null, label: string | null, screenPosition: { x: number; y: number } | null) => void;
  onNavigationClick?: (section: string) => void;
  onDecompose?: () => void;
  onDecomposeComplete?: () => void;
}

interface PieceData {
  mesh: THREE.Mesh;
  originalPosition: THREE.Vector3;
  originalRotation: THREE.Euler;
  originalScale: THREE.Vector3;
  name: string;
  index: number;
}

interface NavigationPiece extends PieceData {
  targetPosition: THREE.Vector3;
  label: string;
  section: string;
}

interface DebrisOrbit {
  orbitAngle: number;       // current angle in orbit (advances each frame)
  orbitSpeed: number;       // rad/s (positive or negative = CW/CCW direction)
  orbitRadius: number;      // distance from orbit center
  orbitCenter: THREE.Vector3;
  orbitU: THREE.Vector3;    // first basis vector of orbital plane
  orbitV: THREE.Vector3;    // second basis vector of orbital plane
  rotSpeedX: number;        // self-tumble speed around X axis
  rotSpeedY: number;        // self-tumble speed around Y axis
}

const NAV_SECTIONS = [
  { section: 'about', label: 'ABOUT', position: new THREE.Vector3(-0.6, 1.5, 1.0) },      // Top-left
  { section: 'works', label: 'WORKS', position: new THREE.Vector3(0.6, 1.5, 1.0) },       // Top-right
  { section: 'services', label: 'SERVICES', position: new THREE.Vector3(-0.6, 0.5, 1.0) }, // Bottom-left
  { section: 'contact', label: 'CONTACT', position: new THREE.Vector3(0.6, 0.5, 1.0) },   // Bottom-right
];

const FracturedLogo = forwardRef<FracturedLogoHandle, FracturedLogoProps>(function FracturedLogo({
  path,
  position = [0, 0, 0],
  scale = 1,
  onNavigationHover,
  onNavigationClick,
  onDecompose,
  onDecomposeComplete,
}: FracturedLogoProps, ref) {
  const groupRef = useRef<THREE.Group>(null);
  const collisionRef = useRef<THREE.Mesh>(null);

  const [navigationPieces, setNavigationPieces] = useState<NavigationPiece[]>([]);
  const [debrisPieces, setDebrisPieces] = useState<PieceData[]>([]);
  const [isDecomposed, setIsDecomposed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { camera, gl } = useThree();

  const timelinesRef = useRef<gsap.core.Timeline[]>([]);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const hoverTweensRef = useRef<Map<string, gsap.core.Tween[]>>(new Map());
  const debrisOrbitsRef = useRef<DebrisOrbit[]>([]);
  const hoveredNavPiecesRef = useRef<Set<string>>(new Set());

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const collisionScale = isMobile ? 1.5 : 1.0;

  const { scene } = useGLTF(path);

  useEffect(() => {
    if (!groupRef.current) return;

    const clonedScene = scene.clone();
    groupRef.current.add(clonedScene);

    const allMeshes: THREE.Mesh[] = [];
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        allMeshes.push(child);
      }
    });

    interface MeshWithVolume {
      mesh: THREE.Mesh;
      volume: number;
      index: number;
      name: string;
    }

    const meshesWithVolume: MeshWithVolume[] = allMeshes.map((mesh, index) => {
      const geometry = mesh.geometry;
      if (!geometry.boundingBox) {
        geometry.computeBoundingBox();
      }

      const box = geometry.boundingBox!;
      const size = new THREE.Vector3();
      box.getSize(size);

      const scaleVolume = mesh.scale.x * mesh.scale.y * mesh.scale.z;
      const volume = size.x * size.y * size.z * scaleVolume;

      return {
        mesh,
        volume,
        index,
        name: mesh.name,
      };
    });

    meshesWithVolume.sort((a, b) => b.volume - a.volume);
    const largestFour = meshesWithVolume.slice(0, 4);

    const navPieces: NavigationPiece[] = [];
    const debris: PieceData[] = [];

    allMeshes.forEach((mesh, index) => {
      const meshName = mesh.name;

      const pieceData: PieceData = {
        mesh,
        originalPosition: mesh.position.clone(),
        originalRotation: mesh.rotation.clone(),
        originalScale: mesh.scale.clone(),
        name: meshName,
        index,
      };

      const largestIndex = largestFour.findIndex(item => item.mesh === mesh);

      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        const material = mesh.material.clone();
        mesh.material = material;

        material.metalness = 0.35;
        material.roughness = 0.3;
        material.transparent = true;
      }

      if (largestIndex !== -1) {
        const config = NAV_SECTIONS[largestIndex];
        navPieces.push({
          ...pieceData,
          targetPosition: config.position,
          label: config.label,
          section: config.section,
        });
      } else {
        debris.push(pieceData);
      }
    });

    setNavigationPieces(navPieces);
    setDebrisPieces(debris);

    const originalCameraPos = camera.position.clone();
    camera.position.set(0, 2, 15); // Start further back and slightly above

    gsap.to(camera.position, {
      x: originalCameraPos.x,
      y: originalCameraPos.y,
      z: originalCameraPos.z,
      duration: 3.5,
      ease: 'power2.inOut',
    });

    if (groupRef.current) {
      groupRef.current.scale.set(0.8, 0.8, 0.8);

      [...navPieces, ...debris].forEach((piece) => {
        if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
          piece.mesh.material.opacity = 0;
          piece.mesh.material.transparent = true;
        }
      });

      setTimeout(() => {
        [...navPieces, ...debris].forEach((piece, index) => {
          if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
            const fadeTween = gsap.to(piece.mesh.material, {
              opacity: 1,
              duration: 1.2,
              ease: 'power2.out',
              delay: index * 0.003, // Very subtle stagger
            });
            tweensRef.current.push(fadeTween);
          }
        });

        const scaleTween = gsap.to(groupRef.current!.scale, {
          x: 1.5,
          y: 1.5,
          z: 1.5,
          duration: 2.0,
          ease: 'power2.out',
        });
        tweensRef.current.push(scaleTween);
      }, 800); // Start after camera begins moving
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  useFrame((state, delta) => {
    if (groupRef.current && !isDecomposed && !isAnimating) {
      if (!prefersReducedMotion) {
        const targetRotX = -state.mouse.y * 0.3;  // tilt up/down (inverted Y)
        const targetRotY =  state.mouse.x * 0.5;  // rotate left/right
        groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * Math.min(delta * 3, 1);
        groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * Math.min(delta * 3, 1);
      }
    }

    if (isDecomposed && !isAnimating && !prefersReducedMotion) {
      const time = state.clock.getElapsedTime();

      navigationPieces.forEach((piece, index) => {
        const floatOffset = index * 0.5;
        const floatY = Math.sin(time * 0.8 + floatOffset) * 0.1;
        piece.mesh.position.y = piece.targetPosition.y + floatY;
        piece.mesh.rotation.y += delta * 0.5;
      });

      debrisPieces.forEach((piece, i) => {
        const orbit = debrisOrbitsRef.current[i];
        if (!orbit) return;

        orbit.orbitAngle += delta * orbit.orbitSpeed;

        const cosA = Math.cos(orbit.orbitAngle);
        const sinA = Math.sin(orbit.orbitAngle);
        piece.mesh.position.set(
          orbit.orbitCenter.x + orbit.orbitU.x * cosA * orbit.orbitRadius + orbit.orbitV.x * sinA * orbit.orbitRadius,
          orbit.orbitCenter.y + orbit.orbitU.y * cosA * orbit.orbitRadius + orbit.orbitV.y * sinA * orbit.orbitRadius,
          orbit.orbitCenter.z + orbit.orbitU.z * cosA * orbit.orbitRadius + orbit.orbitV.z * sinA * orbit.orbitRadius,
        );

        piece.mesh.rotation.x += delta * orbit.rotSpeedX;
        piece.mesh.rotation.y += delta * orbit.rotSpeedY;
      });
    }
  });

  const handleDecompose = () => {
    if (isAnimating || isDecomposed) return;

    setIsAnimating(true);
    setIsDecomposed(true);

    if (onDecompose) {
      onDecompose();
    }

    const animDuration = prefersReducedMotion ? 0.5 : 4.0;

    navigationPieces.forEach((piece) => {
      const posTween = gsap.to(piece.mesh.position, {
        x: piece.targetPosition.x,
        y: piece.targetPosition.y,
        z: piece.targetPosition.z, // Already set to z:2 in NAV_SECTIONS
        duration: animDuration,
        ease: 'power3.out', // SMOOTH like debris
        delay: 0, // ALL AT ONCE
      });
      tweensRef.current.push(posTween);

      const scaleTween = gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x * 1.0,
        y: piece.originalScale.y * 1.0,
        z: piece.originalScale.z * 1.0,
        duration: animDuration,
        ease: 'power3.out', // SMOOTH like debris
        delay: 0, // ALL AT ONCE
      });
      tweensRef.current.push(scaleTween);
    });

    debrisOrbitsRef.current = []; // reset

    debrisPieces.forEach((piece, i) => {
      const radius = 2.0 + Math.random() * 2.5;          // 2.0–4.5 units
      const speed = (0.015 + Math.random() * 0.04) * (Math.random() < 0.5 ? 1 : -1); // ~5x slower: ±0.015–0.055 rad/s
      const startAngle = Math.random() * Math.PI * 2;
      const inclination = Math.random() * Math.PI;         // 0–180°
      const lan = Math.random() * Math.PI * 2;             // longitude of ascending node

      const orbitU = new THREE.Vector3(
        Math.cos(lan),
        0,
        Math.sin(lan)
      );
      const orbitV = new THREE.Vector3(
        -Math.sin(lan) * Math.cos(inclination),
        Math.sin(inclination),
        Math.cos(lan) * Math.cos(inclination)
      );

      const orbitCenter = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.0,
        -2.5 + (Math.random() - 0.5) * 1.0   // Z range: -2.0 to -3.0
      );

      debrisOrbitsRef.current[i] = {
        orbitAngle: startAngle,
        orbitSpeed: speed,
        orbitRadius: radius,
        orbitCenter,
        orbitU,
        orbitV,
        rotSpeedX: (Math.random() - 0.5) * 0.08,
        rotSpeedY: (Math.random() - 0.5) * 0.10,
      };

      const cosA = Math.cos(startAngle);
      const sinA = Math.sin(startAngle);
      const targetX = orbitCenter.x + orbitU.x * cosA * radius + orbitV.x * sinA * radius;
      const targetY = orbitCenter.y + orbitU.y * cosA * radius + orbitV.y * sinA * radius;
      const targetZ = orbitCenter.z + orbitU.z * cosA * radius + orbitV.z * sinA * radius;

      const posTween = gsap.to(piece.mesh.position, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration: animDuration,
        ease: 'power3.out',
        delay: 0,
      });
      tweensRef.current.push(posTween);

      const rotTween = gsap.to(piece.mesh.rotation, {
        x: piece.originalRotation.x + (Math.random() - 0.5) * Math.PI * 2,
        y: piece.originalRotation.y + (Math.random() - 0.5) * Math.PI * 2,
        z: piece.originalRotation.z + (Math.random() - 0.5) * Math.PI * 2,
        duration: animDuration,
        ease: 'power3.out',
        delay: 0,
      });
      tweensRef.current.push(rotTween);

      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        const opacityTween = gsap.to(piece.mesh.material, {
          opacity: 0.25 + Math.random() * 0.2,  // 0.25–0.45
          duration: animDuration,
          delay: 0,
        });
        tweensRef.current.push(opacityTween);
      }
    });

    navigationPieces.forEach((piece) => {
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        piece.mesh.material.emissive.set(0x00ffff);  // subtle cyan identity, not piece color
        const glowTween = gsap.to(piece.mesh.material, {
          emissiveIntensity: 0,  // no at-rest emissive — pieces lit purely by scene lights
          duration: 2.0,
          ease: 'power2.out',
          delay: 0,
        });
        tweensRef.current.push(glowTween);
      }
    });

    const totalDelay = prefersReducedMotion ? 500 : 4000;
    setTimeout(() => {
      setIsAnimating(false);
      if (onDecomposeComplete) {
        onDecomposeComplete();
      }
    }, totalDelay);
  };

  const handlePointerEnter = () => {
    if (!isAnimating) {
      handleDecompose();
    }
  };

  const handleNavPieceHover = (piece: NavigationPiece, isHovering: boolean) => {
    if (!isDecomposed || isAnimating) return;

    const prevTweens = hoverTweensRef.current.get(piece.name) || [];
    prevTweens.forEach(t => t.kill());
    const newTweens: gsap.core.Tween[] = [];

    if (isHovering) {
      hoveredNavPiecesRef.current.add(piece.name);

      const scaleTween = gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x * 1.2,
        y: piece.originalScale.y * 1.2,
        z: piece.originalScale.z * 1.2,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });
      newTweens.push(scaleTween);
      tweensRef.current.push(scaleTween);

      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        const glowColor = new THREE.Color(0x00ffff); // Cyan glow

        const emissiveTween = gsap.to(piece.mesh.material.emissive, {
          r: glowColor.r,
          g: glowColor.g,
          b: glowColor.b,
          duration: 0.3,
          ease: 'power2.out',
        });
        newTweens.push(emissiveTween);
        tweensRef.current.push(emissiveTween);

        const intensityTween = gsap.to(piece.mesh.material, {
          emissiveIntensity: 0.5, // Visible interaction feedback without blinding bloom burst
          duration: 0.3,
          ease: 'power2.out',
        });
        newTweens.push(intensityTween);
        tweensRef.current.push(intensityTween);
      }

      const worldPos = new THREE.Vector3();
      piece.mesh.getWorldPosition(worldPos);

      const screenPos = worldPos.clone().project(camera);

      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = rect.left + (screenPos.x + 1) * rect.width / 2;
      const screenY = rect.top + (-screenPos.y + 1) * rect.height / 2;

      if (onNavigationHover) {
        onNavigationHover(piece.name, piece.label, { x: screenX, y: screenY });
      }
    } else {
      hoveredNavPiecesRef.current.delete(piece.name);

      const scaleTween = gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x * 1.0,
        y: piece.originalScale.y * 1.0,
        z: piece.originalScale.z * 1.0,
        duration: 0.3,
        ease: 'power2.out',
      });
      newTweens.push(scaleTween);
      tweensRef.current.push(scaleTween);

      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        const mat = piece.mesh.material;
        const cyanColor = new THREE.Color(0x00ffff);
        const emissiveTween = gsap.to(mat.emissive, {
          r: cyanColor.r,
          g: cyanColor.g,
          b: cyanColor.b,
          duration: 0.3,
          ease: 'power2.out',
        });
        newTweens.push(emissiveTween);
        tweensRef.current.push(emissiveTween);

        const intensityTween = gsap.to(mat, {
          emissiveIntensity: 0,  // return to no emissive — match new base
          duration: 0.3,
          ease: 'power2.out',
        });
        newTweens.push(intensityTween);
        tweensRef.current.push(intensityTween);
      }

      if (onNavigationHover) {
        onNavigationHover(null, null, null);
      }
    }

    hoverTweensRef.current.set(piece.name, newTweens);
  };

  const handleNavPieceClick = (piece: NavigationPiece) => {
    const timeline = gsap.timeline({
      onStart: () => {
        setIsAnimating(true);
      },
      onComplete: () => {
        if (onNavigationClick) {
          onNavigationClick(piece.section);
        }
      },
    });
    timelinesRef.current.push(timeline);

    const worldPos = new THREE.Vector3();
    piece.mesh.getWorldPosition(worldPos);

    timeline
      .to(camera.position, {
        x: worldPos.x,
        y: worldPos.y,
        z: worldPos.z + 0.5, // Get close but not too close
        duration: 1.5,
        ease: 'power2.inOut',
      })
      .to(
        piece.mesh.scale,
        {
          x: piece.originalScale.x * 8,
          y: piece.originalScale.y * 8,
          z: piece.originalScale.z * 8,
          duration: 1.5,
          ease: 'power2.in',
        },
        '-=1.5'
      )
      .to(
        gl.domElement,
        {
          opacity: 0,
          duration: 0.5,
        },
        '-=0.5'
      );
  };

  useImperativeHandle(ref, () => ({
    navigateToSection: (section: string) => {
      if (isAnimating) return;
      const piece = navigationPieces.find(p => p.section === section);
      if (piece) {
        handleNavPieceClick(piece);
      }
    },
  }));

  useEffect(() => {
    return () => {
      timelinesRef.current.forEach((tl) => tl.kill());
      timelinesRef.current = [];

      tweensRef.current.forEach((tween) => tween.kill());
      tweensRef.current = [];
    };
  }, []);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {!isDecomposed && (
        <mesh
          ref={collisionRef}
          position={[0, 0, 0]}
          onClick={handlePointerEnter}
          visible={false}
        >
          <boxGeometry args={[3, 3, 2]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {isDecomposed &&
        navigationPieces.map((piece) => (
          <mesh
            key={`nav-collision-${piece.name}`}
            position={[piece.targetPosition.x, piece.targetPosition.y, piece.targetPosition.z]}
            onPointerEnter={() => handleNavPieceHover(piece, true)}
            onPointerLeave={() => handleNavPieceHover(piece, false)}
            onClick={() => handleNavPieceClick(piece)}
            visible={false}
          >
            <boxGeometry args={[0.8 * collisionScale, 0.8 * collisionScale, 0.5 * collisionScale]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        ))}
    </group>
  );
});

export default FracturedLogo;

useGLTF.preload('/models/3d-logo.glb');
