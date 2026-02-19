'use client';

import Image from 'next/image';
import AnimatedText from '@/components/dom/AnimatedText';
import { getCategoryLabel, WorkCategory } from '@/lib/works-data';

interface PortfolioDetailHeroProps {
  clientName: string;
  projectTitle: string;
  year: string;
  category: WorkCategory;
  coverImage: string;
  tagline: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
  accentColor: string;
}

export default function PortfolioDetailHero({
  clientName,
  projectTitle,
  year,
  category,
  coverImage,
  tagline,
  description,
  stats,
  accentColor,
}: PortfolioDetailHeroProps) {
  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Cover Image Background */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12">
        <Image
          src={coverImage}
          alt={`${clientName} - ${projectTitle}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Client Name Overlay */}
        <div
          className="absolute bottom-8 left-8 text-6xl md:text-8xl font-['Gibson'] font-bold opacity-30 leading-none select-none pointer-events-none"
          style={{ color: accentColor }}
        >
          {clientName}
        </div>
      </div>

      {/* Content container */}
      <div className="relative z-10">
        {/* Category Badge + Year */}
        <div className="flex items-center gap-4 mb-6">
          <span
            className="px-4 py-2 rounded-full text-sm font-['Gibson'] font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
            }}
          >
            {getCategoryLabel(category)}
          </span>
          <span className="text-gray-500 font-['Gibson']">{year}</span>
        </div>

        {/* Project Title with AnimatedText */}
        <AnimatedText
          className="text-4xl md:text-5xl lg:text-6xl font-['Gibson'] font-bold text-gray-900 mb-4 tracking-tight"
          splitBy="chars"
          stagger={0.02}
          duration={0.5}
          y={30}
        >
          {projectTitle}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="
                p-6 md:p-8
                rounded-2xl
                bg-gray-100/80 backdrop-blur-xl
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
      </div>
    </div>
  );
}
