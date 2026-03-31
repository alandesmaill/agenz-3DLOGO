import { prisma } from './prisma';
import type { PortfolioItem, WorkCategory } from '@/lib/works-data';

function toPortfolioItem(p: NonNullable<Awaited<ReturnType<typeof queryProject>>>): PortfolioItem {
  return {
    id: p.slug,
    category: p.category as WorkCategory,
    clientName: p.clientName,
    projectTitle: p.projectTitle,
    year: p.year,
    accentColor: p.accentColor,
    thumbnail: {
      image: p.thumbnailImage,
      alt: p.thumbnailAlt,
    },
    hero: {
      coverImage: p.heroCoverImage,
      tagline: p.heroTagline,
      description: p.heroDescription,
      stats: p.heroStats.map((s) => ({ label: s.label, value: s.value })),
    },
    overview: {
      challenge: p.overviewChallenge,
      solution: p.overviewSolution,
      approach: p.overviewApproach,
      deliverables: p.overviewDeliverables,
    },
    beforeAfter: p.beforeImage && p.afterImage
      ? {
          beforeImage: p.beforeImage,
          afterImage: p.afterImage,
          description: p.beforeAfterDesc || '',
        }
      : undefined,
    gallery: p.galleryItems.map((g) => ({
      type: g.type as 'image' | 'video',
      src: g.src,
      alt: g.alt || undefined,
      thumbnail: g.thumbnail || undefined,
    })),
    results: p.results.map((r) => ({
      metric: r.metric,
      value: r.value,
      label: r.label,
    })),
    testimonial: {
      quote: p.testimonialQuote,
      author: p.testimonialAuthor,
      role: p.testimonialRole,
      company: p.testimonialCompany,
    },
    relatedProjects: p.relatedSlugs,
  };
}

const includeRelations = {
  heroStats: { orderBy: { sortOrder: 'asc' as const } },
  galleryItems: { orderBy: { sortOrder: 'asc' as const } },
  results: { orderBy: { sortOrder: 'asc' as const } },
};

async function queryProject(slug: string) {
  return prisma.portfolioProject.findUnique({
    where: { slug, published: true },
    include: includeRelations,
  });
}

export async function getAllPublishedProjects(): Promise<PortfolioItem[]> {
  const projects = await prisma.portfolioProject.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
    include: includeRelations,
  });

  return projects.map((p) => toPortfolioItem(p));
}

export async function getProjectBySlug(slug: string): Promise<PortfolioItem | null> {
  const project = await queryProject(slug);
  if (!project) return null;
  return toPortfolioItem(project);
}
