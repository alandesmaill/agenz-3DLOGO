'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // On mobile, use native scroll instead of Lenis
    if (window.innerWidth < 768) {
      document.body.style.overflow = 'auto';
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }

    // Desktop: Initialize Lenis with optimal settings
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

    // Critical: Refresh ScrollTrigger after Lenis is ready
    // This fixes dynamic mounting when navigating from main page
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Additional refresh after content settles
    const lateRefreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(lateRefreshTimer);
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return <div className={className}>{children}</div>;
}
