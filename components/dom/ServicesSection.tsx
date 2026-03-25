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
import { servicesData, type Service } from '@/lib/services-data';
import { useResponsive } from '@/hooks/useResponsive';
import Link from 'next/link';
import { Camera, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onBack?: () => void;
}

function FeaturedCameraCard({
  service,
  divRef,
}: {
  service: Service;
  divRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={divRef}>
      <Link href={service.ctaLink} className="block group">
        <div
          className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/8 border border-cyan-400/25 p-8 md:p-10 lg:p-12 hover:scale-[1.01] transition-all duration-500 will-change-transform transform-gpu"
          style={{ boxShadow: '0 0 50px rgba(0,255,255,0.08)' }}
        >
          {/* Subtle glow behind */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Icon + Title */}
            <div className="flex items-center gap-5 flex-shrink-0">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,255,255,0.18), rgba(0,255,255,0.08))',
                  border: '2px solid rgba(0,255,255,0.35)',
                }}
              >
                <Camera size={36} color="#00ffff" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/55 mb-1">
                  Featured Package
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-['Gibson'] font-bold text-white tracking-tight">
                  {service.title}
                </h3>
              </div>
            </div>

            {/* Description + CTA */}
            <div className="flex-1 md:text-right">
              <p className="font-['Gibson'] text-white/60 text-base md:text-lg leading-relaxed mb-6 md:max-w-sm md:ml-auto">
                {service.description}
              </p>
              <div
                className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-white/10 border border-white/20 text-white font-['Gibson'] font-bold text-sm group-hover:bg-white/18 transition-all duration-300"
                style={{ boxShadow: '0 8px 30px rgba(0,255,255,0.15)' }}
              >
                <span>VIEW PACKAGE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Tag row */}
          <div className="relative flex flex-wrap gap-2.5 mt-8">
            {['Arri Alexa 35', 'Signature Primes', 'Full Kit', '19mm Studio'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-bold text-cyan-400 border border-cyan-400/25 bg-cyan-400/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
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
      <div
        className="scroll-container"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 20% 50%, rgba(0, 255, 255, 0.14) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 60% 85%, rgba(0, 255, 255, 0.10) 0%, transparent 55%),
            #0d0d0d
          `,
        }}
      >
        {/* Header - Fixed */}
        <Header
          variant="dark"
          onLogoClick={onBack}
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

          {/* Featured Camera Rental + 2x2 Grid */}
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
            {/* Featured card: Camera Rental */}
            {(() => {
              const featured = servicesData.find((s) => s.id === 'camera-rental');
              return featured ? (
                <FeaturedCameraCard
                  service={featured}
                  divRef={(el) => { cardsRef.current[0] = el; }}
                />
              ) : null;
            })()}

            {/* 2x2 grid: remaining services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {servicesData
                .filter((s) => s.id !== 'camera-rental')
                .map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    ref={(el) => {
                      cardsRef.current[index + 1] = el;
                    }}
                    {...service}
                    index={index + 1}
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
