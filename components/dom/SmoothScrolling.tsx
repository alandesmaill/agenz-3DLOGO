'use client';

import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollingProps {
  children: ReactNode;
  className?: string;
}

export default function SmoothScrolling({ children, className }: SmoothScrollingProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with optimal settings
    const lenis = new Lenis({
      lerp: 0.1,              // Smooth interpolation (lower = smoother)
      duration: 1.2,          // Scroll duration
      wheelMultiplier: 1,     // Mouse wheel sensitivity
      touchMultiplier: 2,     // Touch sensitivity
      infinite: false,        // Disable infinite scroll
      autoRaf: true,          // Auto requestAnimationFrame
    });

    lenisRef.current = lenis;

    // Integrate with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Update ScrollTrigger on Lenis scroll
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    console.log('[SmoothScrolling] Lenis initialized');

    // Critical: Refresh ScrollTrigger after Lenis is ready
    // This fixes dynamic mounting when navigating from main page
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      console.log('[SmoothScrolling] ScrollTrigger refreshed after Lenis init');
    }, 500);

    // Additional refresh after content settles
    const lateRefreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      console.log('[SmoothScrolling] Late ScrollTrigger refresh complete');
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(lateRefreshTimer);
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      console.log('[SmoothScrolling] Cleanup complete');
    };
  }, []);

  return <div className={className}>{children}</div>;
}
