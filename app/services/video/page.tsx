'use client';

import { useEffect, useState } from 'react';
import SmoothScrolling from '@/components/dom/SmoothScrolling';
import ServiceDetailHero from '@/components/dom/ServiceDetailHero';
import ServiceOverview from '@/components/dom/ServiceOverview';
import ServiceFeatureGrid from '@/components/dom/ServiceFeatureGrid';
import ServiceCTA from '@/components/dom/ServiceCTA';
import Footer from '@/components/dom/Footer';
import Header from '@/components/dom/Header';
import MenuOverlay from '@/components/dom/MenuOverlay';
import { serviceDetailsData } from '@/lib/service-details-data';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VideoPage() {
  const service = serviceDetailsData.video;
  const [menuOpen, setMenuOpen] = useState(false);

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
        variant="dark"
        onLogoClick={() => window.location.href = '/'}
        onGetInTouch={() => window.location.href = '/contact'}
        onMenuClick={() => setMenuOpen(true)}
      />
      <SmoothScrolling>
        <main className="scrollable-page relative min-h-screen" style={{ background: 'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0, 233, 44, 0.10) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 100% 0%, rgba(0, 255, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 10% 100%, rgba(0, 233, 44, 0.08) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(0, 255, 255, 0.07) 0%, transparent 50%), #050505' }}>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-6 md:px-12 overflow-hidden">
          <ServiceDetailHero
            number={service.number}
            title={service.title}
            tagline={service.hero.tagline}
            description={service.hero.description}
            accentColor={service.accentColor}
          />
        </section>

        {/* Overview Section */}
        <section className="relative py-16 md:py-24 px-6 md:px-12">
          <ServiceOverview
            heading={service.overview.heading}
            paragraphs={service.overview.paragraphs}
            benefits={service.overview.benefits}
            accentColor={service.accentColor}
          />
        </section>

        {/* Features Section */}
        <section className="relative py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-['Gibson'] font-bold text-white mb-12 text-center">
              What We Offer
            </h2>
            <ServiceFeatureGrid
              features={service.features}
              accentColor={service.accentColor}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 md:py-24 px-6 md:px-12">
          <ServiceCTA
            heading={service.cta.heading}
            description={service.cta.description}
            buttonText={service.cta.buttonText}
            buttonLink={service.cta.buttonLink}
            accentColor={service.accentColor}
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
