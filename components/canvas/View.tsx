'use client';

import { Canvas, Scene, FracturedLogo } from '@/components/canvas';
import type { FracturedLogoHandle } from '@/components/canvas';
import { NavigationLabel, TestSection, AnimatedBackground, LoadingScreen, Header, HoverHint, ContactModal, MenuOverlay } from '@/components/dom';
import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { useProgress } from '@react-three/drei';
import { gsap } from 'gsap';

// Loading progress component inside Canvas
function LoadingManager({ onProgress }: { onProgress: (progress: number) => void }) {
  const { progress } = useProgress();

  useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);

  return null;
}

export default function View() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fracturedLogoRef = useRef<FracturedLogoHandle>(null);
  const [labelData, setLabelData] = useState<{
    label: string | null;
    position: { x: number; y: number } | null;
    isVisible: boolean;
  }>({
    label: null,
    position: null,
    isVisible: false,
  });

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
  const [isDecomposed, setIsDecomposed] = useState(false);
  const [isDecomposeComplete, setIsDecomposeComplete] = useState(false);

  // Canvas optimization - unmount when in section view
  const [canvasActive, setCanvasActive] = useState(true);

  // Modal and Menu state
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [menuOverlayOpen, setMenuOverlayOpen] = useState(false);

  // Responsive scaling
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setLogoScale(0.8); // Mobile - smaller
      } else if (width < 1024) {
        setLogoScale(1.0); // Tablet - medium
      } else {
        setLogoScale(1.2); // Desktop - larger
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Mark as loaded when progress reaches 100%
  useEffect(() => {
    if (loadingProgress >= 100) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 500);
    }
  }, [loadingProgress]);

  // Unmount canvas when section is visible (optimization)
  useEffect(() => {
    if (testSection.isVisible && testSection.section) {
      // Delay unmount to allow for transition animation
      const timer = setTimeout(() => {
        setCanvasActive(false);
      }, 800); // Wait for section animation to complete
      return () => clearTimeout(timer);
    }
  }, [testSection.isVisible, testSection.section]);

  // Handle navigation hover callback from FracturedLogo
  const handleNavigationHover = (
    _piece: string | null,
    label: string | null,
    screenPosition: { x: number; y: number } | null
  ) => {
    if (!screenPosition || !label) {
      setLabelData({ label: null, position: null, isVisible: false });
      return;
    }

    setLabelData({
      label,
      position: screenPosition,
      isVisible: true,
    });
  };

  // Handle navigation click callback - show test section
  const handleNavigationClick = useCallback((section: string) => {
    setTestSection({
      section,
      isVisible: true,
    });
  }, []);

  // Handle back button - reload page for fresh start
  const handleBack = useCallback(() => {
    // Reload the page to restart the 3D experience
    // This is intentional for performance - canvas was unmounted
    window.location.reload();
  }, []);

  // Handle decomposition callback from FracturedLogo
  const handleDecompose = () => {
    setIsDecomposed(true);
  };

  // Handle decompose animation complete
  const handleDecomposeComplete = useCallback(() => {
    setIsDecomposeComplete(true);
  }, []);

  // Handle nav bar click from HoverHint
  const handleHintNavClick = useCallback((section: string) => {
    fracturedLogoRef.current?.navigateToSection(section);
  }, []);

  // Header button handlers
  const handleGetInTouch = useCallback(() => {
    setContactModalOpen(true);
  }, []);

  const handleMenuClick = useCallback(() => {
    setMenuOverlayOpen(true);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Loading Screen */}
      <LoadingScreen progress={loadingProgress} isLoaded={isLoaded} />

      {/* Header with Logo and Buttons - only show after preload, hide when section active */}
      {isLoaded && !testSection.isVisible && (
        <Header
          onGetInTouch={handleGetInTouch}
          onMenuClick={handleMenuClick}
        />
      )}

      {/* Hover Hint - transforms into nav bar after decompose */}
      <HoverHint
        isVisible={isLoaded && canvasActive && !testSection.isVisible}
        isDecomposed={isDecomposeComplete}
        onNavigationClick={handleHintNavClick}
      />

      {/* Animated Background with Brand Colors - hide when canvas unmounted */}
      {canvasActive && <AnimatedBackground />}

      {/* Three.js Canvas - conditionally rendered for performance */}
      {canvasActive && (
        <Canvas className="w-full h-full">
          <Suspense fallback={null}>
            <LoadingManager onProgress={setLoadingProgress} />
            <Scene>
              {/* Interactive Fractured Logo */}
              <FracturedLogo
                ref={fracturedLogoRef}
                path="/models/3d-logo.glb"
                position={[0, 0, 0]}
                scale={logoScale}
                onNavigationHover={handleNavigationHover}
                onNavigationClick={handleNavigationClick}
                onDecompose={handleDecompose}
                onDecomposeComplete={handleDecomposeComplete}
              />
            </Scene>
          </Suspense>
        </Canvas>
      )}

      {/* HTML Overlay - Navigation Labels */}
      <NavigationLabel
        label={labelData.label}
        position={labelData.position}
        isVisible={labelData.isVisible && canvasActive}
      />

      {/* HTML Overlay - Section Display */}
      <TestSection
        section={testSection.section}
        isVisible={testSection.isVisible}
        onBack={handleBack}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* Menu Overlay */}
      <MenuOverlay
        isOpen={menuOverlayOpen}
        onClose={() => setMenuOverlayOpen(false)}
      />
    </div>
  );
}
