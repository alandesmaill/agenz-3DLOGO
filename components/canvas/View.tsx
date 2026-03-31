'use client';

import { Canvas, Scene, GlassLogoSystem } from '@/components/canvas';
import type { NavPieceScreenPositions, GlassLogoHandle } from '@/components/canvas';
import { NavigationLabel, TestSection, AnimatedBackground, LoadingScreen, Header, HoverHint, ContactModal, MenuOverlay, NavPieceLabel } from '@/components/dom';
import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { useProgress } from '@react-three/drei';

const NAV_SECTIONS = ['about', 'works', 'services', 'contact'] as const;

function LoadingManager({ onProgress }: { onProgress: (progress: number) => void }) {
  const { progress } = useProgress();

  useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);

  return null;
}

export default function View() {
  const containerRef  = useRef<HTMLDivElement>(null);
  const glassLogoRef  = useRef<GlassLogoHandle>(null);
  const labelRefs     = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  const [phase, setPhase] = useState<'intact' | 'exploding' | 'settled'>('intact');

  const [testSection, setTestSection] = useState<{
    section: string | null;
    isVisible: boolean;
  }>({
    section: null,
    isVisible: false,
  });

  const [logoScale, setLogoScale] = useState(1.2);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const [canvasActive, setCanvasActive] = useState(true);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [menuOverlayOpen, setMenuOverlayOpen] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setLogoScale(0.8);
      } else if (width < 1024) {
        setLogoScale(1.0);
      } else {
        setLogoScale(1.2);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (loadingProgress >= 100) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 500);
    }
  }, [loadingProgress]);

  useEffect(() => {
    if (testSection.isVisible && testSection.section) {
      const timer = setTimeout(() => {
        setCanvasActive(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [testSection.isVisible, testSection.section]);

  const handleNavPiecePositions = useCallback((positions: NavPieceScreenPositions) => {
    NAV_SECTIONS.forEach((section, i) => {
      const el = labelRefs.current[i];
      if (!el) return;
      const pos = positions[section];
      if (pos) {
        el.style.left = `${pos.x}px`;
        el.style.top  = `${pos.y}px`;
      } else {
        el.style.left = '-9999px';
        el.style.top  = '-9999px';
      }
    });
  }, []);

  const handleExplode  = useCallback(() => setPhase('exploding'), []);
  const handleSettled  = useCallback(() => setPhase('settled'), []);

  const handleNavigationClick = useCallback((section: string) => {
    setTestSection({ section, isVisible: true });
  }, []);

  const handleBack = useCallback(() => {
    window.location.reload();
  }, []);

  const handleHintNavClick = useCallback((section: string) => {
    if (glassLogoRef.current) {
      glassLogoRef.current.navigateToSection(section);
    } else {
      handleNavigationClick(section);
    }
  }, [handleNavigationClick]);

  const handleLabelNavClick = useCallback((section: string) => {
    if (glassLogoRef.current) {
      glassLogoRef.current.navigateToSection(section);
    } else {
      handleNavigationClick(section);
    }
  }, [handleNavigationClick]);

  const handleMenuClick = useCallback(() => {
    setMenuOverlayOpen(true);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <LoadingScreen progress={loadingProgress} isLoaded={isLoaded} />

      {isLoaded && !testSection.isVisible && (
        <Header
          onMenuClick={handleMenuClick}
        />
      )}

      <HoverHint
        isVisible={isLoaded && canvasActive && !testSection.isVisible}
        isDecomposed={phase === 'settled'}
      />

      {/* Animated Background — hide when canvas unmounted */}
      {canvasActive && <AnimatedBackground />}

      {canvasActive && (
        <Canvas className="w-full h-full">
          <Suspense fallback={null}>
            <LoadingManager onProgress={setLoadingProgress} />
            <Scene>
              <GlassLogoSystem
                ref={glassLogoRef}
                scale={logoScale}
                onNavigationClick={handleNavigationClick}
                onExplode={handleExplode}
                onSettled={handleSettled}
                onNavPiecePositions={handleNavPiecePositions}
              />
            </Scene>
          </Suspense>
        </Canvas>
      )}

      {NAV_SECTIONS.map((section, i) => (
        <NavPieceLabel
          key={section}
          ref={(el) => { labelRefs.current[i] = el; }}
          label={section.toUpperCase() as 'ABOUT' | 'WORKS' | 'SERVICES' | 'CONTACT'}
          section={section}
          isVisible={phase === 'settled' && canvasActive && !testSection.isVisible}
          onNavigationClick={handleLabelNavClick}
          delay={i * 150}
        />
      ))}

      <NavigationLabel
        label={null}
        position={null}
        isVisible={false}
      />

      <TestSection
        section={testSection.section}
        isVisible={testSection.isVisible}
        onBack={handleBack}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      <MenuOverlay
        isOpen={menuOverlayOpen}
        onClose={() => setMenuOverlayOpen(false)}
      />
    </div>
  );
}
