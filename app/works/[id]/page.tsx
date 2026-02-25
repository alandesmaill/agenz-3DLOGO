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
import { getPortfolioById } from '@/lib/works-data';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PortfolioDetailPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useParams();
  const id = params.id as string;
  const portfolio = getPortfolioById(id);

  if (!portfolio) {
    notFound();
  }

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
        variant="dark"
        onLogoClick={() => window.location.href = '/'}
        onGetInTouch={() => window.location.href = '/contact'}
        onMenuClick={() => setMenuOpen(true)}
      />
      <SmoothScrolling>
        <main className="scrollable-page relative min-h-screen" style={{ background: 'radial-gradient(ellipse 70% 60% at 20% 50%, rgba(0, 255, 255, 0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 60% 85%, rgba(0, 255, 255, 0.06) 0%, transparent 55%), #0d0d0d' }}>
          {/* Compact Header */}
          <CompactProjectHeader
            clientName={portfolio.clientName}
            projectTitle={portfolio.projectTitle}
            year={portfolio.year}
            category={portfolio.category}
            accentColor={portfolio.accentColor}
            tagline={portfolio.hero.tagline}
            coverImage={portfolio.hero.coverImage}
          />

          {/* The Challenge */}
          <ProjectStorySection title="The Challenge" accentColor={portfolio.accentColor}>
            <p className="text-lg font-['Gibson'] text-white/65 leading-relaxed">
              {portfolio.overview.challenge}
            </p>
          </ProjectStorySection>

          {/* Our Solution */}
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

          {/* What We Delivered */}
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

          {/* Testimonial */}
          <section className="relative py-12 md:py-16 px-6 md:px-12">
            <ProjectTestimonial
              quote={portfolio.testimonial.quote}
              author={portfolio.testimonial.author}
              role={portfolio.testimonial.role}
              company={portfolio.testimonial.company}
              accentColor={portfolio.accentColor}
            />
          </section>

          {/* Project Gallery */}
          {portfolio.gallery.length > 0 && (
            <ProjectGallery
              items={portfolio.gallery}
              accentColor={portfolio.accentColor}
            />
          )}

          {/* Related Projects */}
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
