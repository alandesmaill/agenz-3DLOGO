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

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  onBack?: () => void;
}

// Dark gradient background style applied to scroll-container — 6 layers covering full page
const darkGradientStyle: React.CSSProperties = {
  background: `
    radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0, 233, 44, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 100% 0%, rgba(0, 255, 255, 0.10) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 20% 50%, rgba(0, 233, 44, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 50%, rgba(0, 255, 255, 0.07) 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 10% 100%, rgba(0, 233, 44, 0.10) 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 100% 100%, rgba(0, 184, 255, 0.09) 0%, transparent 50%),
    #050505
  `,
};

export default function AboutSection({ onBack }: AboutSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flowerRef = useRef<HTMLDivElement>(null);
  const graphicsRef = useRef<HTMLDivElement>(null);
  const shapeAnimationsRef = useRef<gsap.core.Tween[]>([]);

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

  // Glass shape float animations + scroll-triggered entrances
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Flower shape - continuous float
    if (flowerRef.current) {
      // Scroll-triggered entrance: fade + slide from right
      gsap.fromTo(
        flowerRef.current,
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: flowerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Continuous float animation
      const flowerFloat = gsap.to(flowerRef.current, {
        y: -20,
        rotation: 3,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      shapeAnimationsRef.current.push(flowerFloat);
    }

    // Graphics shape - continuous float
    if (graphicsRef.current) {
      // Scroll-triggered entrance: fade + slide from left
      gsap.fromTo(
        graphicsRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: graphicsRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Continuous float animation
      const graphicsFloat = gsap.to(graphicsRef.current, {
        y: 15,
        rotation: -5,
        duration: 6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      shapeAnimationsRef.current.push(graphicsFloat);
    }

    return () => {
      shapeAnimationsRef.current.forEach((anim) => anim.kill());
      shapeAnimationsRef.current = [];
    };
  }, []);

  return (
    <SmoothScrolling>
      <div
        ref={rootRef}
        className="scroll-container about-dark-bg"
        style={darkGradientStyle}
      >
        {/* Header - Fixed, Dark Variant */}
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
            {/* WELCOME TO */}
            <h2
              className="text-white font-bold uppercase tracking-[0.15em]"
              style={{ fontSize: 'clamp(2rem, 7vw, 10vw)', lineHeight: 1.1 }}
            >
              {aboutContent.hero.welcomeText}
            </h2>

            {/* AGENZ */}
            <h1
              className="text-white font-extrabold uppercase leading-none tracking-[0.1em]"
              style={{ fontSize: 'clamp(3.5rem, 14vw, 16vw)' }}
            >
              {aboutContent.hero.brandName}
            </h1>

            {/* Tagline */}
            <AnimatedText
              className="text-white font-extrabold uppercase leading-tight mt-2 tracking-[0.05em]"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 5vw)' }}
              splitBy="words"
              stagger={0.04}
              duration={0.6}
              y={40}
              triggerStart="top 90%"
            >
              WE MASTER EVERYTHING
            </AnimatedText>
            <AnimatedText
              className="text-white font-extrabold uppercase leading-tight tracking-[0.05em]"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 5vw)' }}
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
          <div
            ref={flowerRef}
            className="absolute pointer-events-none
              right-0 top-[35%] -translate-y-1/2 w-[65vw] opacity-35 translate-x-[10%]
              md:top-1/2 md:w-[45vw] md:opacity-50 md:translate-x-[10%]
              lg:w-[40vw] lg:opacity-80 lg:translate-x-[5%]"
          >
            <Image
              src="/images/about/shapes/flower.png"
              alt=""
              width={800}
              height={800}
              className="w-full h-auto"
              priority
            />
          </div>
        </section>

        {/* 2. Mission Section - Split Layout */}
        <section className="relative min-h-screen w-full flex items-center py-24 md:py-0">
          {/* Section gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `
              radial-gradient(ellipse 50% 50% at 0% 50%, rgba(0, 233, 44, 0.06) 0%, transparent 60%),
              radial-gradient(ellipse 50% 50% at 100% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 60%)
            `,
          }} />
          {/* Content Grid */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Mission Text */}
            <div>
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
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
                  className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 text-center"
                >
                  <div
                    ref={(el) => {
                      statsRefs.current[index] = el;
                    }}
                    className="text-4xl md:text-5xl font-bold text-white mb-2"
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
              radial-gradient(ellipse 60% 50% at 10% 80%, rgba(0, 233, 44, 0.08) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 90% 80%, rgba(0, 184, 255, 0.07) 0%, transparent 55%)
            `,
          }} />
          {/* Graphics shape - left side */}
          <div
            ref={graphicsRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none
              w-[50vw] opacity-20 -translate-x-[20%]
              md:w-[40vw] md:opacity-40 md:-translate-x-[15%]
              lg:w-[35vw] lg:opacity-60 lg:-translate-x-[10%]"
          >
            <Image
              src="/images/about/shapes/graphics-shapes.png"
              alt=""
              width={700}
              height={700}
              className="w-full h-auto"
            />
          </div>

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
              className="inline-block px-12 py-5 text-xl font-bold text-black bg-gradient-to-r from-[#00e92c] to-[#00ffff] rounded-full hover:scale-105 transition-transform duration-300 shadow-2xl"
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
