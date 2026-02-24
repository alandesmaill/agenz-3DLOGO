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

// Inline SVG grain texture as data URI
const grainStyle: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  opacity: 0.03,
  mixBlendMode: 'overlay' as const,
};

export default function AboutSection({ onBack }: AboutSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const missionTextRef = useRef<HTMLDivElement>(null);

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

  // CTA watermark parallax
  useEffect(() => {
    if (!watermarkRef.current || !ctaRef.current) return;

    const tween = gsap.to(watermarkRef.current, {
      y: -60,
      scrollTrigger: {
        trigger: ctaRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  // Mission underline scroll-in animation
  useEffect(() => {
    if (!underlineRef.current || !missionTextRef.current) return;

    const tween = gsap.to(underlineRef.current, {
      width: '100%',
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: missionTextRef.current,
        start: 'top 75%',
        once: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <SmoothScrolling>
      <div
        ref={rootRef}
        className="scroll-container"
        style={darkGradientStyle}
      >
        {/* Header - Fixed, Dark Variant */}
        <Header
          variant="dark"
          onLogoClick={onBack}
          onGetInTouch={() => (window.location.href = '/contact')}
          onMenuClick={() => setMenuOpen(true)}
        />

        {/* 1. Hero Section - Full-Width Cinematic */}
        <section className="relative h-screen w-full flex items-center overflow-hidden">
          {/* Grain texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={grainStyle}
            aria-hidden="true"
          />

          {/* Full-width text block */}
          <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 mt-16 md:mt-0">
            {/* Eyebrow label */}
            <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
              {aboutContent.hero.welcomeText}
            </p>

            {/* AGENZ — full-width display */}
            <h1
              className="font-extrabold uppercase leading-none tracking-[0.06em] bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent"
              style={{ fontSize: 'clamp(5rem, 18vw, 22rem)' }}
            >
              {aboutContent.hero.brandName}
            </h1>

            {/* Tagline */}
            <AnimatedText
              className="text-white/60 font-semibold uppercase leading-tight mt-4 tracking-[0.05em]"
              style={{ fontSize: 'clamp(1rem, 2.8vw, 3.5vw)' }}
              splitBy="words"
              stagger={0.04}
              duration={0.6}
              y={40}
              triggerStart="top 90%"
            >
              WE MASTER EVERYTHING FROM A TO Z!
            </AnimatedText>
          </div>
        </section>

        {/* 2. Mission Section - Big Statement */}
        <section className="relative min-h-screen w-full flex items-center py-24">
          {/* Section gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `
              radial-gradient(ellipse 50% 50% at 0% 50%, rgba(0, 233, 44, 0.14) 0%, transparent 60%),
              radial-gradient(ellipse 50% 50% at 100% 50%, rgba(0, 255, 255, 0.12) 0%, transparent 60%)
            `,
          }} />

          <div className="relative z-10 w-full px-6 md:px-12 lg:px-16">
            {/* Section label */}
            <div className="flex flex-col items-center mb-12">
              <span className="block h-[2px] w-10 bg-gradient-to-r from-[#00e92c] to-[#00ffff] mb-4 rounded-full" />
              <p className="text-sm tracking-[0.3em] uppercase text-white/60">
                Our Mission
              </p>
            </div>

            {/* Mission statement */}
            <div ref={missionTextRef} className="max-w-5xl mx-auto text-center">
              <p
                className="text-white/85 font-light leading-relaxed"
                style={{ fontSize: 'clamp(1.8rem, 4.5vw, 5rem)' }}
              >
                To create{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent font-semibold">
                    purposeful creative work
                  </span>
                  <span
                    ref={underlineRef}
                    className="block h-[2px] bg-gradient-to-r from-[#00e92c] to-[#00ffff] rounded-full mt-1"
                    style={{ width: '0%' }}
                  />
                </span>{' '}
                that drives real business results through innovative storytelling and strategic execution.
              </p>
            </div>
          </div>
        </section>

        {/* 3. CTA Section - Kinetic */}
        <section
          ref={ctaRef}
          className="relative h-screen flex items-center justify-center overflow-hidden"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,233,44,0.08) 0%, transparent 70%)`,
          }}
        >
          {/* Existing CTA gradient overlays */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `
              radial-gradient(ellipse 60% 50% at 10% 80%, rgba(0, 233, 44, 0.18) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 90% 80%, rgba(0, 184, 255, 0.16) 0%, transparent 55%)
            `,
          }} />

          {/* Content */}
          <div className="relative z-10 text-center px-6">
            {/* Parallax watermark */}
            <div
              ref={watermarkRef}
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              aria-hidden="true"
            >
              <span
                className="font-extrabold uppercase text-white"
                style={{ fontSize: 'clamp(6rem, 22vw, 28vw)', opacity: 0.04, letterSpacing: '0.05em' }}
              >
                AGENZ
              </span>
            </div>

            {/* Headline with "Amazing" highlighted */}
            <h2
              className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
            >
              {`Let's Create Something `}
              <span className="bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent">
                Amazing
              </span>
            </h2>

            {/* Kinetic button */}
            <Link
              href="/contact"
              className="group inline-block px-12 py-5 text-xl font-bold text-black bg-gradient-to-r from-[#00e92c] to-[#00ffff] rounded-full hover:scale-105 transition-transform duration-300 animate-pulse-glow"
            >
              {aboutContent.cta.buttonText}
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
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
