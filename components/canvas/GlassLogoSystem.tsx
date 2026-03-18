'use client';

import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

// ─── Types ───────────────────────────────────────────────────────────────────

type LogoPhase = 'intact' | 'exploding' | 'settled';

export interface GlassLogoHandle {
  navigateToSection: (section: string) => void;
}

export interface NavPieceScreenPositions {
  about: { x: number; y: number } | null;
  works: { x: number; y: number } | null;
  services: { x: number; y: number } | null;
  contact: { x: number; y: number } | null;
}

interface GlassLogoSystemProps {
  position?: [number, number, number];
  scale?: number;
  onNavigationClick?: (section: string) => void;
  onExplode?: () => void;
  onSettled?: () => void;
  onNavPiecePositions?: (positions: NavPieceScreenPositions) => void;
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
  orbitAngle: number;
  orbitSpeed: number;
  orbitRadius: number;
  orbitCenter: THREE.Vector3;
  orbitU: THREE.Vector3;
  orbitV: THREE.Vector3;
  rotSpeedX: number;
  rotSpeedY: number;
}

// ─── Reusable objects (avoid per-frame / per-event allocations) ─────────────
const _wp   = new THREE.Vector3();
const _sp   = new THREE.Vector3();
const _cyan = new THREE.Color(0x00ffff);

// ─── Constants ───────────────────────────────────────────────────────────────

const NAV_SECTIONS_DESKTOP = [
  { section: 'about',    label: 'ABOUT',    position: new THREE.Vector3(-0.6, 1.1, 1.5) },
  { section: 'works',    label: 'WORKS',    position: new THREE.Vector3( 0.6, 1.1, 1.5) },
  { section: 'services', label: 'SERVICES', position: new THREE.Vector3(-0.6, 0.3, 1.5) },
  { section: 'contact',  label: 'CONTACT',  position: new THREE.Vector3( 0.6, 0.3, 1.5) },
];

const NAV_SECTIONS_MOBILE = [
  { section: 'about',    label: 'ABOUT',    position: new THREE.Vector3(-0.32, 1.1, 1.5) },
  { section: 'works',    label: 'WORKS',    position: new THREE.Vector3( 0.32, 1.1, 1.5) },
  { section: 'services', label: 'SERVICES', position: new THREE.Vector3(-0.32, 0.3, 1.5) },
  { section: 'contact',  label: 'CONTACT',  position: new THREE.Vector3( 0.32, 0.3, 1.5) },
];

const NAV_SCALE_MULTIPLIER_DESKTOP = 1.0;
const NAV_SCALE_MULTIPLIER_MOBILE  = 0.55;

// ─── Component ───────────────────────────────────────────────────────────────

