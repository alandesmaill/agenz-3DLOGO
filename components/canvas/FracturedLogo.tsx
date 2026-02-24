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

// Removed custom GLTFResult type - using GLTF from three-stdlib directly

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

// Navigation sections and their target positions
// Compact U-shaped arrangement - tight horizontal, clear vertical spacing
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

  // Access camera and renderer for zoom animation
  const { camera, gl } = useThree();

  // OPTIMIZATION: Track GSAP timelines for cleanup
  const timelinesRef = useRef<gsap.core.Timeline[]>([]);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  // Track hover tweens per piece to prevent animation conflicts
  const hoverTweensRef = useRef<Map<string, gsap.core.Tween[]>>(new Map());
  const debrisOrbitsRef = useRef<DebrisOrbit[]>([]);
  const hoveredNavPiecesRef = useRef<Set<string>>(new Set());

  // OPTIMIZATION: Detect reduced motion preference for accessibility
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // OPTIMIZATION: Larger collision areas for mobile devices
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const collisionScale = isMobile ? 1.5 : 1.0;

  // Load the GLTF/GLB model
  const { scene } = useGLTF(path);

  // Initialize pieces on mount
  useEffect(() => {
    if (!groupRef.current) return;

    // Clone the scene to avoid mutating the original
    const clonedScene = scene.clone();
    groupRef.current.add(clonedScene);

    // Find all meshes and categorize them
    const allMeshes: THREE.Mesh[] = [];
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        allMeshes.push(child);
      }
    });

    // OPTIMIZATION: Calculate bounding box volume efficiently
    interface MeshWithVolume {
      mesh: THREE.Mesh;
      volume: number;
      index: number;
      name: string;
    }

    const meshesWithVolume: MeshWithVolume[] = allMeshes.map((mesh, index) => {
      // Use geometry bounding box if available (faster than setFromObject)
      const geometry = mesh.geometry;
      if (!geometry.boundingBox) {
        geometry.computeBoundingBox();
      }

      const box = geometry.boundingBox!;
      const size = new THREE.Vector3();
      box.getSize(size);

      // Account for mesh scale
      const scaleVolume = mesh.scale.x * mesh.scale.y * mesh.scale.z;
      const volume = size.x * size.y * size.z * scaleVolume;

      return {
        mesh,
        volume,
        index,
        name: mesh.name,
      };
    });

    // Sort by volume (largest first) and take top 4
    meshesWithVolume.sort((a, b) => b.volume - a.volume);
    const largestFour = meshesWithVolume.slice(0, 4);

    // Separate navigation pieces from debris
    const navPieces: NavigationPiece[] = [];
    const debris: PieceData[] = [];

    allMeshes.forEach((mesh, index) => {
      const meshName = mesh.name;

      // Store original transforms
      const pieceData: PieceData = {
        mesh,
        originalPosition: mesh.position.clone(),
        originalRotation: mesh.rotation.clone(),
        originalScale: mesh.scale.clone(),
        name: meshName,
        index,
      };

      // Check if this is one of the 4 largest pieces
      const largestIndex = largestFour.findIndex(item => item.mesh === mesh);

      // Enhance materials for better appearance on white background
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        // Clone material to avoid affecting other instances
        const material = mesh.material.clone();
        mesh.material = material;

        // Calculate brightness to detect dark pieces (0-1 range)
        const brightness = (material.color.r + material.color.g + material.color.b) / 3;

        if (largestIndex !== -1) {
          // NAVIGATION PIECES - Keep brand colors, add visual weight
          // Preserve original brand colors (cyan/green)

          // Detect if this navigation piece is too dark
          if (brightness < 0.25) {
            // DARK NAVIGATION PIECE - Lighten and give strong emissive so it's never invisible
            material.color.multiplyScalar(2.5);
            material.emissiveIntensity = 0.45;
          } else {
            // BRIGHT NAVIGATION PIECE (cyan/green) - Keep as is
            material.emissiveIntensity = 0.25;
          }

          // Add emissive glow in brand colors for depth
          material.emissive.copy(material.color);

          // High metalness + low roughness = picks up colored lights, specular highlights
          material.metalness = 0.9;
          material.roughness = 0.15;

          // Enable transparency for animations
          material.transparent = true;
        } else {
          // DEBRIS PIECES - Handle dark vs bright pieces differently

          if (brightness < 0.25) {
            material.color.multiplyScalar(2.0);
            material.emissiveIntensity = 0.3;
            material.emissive.copy(material.color);
          } else {
            material.color.multiplyScalar(0.75);
            material.emissiveIntensity = 0.15;
            material.emissive.copy(material.color);
          }

          material.metalness = 0.9;
          material.roughness = 0.15;
          material.transparent = true;
        }
      }

      if (largestIndex !== -1) {
        // This is a navigation piece - assign section based on largest order
        const config = NAV_SECTIONS[largestIndex];
        navPieces.push({
          ...pieceData,
          targetPosition: config.position,
          label: config.label,
          section: config.section,
        });
      } else {
        // This is a debris piece
        debris.push(pieceData);
      }
    });

    setNavigationPieces(navPieces);
    setDebrisPieces(debris);

    // Cinematic camera introduction - zoom from far away
    const originalCameraPos = camera.position.clone();
    camera.position.set(0, 2, 15); // Start further back and slightly above

    gsap.to(camera.position, {
      x: originalCameraPos.x,
      y: originalCameraPos.y,
      z: originalCameraPos.z,
      duration: 3.5,
      ease: 'power2.inOut',
    });

    // Classic landing animation - fade in and scale up
    if (groupRef.current) {
      // Start with logo at smaller scale
      groupRef.current.scale.set(0.8, 0.8, 0.8);

      // Make all pieces invisible initially
      [...navPieces, ...debris].forEach((piece) => {
        if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
          piece.mesh.material.opacity = 0;
          piece.mesh.material.transparent = true;
        }
      });

      // Wait a moment for camera to start moving, then fade in the logo
      setTimeout(() => {
        // Fade in the logo meshes with subtle stagger
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

        // Smooth scale up to final size
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

  // OPTIMIZATION: Frame-rate independent animation with delta
  useFrame((state, delta) => {
    if (groupRef.current && !isDecomposed && !isAnimating) {
      if (!prefersReducedMotion) {
        const targetRotX = -state.mouse.y * 0.3;  // tilt up/down (inverted Y)
        const targetRotY =  state.mouse.x * 0.5;  // rotate left/right
        // Smooth lerp toward target (frame-rate independent)
        groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * Math.min(delta * 3, 1);
        groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * Math.min(delta * 3, 1);
      }
    }

    // Floating animation for navigation pieces (only when decomposed)
    // Skip floating animation if reduced motion is preferred
    if (isDecomposed && !isAnimating && !prefersReducedMotion) {
      const time = state.clock.getElapsedTime();

      navigationPieces.forEach((piece, index) => {
        // Gentle float
        const floatOffset = index * 0.5;
        const floatY = Math.sin(time * 0.8 + floatOffset) * 0.1;
        piece.mesh.position.y = piece.targetPosition.y + floatY;
        piece.mesh.rotation.y += delta * 0.5;

        // Pulse glow only when not being hovered (to avoid fighting GSAP hover tween)
        if (
          !hoveredNavPiecesRef.current.has(piece.name) &&
          piece.mesh.material instanceof THREE.MeshStandardMaterial
        ) {
          piece.mesh.material.emissiveIntensity = 0.65 + 0.25 * Math.sin(time * 1.5 + index * 0.8);
          // Range: 0.4–0.9
        }
      });

      // Orbital motion for debris pieces
      debrisPieces.forEach((piece, i) => {
        const orbit = debrisOrbitsRef.current[i];
        if (!orbit) return;

        // Advance orbit angle
        orbit.orbitAngle += delta * orbit.orbitSpeed;

        // Compute absolute orbital position (2 trig calls per piece)
        const cosA = Math.cos(orbit.orbitAngle);
        const sinA = Math.sin(orbit.orbitAngle);
        piece.mesh.position.set(
          orbit.orbitCenter.x + orbit.orbitU.x * cosA * orbit.orbitRadius + orbit.orbitV.x * sinA * orbit.orbitRadius,
          orbit.orbitCenter.y + orbit.orbitU.y * cosA * orbit.orbitRadius + orbit.orbitV.y * sinA * orbit.orbitRadius,
          orbit.orbitCenter.z + orbit.orbitU.z * cosA * orbit.orbitRadius + orbit.orbitV.z * sinA * orbit.orbitRadius,
        );

        // Self-tumble rotation
        piece.mesh.rotation.x += delta * orbit.rotSpeedX;
        piece.mesh.rotation.y += delta * orbit.rotSpeedY;
      });
    }
  });

  // Handle decomposition animation - ALL AT ONCE
  const handleDecompose = () => {
    if (isAnimating || isDecomposed) return;

    setIsAnimating(true);
    setIsDecomposed(true);

    // Notify parent that decomposition has started
    if (onDecompose) {
      onDecompose();
    }

    // OPTIMIZATION: Respect reduced motion preference
    const animDuration = prefersReducedMotion ? 0.5 : 4.0;

    // Animate navigation pieces to FRONT (positive z)
    // NO DELAY - all execute at once
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

      // Keep original scale (no scaling up)
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

    // Animate debris pieces to orbital start positions
    debrisOrbitsRef.current = []; // reset

    debrisPieces.forEach((piece, i) => {
      // --- Compute orbital parameters ---
      const radius = 2.0 + Math.random() * 2.5;          // 2.0–4.5 units
      const speed = (0.015 + Math.random() * 0.04) * (Math.random() < 0.5 ? 1 : -1); // ~5x slower: ±0.015–0.055 rad/s
      const startAngle = Math.random() * Math.PI * 2;
      const inclination = Math.random() * Math.PI;         // 0–180°
      const lan = Math.random() * Math.PI * 2;             // longitude of ascending node

      // Orbital plane basis vectors (perpendicular pair)
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

      // Orbit center is always behind nav pieces (nav pieces at Z=+1.0)
      const orbitCenter = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.0,
        -2.5 + (Math.random() - 0.5) * 1.0   // Z range: -2.0 to -3.0
      );

      // Store orbit params (indexed to match debrisPieces array)
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

      // Compute target position = orbital starting position
      const cosA = Math.cos(startAngle);
      const sinA = Math.sin(startAngle);
      const targetX = orbitCenter.x + orbitU.x * cosA * radius + orbitV.x * sinA * radius;
      const targetY = orbitCenter.y + orbitU.y * cosA * radius + orbitV.y * sinA * radius;
      const targetZ = orbitCenter.z + orbitU.z * cosA * radius + orbitV.z * sinA * radius;

      // GSAP animate to orbital start position
      const posTween = gsap.to(piece.mesh.position, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration: animDuration,
        ease: 'power3.out',
        delay: 0,
      });
      tweensRef.current.push(posTween);

      // Random rotation during explosion
      const rotTween = gsap.to(piece.mesh.rotation, {
        x: piece.originalRotation.x + (Math.random() - 0.5) * Math.PI * 2,
        y: piece.originalRotation.y + (Math.random() - 0.5) * Math.PI * 2,
        z: piece.originalRotation.z + (Math.random() - 0.5) * Math.PI * 2,
        duration: animDuration,
        ease: 'power3.out',
        delay: 0,
      });
      tweensRef.current.push(rotTween);

      // Fade debris to semi-transparent
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        const opacityTween = gsap.to(piece.mesh.material, {
          opacity: 0.25 + Math.random() * 0.2,  // 0.25–0.45
          duration: animDuration,
          delay: 0,
        });
        tweensRef.current.push(opacityTween);
      }
    });

    // Ramp up emissive glow on all 4 nav pieces once explosion starts
    navigationPieces.forEach((piece) => {
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        piece.mesh.material.emissive.copy(piece.mesh.material.color);
        const glowTween = gsap.to(piece.mesh.material, {
          emissiveIntensity: 0.8,
          duration: 2.0,
          ease: 'power2.out',
          delay: 0,
        });
        tweensRef.current.push(glowTween);
      }
    });

    // Animation complete after duration (no stagger needed)
    const totalDelay = prefersReducedMotion ? 500 : 4000;
    setTimeout(() => {
      setIsAnimating(false);
      if (onDecomposeComplete) {
        onDecomposeComplete();
      }
    }, totalDelay);
  };

  // Global hover handlers
  const handlePointerEnter = () => {
    if (!isAnimating) {
      handleDecompose();
    }
  };

  // Removed: handlePointerLeave to prevent auto-reassembly
  // The logo now decomposes once and stays decomposed

  // Navigation piece hover handlers
  const handleNavPieceHover = (piece: NavigationPiece, isHovering: boolean) => {
    if (!isDecomposed || isAnimating) return;

    // Kill previous hover tweens for this piece to prevent conflicts
    const prevTweens = hoverTweensRef.current.get(piece.name) || [];
    prevTweens.forEach(t => t.kill());
    const newTweens: gsap.core.Tween[] = [];

    if (isHovering) {
      hoveredNavPiecesRef.current.add(piece.name);

      // Scale up on hover (from 1.0 to 1.2)
      const scaleTween = gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x * 1.2,
        y: piece.originalScale.y * 1.2,
        z: piece.originalScale.z * 1.2,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });
      newTweens.push(scaleTween);
      tweensRef.current.push(scaleTween);

      // Add glow effect with bloom
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
          emissiveIntensity: 1.4, // More dramatic hover glow
          duration: 0.3,
          ease: 'power2.out',
        });
        newTweens.push(intensityTween);
        tweensRef.current.push(intensityTween);
      }

      // Get world position and convert to screen coordinates
      const worldPos = new THREE.Vector3();
      piece.mesh.getWorldPosition(worldPos);

      // Project 3D world position to 2D screen position using proper camera projection
      const screenPos = worldPos.clone().project(camera);

      // Convert normalized device coordinates (-1 to 1) to screen pixels
      const canvas = gl.domElement;
      const rect = canvas.getBoundingClientRect();
      const screenX = rect.left + (screenPos.x + 1) * rect.width / 2;
      const screenY = rect.top + (-screenPos.y + 1) * rect.height / 2;

      if (onNavigationHover) {
        onNavigationHover(piece.name, piece.label, { x: screenX, y: screenY });
      }
    } else {
      hoveredNavPiecesRef.current.delete(piece.name);

      // Scale back to decomposed size (1.0)
      const scaleTween = gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x * 1.0,
        y: piece.originalScale.y * 1.0,
        z: piece.originalScale.z * 1.0,
        duration: 0.3,
        ease: 'power2.out',
      });
      newTweens.push(scaleTween);
      tweensRef.current.push(scaleTween);

      // Return emissive to piece's own color at base glow level (not dead/dark)
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        const mat = piece.mesh.material;
        const emissiveTween = gsap.to(mat.emissive, {
          r: mat.color.r,
          g: mat.color.g,
          b: mat.color.b,
          duration: 0.3,
          ease: 'power2.out',
        });
        newTweens.push(emissiveTween);
        tweensRef.current.push(emissiveTween);

        const intensityTween = gsap.to(mat, {
          emissiveIntensity: 0.7,   // return to base glow, not 0
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

    // Store new tweens for this piece
    hoverTweensRef.current.set(piece.name, newTweens);
  };

  // Navigation piece click handler with camera zoom animation
  const handleNavPieceClick = (piece: NavigationPiece) => {
    // Create camera dive animation timeline (track for cleanup)
    const timeline = gsap.timeline({
      onStart: () => {
        setIsAnimating(true);
      },
      onComplete: () => {
        // Notify parent component that zoom is complete
        if (onNavigationClick) {
          onNavigationClick(piece.section);
        }
      },
    });
    timelinesRef.current.push(timeline);

    // Get world position of the piece
    const worldPos = new THREE.Vector3();
    piece.mesh.getWorldPosition(worldPos);

    timeline
      // 1. Zoom camera INTO the piece
      .to(camera.position, {
        x: worldPos.x,
        y: worldPos.y,
        z: worldPos.z + 0.5, // Get close but not too close
        duration: 1.5,
        ease: 'power2.inOut',
      })
      // 2. Scale piece up to fill view (simultaneously with camera zoom)
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
      // 3. Fade to white (using DOM element opacity)
      .to(
        gl.domElement,
        {
          opacity: 0,
          duration: 0.5,
        },
        '-=0.5'
      );
  };

  // Expose imperative handle for DOM-driven navigation
  useImperativeHandle(ref, () => ({
    navigateToSection: (section: string) => {
      if (isAnimating) return;
      const piece = navigationPieces.find(p => p.section === section);
      if (piece) {
        handleNavPieceClick(piece);
      }
    },
  }));

  // OPTIMIZATION: Cleanup GSAP animations on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Kill all tracked timelines
      timelinesRef.current.forEach((tl) => tl.kill());
      timelinesRef.current = [];

      // Kill all tracked tweens
      tweensRef.current.forEach((tween) => tween.kill());
      tweensRef.current = [];
    };
  }, []);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Global collision mesh for hover detection (only visible when assembled) */}
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

      {/* Collision meshes for navigation pieces (only when decomposed) */}
      {/* OPTIMIZATION: Larger hit areas for mobile devices */}
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

// Preload the model
useGLTF.preload('/models/3d-logo.glb');
