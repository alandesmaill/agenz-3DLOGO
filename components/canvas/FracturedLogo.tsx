'use client';

import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { gsap } from 'gsap';

interface FracturedLogoProps {
  path: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  onNavigationHover?: (piece: string | null, label: string | null, screenPosition: { x: number; y: number } | null) => void;
  onNavigationClick?: (section: string) => void;
  onDecompose?: () => void;
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

// Navigation sections and their target positions
// Compact U-shaped arrangement - tight horizontal, clear vertical spacing
const NAV_SECTIONS = [
  { section: 'about', label: 'ABOUT', position: new THREE.Vector3(-0.6, 1.5, 1.0) },      // Top-left
  { section: 'works', label: 'WORKS', position: new THREE.Vector3(0.6, 1.5, 1.0) },       // Top-right
  { section: 'services', label: 'SERVICES', position: new THREE.Vector3(-0.6, 0.5, 1.0) }, // Bottom-left
  { section: 'contact', label: 'CONTACT', position: new THREE.Vector3(0.6, 0.5, 1.0) },   // Bottom-right
];

export default function FracturedLogo({
  path,
  position = [0, 0, 0],
  scale = 1,
  onNavigationHover,
  onNavigationClick,
  onDecompose,
}: FracturedLogoProps) {
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
            // DARK NAVIGATION PIECE - Lighten significantly to show geometry
            material.color.multiplyScalar(2.2); // Brighten dark pieces
            material.emissiveIntensity = 0.2; // Higher emissive for dark pieces
          } else {
            // BRIGHT NAVIGATION PIECE (cyan/green) - Keep as is
            material.emissiveIntensity = 0.1; // Subtle inner glow
          }

          // Add emissive glow in brand colors for depth
          material.emissive.copy(material.color);

          // Premium solid look with higher metalness and lower roughness
          material.metalness = 0.7; // More reflective for better visibility
          material.roughness = 0.4; // Shinier, premium feel

