'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface InfiniteTextProps {
  text: string;
  length?: number;
  className?: string;
}

export default function InfiniteText({ text, length = 5, className = '' }: InfiniteTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.getBoundingClientRect().width;
    const itemWidth = container.children[0]?.getBoundingClientRect().width || 0;

    if (itemWidth === 0) return;

    const initialOffset = ((2 * itemWidth) / containerWidth) * 100 * -1;

    gsap.set(container, {
      xPercent: initialOffset,
    });

    const duration = 5;

    const tl = gsap.timeline();
    tl.to(container, {
      ease: 'none',
      duration,
      xPercent: 0,
      repeat: -1,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex items-center whitespace-nowrap ${className}`}
    >
      {Array.from({ length }, (_, index) => (
        <div
          key={`${index}-${text}`}
          className={`flex items-center px-10 ${
            index % 2 === 0
              ? 'text-gray-400'
              : 'text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.3)]'
          }`}
        >
          <span className="text-sm font-bold tracking-widest uppercase">{text}</span>
        </div>
      ))}
    </div>
  );
}
