'use client';

import AnimatedText from '@/components/dom/AnimatedText';

export default function WorksListHeader() {
  return (
    <section className="bg-[#050505] py-28 md:py-36 px-6 md:px-12">
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
        <p className="mt-6 text-lg md:text-xl font-['Gibson'] text-white/40 max-w-2xl">
          Selected projects across brand, digital, and video
        </p>
      </div>
    </section>
  );
}
