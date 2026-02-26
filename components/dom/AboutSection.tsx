'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import MenuOverlay from './MenuOverlay';
import SmoothScrolling from './SmoothScrolling';
import Footer from './Footer';
import Header from './Header';
import { aboutContent } from '@/lib/about-content';

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  onBack?: () => void;
}

// Dark gradient background style applied to scroll-container — green atmospheric on #0d0d0d
const darkGradientStyle: React.CSSProperties = {
  background: `
    radial-gradient(ellipse 70% 60% at 20% 50%, rgba(0, 255, 255, 0.14) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 60% 85%, rgba(0, 255, 255, 0.10) 0%, transparent 55%),
    #0d0d0d
  `,
};

// Inline SVG grain texture as data URI
const grainStyle: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  opacity: 0.03,
  mixBlendMode: 'overlay' as const,
};

function HoverWords({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const words = text.split(' ');

  return (
    <h1 className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          className="group/word inline-block overflow-hidden relative mr-[0.22em] mb-[0.05em] cursor-default"
          style={{ verticalAlign: 'bottom' }}
        >
          {/* Visible word — exits upward on hover */}
          <span className="block transition-transform duration-300 ease-out group-hover/word:-translate-y-full">
            {word}
          </span>
          {/* Clone — enters from below on hover, uses brand gradient */}
          <span
            className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-out group-hover/word:translate-y-0 bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent"
          >
            {word}
          </span>
        </span>
      ))}
    </h1>
  );
}

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
            {/* SVG Logo */}
            <div className="mb-8 md:mb-10">
              <Image
                src="/agenz creative hub.svg"
                alt="Agenz Creative Hub"
                width={360}
                height={105}
                priority
                className="w-[220px] md:w-[300px] lg:w-[380px]"
              />
            </div>

            {/* Hover-animated tagline */}
            <HoverWords
              text={aboutContent.hero.headline}
              className="text-white/90 font-extrabold uppercase leading-[0.92] tracking-[-0.01em]"
              style={{ fontSize: 'clamp(3.2rem, 6.5vw, 8.5rem)' }}
            />
          </div>
        </section>

        {/* 2. Mission Section - Big Statement */}
        <section className="relative min-h-screen w-full flex items-center py-24">
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
        >
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
