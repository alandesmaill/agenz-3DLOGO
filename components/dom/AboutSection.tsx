'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import MenuOverlay from './MenuOverlay';
import SmoothScrolling from './SmoothScrolling';
import AnimatedText from './AnimatedText';
import Footer from './Footer';
import Header from './Header';
import { aboutContent } from '@/lib/about-content';

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  onBack?: () => void;
}

// Dark gradient background style applied to scroll-container — 4 layers on #050505
const darkGradientStyle: React.CSSProperties = {
  background: `
    radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0, 233, 44, 0.20) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 100% 0%, rgba(0, 255, 255, 0.18) 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 10% 100%, rgba(0, 233, 44, 0.18) 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 100% 100%, rgba(0, 255, 255, 0.16) 0%, transparent 50%),
    #050505
  `,
};

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
      <div
        ref={rootRef}
        className="scroll-container"
        style={darkGradientStyle}
      >
        {/* Header - Fixed, Light Variant */}
        <Header
          variant="dark"
          onLogoClick={onBack}
          onGetInTouch={() => (window.location.href = '/contact')}
          onMenuClick={() => setMenuOpen(true)}
        />

        {/* 1. Hero Section - Full Screen */}
        <section className="relative h-screen w-full flex items-center md:items-end overflow-hidden md:pb-24">
          {/* Left-aligned text block */}
          <div className="relative z-10 w-full px-6 md:px-8 lg:px-12 mt-16 md:mt-0">
            {/* Accent rule */}
            <div
              className="hero-accent-rule h-0.5 w-16 mb-4 rounded-full bg-gradient-to-r from-[#00e92c] to-[#00ffff]"
            />

            {/* WELCOME TO */}
            <h2
              className="text-white font-bold uppercase tracking-[0.2em]"
              style={{ fontSize: 'clamp(1.4rem, 5vw, 7vw)', lineHeight: 1.1 }}
            >
              {aboutContent.hero.welcomeText}
            </h2>

            {/* AGENZ — gradient fill */}
            <h1
              className="font-extrabold uppercase leading-none tracking-[0.1em] bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent"
              style={{ fontSize: 'clamp(3.5rem, 14vw, 16vw)' }}
            >
              {aboutContent.hero.brandName}
            </h1>

            {/* Tagline — lighter weight, softer colour for hierarchy contrast */}
            <AnimatedText
              className="text-white/60 font-semibold uppercase leading-tight mt-2 tracking-[0.05em]"
              style={{ fontSize: 'clamp(1.2rem, 3.5vw, 4.5vw)' }}
              splitBy="words"
              stagger={0.04}
              duration={0.6}
              y={40}
              triggerStart="top 90%"
            >
              WE MASTER EVERYTHING
            </AnimatedText>
            <AnimatedText
              className="text-white/60 font-semibold uppercase leading-tight tracking-[0.05em]"
              style={{ fontSize: 'clamp(1.2rem, 3.5vw, 4.5vw)' }}
              splitBy="words"
              stagger={0.04}
              duration={0.6}
              y={40}
              triggerStart="top 90%"
            >
              FROM A TO Z!
            </AnimatedText>
          </div>

          {/* Flower shape - right side */}
        </section>

        {/* 2. Mission Section - Split Layout */}
        <section className="relative min-h-screen w-full flex items-center py-24 md:py-0">
          {/* Section gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `
              radial-gradient(ellipse 50% 50% at 0% 50%, rgba(0, 233, 44, 0.14) 0%, transparent 60%),
              radial-gradient(ellipse 50% 50% at 100% 50%, rgba(0, 255, 255, 0.12) 0%, transparent 60%)
            `,
          }} />
          {/* Content Grid */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Mission Text */}
            <div>
              <div className="mission-card bg-white/8 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-l-4 border-l-[#00e92c] border border-white/14 shadow-lg">
                <h2 className="text-xl font-bold mb-4 uppercase tracking-wider bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent">
                  Our Mission
                </h2>
                <AnimatedText
                  className="text-white/75 text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed"
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
                  className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 border border-white/14 shadow-md text-center"
                >
                  <div
                    ref={(el) => {
                      statsRefs.current[index] = el;
                    }}
                    className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent"
                  >
                    0+
                  </div>
                  <div className="text-white/60 text-xs md:text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. CTA Section - Full Screen Finale */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Section gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `
              radial-gradient(ellipse 60% 50% at 10% 80%, rgba(0, 233, 44, 0.18) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 90% 80%, rgba(0, 184, 255, 0.16) 0%, transparent 55%)
            `,
          }} />
          {/* Content */}
          <div className="relative z-10 text-center px-6">
            {/* Watermark AGENZ behind headline */}
            <div
              className="cta-watermark absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              aria-hidden="true"
            >
              <span
                className="font-extrabold uppercase text-white"
                style={{ fontSize: 'clamp(6rem, 22vw, 28vw)', opacity: 0.04, letterSpacing: '0.05em' }}
              >
                AGENZ
              </span>
            </div>

            <AnimatedText
              className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent"
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
              className="inline-block px-12 py-5 text-xl font-bold text-black bg-gradient-to-r from-[#00e92c] to-[#00ffff] rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(0,233,44,0.3)] hover:shadow-[0_0_60px_rgba(0,233,44,0.5)]"
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
