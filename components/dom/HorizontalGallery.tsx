'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PortfolioItem } from '@/lib/works-data';
import GalleryCard from './GalleryCard';
import { useResponsive } from '@/hooks/useResponsive';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalGalleryProps {
  items: PortfolioItem[];
  filterCategory?: string; // For Phase 6 filtering
}

export default function HorizontalGallery({ items, filterCategory = 'all' }: HorizontalGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();

  // Filter items by category (Phase 6 feature)
  const filteredItems = filterCategory === 'all'
    ? items
    : items.filter(item => item.category === filterCategory);

  useEffect(() => {
    // Skip horizontal scroll on mobile - stack vertically instead
    if (isMobile || !containerRef.current || !scrollContainerRef.current) return;

    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;

    // Calculate scroll amount based on container width
    const getScrollAmount = () => {
      const scrollWidth = scrollContainer.scrollWidth;
      const viewportWidth = window.innerWidth;
      return -(scrollWidth - viewportWidth);
    };

    // Create horizontal scroll animation with pinning
    const scrollTween = gsap.to(scrollContainer, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1, // Smooth scrub with 1-second catch-up
        invalidateOnRefresh: true, // Recalculate on resize
        end: () => `+=${scrollContainer.scrollWidth - window.innerWidth}`,
        // markers: true, // Uncomment for debugging
      },
    });

    // Cleanup on unmount
    return () => {
      if (scrollTween.scrollTrigger) {
        scrollTween.scrollTrigger.kill();
      }
      scrollTween.kill();
    };
  }, [isMobile, filteredItems]); // Re-run when mobile state or filtered items change

  return (
    <section
      ref={containerRef}
      className={`relative ${isMobile ? 'py-12' : 'h-screen'} overflow-hidden`}
    >
      <div
        ref={scrollContainerRef}
        className={`
          ${isMobile ? 'flex flex-col gap-8 px-4' : 'flex flex-row gap-8 px-12'}
          ${!isMobile && 'h-full items-center'}
        `}
      >
        {filteredItems.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
