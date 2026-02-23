'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  ctaText: string;
  ctaLink: string;
  index: number;
}

const ServiceCard = forwardRef<HTMLDivElement, ServiceCardProps>(
  function ServiceCard(
    { title, description, icon, accentColor, ctaText, ctaLink },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styling
          'relative overflow-hidden rounded-3xl',
          'backdrop-blur-xl bg-white/8 border border-white/14',
          'p-8 md:p-10 lg:p-12',
          'group cursor-pointer',
          // Fixed aspect ratio - perfect squares
          'aspect-square',
          'flex flex-col',
          // Subtle hover effects only
          'hover:shadow-2xl hover:scale-[1.02]',
          'transition-all duration-500',
          // GPU acceleration
          'will-change-transform transform-gpu'
        )}
      >
        {/* Icon - Top Section */}
        <div className="mb-6">
          <div
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl
                       flex items-center justify-center
                       transition-transform duration-500 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
              border: `2px solid ${accentColor}40`,
            }}
          >
            <img
              src={icon}
              alt={`${title} icon`}
              className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Content - Middle Section (grows to fill space) */}
        <div className="flex-grow mb-6">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-['Gibson'] font-bold
                         mb-4 text-white tracking-tight">
            {title}
          </h3>
          <p className="font-['Gibson'] text-white/65 text-base md:text-lg
                        leading-relaxed line-clamp-4">
            {description}
          </p>
        </div>

        {/* CTA - Bottom Section */}
        <div className="mt-auto">
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       bg-white/10 text-white font-['Gibson'] font-bold border border-white/20
                       hover:scale-105 hover:bg-white/20
                       transition-all duration-300 group/btn"
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
  }
);

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
