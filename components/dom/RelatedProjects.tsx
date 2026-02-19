'use client';

import { getPortfolioById } from '@/lib/works-data';
import WorksCard from '@/components/dom/WorksCard';
import AnimatedText from '@/components/dom/AnimatedText';

interface RelatedProjectsProps {
  relatedProjectIds: string[];
  accentColor: string;
}

export default function RelatedProjects({
  relatedProjectIds,
}: RelatedProjectsProps) {
  const relatedProjects = relatedProjectIds
    .map(id => getPortfolioById(id))
    .filter(Boolean)
    .slice(0, 3);

  if (relatedProjects.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <AnimatedText
        className="text-3xl md:text-4xl font-['Gibson'] font-bold text-white mb-8 text-center"
        splitBy="words"
        stagger={0.03}
        duration={0.6}
        y={30}
      >
        More Work
      </AnimatedText>

      <div className="space-y-4">
        {relatedProjects.map((project) => (
          project && <WorksCard key={project.id} item={project} />
        ))}
      </div>
    </div>
  );
}
