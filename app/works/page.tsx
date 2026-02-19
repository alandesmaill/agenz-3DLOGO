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
import { getAllPortfolio } from '@/lib/works-data';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WorksPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const portfolioItems = getAllPortfolio();

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
      <WorksListHeader />

      <SmoothScrolling>
        <main className="scrollable-page relative min-h-screen bg-[#050505]">
          {/* Portfolio Cards */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 space-y-4">
            {portfolioItems.map((item) => (
              <WorksCard key={item.id} item={item} />
            ))}
          </div>

          {/* Client Logos Section */}
          <section className="relative py-12 md:py-16 px-6 md:px-12">
            <ClientLogos />
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
