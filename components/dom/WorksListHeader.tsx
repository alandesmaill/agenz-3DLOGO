'use client';

import AnimatedText from '@/components/dom/AnimatedText';

export default function WorksListHeader() {
  return (
    <section className="relative overflow-hidden pt-24 pb-10 md:pt-28 md:pb-12 px-6 md:px-12">
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
