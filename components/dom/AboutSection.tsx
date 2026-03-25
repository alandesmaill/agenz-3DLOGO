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
import { ArrowRight } from 'lucide-react';

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

  // CTA refs
  const watermarkRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  // Mission refs
  const missionRef = useRef<HTMLElement>(null);
  const missionWatermarkRef = useRef<HTMLDivElement>(null);
  const missionTextRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const missionDividerRef = useRef<HTMLDivElement>(null);
  const missionBeliefRef = useRef<HTMLParagraphElement>(null);

  // Vision refs
  const visionRef = useRef<HTMLElement>(null);
  const visionLabelRef = useRef<HTMLDivElement>(null);
  const visionFirstParaRef = useRef<HTMLParagraphElement>(null);
  const visionUnderlineRef = useRef<HTMLSpanElement>(null);
  const visionDividerRef = useRef<HTMLDivElement>(null);
  const visionBeliefRef = useRef<HTMLParagraphElement>(null);
  const visionWatermarkRef = useRef<HTMLDivElement>(null);

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

    // Extra refresh to ensure vision section triggers are positioned correctly
    const lateRefreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1200);

    // Safety fallback: if vision content refs are still at opacity 0 after 2.5s,
    // force them visible in case ScrollTrigger positions were miscalculated
    const fallbackTimer = setTimeout(() => {
      const els = [
        visionLabelRef.current,
        visionFirstParaRef.current,
        visionBeliefRef.current,
        visionUnderlineRef.current,
        visionDividerRef.current,
      ];
      els.forEach((el) => {
        if (!el) return;
        const opacity = parseFloat(window.getComputedStyle(el).opacity);
        if (opacity < 0.5) {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
          if (el === visionUnderlineRef.current) {
            gsap.to(el, { width: '100%', duration: 0.8, ease: 'power2.out' });
          }
          if (el === visionDividerRef.current) {
            gsap.to(el, { width: 128, duration: 0.6, ease: 'power2.out' });
          }
        }
      });
    }, 2500);

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(updateTimer);
      clearTimeout(lateRefreshTimer);
      clearTimeout(fallbackTimer);
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

  // Mission: watermark parallax
  useEffect(() => {
    if (!missionWatermarkRef.current || !missionRef.current) return;

    const tween = gsap.to(missionWatermarkRef.current, {
      y: -60,
      scrollTrigger: {
        trigger: missionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  // Mission: underline sweep on "real business impact"
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

  // Mission: short center divider
  useEffect(() => {
    if (!missionDividerRef.current || !missionTextRef.current) return;

    const tween = gsap.to(missionDividerRef.current, {
      width: 128,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: missionTextRef.current,
        start: 'top 65%',
        once: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  // Mission: belief paragraph fade-up
  useEffect(() => {
    if (!missionBeliefRef.current || !missionTextRef.current) return;

    const tween = gsap.fromTo(
      missionBeliefRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: missionTextRef.current,
          start: 'top 60%',
          once: true,
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  // Vision: label fade-up
  useEffect(() => {
    if (!visionLabelRef.current || !visionRef.current) return;

    const tween = gsap.fromTo(
      visionLabelRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: visionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  // Vision: first paragraph fade-up
  useEffect(() => {
    if (!visionFirstParaRef.current || !visionRef.current) return;

    const tween = gsap.fromTo(
      visionFirstParaRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: visionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  // Vision: underline sweep on "lasting impressions."
  useEffect(() => {
    if (!visionUnderlineRef.current || !visionFirstParaRef.current) return;

    const tween = gsap.to(visionUnderlineRef.current, {
      width: '100%',
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: visionFirstParaRef.current,
        start: 'top 65%',
        toggleActions: 'play none none none',
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  // Vision: short center divider (w-32 = 128px)
  useEffect(() => {
    if (!visionDividerRef.current || !visionFirstParaRef.current) return;

    const tween = gsap.to(visionDividerRef.current, {
      width: 128,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: visionFirstParaRef.current,
        start: 'top 60%',
        toggleActions: 'play none none none',
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, []);

  // Vision: belief paragraph fade-up
  useEffect(() => {
    if (!visionBeliefRef.current || !visionFirstParaRef.current) return;

    const tween = gsap.fromTo(
      visionBeliefRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: visionFirstParaRef.current,
          start: 'top 55%',
          toggleActions: 'play none none none',
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, []);

  // Vision: watermark parallax
  useEffect(() => {
    if (!visionWatermarkRef.current || !visionRef.current) return;

    const tween = gsap.to(visionWatermarkRef.current, {
      y: -60,
      scrollTrigger: {
        trigger: visionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
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
          onMenuClick={() => setMenuOpen(true)}
        />

        {/* 1. Hero Section - Full-Width Cinematic */}
        <section className="relative h-screen w-full flex items-center overflow-hidden">
          {/* Subtle cyan glow — mirrors rest of page */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 30% 60%, rgba(0, 255, 255, 0.09) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />
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

        {/* 2. Mission Section - Centered */}
        <section
          ref={missionRef}
          className="relative min-h-screen w-full flex items-center justify-center py-24 overflow-hidden"
        >
          {/* "MISSION" watermark with parallax */}
          <div
            ref={missionWatermarkRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <span
              className="font-extrabold uppercase text-[#00e92c]"
              style={{ fontSize: 'clamp(8rem, 28vw, 34vw)', opacity: 0.025, letterSpacing: '0.05em' }}
            >
              MISSION
            </span>
          </div>

          <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 text-center">

            {/* Centered label: ━━ OUR MISSION */}
            <div className="flex flex-col items-center mb-12">
              <span className="block h-[2px] w-8 bg-gradient-to-r from-[#00e92c] to-[#00ffff] mb-4 rounded-full" />
              <p className="text-sm tracking-[0.3em] uppercase text-white/60">
                Our Mission
              </p>
            </div>

            {/* Text block — centered, max-w-4xl */}
            <div ref={missionTextRef} className="max-w-4xl mx-auto">

              {/* Main statement — bold, large */}
              <p
                className="text-white/90 font-bold leading-[1.1]"
                style={{ fontSize: 'clamp(1.9rem, 3.8vw, 4.2rem)' }}
              >
                To create purposeful creative work that delivers{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent font-semibold">
                    real business impact
                  </span>
                  <span
                    ref={underlineRef}
                    className="block h-[2px] bg-gradient-to-r from-[#00e92c] to-[#00ffff] rounded-full mt-1"
                    style={{ width: '0%' }}
                  />
                </span>
                {', '}blending innovative storytelling, strategic thinking, and precise execution to help brands grow, connect, and stand out in a constantly evolving world.
              </p>

              {/* Short centered divider */}
              <div
                ref={missionDividerRef}
                className="h-[1px] bg-white/10 my-8 mx-auto rounded-full"
                style={{ width: 0 }}
              />

              {/* Belief line — lighter, smaller */}
              <p
                ref={missionBeliefRef}
                className="text-white/60 font-light"
                style={{ fontSize: 'clamp(1rem, 1.8vw, 1.4rem)', opacity: 0 }}
              >
                {aboutContent.mission.belief}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Vision Section - Centered, Expansive */}
        <section
          ref={visionRef}
          className="relative min-h-screen w-full flex items-center justify-center py-32 overflow-hidden"
        >
          {/* Large "VISION" watermark with parallax */}
          <div
            ref={visionWatermarkRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <span
              className="font-extrabold uppercase text-[#00ffff]"
              style={{ fontSize: 'clamp(8rem, 28vw, 34vw)', opacity: 0.025, letterSpacing: '0.05em' }}
            >
              VISION
            </span>
          </div>

          {/* Cyan glow blob — top-right, desktop only */}
          <div
            className="absolute top-[10%] right-[5%] w-[40vw] h-[40vw] pointer-events-none hidden md:block"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0, 255, 255, 0.08) 0%, transparent 60%)',
            }}
            aria-hidden="true"
          />

          {/* Content — centered */}
          <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 text-center">

            {/* Centered label: ━━ OUR VISION */}
            <div
              ref={visionLabelRef}
              className="flex flex-col items-center mb-12"
              style={{ opacity: 0 }}
            >
              <span className="block h-[2px] w-8 bg-gradient-to-r from-[#00ffff] to-[#00e92c] mb-4 rounded-full" />
              <p className="text-sm tracking-[0.3em] uppercase text-white/60">
                Our Vision
              </p>
            </div>

            {/* First paragraph — large, light */}
            <p
              ref={visionFirstParaRef}
              className="text-white/90 font-bold leading-[1.1] max-w-4xl mx-auto"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 4rem)', opacity: 0 }}
            >
              To become a leading creative partner for ambitious brands, shaping culture through bold ideas, meaningful design, and experiences that leave{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#00ffff] to-[#00e92c] bg-clip-text text-transparent font-semibold">
                  lasting impressions.
                </span>
                <span
                  ref={visionUnderlineRef}
                  className="block h-[2px] bg-gradient-to-r from-[#00ffff] to-[#00e92c] rounded-full mt-1"
                  style={{ width: '0%' }}
                />
              </span>
            </p>

            {/* Short centered divider */}
            <div
              ref={visionDividerRef}
              className="h-[1px] bg-white/10 my-8 mx-auto rounded-full"
              style={{ width: 0 }}
            />

            {/* Belief paragraph — smaller, dimmer */}
            <p
              ref={visionBeliefRef}
              className="text-white/50 font-light max-w-2xl mx-auto"
              style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', opacity: 0 }}
            >
              {aboutContent.vision.belief}
            </p>
          </div>
        </section>

        {/* 4. CTA Section - Kinetic */}
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
              <ArrowRight className="ml-2 w-5 h-5 inline-block transition-transform duration-300 group-hover:translate-x-1" />
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
