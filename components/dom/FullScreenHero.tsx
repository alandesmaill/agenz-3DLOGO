'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { usePageTransition } from '@/hooks/usePageTransition';
import AnimatedText from './AnimatedText';

interface FullScreenHeroProps {
  clientName: string;
  projectTitle: string;
  category: string;
  year: number | string;
  accentColor: string;
  gradient: string;
  projectId: string;
}

export default function FullScreenHero({
  clientName,
  projectTitle,
  category,
  year,
  accentColor,
  gradient,
  projectId,
}: FullScreenHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { getTransition, clearTransition } = usePageTransition();

  useEffect(() => {
    if (!heroRef.current) return;

    // Check if coming from a transition
    const transition = getTransition();

    if (!transition) {
      // Normal page load - play intro animation
      const animation = gsap.fromTo(
        heroRef.current,
        {
          opacity: 0,
          scale: 1.05,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power3.out',
        }
      );

      return () => {
        animation.kill();
      };
    }

    if (transition.direction === 'forward') {
      // Coming from works page - already morphed in
      // Just clear transition data (no animation needed)
      clearTransition();
    }

    // Note: backward transition is handled by browser back button
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle browser back button for backward morph
  useEffect(() => {
    const handleBackButton = () => {
      if (!heroRef.current) return;

      // Create overlay for backward morph
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.zIndex = '9999';
      overlay.style.background = gradient;
      overlay.style.pointerEvents = 'none';

      // GPU Acceleration properties for smoother animation
      overlay.style.willChange = 'transform, opacity, border-radius';
      overlay.style.backfaceVisibility = 'hidden';
      overlay.style.perspective = '1000px';
      overlay.style.transform = 'translateZ(0)';
      overlay.style.webkitTransform = 'translateZ(0)';  // Safari support

      document.body.appendChild(overlay);

      // Try to get transition data (may not exist if navigated directly)
      const transition = getTransition();

      if (transition && transition.fromRect) {
        // Animate overlay to original card position
        gsap.to(overlay, {
          top: `${transition.fromRect.top}px`,
          left: `${transition.fromRect.left}px`,
          width: `${transition.fromRect.width}px`,
          height: `${transition.fromRect.height}px`,
          borderRadius: '24px',
          duration: 1.15,
          ease: 'power2.inOut',
          onComplete: () => {
            overlay.remove();
            clearTransition();
          },
        });
      } else {
        // No transition data - just fade out
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            overlay.remove();
          },
        });
      }
    };

    // Listen for back navigation
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradient]);

  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
      {/* Hero Gradient Background */}
      <div
        ref={heroRef}
        className="absolute inset-0 will-change-transform"
        style={{ background: gradient }}
      >
        {/* Large Client Name Watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-[12vw] md:text-[15vw] lg:text-[18vw] font-bold text-white/10 uppercase leading-none tracking-tighter select-none">
            {clientName}
          </h1>
        </div>
      </div>

      {/* Floating Text Overlay - Bottom Left */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 md:pb-20 w-full">
        <div className="max-w-3xl">
          {/* Category + Year Badge */}
          <div className="mb-6">
            <span
              className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider px-5 py-2.5 rounded-full backdrop-blur-xl"
              style={{
                color: accentColor,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: `2px solid ${accentColor}40`,
              }}
            >
              {category} • {year}
            </span>
          </div>

          {/* Project Title */}
          <AnimatedText
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4"
            splitBy="words"
            stagger={0.05}
            duration={0.8}
            y={50}
            delay={0.3}
          >
            {projectTitle}
          </AnimatedText>

          {/* Client Name */}
          <AnimatedText
            className="text-2xl md:text-3xl lg:text-4xl text-white/90 font-light"
            splitBy="words"
            stagger={0.03}
            duration={0.6}
            y={30}
            delay={0.6}
          >
            {clientName}
          </AnimatedText>
        </div>
      </div>

      {/* Gradient Overlay for Better Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </section>
  );
}
