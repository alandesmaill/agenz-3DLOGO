'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import MenuOverlay from './MenuOverlay';
import SmoothScrolling from './SmoothScrolling';
import AnimatedText from './AnimatedText';
import Footer from './Footer';
import Header from './Header';
import { aboutContent } from '@/lib/about-content';
import { aboutGradients } from '@/lib/about-gradients';

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  onBack?: () => void;
}

// Client logos data
const clientLogos = [
  { id: 1, name: 'Fibernet', image: '/images/clients/fibernet.svg' },
  { id: 2, name: 'iQ Labs', image: '/images/clients/iq-labs.svg' },
  { id: 3, name: 'iQ Online', image: '/images/clients/iq-online.svg' },
  { id: 4, name: 'KurdsatTowers', image: '/images/clients/kurdsat-towers.svg' },
  { id: 5, name: 'MJ Holding', image: '/images/clients/mj-holding.svg' },
  { id: 6, name: 'Optiq', image: '/images/clients/optiq.svg' },
  { id: 7, name: 'RoverCity', image: '/images/clients/rover-city.svg' },
  { id: 8, name: 'VQ', image: '/images/clients/vq.svg' },
  { id: 9, name: 'WhiteTowers', image: '/images/clients/white-towers.svg' },
];

export default function AboutSection({ onBack }: AboutSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Critical: Refresh ScrollTrigger when AboutSection mounts
  useEffect(() => {
    window.scrollTo(0, 0);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    const updateTimer = setTimeout(() => {
      ScrollTrigger.update();
    }, 800);

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(updateTimer);
    };
  }, []);

  // Stats count-up animation
  useEffect(() => {
    if (statsRefs.current.length === 0) return;

    const animations: gsap.core.Tween[] = [];

    statsRefs.current.forEach((statRef, index) => {
      if (!statRef) return;

      const stat = aboutContent.mission.stats[index];
      const numericValue = parseInt(stat.value.replace(/\D/g, ''), 10);
      const suffix = stat.value.replace(/\d/g, '');

      const obj = { value: 0 };

      const animation = gsap.to(obj, {
        value: numericValue,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statRef,
          start: 'top 80%',
          once: true,
        },
        onUpdate: () => {
          if (statRef) {
            statRef.textContent = Math.floor(obj.value) + suffix;
          }
        },
      });

      animations.push(animation);
    });

    return () => {
      animations.forEach((anim) => anim.kill());
    };
  }, []);

  return (
    <SmoothScrolling>
      <div ref={rootRef} className="scroll-container">
        {/* Header - Fixed */}
        <Header
          onLogoClick={onBack}
          onGetInTouch={() => (window.location.href = '/contact')}
          onMenuClick={() => setMenuOpen(true)}
        />

        {/* 1. Hero Section - Full Screen */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* CSS Gradient Background */}
          <div className="absolute inset-0" style={{ background: aboutGradients.hero }} />

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
            <AnimatedText
              className="text-white text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight"
              splitBy="words"
              stagger={0.05}
              duration={0.8}
              y={50}
            >
              {aboutContent.hero.headline}
            </AnimatedText>

            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              {aboutContent.hero.subheading}
            </p>
          </div>
        </section>

        {/* 2. Mission Section - Full Screen Split Layout */}
        <section className="relative min-h-screen w-full flex items-center py-24 md:py-0">
          {/* CSS Gradient Background */}
          <div className="absolute inset-0" style={{ background: aboutGradients.mission }} />

          {/* Content Grid */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Mission Text */}
            <div>
              <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-12 border border-white/20">
                <h2 className="text-white text-xl font-bold mb-4 uppercase tracking-wider">
                  Our Mission
                </h2>
                <AnimatedText
                  className="text-white text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed"
                  splitBy="words"
                  stagger={0.03}
                  duration={0.8}
                  y={30}
                  triggerStart="top 75%"
                >
                  {aboutContent.mission.statement}
                </AnimatedText>
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {aboutContent.mission.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 text-center"
                >
                  <div
                    ref={(el) => {
                      statsRefs.current[index] = el;
                    }}
                    className="text-4xl md:text-5xl font-bold text-white mb-2"
                  >
                    0+
                  </div>
                  <div className="text-white/80 text-xs md:text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Team Section - Simple Placeholder */}
        <section className="relative py-24 md:py-32 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <AnimatedText
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
              splitBy="words"
              stagger={0.05}
              duration={0.8}
              y={40}
              triggerStart="top 80%"
            >
              {aboutContent.team.headline}
            </AnimatedText>
            <p className="text-gray-600 text-lg mt-6">{aboutContent.team.subheading}</p>
          </div>
        </section>

        {/* 4. Clients Marquee Section */}
        <section className="relative py-24 md:py-32 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-center text-4xl md:text-5xl font-bold mb-16 text-gray-900">
              Trusted By
            </h2>

            {/* Scrolling Marquee Container */}
            <div className="relative overflow-hidden">
              <div className="flex gap-8 md:gap-12 animate-marquee hover:[animation-play-state:paused]">
                {/* Render logos twice for seamless loop */}
                {[...clientLogos, ...clientLogos].map((logo, idx) => (
                  <div
                    key={`${logo.id}-${idx}`}
                    className="flex-shrink-0 w-24 md:w-32 h-16 md:h-24 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
                  >
                    <Image
                      src={logo.image}
                      alt={logo.name}
                      width={128}
                      height={96}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-marquee {
              animation: marquee 30s linear infinite;
            }
          `}</style>
        </section>

        {/* 5. CTA Section - Full Screen Finale */}
        <section className="relative h-screen flex items-center justify-center">
          {/* CSS Gradient Background */}
          <div className="absolute inset-0" style={{ background: aboutGradients.cta }} />

          {/* Content */}
          <div className="relative z-10 text-center px-6">
            <AnimatedText
              className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-8"
              splitBy="words"
              stagger={0.05}
              duration={0.8}
              y={50}
              triggerStart="top 80%"
            >
              {aboutContent.cta.headline}
            </AnimatedText>

            <Link
              href="/contact"
              className="inline-block px-12 py-5 text-xl font-bold text-black bg-white rounded-full hover:scale-105 transition-transform duration-300 shadow-2xl"
            >
              {aboutContent.cta.buttonText}
            </Link>
          </div>
        </section>

        {/* Menu Overlay */}
        <MenuOverlay
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScrolling>
  );
}
