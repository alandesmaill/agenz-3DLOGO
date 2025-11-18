'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '@/styles/animations/infiniteText.module.css';

interface InfiniteTextProps {
  text: string;
  length?: number;
}

export default function InfiniteText({ text, length = 5 }: InfiniteTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = gsap.to(containerRef.current, {
      x: '-50%',
      duration: 20,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.container}>
        {Array.from({ length }).map((_, i) => (
          <span key={i} className={styles.text}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
