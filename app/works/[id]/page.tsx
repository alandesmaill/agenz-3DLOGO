'use client';

import { useCallback, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import SmoothScrolling from '@/components/dom/SmoothScrolling';
import Header from '@/components/dom/Header';
import MenuOverlay from '@/components/dom/MenuOverlay';
import Footer from '@/components/dom/Footer';
import PortfolioDetailHero from '@/components/dom/PortfolioDetailHero';
import ProjectOverview from '@/components/dom/ProjectOverview';
import BeforeAfterShowcase from '@/components/dom/BeforeAfterShowcase';
import ProjectGallery from '@/components/dom/ProjectGallery';
import ProjectResults from '@/components/dom/ProjectResults';
import ProjectTestimonial from '@/components/dom/ProjectTestimonial';
import RelatedProjects from '@/components/dom/RelatedProjects';
import { getPortfolioById } from '@/lib/works-data';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const portfolio = getPortfolioById(params.id);

  // If portfolio item not found, show 404
  if (!portfolio) {
    notFound();
  }

  // Menu navigation handler
  const handleMenuNavigate = useCallback((section: string) => {
    if (section === 'home') {
      window.location.href = '/';
    } else if (section === 'about') {
      window.location.href = '/about';
    } else if (section === 'works') {
      window.location.href = '/works';
    } else if (section === 'services') {
      window.location.href = '/services';
    } else if (section === 'contact') {
      window.location.href = '/contact';
    }
  }, []);

  // Scroll to top and refresh ScrollTrigger on mount
  useEffect(() => {
    window.scrollTo(0, 0);

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
        onLogoClick={() => window.location.href = '/'}
        onGetInTouch={() => window.location.href = '/contact'}
        onMenuClick={() => setMenuOpen(true)}
      />
      <SmoothScrolling>
        <main className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          {/* Hero Section */}
          <section className="relative py-20 md:py-32 px-6 md:px-12 overflow-hidden">
            <PortfolioDetailHero
              clientName={portfolio.clientName}
              projectTitle={portfolio.projectTitle}
              year={portfolio.year}
              category={portfolio.category}
              coverImage={portfolio.hero.coverImage}
              tagline={portfolio.hero.tagline}
              description={portfolio.hero.description}
              stats={portfolio.hero.stats}
              accentColor={portfolio.accentColor}
            />
          </section>

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
        onNavigate={handleMenuNavigate}
      />
    </>
  );
}
