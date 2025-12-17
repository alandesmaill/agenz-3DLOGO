'use client';

import { useEffect, useState } from 'react';
import SmoothScrolling from '@/components/dom/SmoothScrolling';
import Header from '@/components/dom/Header';
import MenuOverlay from '@/components/dom/MenuOverlay';
import Footer from '@/components/dom/Footer';
import ServiceCTA from '@/components/dom/ServiceCTA';
import BentoGrid from '@/components/dom/BentoGrid';
import WorksPageHero from '@/components/dom/WorksPageHero';
import { getAllPortfolio } from '@/lib/works-data';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WorksPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const portfolioItems = getAllPortfolio();

  // Get featured project (TechFlow)
  const featuredProject = portfolioItems.find(item => item.id === 'techflow-rebrand');

  // Scroll to top and refresh ScrollTrigger on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    // Refresh after component renders
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    // Force update all triggers
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
      {/* Hero Section - Full Screen */}
      {featuredProject && <WorksPageHero featuredProject={featuredProject} />}

      <SmoothScrolling>
        <main className="relative min-h-screen bg-gray-100">

          {/* Portfolio Bento Grid - 10 Projects (excluding TechFlow) */}
          <section className="bento-section relative bg-white py-8 md:py-8 lg:py-12 px-0">
            <BentoGrid
              projects={portfolioItems
                .filter(item => item.id !== 'techflow-rebrand')
                .slice(0, 10)
              }
            />
          </section>

          {/* CTA Section */}
          <section className="relative py-16 md:py-20 px-6 md:px-12">
            <ServiceCTA
              heading="Ready to Create Something Unforgettable?"
              description="Let's discuss your project and explore how we can transform your brand through strategic design, engaging content, and compelling storytelling."
              buttonText="Start Your Project"
              buttonLink="/contact"
              accentColor="#00ffff"
            />
          </section>

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
