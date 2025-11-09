'use client';

import { Canvas, Scene, FracturedLogo } from '@/components/canvas';
import { NavigationLabel, TestSection, AnimatedBackground, LoadingScreen } from '@/components/dom';
import { Suspense, useState, useRef, useEffect } from 'react';
import { useProgress } from '@react-three/drei';

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

  // Handle navigation hover callback from FracturedLogo
  const handleNavigationHover = (
    piece: string | null,
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
  const handleNavigationClick = (section: string) => {
    console.log(`Navigation clicked: ${section}`);
    setTestSection({
      section,
      isVisible: true,
    });
  };

  // Handle back button - reset to logo view
  const handleBack = () => {
    setTestSection({
      section: null,
      isVisible: false,
    });

    // Reset canvas opacity
    const canvas = containerRef.current?.querySelector('canvas');
    if (canvas) {
      canvas.style.opacity = '1';
    }

    // Reload page to reset Three.js scene
    // This is a simple approach for testing - in production you'd want a proper reset function
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Loading Screen */}
      <LoadingScreen progress={loadingProgress} isLoaded={isLoaded} />

      {/* Animated Background with Brand Colors */}
      <AnimatedBackground />

      {/* Three.js Canvas */}
      <Canvas className="w-full h-full">
        <Suspense fallback={null}>
          <LoadingManager onProgress={setLoadingProgress} />
          <Scene>
            {/* Interactive Fractured Logo */}
            <FracturedLogo
              path="/models/3d-logo.glb"
              position={[0, 0, 0]}
              scale={logoScale}
              onNavigationHover={handleNavigationHover}
              onNavigationClick={handleNavigationClick}
            />
          </Scene>
        </Suspense>
      </Canvas>

      {/* HTML Overlay - Navigation Labels */}
      <NavigationLabel
        label={labelData.label}
        position={labelData.position}
        isVisible={labelData.isVisible}
      />

      {/* HTML Overlay - Test Section Display */}
      <TestSection
        section={testSection.section}
        isVisible={testSection.isVisible}
        onBack={handleBack}
      />
    </div>
  );
}
