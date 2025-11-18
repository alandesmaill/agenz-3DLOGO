'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { FloatingMeshes } from '@/components/canvas/about';
import { InfiniteText } from '@/components/dom/animations';
import styles from '@/styles/sections/aboutHero.module.css';

export default function AboutHero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className={styles.root}>
      <div className={styles.topContainer}>
        <div className={styles.leftContainer}>
          <h2 className={styles.title}>Lorem Ipsum</h2>
          <h2 className={`${styles.title} ${styles.bold}`}>Dolor Sit Amet</h2>
        </div>
        {!isMobile && (
          <div className={styles.rightContainer}>
            <h6 className={styles.subtitle}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </h6>
          </div>
        )}
      </div>

      <div className={styles.bottomContainer}>
        <Canvas
          className={styles.canvas}
          camera={{ position: [0, 0, 20], fov: 20 }}
          gl={{ antialias: true, alpha: true }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={20} />
          <FloatingMeshes
            totalCount={isMobile ? 12 : 18}
            transparentCount={isMobile ? 3 : 5}
            isMobile={isMobile}
          />
          <Environment preset="city" />
        </Canvas>
      </div>

      {isMobile && (
        <div className={styles.rightContainerMobile}>
          <h6 className={styles.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </h6>
        </div>
      )}

      <div className={styles.infiniteContainer}>
        <InfiniteText text="Scroll Down" length={5} />
      </div>
    </section>
  );
}