          // Enable transparency for animations
          material.transparent = true;
        } else {
          // DEBRIS PIECES - Handle dark vs bright pieces differently

          if (brightness < 0.25) {
            // DARK DEBRIS PIECE - Lighten to show geometry (opposite of bright pieces)
            material.color.multiplyScalar(1.8); // Lighten instead of darken
            material.emissiveIntensity = 0.15; // Add emissive to dark debris
            material.emissive.copy(material.color);
          } else {
            // BRIGHT DEBRIS PIECE - Darken slightly for contrast
            material.color.multiplyScalar(0.7); // Darken bright pieces
            material.emissiveIntensity = 0.05; // Subtle emissive
            material.emissive.copy(material.color);
          }

          // Same material properties for consistency
          material.metalness = 0.7; // Increased from 0.6 for more reflections
          material.roughness = 0.4;
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
      // FIXED: Use delta for frame-rate independence
      // Very slow rotation (reduced from 0.3 to 0.02)
      if (!prefersReducedMotion) {
        groupRef.current.rotation.y += delta * 0.02;
      }
    }

    // Floating animation for navigation pieces (only when decomposed)
    // Skip floating animation if reduced motion is preferred
    if (isDecomposed && !isAnimating && !prefersReducedMotion) {
      const time = state.clock.getElapsedTime();

      navigationPieces.forEach((piece, index) => {
        // Gentle up-down floating motion with offset per piece
        const floatOffset = index * 0.5; // Offset the wave for each piece
        const floatY = Math.sin(time * 0.8 + floatOffset) * 0.1;
        piece.mesh.position.y = piece.targetPosition.y + floatY;

        // FIXED: Use delta for frame-rate independence
        // Slowed down rotation from 1.5 to 0.5 (3x slower)
        piece.mesh.rotation.y += delta * 0.5;
      });

      // Subtle looping motion for debris pieces in background
      debrisPieces.forEach((piece) => {
        // Each piece has unique timing based on its index
        const offset = piece.index * 0.3;

        // Very gentle floating motion with very slow frequencies
        const floatX = Math.sin(time * 0.1 + offset) * 0.05;
        const floatY = Math.cos(time * 0.12 + offset * 1.5) * 0.08;
        const floatZ = Math.sin(time * 0.08 + offset * 2) * 0.05;

        // Apply extremely subtle movement to current position
        piece.mesh.position.x += floatX * 0.02;
        piece.mesh.position.y += floatY * 0.02;
        piece.mesh.position.z += floatZ * 0.02;

        // Extremely slow continuous rotation (barely noticeable)
        piece.mesh.rotation.x += delta * 0.01;
        piece.mesh.rotation.y += delta * 0.015;
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
      gsap.to(piece.mesh.position, {
        x: piece.targetPosition.x,
        y: piece.targetPosition.y,
        z: piece.targetPosition.z, // Already set to z:2 in NAV_SECTIONS
        duration: animDuration,
        ease: 'power3.out', // SMOOTH like debris
        delay: 0, // ALL AT ONCE
      });

      // Keep original scale (no scaling up)
      gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x * 1.0,
        y: piece.originalScale.y * 1.0,
        z: piece.originalScale.z * 1.0,
        duration: animDuration,
        ease: 'power3.out', // SMOOTH like debris
        delay: 0, // ALL AT ONCE
      });
    });

    // Animate debris pieces to BACK (negative z)
    // NO DELAY - all execute at once
    debrisPieces.forEach((piece) => {
      // Calculate random scatter in x/y, but ALWAYS push to back (negative z)
      const angle = Math.random() * Math.PI * 2;
      const distance = 2 + Math.random() * 3; // 2-5 units
      const height = (Math.random() - 0.5) * 2;

      const targetX = piece.originalPosition.x + Math.cos(angle) * distance;
      const targetY = piece.originalPosition.y + height;
      // PUSH TO BACK: negative z between -0.5 and -1 (very close, just behind nav)
      const targetZ = piece.originalPosition.z - (0.5 + Math.random() * 0.5);

      gsap.to(piece.mesh.position, {
        x: targetX,
        y: targetY,
        z: targetZ, // NEGATIVE Z = BACK
        duration: animDuration,
        ease: 'power3.out',
        delay: 0, // ALL AT ONCE
      });

      // Random rotation
      gsap.to(piece.mesh.rotation, {
        x: piece.originalRotation.x + (Math.random() - 0.5) * Math.PI * 2,
        y: piece.originalRotation.y + (Math.random() - 0.5) * Math.PI * 2,
        z: piece.originalRotation.z + (Math.random() - 0.5) * Math.PI * 2,
        duration: animDuration,
        ease: 'power3.out',
        delay: 0, // ALL AT ONCE
      });

      // Fade out debris
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(piece.mesh.material, {
          opacity: 0.3 + Math.random() * 0.3, // 0.3-0.6
          duration: animDuration,
          delay: 0, // ALL AT ONCE
        });
      }
    });

    // Animation complete after duration (no stagger needed)
    const totalDelay = prefersReducedMotion ? 500 : 4000;
    setTimeout(() => {
      setIsAnimating(false);
    }, totalDelay);
  };

  // Handle recomposition animation
  const handleRecompose = () => {
    if (isAnimating || !isDecomposed) return;

    setIsAnimating(true);
    setIsDecomposed(false);

    // Clear any active hover labels
    if (onNavigationHover) {
      onNavigationHover(null, null, null);
    }

    // Return navigation pieces to original positions
    navigationPieces.forEach((piece) => {
      gsap.to(piece.mesh.position, {
        x: piece.originalPosition.x,
        y: piece.originalPosition.y,
        z: piece.originalPosition.z,
        duration: 1.2,
        ease: 'power2.inOut',
      });

      gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x,
        y: piece.originalScale.y,
        z: piece.originalScale.z,
        duration: 1.2,
        ease: 'power2.inOut',
      });
    });

    // Return debris pieces to original positions
    debrisPieces.forEach((piece) => {
      gsap.to(piece.mesh.position, {
        x: piece.originalPosition.x,
        y: piece.originalPosition.y,
        z: piece.originalPosition.z,
        duration: 1.2,
        ease: 'power2.inOut',
      });

      gsap.to(piece.mesh.rotation, {
        x: piece.originalRotation.x,
        y: piece.originalRotation.y,
        z: piece.originalRotation.z,
        duration: 1.2,
        ease: 'power2.inOut',
      });

      // Restore opacity
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(piece.mesh.material, {
          opacity: 1,
          duration: 1.2,
        });
      }
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 1200);
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

    if (isHovering) {
      // Scale up on hover (from 1.0 to 1.2)
      gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x * 1.2,
        y: piece.originalScale.y * 1.2,
        z: piece.originalScale.z * 1.2,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });

      // Add glow effect with bloom
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        // Set emissive color to brand colors for bloom effect
        const originalEmissive = piece.mesh.material.emissive.clone();
        const glowColor = new THREE.Color(0x00ffff); // Cyan glow

        gsap.to(piece.mesh.material.emissive, {
          r: glowColor.r,
          g: glowColor.g,
          b: glowColor.b,
          duration: 0.3,
          ease: 'power2.out',
        });

        gsap.to(piece.mesh.material, {
          emissiveIntensity: 0.5, // Gentle glow (reduced from 2.5)
          duration: 0.3,
          ease: 'power2.out',
        });
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
      // Scale back to decomposed size (1.0)
      gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x * 1.0,
        y: piece.originalScale.y * 1.0,
        z: piece.originalScale.z * 1.0,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Remove glow effect
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(piece.mesh.material.emissive, {
          r: 0,
          g: 0,
          b: 0,
          duration: 0.3,
          ease: 'power2.out',
        });

        gsap.to(piece.mesh.material, {
          emissiveIntensity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      if (onNavigationHover) {
        onNavigationHover(null, null, null);
      }
    }
  };

  // Navigation piece click handler with camera zoom animation
  const handleNavPieceClick = (piece: NavigationPiece) => {
    // Store original camera position for potential reset
    const originalCameraPos = camera.position.clone();

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
          onPointerEnter={handlePointerEnter}
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
}

// Preload the model
useGLTF.preload('/models/3d-logo.glb');
