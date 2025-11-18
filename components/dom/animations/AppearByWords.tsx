'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import clsx from 'clsx';
import styles from '@/styles/animations/appearByWords.module.css';

interface AppearByWordsProps {
  children: string;
}

export default function AppearByWords({ children }: AppearByWordsProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    const element = containerRef.current;
    const splitted = new SplitType(element, { types: 'words' });

    if (splitted.words) {
      gsap.fromTo(
        splitted.words,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }

    return () => {
      splitted.revert();
    };
  }, [isVisible]);

  return (
    <span
      ref={containerRef}
      className={clsx(styles.title, isVisible && styles.visible)}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
