'use client';

import { useEffect, useRef, ReactNode } from 'react';
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  splitBy?: 'chars' | 'words' | 'lines';
  stagger?: number;
  duration?: number;
  delay?: number;
  y?: number;
  triggerStart?: string;
  once?: boolean;
}

export default function AnimatedText({
  children,
  className = '',
  splitBy = 'chars',
  stagger = 0.008, // Optimal for character animations
  duration = 0.5,
  delay = 0,
  y = 50, // Slide up from below
  triggerStart = 'top 80%', // Trigger when 20% visible
  once = true, // Play animation once
}: AnimatedTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const splitInstanceRef = useRef<SplitType | null>(null);

  useEffect(() => {
    if (!textRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Skip animation for users who prefer reduced motion
      return;
    }

    // Small delay to ensure DOM is ready and Lenis is initialized
    const initTimer = setTimeout(() => {
      if (!textRef.current) return;

      // Split the text into characters
      const splitText = new SplitType(textRef.current, {
        types: splitBy,
        tagName: 'span',
      });

      splitInstanceRef.current = splitText;

      // Get the elements to animate
      const elements =
        splitBy === 'chars' ? splitText.chars :
        splitBy === 'words' ? splitText.words :
        splitText.lines;

      if (!elements || elements.length === 0) {
        return;
      }

      // Set initial state
      gsap.set(elements, {
        opacity: 0,
        y: y,
        willChange: 'transform, opacity',
      });

      // Create scroll-triggered animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: textRef.current,
          start: triggerStart,
          end: 'bottom top',
          toggleActions: once ? 'play none none none' : 'play none none reverse',
          invalidateOnRefresh: true, // Recalculate on refresh
          // markers: true, // Uncomment for debugging
        },
      });

      tl.to(elements, {
        opacity: 1,
        y: 0,
        duration: duration,
        delay: delay,
        stagger: {
          amount: elements.length * stagger,
          from: 'start',
        },
        ease: 'power2.out',
        clearProps: 'willChange', // Clean up after animation
      });

      // Refresh ScrollTrigger after animation is set up
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, 200); // Wait for DOM to be ready

    // Cleanup
    return () => {
      clearTimeout(initTimer);
      if (splitInstanceRef.current) {
        splitInstanceRef.current.revert();
      }
    };
  }, [splitBy, stagger, duration, delay, y, triggerStart, once]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
