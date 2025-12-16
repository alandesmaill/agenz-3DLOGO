'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BentoProjectCard from './BentoProjectCard';
import type { PortfolioItem } from '@/lib/works-data';

gsap.registerPlugin(ScrollTrigger);

interface BentoGridProps {
  projects: PortfolioItem[];
}

// Layout configurations for different breakpoints
// Updated for 10-card Linearity-style bento grid (NO aspect ratios to avoid conflicts with auto-rows)
const GRID_LAYOUTS = {
  desktop: [
    { colSpan: 'lg:col-span-2', rowSpan: 'lg:row-span-2' },  // 1: Hero (2x2)
    { colSpan: 'lg:col-span-1', rowSpan: 'lg:row-span-1' }, // 2: Med (1x1)
    { colSpan: 'lg:col-span-1', rowSpan: 'lg:row-span-2' },  // 3: Tall (1x2)
    { colSpan: 'lg:col-span-1', rowSpan: 'lg:row-span-1' }, // 4: Med (1x1)
    { colSpan: 'lg:col-span-1', rowSpan: 'lg:row-span-1' }, // 5: Med (1x1)
    { colSpan: 'lg:col-span-1', rowSpan: 'lg:row-span-1' }, // 6: Med (1x1)
    { colSpan: 'lg:col-span-2', rowSpan: 'lg:row-span-1' }, // 7: Wide (2x1)
    { colSpan: 'lg:col-span-2', rowSpan: 'lg:row-span-1' }, // 8: Wide (2x1)
    { colSpan: 'lg:col-span-1', rowSpan: 'lg:row-span-1' }, // 9: Med (1x1)
    { colSpan: 'lg:col-span-1', rowSpan: 'lg:row-span-1' }, // 10: Med (1x1)
  ],
  tablet: [
    { colSpan: 'md:col-span-2', rowSpan: 'md:row-span-2' },  // 1: Full width tall
    { colSpan: 'md:col-span-1', rowSpan: 'md:row-span-2' },  // 2: Tall
    { colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' }, // 3: Med
    { colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1' }, // 4: Wide
    { colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' }, // 5: Med
    { colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' }, // 6: Med
    { colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1' }, // 7: Wide
    { colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' }, // 8: Med
    { colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1' }, // 9: Med
    { colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1' }, // 10: Wide
  ],
  mobile: [
    {},  // 1: No sizing on mobile - just stack
    {},  // 2
    {},  // 3
    {},  // 4
    {},  // 5
    {},  // 6
    {},  // 7
    {},  // 8
    {},  // 9
    {},  // 10
  ],
};

export default function BentoGrid({ projects }: BentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Stagger entrance animation for all cards
  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.bento-card');

    // Staggered reveal animation
    const animation = gsap.fromTo(
      cards,
      {
        scale: 0.9,
        opacity: 0,
        borderRadius: '100px',
        y: 50,
      },
      {
        scale: 1,
        opacity: 1,
        borderRadius: '24px',
        y: 0,
        duration: 1.2,
        stagger: {
          amount: 0.6, // Total stagger time: 600ms across all cards
          from: 'start', // Sequential reveal from first to last
          ease: 'power2.out',
        },
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 70%',
          once: true,
        },
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  // Combine layouts for all breakpoints
  const getGridConfig = (index: number) => {
    const desktop = GRID_LAYOUTS.desktop[index] || GRID_LAYOUTS.desktop[0];
    const tablet = GRID_LAYOUTS.tablet[index] || GRID_LAYOUTS.tablet[0];

    return {
      colSpan: `${tablet.colSpan || ''} ${desktop.colSpan || ''}`.trim(),
      rowSpan: `${tablet.rowSpan || ''} ${desktop.rowSpan || ''}`.trim(),
    };
  };

  return (
    <div
      ref={gridRef}
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-1 md:gap-2 lg:gap-3
        auto-rows-[180px] md:auto-rows-[200px] lg:auto-rows-[200px]
        w-full
        max-h-[85vh]
      "
    >
      {projects.map((project, index) => (
        <BentoProjectCard
          key={project.id}
          item={project}
          index={index}
          gridConfig={getGridConfig(index)}
        />
      ))}
    </div>
  );
}
