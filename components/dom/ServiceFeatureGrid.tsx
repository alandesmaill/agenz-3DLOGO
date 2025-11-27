'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useResponsive } from '@/hooks/useResponsive';

interface ServiceFeatureGridProps {
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  accentColor: string;
}

export default function ServiceFeatureGrid({
  features,
  accentColor,
}: ServiceFeatureGridProps) {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { isMobile } = useResponsive();

  // Icon float animation (disabled on mobile)
  useEffect(() => {
    if (isMobile) return;

    const animations = iconRefs.current.map((icon, index) => {
      if (!icon) return null;

      // Stagger the float timing for visual interest
      const delay = index * 0.15;

      return gsap.to(icon, {
        y: -8,
        duration: 2 + (index % 3) * 0.3, // Vary duration slightly
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay,
      });
    });

    return () => {
      animations.forEach((anim) => {
        if (anim) anim.kill();
      });
    };
  }, [isMobile]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="
            p-6 md:p-8
            rounded-2xl
            bg-white/80 backdrop-blur-xl
            border border-white/30
            shadow-lg hover:shadow-2xl
            transition-all duration-300
            hover:scale-[1.02]
            transform-gpu
            group
          "
        >
          {/* Icon container with float animation */}
          <div className="mb-6">
            <div
              ref={(el) => (iconRefs.current[index] = el)}
              className="
                w-16 h-16 md:w-20 md:h-20
                rounded-2xl
                flex items-center justify-center
                transition-transform duration-300
                group-hover:scale-110
              "
              style={{
                background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                border: `2px solid ${accentColor}40`,
              }}
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-10 h-10 md:w-12 md:h-12"
              />
            </div>
          </div>

          {/* Title */}
          <h3
            className="
              text-xl md:text-2xl
              font-['Gibson'] font-bold
              text-gray-900
              mb-3
              tracking-tight
            "
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p className="font-['Gibson'] text-gray-700 leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
