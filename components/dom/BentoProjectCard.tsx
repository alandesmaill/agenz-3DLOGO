'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProjectGradient } from '@/lib/works-placeholders';
import { usePageTransition } from '@/hooks/usePageTransition';
import { getCategoryLabel } from '@/lib/works-data';
import type { PortfolioItem } from '@/lib/works-data';

gsap.registerPlugin(ScrollTrigger);

interface BentoProjectCardProps {
  item: PortfolioItem;
  index: number;
  gridConfig: {
    colSpan: string;
    rowSpan: string;
    aspect: string;
  };
}

export default function BentoProjectCard({
  item,
  index,
  gridConfig,
}: BentoProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { startTransition } = usePageTransition();
  const [isAnimating, setIsAnimating] = useState(false);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // ScrollTrigger entrance animation
  useEffect(() => {
    if (!cardRef.current) return;

    const animation = gsap.fromTo(
      cardRef.current,
      {
        scale: 0.9,
        opacity: 0,
        borderRadius: '100px',
      },
      {
        scale: 1,
        opacity: 1,
        borderRadius: '24px',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 75%',
          once: true,
        },
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  // Create hover timeline
  useEffect(() => {
    if (!imageRef.current || !titleRef.current || !overlayRef.current) return;

    // Create paused timeline for hover effects
    const tl = gsap.timeline({ paused: true });

    tl.to(imageRef.current, { scale: 1.05, duration: 0.5, ease: 'power2.out' }, 0)
      .to(titleRef.current, { scale: 1.05, duration: 0.3, ease: 'power2.out' }, 0)
      .to(overlayRef.current, { opacity: 0.5, duration: 0.3 }, 0);

    hoverTimelineRef.current = tl;

    return () => {
      if (hoverTimelineRef.current) {
        hoverTimelineRef.current.kill();
      }
    };
  }, []);

  // Hover handlers
  const handleMouseEnter = () => {
    if (hoverTimelineRef.current && !isAnimating) {
      hoverTimelineRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimelineRef.current && !isAnimating) {
      hoverTimelineRef.current.reverse();
    }
  };

  // Morph animation click handler (adapted from FullScreenProjectShowcase)
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Prevent multiple clicks during animation
    if (isAnimating || !cardRef.current) return;

    setIsAnimating(true);

    // Save transition state to sessionStorage
    startTransition(cardRef.current, item.id, 'forward');

    // Anticipation: Shrink card slightly for immediate feedback
    gsap.to(cardRef.current, {
      scale: 0.95,
      duration: 0.15,
      ease: 'power2.in',
    });

    // Brief pause before morph begins (makes click feel snappier)
    setTimeout(() => {
      // Create fixed overlay element that will morph
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.zIndex = '9999';
      overlay.style.background = getProjectGradient(item.id, 'hero');
      overlay.style.pointerEvents = 'none';

      // GPU Acceleration properties for smoother animation
      overlay.style.willChange = 'transform, opacity, border-radius';
      overlay.style.backfaceVisibility = 'hidden';
      overlay.style.perspective = '1000px';
      overlay.style.transform = 'translateZ(0)';
      overlay.style.webkitTransform = 'translateZ(0)'; // Safari support

      // Get current position of the card
      const rect = cardRef.current!.getBoundingClientRect();
      overlay.style.top = `${rect.top}px`;
      overlay.style.left = `${rect.left}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      overlay.style.borderRadius = '24px';

      document.body.appendChild(overlay);

      // Staggered morph animation for smoother visual flow
      const timeline = gsap.timeline({
        onComplete: () => {
          // Navigate to detail page after animation completes
          router.push(`/works/${item.id}`);

          // Wait for browser to paint the new page content
          // Double RAF ensures content is visible before overlay fades
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // Additional 50ms safety delay to ensure paint is fully complete
              setTimeout(() => {
                // Fade overlay out smoothly with premium easing
                gsap.to(overlay, {
                  opacity: 0,
                  duration: 0.3,
                  ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  onComplete: () => {
                    if (overlay && overlay.parentNode) {
                      overlay.remove();
                    }
                  },
                });
              }, 50);
            });
          });
        },
      });

      // Phase 1: Position moves smoothly (0-1.15s)
      timeline.to(
        overlay,
        {
          top: 0,
          left: 0,
          duration: 1.15,
          ease: 'power2.inOut',
        },
        0 // Start immediately
      );

      // Phase 2: Size expands with slight delay (0.05-1.15s)
      timeline.to(
        overlay,
        {
          width: '100vw',
          height: '100vh',
          duration: 1.1,
          ease: 'power2.inOut',
        },
        0.05 // 50ms delay for visual separation
      );

      // Phase 3: Corners flatten faster (0.35-1.05s)
      timeline.to(
        overlay,
        {
          borderRadius: '0px',
          duration: 0.7,
          ease: 'power3.out',
        },
        0.35 // Starts later, finishes earlier
      );
    }, 150); // 150ms anticipation delay
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        bento-card group relative
        cursor-pointer overflow-hidden rounded-3xl
        shadow-xl hover:shadow-2xl
        transition-shadow duration-500
        will-change-transform transform-gpu
        h-full w-full
        ${gridConfig.colSpan}
        ${gridConfig.rowSpan}
      `}
    >
      {/* Image Container with Gradient Background */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          background: getProjectGradient(item.id, 'hero'),
        }}
      >
        {/* Client Name Watermark (center, even more subtle) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/10 text-4xl md:text-5xl lg:text-6xl font-bold text-center px-4">
            {item.clientName}
          </div>
        </div>

        {/* Dark Gradient Overlay for Text Readability (reduced) */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-30 transition-opacity duration-300"
        />
      </div>

      {/* Minimal Corner Label - Linearity Style */}
      <div
        ref={titleRef}
        className="absolute top-4 left-4 md:top-6 md:left-6"
      >
        {/* Category Badge - Tiny */}
        <div className="mb-1">
          <span
            className="text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-80"
            style={{ color: item.accentColor }}
          >
            {getCategoryLabel(item.category)} • {item.year}
          </span>
        </div>

        {/* Project Title - Small */}
        <h3 className="text-sm md:text-base font-bold text-white leading-tight">
          {item.projectTitle}
        </h3>

        {/* Client Name - Tiny */}
        <p className="text-[10px] md:text-xs text-white/70 mt-0.5">
          {item.clientName}
        </p>
      </div>
    </div>
  );
}
