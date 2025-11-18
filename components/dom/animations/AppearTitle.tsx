'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from '@/styles/animations/appearTitle.module.css';

interface AppearTitleProps {
  children: React.ReactNode;
}

export default function AppearTitle({ children }: AppearTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }
    );
  }, [isVisible]);

  return (
    <div ref={containerRef} className={styles.container}>
      {children}
    </div>
  );
}
