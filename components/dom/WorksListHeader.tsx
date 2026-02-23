'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import AnimatedText from '@/components/dom/AnimatedText';

gsap.registerPlugin(ScrollTrigger);

export default function WorksListHeader() {
  const treeRef = useRef<HTMLDivElement>(null);
  const floatTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !treeRef.current) return;

    // Scroll-triggered entrance: fade + slide from right
    gsap.fromTo(
      treeRef.current,
      { opacity: 0, x: 80 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: treeRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );

    // Continuous float animation
    floatTweenRef.current = gsap.to(treeRef.current, {
      y: 15,
      rotation: -5,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => {
      floatTweenRef.current?.kill();
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 pb-10 md:pt-28 md:pb-12 px-6 md:px-12">
      {/* Tree decoration — top-right, partially bleeding off edge */}
      <div
        ref={treeRef}
        className="absolute pointer-events-none
          right-0 top-0
          w-[38vw] opacity-70 translate-x-[5%] -translate-y-[5%]
          md:w-[30vw] md:opacity-85
          lg:w-[26vw] lg:opacity-100"
      >
        <Image
          src="/images/about/shapes/tree.webp"
          alt=""
          width={600}
          height={800}
          className="w-full h-auto"
          priority
        />
      </div>

      <div className="max-w-6xl mx-auto">
        <AnimatedText
          className="text-4xl md:text-6xl lg:text-7xl font-['Gibson'] font-bold text-white leading-tight"
          splitBy="words"
          stagger={0.04}
          duration={0.6}
          y={40}
        >
          Our Work
        </AnimatedText>
        <p className="mt-6 text-lg md:text-xl font-['Gibson'] text-white/60 max-w-2xl">
          Selected projects across brand, digital, and video
        </p>
      </div>
    </section>
  );
}
