'use client';

import { useEffect, useRef } from 'react';
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScatteredTextProps {
  children: string;
  className?: string;
}

export default function ScatteredText({ children, className = '' }: ScatteredTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const splitInstanceRef = useRef<SplitType | null>(null);

  useEffect(() => {
    if (!textRef.current) return;

    // Split text into words
    const split = new SplitType(textRef.current, {
      types: 'words',
      tagName: 'span',
    });

    splitInstanceRef.current = split;

    // Get all word elements
    const words = split.words;

    if (!words || words.length === 0) return;

    // Set initial scattered state for each word
    gsap.set(words, {
      opacity: 0.2,
      x: () => gsap.utils.random(-200, 200),
      y: () => gsap.utils.random(-100, 100),
      rotation: () => gsap.utils.random(-15, 15),
      scale: 0.8,
    });

    // Create scroll-triggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%', // Start when element is 80% in viewport
        end: 'center center', // End when element is centered
        scrub: 1, // Smooth scroll-linked animation
        toggleActions: 'play none none reverse',
      },
    });

    // Animate words back to original positions with stagger
    tl.to(words, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1,
      ease: 'power2.out',
      stagger: {
        amount: 0.5, // Total stagger duration
        from: 'start', // Stagger from first to last
      },
    });

    // Cleanup
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === textRef.current) {
          trigger.kill();
        }
      });
      if (splitInstanceRef.current) {
        splitInstanceRef.current.revert();
      }
    };
  }, [children]);

  return (
    <p ref={textRef} className={className}>
      {children}
    </p>
  );
}
