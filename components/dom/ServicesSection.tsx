'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServiceCard from './ServiceCard';
import InfiniteText from './InfiniteText';
import MenuOverlay from './MenuOverlay';
import SmoothScrolling from './SmoothScrolling';
import AnimatedText from './AnimatedText';
import Header from './Header';
import Footer from './Footer';
import { servicesData } from '@/lib/services-data';
import { useResponsive } from '@/hooks/useResponsive';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onBack?: () => void;
}

export default function ServicesSection({ onBack }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile } = useResponsive();

  // Critical: Refresh ScrollTrigger when ServicesSection mounts
  useEffect(() => {
    // Scroll to top when section loads
    window.scrollTo(0, 0);

    // Refresh ScrollTrigger after component and children have rendered
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    // Force update all triggers
    const updateTimer = setTimeout(() => {
      ScrollTrigger.update();
    }, 800);

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(updateTimer);
    };
  }, []);

  // Hero and cards animation
  useEffect(() => {
    if (!sectionRef.current || !heroRef.current) return;

    const ctx = gsap.context(() => {
      // Immediate animation on mount (not scroll-triggered)
      const timeline = gsap.timeline({ delay: 0.2 });

      timeline
        .fromTo(
          heroRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        )
        .fromTo(
          cardsRef.current.filter(Boolean),
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: isMobile ? 0.15 : 0.12,
            duration: isMobile ? 0.4 : 0.6,
            ease: 'power2.out',
          },
          '-=0.4'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <SmoothScrolling>
      <div className="scroll-container bg-gray-100">
        {/* Header - Fixed */}
        <Header
          onLogoClick={onBack}
          onGetInTouch={() => window.location.href = '/contact'}
          onMenuClick={() => setMenuOpen(true)}
        />

        {/* Main Content */}
        <section
          ref={sectionRef}
          className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 lg:px-12 bg-gray-100"
        >
          {/* Hero Section */}
          <div ref={heroRef} className="max-w-7xl mx-auto mb-16">
            <AnimatedText
              className="text-5xl md:text-7xl font-['Gibson'] font-bold text-gray-900 tracking-tight mb-6"
              splitBy="chars"
              stagger={0.02}
              duration={0.5}
              y={30}
            >
              OUR SERVICES
            </AnimatedText>
            <p className="text-lg md:text-xl font-['Gibson'] text-gray-600 max-w-2xl leading-relaxed">
              Comprehensive creative solutions that elevate your brand across every touchpoint.
              From strategy to execution, we deliver excellence.
            </p>
          </div>

          {/* 2x2 Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {servicesData.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  {...service}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Infinite Scroll Text */}
          <div className="mt-16 overflow-hidden">
            <InfiniteText
              text="Explore Our Services"
              length={15}
              className="text-6xl md:text-8xl font-bold"
            />
          </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* Menu Overlay */}
        <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </SmoothScrolling>
  );
}
