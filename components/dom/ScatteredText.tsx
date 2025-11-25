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

    // Use requestAnimationFrame to ensure DOM is ready
    const setupAnimation = () => {
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

      // Refresh ScrollTrigger after text split
      ScrollTrigger.refresh();

      // Create scroll-triggered animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: textRef.current,
          scroller: '.scroll-container', // Target the About section scroll container
          start: 'top 90%', // Start when element is 90% in viewport
          end: 'bottom 60%', // End when bottom is 60% in viewport
          scrub: 1.5, // Smooth scroll-linked animation
          toggleActions: 'play none none reverse',
          // markers: true, // Uncomment for debugging
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
    };

    // Wait for next frame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      const cleanup = setupAnimation();
      if (cleanup) {
        // Store cleanup function
        return cleanup;
      }
    });

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
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
