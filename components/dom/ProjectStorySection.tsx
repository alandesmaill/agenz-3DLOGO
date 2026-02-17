'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProjectStorySectionProps {
  title: string;
  accentColor: string;
  children: ReactNode;
}

export default function ProjectStorySection({
  title,
  accentColor,
  children,
}: ProjectStorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div ref={sectionRef} className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-6 md:px-0">
        {/* Accent bar */}
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: accentColor }} />
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-['Gibson'] font-bold text-gray-900 mb-6">
          {title}
        </h2>
        {/* Content */}
        {children}
      </div>
    </div>
  );
}
