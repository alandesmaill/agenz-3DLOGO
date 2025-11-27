import React, { forwardRef, useRef, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import type { Service } from '@/lib/services-data';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';

// Throttle utility for performance
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastRan: number = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastRan >= delay) {
      func.apply(this, args);
      lastRan = now;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastRan = Date.now();
      }, delay - (now - lastRan));
    }
  };
}

interface ServiceCardProps extends Service {
  index: number;
}

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(function ServiceCard(
  {
    number,
    title,
    description,
    features,
    testimonial,
    clientLogos,
    icon,
    accentColor,
    ctaText,
    ctaLink,
    gridSize,
    index,
  },
  ref
) {
    const cardInnerRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const { isMobile, isDesktop } = useResponsive();
    const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

    // Continuous float animation (disabled on mobile)
    useEffect(() => {
      if (!iconRef.current || isMobile) return;

      const floatAnimation = gsap.to(iconRef.current, {
        y: -10,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });

      return () => {
        floatAnimation.kill();
      };
    }, [isMobile]);

    // Icon hover effects (scale + rotate on desktop)
    const handleIconHover = () => {
      if (!iconRef.current || isMobile) return;

      gsap.to(iconRef.current, {
        scale: 1.2,
        rotation: 5,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleIconLeave = () => {
      if (!iconRef.current || isMobile) return;

      gsap.to(iconRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    // 3D tilt effect based on mouse position (desktop only)
    const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardInnerRef.current || !isDesktop) return;

      const rect = cardInnerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate rotation (±5deg max)
      const rotateY = ((e.clientX - centerX) / rect.width) * 10;
      const rotateX = ((centerY - e.clientY) / rect.height) * 10;

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.1s ease-out',
      });
    };

    // Magnetic cursor effect (throttled for performance)
    const handleMagneticMove = useMemo(
      () =>
        throttle((e: React.MouseEvent<HTMLDivElement>) => {
          if (!ref || typeof ref === 'function' || !ref.current || !isDesktop) return;

          const rect = ref.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Subtle magnetic pull (15% strength)
          const deltaX = (e.clientX - centerX) * 0.15;
          const deltaY = (e.clientY - centerY) * 0.15;

          gsap.to(ref.current, {
            x: deltaX,
            y: deltaY,
            duration: 0.6,
            ease: 'power2.out',
          });
        }, 16),
      [ref, isDesktop]
    );

    // Combined mouse move handler
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      handleCardMouseMove(e);
      handleMagneticMove(e);
    };

    // Reset both effects on mouse leave
    const handleCardMouseLeave = () => {
      // Reset tilt
      setTiltStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.3s ease-out',
      });

      // Reset magnetic position
      if (ref && typeof ref !== 'function' && ref.current) {
        gsap.to(ref.current, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    };

    return (
      <div
        ref={ref}
        onMouseMove={isDesktop ? handleMouseMove : undefined}
        onMouseLeave={isDesktop ? handleCardMouseLeave : undefined}
        className={cn(
          // Base styling
          'relative overflow-hidden rounded-3xl',
          'backdrop-blur-xl bg-white/80 border border-white/30',
          'shadow-lg hover:shadow-2xl',
          'p-6 md:p-8 lg:p-10',
          'group cursor-pointer',
          'transition-all duration-500',
          // GPU acceleration
          'will-change-transform',
          'transform-gpu',
          // Grid size variants
          gridSize === 'wide' && 'md:col-span-2',
          gridSize === 'tall' && 'lg:row-span-2',
          // Minimum height
          'min-h-[400px] md:min-h-[500px] lg:min-h-[600px]',
          gridSize === 'tall' && 'lg:min-h-[800px]'
        )}
        style={{
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
      >
        {/* Inner container for tilt effect */}
        <div ref={cardInnerRef} style={tiltStyle} className="w-full h-full">
          {/* Gradient border on hover */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${accentColor}40, transparent)`,
              padding: '2px',
              zIndex: -1,
            }}
          />

        {/* Service number badge */}
        <div
          className="absolute top-4 right-4 text-5xl md:text-6xl lg:text-7xl font-['Gibson'] font-bold opacity-10 select-none"
          style={{ color: accentColor }}
        >
          {number}
        </div>

        {/* Icon */}
        <div className="mb-6 relative z-10">
          <div
            ref={iconRef}
            className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 relative group/icon"
            onMouseEnter={handleIconHover}
            onMouseLeave={handleIconLeave}
          >
            <div
              className="w-full h-full rounded-2xl flex items-center justify-center transition-transform duration-500"
              style={{
                background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                border: `2px solid ${accentColor}40`,
              }}
            >
              <img
                src={icon}
                alt={`${title} icon`}
                className="w-12 h-12 md:w-14 md:h-14"
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl lg:text-3xl font-['Gibson'] font-bold mb-3 text-gray-900 tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="font-['Gibson'] text-gray-800 mb-6 leading-relaxed">{description}</p>

        {/* Features list */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-sm font-['Gibson'] text-gray-900">
              <span
                className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Testimonial */}
        <div className="mb-8 p-4 rounded-2xl bg-white/40 border border-white/40 backdrop-blur-sm">
          <p className="text-sm font-['Gibson'] italic text-gray-900 mb-2">
            "{testimonial.quote}"
          </p>
          <p className="text-xs font-['Gibson'] font-semibold text-gray-800">
            – {testimonial.author}, {testimonial.company}
          </p>
        </div>

        {/* Client logos */}
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          {clientLogos.map((logo, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-lg bg-white/60 border border-white/40 overflow-hidden grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
              title={`Client ${i + 1}`}
            >
              <img
                src={logo}
                alt={`Client ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href={ctaLink}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-['Gibson'] font-bold hover:scale-105 hover:bg-gray-800 transition-all duration-300 group/btn"
          style={{
            boxShadow: `0 10px 30px ${accentColor}20`,
          }}
        >
          <span>{ctaText}</span>
          <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
            →
          </span>
        </Link>
        </div>
      </div>
    );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
