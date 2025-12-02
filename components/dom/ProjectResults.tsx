'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import AnimatedText from '@/components/dom/AnimatedText';
import { useResponsive } from '@/hooks/useResponsive';

interface ResultItem {
  metric: string;
  value: string;
  label: string;
  icon: string;
}

interface ProjectResultsProps {
  results: ResultItem[];
  accentColor: string;
}

export default function ProjectResults({
  results,
  accentColor,
}: ProjectResultsProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { isMobile } = useResponsive();

  // Stagger animation on mount
  useEffect(() => {
    if (isMobile) return;

    const cards = cardRefs.current.filter(Boolean);
    if (cards.length === 0) return;

    const animations = cards.map((card, index) => {
      return gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.15,
          ease: 'power2.out',
        }
      );
    });

    return () => {
      animations.forEach(anim => anim?.kill());
    };
  }, [isMobile]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Section Title */}
      <AnimatedText
        className="text-3xl md:text-4xl font-['Gibson'] font-bold text-gray-900 mb-4 text-center"
        splitBy="words"
        stagger={0.03}
        duration={0.6}
        y={30}
      >
        Results & Impact
      </AnimatedText>

      <p className="text-lg font-['Gibson'] text-gray-600 mb-12 text-center max-w-3xl mx-auto">
        Data-driven results that demonstrate the success of our strategic approach
      </p>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {results.map((result, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            className="
              p-8 md:p-10
              rounded-3xl
              bg-white/80 backdrop-blur-xl
              border border-white/30
              shadow-lg hover:shadow-2xl
              transition-all duration-300
              hover:scale-105
              transform-gpu
            "
            style={{
              boxShadow: `0 10px 40px ${accentColor}10`,
            }}
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{
                backgroundColor: `${accentColor}20`,
              }}
            >
              <div className="w-8 h-8" style={{ color: accentColor }}>
                {/* Placeholder for icon SVG */}
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
              </div>
            </div>

            {/* Value */}
            <div
              className="text-5xl md:text-6xl font-['Gibson'] font-bold mb-3"
              style={{ color: accentColor }}
            >
              {result.value}
            </div>

            {/* Label */}
            <div className="text-lg font-['Gibson'] font-medium text-gray-700">
              {result.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