const GlassLogoSystem = forwardRef<GlassLogoHandle, GlassLogoSystemProps>(function GlassLogoSystem({
  position = [0, 0, 0],
  scale = 1,
  onNavigationClick,
  onExplode,
  onSettled,
  onNavPiecePositions,
}: GlassLogoSystemProps, ref) {
  const intactGroupRef    = useRef<THREE.Group>(null);
  const fracturedGroupRef = useRef<THREE.Group>(null);
  const phaseRef          = useRef<LogoPhase>('intact');
  const navigationPiecesRef = useRef<NavigationPiece[]>([]);
  const debrisPiecesRef     = useRef<PieceData[]>([]);
  const debrisOrbitsRef     = useRef<DebrisOrbit[]>([]);
  const tweensRef           = useRef<gsap.core.Tween[]>([]);
  const timelinesRef        = useRef<gsap.core.Timeline[]>([]);
  const timerIdsRef         = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hoverTweensRef      = useRef<Map<string, gsap.core.Tween[]>>(new Map());
  const isAnimatingRef      = useRef(false);
  const domRectRef          = useRef<DOMRect | null>(null);

  const [phase, setPhase] = useState<LogoPhase>('intact');
  // Trigger re-render once fractured pieces are ready so collision meshes mount
  const [fracturedReady, setFracturedReady] = useState(false);

  const { camera, gl } = useThree();

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  const collisionScale      = isMobile ? 1.5 : 1.0;
  const navSections         = isMobile ? NAV_SECTIONS_MOBILE : NAV_SECTIONS_DESKTOP;
  const navScaleMultiplier  = isMobile ? NAV_SCALE_MULTIPLIER_MOBILE : NAV_SCALE_MULTIPLIER_DESKTOP;

  // ─── Load models ───────────────────────────────────────────────────────────

  const { scene: intactScene }    = useGLTF('/models/model 2/Z.glb');
  const { scene: fracturedScene } = useGLTF('/models/model 2/Z1.glb');

  // ─── Z.glb (intact) — cinematic intro ──────────────────────────────────────

  useEffect(() => {
    if (!intactGroupRef.current) return;
    const intactGroup = intactGroupRef.current;

    const cloned = intactScene.clone();
    intactGroup.add(cloned);

    const allMeshes: THREE.Mesh[] = [];
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          const mat = child.material.clone();
          child.material = mat;
          mat.transparent = true;
          mat.opacity = 0;
        }
        allMeshes.push(child);
      }
    });

    // Cinematic camera intro
    const originalCameraPos = camera.position.clone();
    camera.position.set(0, 2, 15);
    const cameraTween = gsap.to(camera.position, {
      x: originalCameraPos.x,
      y: originalCameraPos.y,
      z: originalCameraPos.z,
      duration: 3.5,
      ease: 'power2.inOut',
    });
    tweensRef.current.push(cameraTween);

    // Start small, scale up after camera starts moving
    intactGroup.scale.set(0.8, 0.8, 0.8);

    const t1 = setTimeout(() => {
      allMeshes.forEach((mesh, index) => {
        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          const tween = gsap.to(mesh.material, {
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            delay: index * 0.003,
          });
          tweensRef.current.push(tween);
        }
      });

      const scaleTween = gsap.to(intactGroup.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 2.0,
        ease: 'power2.out',
      });
      tweensRef.current.push(scaleTween);
    }, 800);
    timerIdsRef.current.push(t1);

    return () => {
      cloned.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.dispose();
          child.geometry.dispose();
        }
      });
      intactGroup.remove(cloned);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intactScene]);

  // ─── Z1.glb (fractured) — initialize pieces, keep hidden ──────────────────

  useEffect(() => {
    if (!fracturedGroupRef.current) return;

    const cloned = fracturedScene.clone();
    fracturedGroupRef.current.add(cloned);
    fracturedGroupRef.current.visible = false;

    const allMeshes: THREE.Mesh[] = [];
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material instanceof THREE.MeshStandardMaterial) {
          const mat = child.material.clone();
          child.material = mat;
          mat.transparent = true;
        }
        allMeshes.push(child);
      }
    });

    // Reparent every mesh directly to fracturedGroupRef so that mesh.position
    // is in world space (fracturedGroupRef sits at origin, scale=1).
    // This eliminates glTF intermediate-node offsets that would otherwise shift
    // pieces away from their intended target positions.
    allMeshes.forEach(mesh => fracturedGroupRef.current!.attach(mesh));
    fracturedGroupRef.current.remove(cloned);

    // Volume-sort to identify 4 nav pieces
    const meshesWithVolume = allMeshes.map((mesh, index) => {
      const geometry = mesh.geometry;
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const box = geometry.boundingBox!;
      const size = new THREE.Vector3();
      box.getSize(size);
      const vol = size.x * size.y * size.z * mesh.scale.x * mesh.scale.y * mesh.scale.z;
      return { mesh, volume: vol, index, name: mesh.name };
    });

    meshesWithVolume.sort((a, b) => b.volume - a.volume);
    const largestFour = meshesWithVolume.slice(0, 4);

    const navPieces: NavigationPiece[] = [];
    const debris: PieceData[] = [];

    allMeshes.forEach((mesh, index) => {
      const pieceData: PieceData = {
        mesh,
        originalPosition: mesh.position.clone(),
        originalRotation: mesh.rotation.clone(),
        originalScale: mesh.scale.clone(),
        name: mesh.name || `piece_${index}`,
        index,
      };

      const largestIndex = largestFour.findIndex(item => item.mesh === mesh);

      if (largestIndex !== -1) {
        const config = navSections[largestIndex];
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

    navigationPiecesRef.current = navPieces;
    debrisPiecesRef.current     = debris;
    setFracturedReady(true);

    return () => {
      allMeshes.forEach((mesh) => {
        if (mesh.material instanceof THREE.Material) mesh.material.dispose();
        mesh.geometry.dispose();
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fracturedScene]);

  // ─── Decompose animation ───────────────────────────────────────────────────

  const startDecomposeAnimation = () => {
    const dur     = prefersReducedMotion ? 0.5 : 4.0;
    const navPieces = navigationPiecesRef.current;
    const debris    = debrisPiecesRef.current;

    // Nav pieces → target positions
    navPieces.forEach((piece) => {
      tweensRef.current.push(
        gsap.to(piece.mesh.position, {
          x: piece.targetPosition.x,
          y: piece.targetPosition.y,
          z: piece.targetPosition.z,
          duration: dur,
          ease: 'power3.out',
          delay: 0,
        })
      );
      tweensRef.current.push(
        gsap.to(piece.mesh.scale, {
          x: piece.originalScale.x * navScaleMultiplier,
          y: piece.originalScale.y * navScaleMultiplier,
          z: piece.originalScale.z * navScaleMultiplier,
          duration: dur,
          ease: 'power3.out',
          delay: 0,
        })
      );
    });

    // Emissive ramp on nav pieces
    navPieces.forEach((piece) => {
      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        piece.mesh.material.emissive.set(0x00ffff);
        tweensRef.current.push(
          gsap.to(piece.mesh.material, {
            emissiveIntensity: 0,
            duration: 2.0,
            ease: 'power2.out',
          })
        );
      }
    });

    // Debris → orbital start positions
    debrisOrbitsRef.current = [];

    debris.forEach((piece, i) => {
      const radius    = 2.0 + Math.random() * 2.5;
      const speed     = (0.015 + Math.random() * 0.04) * (Math.random() < 0.5 ? 1 : -1);
      const startAngle = Math.random() * Math.PI * 2;
      const inclination = Math.random() * Math.PI;
      const lan = Math.random() * Math.PI * 2;

      const orbitU = new THREE.Vector3(Math.cos(lan), 0, Math.sin(lan));
      const orbitV = new THREE.Vector3(
        -Math.sin(lan) * Math.cos(inclination),
         Math.sin(inclination),
         Math.cos(lan) * Math.cos(inclination)
      );
      const orbitCenter = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.0,
        -2.5 + (Math.random() - 0.5) * 1.0
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

      tweensRef.current.push(
        gsap.to(piece.mesh.position, {
          x: orbitCenter.x + orbitU.x * cosA * radius + orbitV.x * sinA * radius,
          y: orbitCenter.y + orbitU.y * cosA * radius + orbitV.y * sinA * radius,
          z: orbitCenter.z + orbitU.z * cosA * radius + orbitV.z * sinA * radius,
          duration: dur,
          ease: 'power3.out',
        })
      );
      tweensRef.current.push(
        gsap.to(piece.mesh.rotation, {
          x: piece.originalRotation.x + (Math.random() - 0.5) * Math.PI * 2,
          y: piece.originalRotation.y + (Math.random() - 0.5) * Math.PI * 2,
          z: piece.originalRotation.z + (Math.random() - 0.5) * Math.PI * 2,
          duration: dur,
          ease: 'power3.out',
        })
      );

      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        tweensRef.current.push(
          gsap.to(piece.mesh.material, {
            opacity: 0.25 + Math.random() * 0.2,
            duration: dur,
          })
        );
      }
    });

    const totalMs = prefersReducedMotion ? 500 : 4000;
    const t2 = setTimeout(() => {
      isAnimatingRef.current = false;
      phaseRef.current = 'settled';
      setPhase('settled');
      onSettled?.();
    }, totalMs);
    timerIdsRef.current.push(t2);
  };

  // ─── Click handler ─────────────────────────────────────────────────────────

  const handleLogoClick = () => {
    if (phaseRef.current !== 'intact') return;
    phaseRef.current = 'exploding';
    setPhase('exploding');
    isAnimatingRef.current = true;
    onExplode?.();

    // Copy intact group's current scale so fractured group appears same size
    if (intactGroupRef.current && fracturedGroupRef.current) {
      const s = intactGroupRef.current.scale;
      fracturedGroupRef.current.scale.set(s.x, s.y, s.z);
    }

    // Instant model swap
    if (intactGroupRef.current)    intactGroupRef.current.visible    = false;
    if (fracturedGroupRef.current) fracturedGroupRef.current.visible = true;

    startDecomposeAnimation();
  };

  // ─── Nav piece hover / click ───────────────────────────────────────────────

  const handleNavPieceHover = (piece: NavigationPiece, isHovering: boolean) => {
    if (phaseRef.current !== 'settled' || isAnimatingRef.current) return;

    const prev = hoverTweensRef.current.get(piece.name) || [];
    prev.forEach(t => t.kill());
    const next: gsap.core.Tween[] = [];

    if (isHovering) {
      next.push(
        gsap.to(piece.mesh.scale, {
          x: piece.originalScale.x * navScaleMultiplier * 1.2,
          y: piece.originalScale.y * navScaleMultiplier * 1.2,
          z: piece.originalScale.z * navScaleMultiplier * 1.2,
          duration: 0.3,
          ease: 'back.out(1.7)',
        })
      );

      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        next.push(
          gsap.to(piece.mesh.material.emissive, {
            r: _cyan.r, g: _cyan.g, b: _cyan.b,
            duration: 0.3, ease: 'power2.out',
          })
        );
        next.push(
          gsap.to(piece.mesh.material, {
            emissiveIntensity: 0.5,
            duration: 0.3, ease: 'power2.out',
          })
        );
      }
    } else {
      next.push(
        gsap.to(piece.mesh.scale, {
          x: piece.originalScale.x * navScaleMultiplier,
          y: piece.originalScale.y * navScaleMultiplier,
          z: piece.originalScale.z * navScaleMultiplier,
          duration: 0.3, ease: 'power2.out',
        })
      );

      if (piece.mesh.material instanceof THREE.MeshStandardMaterial) {
        next.push(
          gsap.to(piece.mesh.material.emissive, {
            r: _cyan.r, g: _cyan.g, b: _cyan.b,
            duration: 0.3, ease: 'power2.out',
          })
        );
        next.push(
          gsap.to(piece.mesh.material, {
            emissiveIntensity: 0,
            duration: 0.3, ease: 'power2.out',
          })
        );
      }
    }

    next.forEach(t => tweensRef.current.push(t));
    hoverTweensRef.current.set(piece.name, next);
  };

  const handleNavPieceClick = (piece: NavigationPiece) => {
    const timeline = gsap.timeline({
      onStart: () => { isAnimatingRef.current = true; },
      onComplete: () => { onNavigationClick?.(piece.section); },
    });
    timelinesRef.current.push(timeline);

    const worldPos = new THREE.Vector3();
    piece.mesh.getWorldPosition(worldPos);

    timeline
      .to(camera.position, {
        x: worldPos.x,
        y: worldPos.y,
        z: worldPos.z + 0.5,
        duration: 1.5,
        ease: 'power2.inOut',
      })
      .to(piece.mesh.scale, {
        x: piece.originalScale.x * 8,
        y: piece.originalScale.y * 8,
        z: piece.originalScale.z * 8,
        duration: 1.5,
        ease: 'power2.in',
      }, '-=1.5')
      .to(gl.domElement, {
        opacity: 0,
        duration: 0.5,
      }, '-=0.5');
  };

  // ─── Imperative handle ────────────────────────────────────────────────────

  useImperativeHandle(ref, () => ({
    navigateToSection: (section: string) => {
      if (isAnimatingRef.current) return;
      const piece = navigationPiecesRef.current.find(p => p.section === section);
      if (piece) handleNavPieceClick(piece);
    },
  }));

  // ─── useFrame ─────────────────────────────────────────────────────────────

  useFrame((state, delta) => {
    const p = phaseRef.current;

    // Intact: mouse-tracking tilt
    if (p === 'intact' && intactGroupRef.current && !prefersReducedMotion) {
      const targetRotX = -state.mouse.y * 0.3;
      const targetRotY =  state.mouse.x * 0.5;
      intactGroupRef.current.rotation.x += (targetRotX - intactGroupRef.current.rotation.x) * Math.min(delta * 3, 1);
      intactGroupRef.current.rotation.y += (targetRotY - intactGroupRef.current.rotation.y) * Math.min(delta * 3, 1);
    }

    // Settled: float nav pieces + orbit debris + project to screen
    if (p === 'settled' && !prefersReducedMotion) {
      const time = state.clock.getElapsedTime();

      navigationPiecesRef.current.forEach((piece, i) => {
        piece.mesh.position.y  = piece.targetPosition.y + Math.sin(time * 0.8 + i * 0.5) * 0.1;
        piece.mesh.rotation.y += delta * 0.5;
      });

      debrisPiecesRef.current.forEach((piece, i) => {
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

      // Project world positions to screen for label tracking
      if (onNavPiecePositions) {
        const out: NavPieceScreenPositions = { about: null, works: null, services: null, contact: null };
        const rect = domRectRef.current ?? gl.domElement.getBoundingClientRect();
        navigationPiecesRef.current.forEach((piece) => {
          piece.mesh.getWorldPosition(_wp);
          _sp.copy(_wp).project(camera);
          out[piece.section as keyof NavPieceScreenPositions] = {
            x: rect.left + (_sp.x + 1) * rect.width  / 2,
            y: rect.top  + (-_sp.y + 1) * rect.height / 2,
          };
        });
        onNavPiecePositions(out);
      }
    }
  });

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const updateRect = () => { domRectRef.current = gl.domElement.getBoundingClientRect(); };
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
      timelinesRef.current.forEach(tl => tl.kill());
      timelinesRef.current = [];
      tweensRef.current.forEach(t => t.kill());
      tweensRef.current = [];
      timerIdsRef.current.forEach(clearTimeout);
      timerIdsRef.current = [];
    };
  }, [gl]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <group position={position}>
      {/* Intact Z.glb */}
      <group ref={intactGroupRef}>
        {phase === 'intact' && (
          <mesh onClick={handleLogoClick} visible={false}>
            <boxGeometry args={[3, 3, 2]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )}
      </group>

      {/* Fractured Z1.glb */}
      <group ref={fracturedGroupRef}>
        {phase === 'settled' && fracturedReady &&
          navigationPiecesRef.current.map((piece) => (
            <mesh
              key={`nav-hit-${piece.name}`}
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
    </group>
  );
});

export default GlassLogoSystem;

// Preload both models on module load
useGLTF.preload('/models/model 2/Z.glb');
useGLTF.preload('/models/model 2/Z1.glb');
