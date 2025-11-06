'use client';

import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { gsap } from 'gsap';

interface FracturedLogoProps {
  path: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  onNavigationHover?: (piece: string | null, label: string | null, position: THREE.Vector3 | null) => void;
  onNavigationClick?: (section: string) => void;
}

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

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

// Navigation piece configuration
const NAV_CONFIG = {
  'Piece_001': { position: new THREE.Vector3(-2, 2, 0), label: 'ABOUT', section: 'about' },
  'Piece_002': { position: new THREE.Vector3(2, 2, 0), label: 'SERVICES', section: 'services' },
  'Piece_003': { position: new THREE.Vector3(-2, -2, 0), label: 'PORTFOLIO', section: 'portfolio' },
  'Piece_004': { position: new THREE.Vector3(2, -2, 0), label: 'CONTACT', section: 'contact' },
};

export default function FracturedLogo({
  path,
  position = [0, 0, 0],
  scale = 1,
  onNavigationHover,
  onNavigationClick,
}: FracturedLogoProps) {
  const groupRef = useRef<THREE.Group>(null);
  const collisionRef = useRef<THREE.Mesh>(null);

  const [navigationPieces, setNavigationPieces] = useState<NavigationPiece[]>([]);
  const [debrisPieces, setDebrisPieces] = useState<PieceData[]>([]);
  const [isDecomposed, setIsDecomposed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load the GLTF/GLB model
  const { scene } = useGLTF(path) as GLTFResult;

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

    console.log(`Found ${allMeshes.length} meshes in the model`);

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

      // Check if this is a navigation piece (Piece_001 through Piece_004)
      if (meshName in NAV_CONFIG) {
        const config = NAV_CONFIG[meshName as keyof typeof NAV_CONFIG];
        navPieces.push({
          ...pieceData,
          targetPosition: config.position,
          label: config.label,
          section: config.section,
        });

        // Enhance material for navigation pieces
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.emissive = new THREE.Color(0x4444ff);
          mesh.material.emissiveIntensity = 0;
        }
      } else {
        // This is a debris piece
        debris.push(pieceData);

        // Make debris pieces slightly transparent when decomposed
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.transparent = true;
        }
      }
    });

    console.log(`Navigation pieces: ${navPieces.length}, Debris pieces: ${debris.length}`);

    setNavigationPieces(navPieces);
    setDebrisPieces(debris);
  }, [scene]);

  // Idle rotation animation (only when assembled)
  useFrame(() => {
    if (groupRef.current && !isDecomposed && !isAnimating) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Handle decomposition animation
  const handleDecompose = () => {
    if (isAnimating || isDecomposed) return;

    setIsAnimating(true);
    setIsDecomposed(true);

    // Animate navigation pieces to target positions
    navigationPieces.forEach((piece, index) => {
      gsap.to(piece.mesh.position, {
        x: piece.targetPosition.x,
        y: piece.targetPosition.y,
        z: piece.targetPosition.z,
        duration: 1.5,
        ease: 'power2.inOut',
        delay: index * 0.01,
      });

      gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x * 1.2,
        y: piece.originalScale.y * 1.2,
        z: piece.originalScale.z * 1.2,
        duration: 1.5,
        ease: 'power2.inOut',
        delay: index * 0.01,
      });

      // Add glow to navigation pieces
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(piece.mesh.material, {
          emissiveIntensity: 0.3,
          duration: 1.5,
          delay: index * 0.01,
        });
      }
    });

    // Animate debris pieces - explode randomly
    debrisPieces.forEach((piece, index) => {
      // Calculate random explosion vector
      const angle = Math.random() * Math.PI * 2;
      const distance = 2 + Math.random() * 3; // 2-5 units
      const height = (Math.random() - 0.5) * 2;

      const targetX = piece.originalPosition.x + Math.cos(angle) * distance;
      const targetY = piece.originalPosition.y + height;
      const targetZ = piece.originalPosition.z + Math.sin(angle) * distance;

      gsap.to(piece.mesh.position, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration: 1.5,
        ease: 'power3.out',
        delay: (index + navigationPieces.length) * 0.01,
      });

      // Random rotation
      gsap.to(piece.mesh.rotation, {
        x: piece.originalRotation.x + (Math.random() - 0.5) * Math.PI * 2,
        y: piece.originalRotation.y + (Math.random() - 0.5) * Math.PI * 2,
        z: piece.originalRotation.z + (Math.random() - 0.5) * Math.PI * 2,
        duration: 1.5,
        ease: 'power3.out',
        delay: (index + navigationPieces.length) * 0.01,
      });

      // Fade out debris
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(piece.mesh.material, {
          opacity: 0.3 + Math.random() * 0.3, // 0.3-0.6
          duration: 1.5,
          delay: (index + navigationPieces.length) * 0.01,
        });
      }
    });

    // Animation complete after 1.5s + stagger time
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500 + (navigationPieces.length + debrisPieces.length) * 10);
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

      // Remove glow
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(piece.mesh.material, {
          emissiveIntensity: 0,
          duration: 1.2,
        });
      }
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

  const handlePointerLeave = () => {
    handleRecompose();
  };

  // Navigation piece hover handlers
  const handleNavPieceHover = (piece: NavigationPiece, isHovering: boolean) => {
    if (!isDecomposed || isAnimating) return;

    if (isHovering) {

      // Scale up on hover
      gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x * 1.3,
        y: piece.originalScale.y * 1.3,
        z: piece.originalScale.z * 1.3,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });

      // Increase glow
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(piece.mesh.material, {
          emissiveIntensity: 0.8,
          duration: 0.3,
        });
      }

      // Get world position for label
      const worldPos = new THREE.Vector3();
      piece.mesh.getWorldPosition(worldPos);

      if (onNavigationHover) {
        onNavigationHover(piece.name, piece.label, worldPos);
      }
    } else {

      // Scale back to decomposed size
      gsap.to(piece.mesh.scale, {
        x: piece.originalScale.x * 1.2,
        y: piece.originalScale.y * 1.2,
        z: piece.originalScale.z * 1.2,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Return to normal glow
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(piece.mesh.material, {
          emissiveIntensity: 0.3,
          duration: 0.3,
        });
      }

      if (onNavigationHover) {
        onNavigationHover(null, null, null);
      }
    }
  };

  // Navigation piece click handler
  const handleNavPieceClick = (piece: NavigationPiece) => {
    console.log(`Navigating to: ${piece.section.toUpperCase()}`);
    if (onNavigationClick) {
      onNavigationClick(piece.section);
    }
  };

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
            <boxGeometry args={[0.8, 0.8, 0.5]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        ))}

      {/* Large collision mesh for mouse leave detection when decomposed */}
      {isDecomposed && (
        <mesh
          position={[0, 0, 0]}
          onPointerLeave={handlePointerLeave}
          visible={false}
        >
          <boxGeometry args={[12, 12, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/3d-logo.glb');
