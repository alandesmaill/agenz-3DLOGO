'use client';

import { useEffect, useState } from 'react';
import SmoothScrolling from '@/components/dom/SmoothScrolling';
import Header from '@/components/dom/Header';
import MenuOverlay from '@/components/dom/MenuOverlay';
import Footer from '@/components/dom/Footer';
import ServiceCTA from '@/components/dom/ServiceCTA';
import AnimatedText from '@/components/dom/AnimatedText';
import HorizontalGallery from '@/components/dom/HorizontalGallery';
import { getAllPortfolio } from '@/lib/works-data';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WorksPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const portfolioItems = getAllPortfolio();

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
      <SmoothScrolling>
        <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          {/* Hero Section */}
          <section className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
            <div className="max-w-6xl mx-auto text-center">
              {/* Title */}
              <AnimatedText
                className="text-5xl md:text-7xl lg:text-8xl font-['Gibson'] font-bold text-white mb-6"
                splitBy="chars"
                stagger={0.02}
                duration={0.5}
                y={30}
              >
                Our Work
              </AnimatedText>

              {/* Description */}
              <AnimatedText
                className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto font-['Gibson']"
                splitBy="words"
                stagger={0.015}
                duration={0.4}
                delay={0.3}
                y={20}
              >
                Explore our portfolio of award-winning projects across brand identity, digital campaigns, and video production. Each piece tells a story of transformation and measurable impact.
              </AnimatedText>
            </div>

            {/* Gradient Orb Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full blur-3xl -z-10" />
          </section>

          {/* Horizontal Gallery Section */}
          <section className="relative">
            <HorizontalGallery items={portfolioItems} />
          </section>

          {/* CTA Section */}
          <section className="relative py-24 md:py-32 px-6 md:px-12">
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
        onNavigate={(section) => {
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
        }}
      />
    </>
  );
}
