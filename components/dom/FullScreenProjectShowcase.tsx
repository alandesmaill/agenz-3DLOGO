'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProjectGradient } from '@/lib/works-placeholders';
import { usePageTransition } from '@/hooks/usePageTransition';
import type { PortfolioItem } from '@/lib/works-data';

gsap.registerPlugin(ScrollTrigger);

interface FullScreenProjectShowcaseProps {
  item: PortfolioItem;
  index: number;
}

export default function FullScreenProjectShowcase({
  item,
  index,
}: FullScreenProjectShowcaseProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { startTransition } = usePageTransition();
  const [isAnimating, setIsAnimating] = useState(false);
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (!imageRef.current) return;

    // Morph animation: scale + opacity + border-radius
    const animation = gsap.fromTo(
      imageRef.current,
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
          trigger: imageRef.current,
          start: 'top 75%',
          once: true,
        },
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  // Click handler for morph animation
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Prevent multiple clicks during animation
    if (isAnimating || !imageRef.current) return;

    setIsAnimating(true);

    // Save transition state to sessionStorage
    startTransition(imageRef.current, item.id, 'forward');

    // Anticipation: Shrink card slightly for immediate feedback
    gsap.to(imageRef.current, {
      scale: 0.95,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        // Start GSAP morph animation
        handleMorph();
      },
    });
  };

  // GSAP morph animation with signal-based coordination for flash-free transitions
  const handleMorph = () => {
    if (!imageRef.current) return;

    console.log('[Morph] Starting GSAP morph animation');

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

      // Get current position of the card
      const rect = imageRef.current!.getBoundingClientRect();
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

          // Wait for detail page to signal it's fully painted
          const waitForPageReady = () => {
            const readySignal = sessionStorage.getItem('page-ready-signal');

            if (readySignal === 'true') {
              // Page is ready! Fade overlay out
              console.log('[Morph] Page ready signal received, fading overlay');

              sessionStorage.removeItem('page-ready-signal');

              gsap.to(overlay, {
                opacity: 0,
                duration: 0.3,
                ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
                onComplete: () => {
                  if (overlay && overlay.parentNode) {
                    overlay.remove();
                  }
                  setIsAnimating(false);
                },
              });
            } else {
              // Not ready yet, check again in 50ms
              setTimeout(waitForPageReady, 50);
            }
          };

          // Start polling for ready signal
          setTimeout(waitForPageReady, 100);

          // Safety timeout: force fade after 5 seconds even if no signal
          setTimeout(() => {
            if (overlay && overlay.parentNode) {
              console.warn('[Morph] Timeout reached, forcing overlay fade');
              gsap.to(overlay, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => overlay.remove(),
              });
              setIsAnimating(false);
            }
          }, 5000);
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
        0
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
        0.05
      );

      // Phase 3: Corners flatten faster (0.35-1.05s)
      timeline.to(
        overlay,
        {
          borderRadius: '0px',
          duration: 0.7,
          ease: 'power3.out',
        },
        0.35
      );
    }, 150);
  };

  return (
    <section className="min-h-screen flex items-center py-20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div
          className={`grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-center ${
            isEven ? '' : 'lg:grid-flow-dense'
          }`}
        >
          {/* Image Section (70% width on desktop) */}
          <div className={`lg:col-span-7 ${isEven ? '' : 'lg:col-start-4'}`}>
            <div
              ref={imageRef}
              onClick={handleClick}
              data-project-card
              data-project-id={item.id}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden will-change-transform shadow-2xl hover:scale-[1.02] transition-transform duration-700 cursor-pointer"
              style={{
                background: getProjectGradient(item.id, 'hero'),
              }}
            >
              {/* Placeholder for future image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/20 text-6xl font-bold">
                  {item.clientName}
                </div>
              </div>
            </div>
          </div>

          {/* Text Panel (30% width on desktop) */}
          <div
            className={`lg:col-span-3 ${
              isEven ? '' : 'lg:col-start-1 lg:row-start-1'
            }`}
          >
            <div className="lg:sticky lg:top-32 space-y-6">
              {/* Category Badge */}
              <div>
                <span
                  className="inline-block text-xs md:text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full"
                  style={{
                    color: item.accentColor,
                    backgroundColor: `${item.accentColor}15`,
                  }}
                >
                  {item.category} • {item.year}
                </span>
              </div>

              {/* Project Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {item.projectTitle}
              </h2>

              {/* Client Name */}
              <p className="text-xl md:text-2xl text-gray-600 font-light">
                {item.clientName}
              </p>

              {/* Description */}
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {item.hero.description}
              </p>

              {/* View Project Button */}
              <button
                onClick={handleClick}
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-300 font-medium"
              >
                View Project
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
