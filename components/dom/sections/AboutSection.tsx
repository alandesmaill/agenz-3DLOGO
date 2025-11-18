'use client';

import { useEffect, useState } from 'react';
import AboutHero from './AboutHero';
import AboutQuote from './AboutQuote';
import AboutClients from './AboutClients';
import styles from '@/styles/sections/aboutSection.module.css';

interface AboutSectionProps {
  isVisible: boolean;
  onBack: () => void;
}

export default function AboutSection({ isVisible, onBack }: AboutSectionProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setOpacity(1), 100);
      return () => clearTimeout(timer);
    } else {
      setOpacity(0);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={styles.container} style={{ opacity }}>
      <button onClick={onBack} className={styles.backButton}>
        ← BACK TO LOGO
      </button>

      <div className={styles.content}>
        <AboutHero />
        <AboutQuote />
        <AboutClients />
      </div>
    </div>
  );
}
