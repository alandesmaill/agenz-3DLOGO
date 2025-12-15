'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import SmoothScrolling from '@/components/dom/SmoothScrolling';
import Header from '@/components/dom/Header';
import MenuOverlay from '@/components/dom/MenuOverlay';
import Footer from '@/components/dom/Footer';
import FullScreenHero from '@/components/dom/FullScreenHero';
import ImageGrid from '@/components/dom/ImageGrid';
import ProjectOverview from '@/components/dom/ProjectOverview';
import BeforeAfterShowcase from '@/components/dom/BeforeAfterShowcase';
import ProjectGallery from '@/components/dom/ProjectGallery';
import ProjectResults from '@/components/dom/ProjectResults';
import ProjectTestimonial from '@/components/dom/ProjectTestimonial';
import RelatedProjects from '@/components/dom/RelatedProjects';
import { getPortfolioById } from '@/lib/works-data';
import { getProjectGradient } from '@/lib/works-placeholders';
import { usePageReady } from '@/contexts/PageReadyContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioDetailPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { markReady } = usePageReady();
  const params = useParams();
  const id = params.id as string;
  const portfolio = getPortfolioById(id);

  // If portfolio item not found, show 404
  if (!portfolio) {
    notFound();
  }


  // Scroll to top and refresh ScrollTrigger on mount
  useEffect(() => {
    console.log('[PortfolioDetail] Component mounted');
    window.scrollTo(0, 0);

    // Check if coming from morph transition
    const transition = sessionStorage.getItem('works-page-transition');

    if (transition) {
      console.log('[PortfolioDetail] Coming from morph transition');

      // Coming from morph - refresh immediately and earlier
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      setTimeout(() => {
        ScrollTrigger.update();
      }, 300);

      // Additional refresh to ensure all triggers are set up
      setTimeout(() => {
        ScrollTrigger.refresh();
        console.log('[PortfolioDetail] Final ScrollTrigger refresh complete');

        // Signal that page is fully painted and ready
        markReady();
      }, 500);
    } else {
      console.log('[PortfolioDetail] Normal navigation');

      // Normal navigation - use existing timers
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 600);

      setTimeout(() => {
        ScrollTrigger.update();
        console.log('[PortfolioDetail] Final ScrollTrigger update complete');

        // Signal that page is fully painted and ready
        markReady();
      }, 800);
    }
  }, [markReady]);

  return (
    <>
      <Header
        onLogoClick={() => window.location.href = '/'}
        onGetInTouch={() => window.location.href = '/contact'}
        onMenuClick={() => setMenuOpen(true)}
      />
      <SmoothScrolling>
        <main className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          {/* Hero Section - Full Screen */}
          <FullScreenHero
            clientName={portfolio.clientName}
            projectTitle={portfolio.projectTitle}
            year={portfolio.year}
            category={portfolio.category}
            accentColor={portfolio.accentColor}
            gradient={getProjectGradient(portfolio.id, 'hero')}
            projectId={portfolio.id}
          />

          {/* Overview Section */}
          <section className="relative py-16 md:py-24 px-6 md:px-12">
            <ProjectOverview
              challenge={portfolio.overview.challenge}
              solution={portfolio.overview.solution}
              approach={portfolio.overview.approach}
              deliverables={portfolio.overview.deliverables}
              accentColor={portfolio.accentColor}
            />
          </section>

          {/* Before/After Section (conditional) */}
          {portfolio.beforeAfter && (
            <section className="relative py-16 md:py-24 px-6 md:px-12">
              <BeforeAfterShowcase
                beforeImage={portfolio.beforeAfter.beforeImage}
                afterImage={portfolio.beforeAfter.afterImage}
                description={portfolio.beforeAfter.description}
                accentColor={portfolio.accentColor}
              />
            </section>
          )}

          {/* Gallery Section */}
          <section className="relative py-16 md:py-24 px-6 md:px-12">
            <ProjectGallery
              galleryItems={portfolio.gallery}
              accentColor={portfolio.accentColor}
            />
          </section>

          {/* Image Grid - Visual Showcase */}
          <ImageGrid
            images={[
              getProjectGradient(portfolio.id, 'gallery', 0),
              getProjectGradient(portfolio.id, 'gallery', 1),
              getProjectGradient(portfolio.id, 'gallery', 2),
            ]}
            captions={[
              portfolio.gallery[0]?.alt || 'Project showcase image 1',
              portfolio.gallery[1]?.alt || 'Project showcase image 2',
              portfolio.gallery[2]?.alt || 'Project showcase image 3',
            ]}
          />

          {/* Results Section */}
          <section className="relative py-16 md:py-24 px-6 md:px-12">
            <ProjectResults
              results={portfolio.results}
              accentColor={portfolio.accentColor}
            />
          </section>

          {/* Testimonial Section */}
          <section className="relative py-16 md:py-24 px-6 md:px-12">
            <ProjectTestimonial
              quote={portfolio.testimonial.quote}
              author={portfolio.testimonial.author}
              role={portfolio.testimonial.role}
              company={portfolio.testimonial.company}
              accentColor={portfolio.accentColor}
            />
          </section>

          {/* Related Projects Section */}
          {portfolio.relatedProjects.length > 0 && (
            <section className="relative py-16 md:py-24 px-6 md:px-12">
              <RelatedProjects
                relatedProjectIds={portfolio.relatedProjects}
                accentColor={portfolio.accentColor}
              />
            </section>
          )}

          {/* Footer */}
          <Footer />
        </main>
      </SmoothScrolling>

      {/* Menu Overlay */}
      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
