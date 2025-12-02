'use client';

import { getPortfolioById } from '@/lib/works-data';
import GalleryCard from '@/components/dom/GalleryCard';
import AnimatedText from '@/components/dom/AnimatedText';

interface RelatedProjectsProps {
  relatedProjectIds: string[];
  accentColor: string;
}

export default function RelatedProjects({
  relatedProjectIds,
  accentColor,
}: RelatedProjectsProps) {
  // Get related portfolio items
  const relatedProjects = relatedProjectIds
    .map(id => getPortfolioById(id))
    .filter(Boolean)
    .slice(0, 3); // Max 3 related projects

  if (relatedProjects.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Section Title */}
      <AnimatedText
        className="text-3xl md:text-4xl font-['Gibson'] font-bold text-gray-900 mb-12 text-center"
        splitBy="words"
        stagger={0.03}
        duration={0.6}
        y={30}
      >
        More Work
      </AnimatedText>

      {/* Related Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedProjects.map((project) => (
          project && <GalleryCard key={project.id} item={project} />
        ))}
      </div>
    </div>
  );
}
