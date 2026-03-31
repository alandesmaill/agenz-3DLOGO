'use client';

import { useEffect, useState } from 'react';
import SmoothScrolling from '@/components/dom/SmoothScrolling';
import Header from '@/components/dom/Header';
import MenuOverlay from '@/components/dom/MenuOverlay';
import Footer from '@/components/dom/Footer';
import ServiceCTA from '@/components/dom/ServiceCTA';
import ClientLogos from '@/components/dom/ClientLogos';
import WorksListHeader from '@/components/dom/WorksListHeader';
import WorksCard from '@/components/dom/WorksCard';
import type { PortfolioItem } from '@/lib/works-data';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WorksPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch('/api/content/works')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPortfolioItems(
            data.map((p: Record<string, unknown>) => ({
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
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    setTimeout(() => {
      ScrollTrigger.update();
    }, 800);
  }, []);

  return (
    <>
      <Header
        variant="dark"
        onLogoClick={() => window.location.href = '/'}
        onMenuClick={() => setMenuOpen(true)}
      />

      <SmoothScrolling>
        <main className="scrollable-page relative min-h-screen" style={{ background: 'radial-gradient(ellipse 70% 60% at 20% 50%, rgba(0, 255, 255, 0.14) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 60% 85%, rgba(0, 255, 255, 0.10) 0%, transparent 55%), #0d0d0d' }}>
          <WorksListHeader />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pb-12 space-y-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#00ffff] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : portfolioItems.map((item) => (
              <WorksCard key={item.id} item={item} />
            ))}
          </div>

          <section className="relative py-12 md:py-16 px-6 md:px-12">
            <ClientLogos />
          </section>

          <section className="relative py-16 md:py-20 px-6 md:px-12">
            <ServiceCTA
              heading="Ready to Create Something Unforgettable?"
              description="Let's start a conversation about your vision and explore how we can transform your brand through strategic thinking, purposeful design, and storytelling that truly connects. We combine creativity with clarity, crafting experiences that capture attention, build emotion, and drive meaningful results."
              buttonText="Start Your Project"
              buttonLink="/contact"
              accentColor="#00ffff"
            />
          </section>

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
