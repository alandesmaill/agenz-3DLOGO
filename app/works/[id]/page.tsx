'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import SmoothScrolling from '@/components/dom/SmoothScrolling';
import Header from '@/components/dom/Header';
import MenuOverlay from '@/components/dom/MenuOverlay';
import Footer from '@/components/dom/Footer';
import CompactProjectHeader from '@/components/dom/CompactProjectHeader';
import ProjectStorySection from '@/components/dom/ProjectStorySection';
import ProjectTestimonial from '@/components/dom/ProjectTestimonial';
import RelatedProjects from '@/components/dom/RelatedProjects';
import ProjectGallery from '@/components/dom/ProjectGallery';
import type { PortfolioItem } from '@/lib/works-data';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function transformProject(p: Record<string, unknown>): PortfolioItem {
  return {
    id: p.slug as string,
    category: p.category as PortfolioItem['category'],
    clientName: p.clientName as string,
    projectTitle: p.projectTitle as string,
    year: p.year as string,
    accentColor: p.accentColor as string,
    thumbnail: { image: p.thumbnailImage as string, alt: p.thumbnailAlt as string },
    hero: {
      coverImage: p.heroCoverImage as string,
      tagline: p.heroTagline as string,
      description: p.heroDescription as string,
      stats: ((p.heroStats as Array<Record<string, string>>) || []).map((s) => ({ label: s.label, value: s.value })),
    },
    overview: {
      challenge: p.overviewChallenge as string,
      solution: p.overviewSolution as string,
      approach: p.overviewApproach as string[],
      deliverables: p.overviewDeliverables as string[],
    },
    gallery: ((p.galleryItems as Array<Record<string, string>>) || []).map((g) => ({
      type: g.type as 'image' | 'video',
      src: g.src,
      alt: g.alt || undefined,
      thumbnail: g.thumbnail || undefined,
    })),
    results: ((p.results as Array<Record<string, string>>) || []).map((r) => ({
      metric: r.metric,
      value: r.value,
      label: r.label,
    })),
    testimonial: {
      quote: p.testimonialQuote as string,
      author: p.testimonialAuthor as string,
      role: p.testimonialRole as string,
      company: p.testimonialCompany as string,
    },
    relatedProjects: p.relatedSlugs as string[],
  };
}

export default function PortfolioDetailPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`/api/content/works/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => setPortfolio(transformProject(data)))
      .catch(() => setPortfolio(null))
      .finally(() => setLoading(false));

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    setTimeout(() => {
      ScrollTrigger.update();
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00ffff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!portfolio) {
    notFound();
  }

  return (
    <>
      <Header
        variant="dark"
        onLogoClick={() => window.location.href = '/'}
        onMenuClick={() => setMenuOpen(true)}
      />
      <SmoothScrolling>
        <main className="scrollable-page relative min-h-screen" style={{ background: 'radial-gradient(ellipse 70% 60% at 20% 50%, rgba(0, 255, 255, 0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 60% 85%, rgba(0, 255, 255, 0.06) 0%, transparent 55%), #0d0d0d' }}>
          <CompactProjectHeader
            clientName={portfolio.clientName}
            projectTitle={portfolio.projectTitle}
            year={portfolio.year}
            category={portfolio.category}
            accentColor={portfolio.accentColor}
            tagline={portfolio.hero.tagline}
            coverImage={portfolio.hero.coverImage}
          />

          <ProjectStorySection title="The Challenge" accentColor={portfolio.accentColor}>
            <p className="text-lg font-['Gibson'] text-white/65 leading-relaxed">
              {portfolio.overview.challenge}
            </p>
          </ProjectStorySection>

          <ProjectStorySection title="Our Solution" accentColor={portfolio.accentColor}>
            <p className="text-lg font-['Gibson'] text-gray-700 leading-relaxed mb-6">
              {portfolio.overview.solution}
            </p>
            <h4 className="text-lg font-['Gibson'] font-bold text-white mb-3">Approach</h4>
            <ul className="space-y-2">
              {portfolio.overview.approach.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${portfolio.accentColor}20` }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke={portfolio.accentColor} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-base font-['Gibson'] text-white/65">{item}</span>
                </li>
              ))}
            </ul>
          </ProjectStorySection>

          <ProjectStorySection title="What We Delivered" accentColor={portfolio.accentColor}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {portfolio.overview.deliverables.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${portfolio.accentColor}20` }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke={portfolio.accentColor} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  <span className="text-sm font-['Gibson'] text-white/65">{item}</span>
                </div>
              ))}
            </div>
          </ProjectStorySection>

          <section className="relative py-12 md:py-16 px-6 md:px-12">
            <ProjectTestimonial
              quote={portfolio.testimonial.quote}
              author={portfolio.testimonial.author}
              role={portfolio.testimonial.role}
              company={portfolio.testimonial.company}
              accentColor={portfolio.accentColor}
            />
          </section>

          {portfolio.gallery.length > 0 && (
            <ProjectGallery
              items={portfolio.gallery}
              accentColor={portfolio.accentColor}
            />
          )}

          {portfolio.relatedProjects.length > 0 && (
            <section className="relative py-12 md:py-16 px-6 md:px-12">
              <RelatedProjects
                relatedProjectIds={portfolio.relatedProjects}
                accentColor={portfolio.accentColor}
              />
            </section>
          )}

          <Footer />
        </main>
      </SmoothScrolling>

      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
