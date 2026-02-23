'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
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
  const roseRef = useRef<HTMLDivElement>(null);
  const roseFloatRef = useRef<gsap.core.Tween | null>(null);

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

  // Rose shape float animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !roseRef.current) return;

    // Scroll-triggered entrance: fade + slide from right
    gsap.fromTo(
      roseRef.current,
      { opacity: 0, x: 80 },
      {
        opacity: 1,
        x: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: roseRef.current,
          start: 'top 85%',
          once: true,
        },
      }
    );

    // Continuous float animation
    roseFloatRef.current = gsap.to(roseRef.current, {
      y: 12,
      rotation: 4,
      duration: 7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => {
      roseFloatRef.current?.kill();
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
      <div
        className="scroll-container"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0, 233, 44, 0.20) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 100% 0%, rgba(0, 255, 255, 0.18) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 10% 100%, rgba(0, 233, 44, 0.18) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 100% 100%, rgba(0, 255, 255, 0.16) 0%, transparent 50%),
            #050505
          `,
        }}
      >
        {/* Header - Fixed */}
        <Header
          variant="dark"
          onLogoClick={onBack}
          onGetInTouch={() => window.location.href = '/contact'}
          onMenuClick={() => setMenuOpen(true)}
        />

        {/* Main Content */}
        <section
          ref={sectionRef}
          className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6 lg:px-12"
        >
          {/* Hero Section */}
          <div ref={heroRef} className="relative overflow-visible max-w-7xl mx-auto mb-16">
            {/* Rose flower — top-right, partially bleeding off edge */}
            <div
              ref={roseRef}
              className="absolute pointer-events-none
                right-0 top-0
                w-[28vw] opacity-50 translate-x-[8%] -translate-y-[10%]
                md:w-[22vw] md:opacity-70
                lg:w-[18vw] lg:opacity-90"
            >
              <Image
                src="/images/about/shapes/rose flower.webp"
                alt=""
                width={500}
                height={500}
                className="w-full h-auto"
              />
            </div>

            <AnimatedText
              className="text-5xl md:text-7xl font-['Gibson'] font-bold text-white tracking-tight mb-6"
              splitBy="chars"
              stagger={0.02}
              duration={0.5}
              y={30}
            >
              OUR SERVICES
            </AnimatedText>
            <p className="text-lg md:text-xl font-['Gibson'] text-white/75 max-w-2xl leading-relaxed">
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
