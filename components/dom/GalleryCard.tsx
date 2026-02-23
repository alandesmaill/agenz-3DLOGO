'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { PortfolioItem, getCategoryLabel } from '@/lib/works-data';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface GalleryCardProps {
  item: PortfolioItem;
}

export default function GalleryCard({ item }: GalleryCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const { isMobile } = useResponsive();

  // Hover animation (scale + lift)
  const handleMouseEnter = () => {
    if (!cardRef.current || isMobile) return;

    gsap.to(cardRef.current, {
      scale: 1.05,
      y: -10,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || isMobile) return;

    gsap.to(cardRef.current, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <Link
      href={`/works/${item.id}`}
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative block overflow-hidden rounded-2xl',
        'bg-white/8 backdrop-blur-sm border border-white/14',
        'transition-shadow duration-300',
        'hover:shadow-2xl',
        // Desktop: 500×600px, Mobile: full width with aspect ratio
        isMobile ? 'w-full aspect-[5/6]' : 'w-[500px] h-[600px] flex-shrink-0'
      )}
      style={{
        boxShadow: isMobile ? 'none' : `0 10px 40px ${item.accentColor}15`,
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={item.thumbnail.image}
          alt={item.thumbnail.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 500px"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
      </div>

      {/* Category Badge (Top-Left) */}
      <div className="absolute top-6 left-6 z-10">
        <span
          className="px-4 py-2 rounded-full text-xs font-['Gibson'] font-semibold uppercase tracking-wider backdrop-blur-md border"
          style={{
            backgroundColor: `${item.accentColor}20`,
            borderColor: `${item.accentColor}40`,
            color: item.accentColor,
          }}
        >
          {getCategoryLabel(item.category)}
        </span>
      </div>

      {/* Content (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        {/* Client Name */}
        <h3
          className="text-xl font-['Gibson'] font-bold mb-2 transition-all duration-300 group-hover:translate-x-2"
          style={{ color: item.accentColor }}
        >
          {item.clientName}
        </h3>

        {/* Project Title */}
        <p className="text-white text-2xl font-['Gibson'] font-semibold mb-2 transition-all duration-300 group-hover:translate-x-2">
          {item.projectTitle}
        </p>

        {/* Year */}
        <p className="text-white/60 text-sm font-['Gibson'] transition-all duration-300 group-hover:translate-x-2">
          {item.year}
        </p>

        {/* Hover Arrow */}
        <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white font-['Gibson'] text-sm">View Project</span>
          <svg
            className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
