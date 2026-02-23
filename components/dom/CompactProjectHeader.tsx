'use client';

import Image from 'next/image';
import AnimatedText from '@/components/dom/AnimatedText';
import { getCategoryLabel, type WorkCategory } from '@/lib/works-data';

interface CompactProjectHeaderProps {
  clientName: string;
  projectTitle: string;
  year: string;
  category: WorkCategory;
  accentColor: string;
  tagline: string;
  coverImage?: string;
}

export default function CompactProjectHeader({
  clientName,
  projectTitle,
  year,
  category,
  accentColor,
  tagline,
  coverImage,
}: CompactProjectHeaderProps) {
  return (
    <section className="pt-24 md:pt-28 pb-10 md:pb-14 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Text — 3 cols on desktop */}
          <div className="lg:col-span-3">
            {/* Badge + Year */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-xs font-['Gibson'] font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
              >
                {getCategoryLabel(category)}
              </span>
              <span className="text-sm font-['Gibson'] text-white/60">{year}</span>
            </div>

            {/* Title */}
            <AnimatedText
              className="text-3xl md:text-4xl lg:text-5xl font-['Gibson'] font-bold text-white leading-tight"
              splitBy="words"
              stagger={0.04}
              duration={0.6}
              y={40}
            >
              {projectTitle}
            </AnimatedText>

            {/* Client name */}
            <p className="mt-3 text-xl font-['Gibson'] text-white/60">{clientName}</p>

            {/* Tagline */}
            <p className="mt-2 text-base font-['Gibson'] text-white/50 max-w-xl">{tagline}</p>

          </div>

          {/* Optional cover image — 2 cols on desktop */}
          {coverImage && (
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden max-h-[300px]">
              <Image
                src={coverImage}
                alt={projectTitle}
                width={600}
                height={400}
                className="object-cover w-full h-full rounded-2xl"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
