'use client';

import Image from 'next/image';
import { PortfolioItem } from '@/lib/works-data';
import { getProjectGradient } from '@/lib/works-placeholders';

interface WorksPageHeroProps {
  featuredProject: PortfolioItem;
}

export default function WorksPageHero({ featuredProject }: WorksPageHeroProps) {
  const handleExploreClick = () => {
    const bentoSection = document.querySelector('.bento-section');
    if (bentoSection) {
      bentoSection.scrollIntoView({ behavior: 'smooth' });
    }
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

      {/* Content at bottom - Just "Explore Portfolio" button */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-12 md:pb-20 w-full">
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
