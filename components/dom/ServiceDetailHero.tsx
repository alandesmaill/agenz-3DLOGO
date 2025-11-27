'use client';

import Link from 'next/link';
import AnimatedText from '@/components/dom/AnimatedText';

interface ServiceDetailHeroProps {
  number: string;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
}

export default function ServiceDetailHero({
  number,
  title,
  tagline,
  description,
  accentColor,
  stats,
}: ServiceDetailHeroProps) {
  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Large service number overlay */}
      <div
        className="
          absolute -top-12 -left-4 md:-left-12
          text-[140px] md:text-[200px] lg:text-[240px]
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

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="
                p-6 md:p-8
                rounded-2xl
                bg-white/80 backdrop-blur-xl
                border border-white/30
                shadow-lg hover:shadow-2xl
                transition-all duration-300
                hover:scale-105
                transform-gpu
              "
            >
              <div
                className="text-4xl md:text-5xl font-['Gibson'] font-bold mb-2"
                style={{ color: accentColor }}
              >
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-['Gibson'] font-medium text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/contact"
          className="
            inline-flex items-center gap-3
            px-8 py-4
            bg-gray-900 text-white
            font-['Gibson'] font-bold text-lg
            rounded-full
            hover:scale-105 hover:bg-gray-800
            transition-all duration-300
            shadow-xl
            group
          "
          style={{
            boxShadow: `0 15px 50px ${accentColor}25`,
          }}
        >
          <span>Get Started</span>
          <span className="text-xl transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
