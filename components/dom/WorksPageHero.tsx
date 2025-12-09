'use client';

import Image from 'next/image';
import AnimatedText from '@/components/dom/AnimatedText';
import { PortfolioItem } from '@/lib/works-data';
import { getProjectGradient } from '@/lib/works-placeholders';

interface WorksPageHeroProps {
  featuredProject: PortfolioItem;
}

export default function WorksPageHero({ featuredProject }: WorksPageHeroProps) {
  const handleExploreClick = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-20"
        style={{ background: getProjectGradient(featuredProject.id, 'hero') }}
      />

      {/* Optional background image with reduced opacity */}
      {featuredProject.hero.coverImage && (
        <div className="absolute inset-0 -z-20">
          <Image
            src={featuredProject.hero.coverImage}
            alt={`${featuredProject.clientName} - ${featuredProject.projectTitle}`}
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
      )}

      {/* Large client name watermark */}
      <div className="absolute top-8 sm:top-12 left-4 sm:left-6 md:left-12 pointer-events-none select-none">
        <h1 className="text-[12vw] md:text-[15vw] lg:text-[18vw] font-['Gibson'] font-bold text-white/10 leading-none">
          {featuredProject.clientName}
        </h1>
      </div>

      {/* Content at bottom */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-20 w-full">
        {/* Category badge */}
        <div className="inline-block px-4 py-2 rounded-full backdrop-blur-lg bg-white/20 border border-white/30 mb-6">
          <span className="text-sm font-['Gibson'] font-bold text-white uppercase tracking-wider">
            {featuredProject.category} • {featuredProject.year}
          </span>
        </div>

        {/* Project title with AnimatedText */}
        <AnimatedText
          className="text-4xl md:text-5xl lg:text-6xl font-['Gibson'] font-bold text-white mb-4 leading-tight"
          splitBy="words"
          stagger={0.05}
          duration={0.6}
          y={30}
        >
          {featuredProject.projectTitle}
        </AnimatedText>

        {/* Tagline */}
        <p className="text-xl md:text-2xl font-['Gibson'] text-white/90 mb-8 max-w-3xl leading-relaxed">
          {featuredProject.hero.tagline}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl">
          {featuredProject.hero.stats.map((stat, index) => (
            <div
              key={index}
              className="
                p-4 md:p-6
                rounded-xl
                backdrop-blur-lg bg-white/10
                border border-white/20
                hover:bg-white/20
                transition-all duration-300
                hover:scale-105
                transform-gpu
              "
            >
              <div className="text-3xl md:text-4xl font-['Gibson'] font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm font-['Gibson'] text-white/80 uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleExploreClick}
          className="
            inline-flex items-center gap-3
            px-8 py-4
            bg-white text-gray-900
            font-['Gibson'] font-bold text-lg
            rounded-full
            hover:scale-105 hover:shadow-2xl
            transition-all duration-300
            shadow-xl
            group
          "
        >
          <span>Explore Portfolio</span>
          <span className="text-xl transition-transform group-hover:translate-y-1">
            ↓
          </span>
        </button>
      </div>

      {/* Dark gradient overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none -z-10" />

      {/* Scroll indicator (animated) */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
        <div className="text-white/60 text-2xl md:text-3xl">↓</div>
      </div>
    </section>
  );
}
