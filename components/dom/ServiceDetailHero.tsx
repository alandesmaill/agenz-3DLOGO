'use client';

import AnimatedText from '@/components/dom/AnimatedText';

interface ServiceDetailHeroProps {
  number: string;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
}

export default function ServiceDetailHero({
  number,
  title,
  tagline,
  description,
  accentColor,
}: ServiceDetailHeroProps) {
  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Large service number overlay */}
      <div
        className="
          absolute -top-12 -left-2 sm:-left-4 md:-left-8 lg:-left-12
          text-[100px] sm:text-[120px] md:text-[160px] lg:text-[200px]
          font-['Gibson'] font-bold
          opacity-10
          leading-none
          select-none
          pointer-events-none
        "
        style={{ color: accentColor }}
      >
        {number}
      </div>

      {/* Content container */}
      <div className="relative z-10">
        {/* Title with AnimatedText */}
        <AnimatedText
          className="text-4xl md:text-5xl lg:text-6xl font-['Gibson'] font-bold text-gray-900 mb-4 tracking-tight"
          splitBy="chars"
          stagger={0.02}
          duration={0.5}
          y={30}
        >
          {title}
        </AnimatedText>

        {/* Tagline */}
        <p className="text-2xl md:text-3xl font-['Gibson'] font-medium text-gray-700 mb-6">
          {tagline}
        </p>

        {/* Description */}
        <p className="text-lg md:text-xl font-['Gibson'] text-gray-600 mb-12 max-w-4xl leading-relaxed">
          {description}
        </p>

      </div>
    </div>
  );
}
