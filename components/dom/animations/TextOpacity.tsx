'use client';

import SplitType from 'split-type';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import styles from '@/styles/animations/textOpacity.module.css';

interface TextOpacityProps {
  children: string;
  trigger: HTMLElement | null;
}

export default function TextOpacity({ children, trigger }: TextOpacityProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trigger) return;

    const element = containerRef.current;

    // Split text into words
    const splitted = new SplitType(element, { types: 'words' });

    // Set initial state for all words
    splitted.words?.forEach((word) => gsap.set(word, { opacity: 0 }));

    // Create 3D perspective animation
    const animation = gsap.fromTo(
      splitted.words,
      {
        willChange: 'opacity, transform',
        z: () => gsap.utils.random(500, 950),
        opacity: 0,
        xPercent: () => gsap.utils.random(-100, 100),
        yPercent: () => gsap.utils.random(-10, 10),
        rotationX: () => gsap.utils.random(-90, 90),
      },
      {
        ease: 'expo',
        opacity: 1,
        rotationX: 0,
        rotationY: 0,
        xPercent: 0,
        yPercent: 0,
        z: 0,
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
        stagger: {
          each: 0.006,
          from: 'random',
        },
      },
    );

    return () => {
      animation.kill();
      splitted.revert();
    };
  }, [trigger]);

  return (
    <div ref={containerRef} className={styles.title}>
      {children}
    </div>
  );
}
