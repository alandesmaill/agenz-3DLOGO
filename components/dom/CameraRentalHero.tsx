'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

interface CameraRentalHeroProps {
  name: string;
  tagline: string;
  heroImage: string;
  highlights: string[];
  accentColor: string;
}

export default function CameraRentalHero({
  tagline,
  heroImage,
  highlights,
  accentColor,
}: CameraRentalHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [magnifier, setMagnifier] = useState({ visible: false, x: 0, y: 0 });

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        '.hero-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
        .fromTo(
          '.hero-heading',
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.3'
        )
        .fromTo(
          '.hero-tagline',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          '.hero-image-wrap',
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' },
          '-=0.7'
        )
        .fromTo(
          '.hero-stat',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
          '-=0.5'
        );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const LENS_SIZE = 200;
  const ZOOM = 2.5;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMagnifier({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMagnifier((m) => ({ ...m, visible: false }));
  }, []);

  const containerW = imgContainerRef.current?.offsetWidth ?? 0;
  const containerH = imgContainerRef.current?.offsetHeight ?? 0;
  const lensLeft = Math.min(Math.max(magnifier.x - LENS_SIZE / 2, 0), containerW - LENS_SIZE);
  const lensTop = Math.min(Math.max(magnifier.y - LENS_SIZE / 2, 0), containerH - LENS_SIZE);
  const bgX = -(magnifier.x * ZOOM - LENS_SIZE / 2);
  const bgY = -(magnifier.y * ZOOM - LENS_SIZE / 2);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 0% 50%, rgba(0,255,255,0.10) 0%, transparent 55%),
          radial-gradient(ellipse 60% 60% at 100% 20%, rgba(0,233,44,0.06) 0%, transparent 55%),
          radial-gradient(ellipse 50% 50% at 50% 100%, rgba(0,255,255,0.05) 0%, transparent 55%),
          #050505
        `,
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 pt-28 pb-20 md:pt-36 md:pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-8 items-center">
          {/* Left: Text */}
          <div>
            <div className="hero-label inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-bold uppercase tracking-[0.2em] mb-8">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: accentColor }}
              />
              Camera Rental
            </div>

            <h1 className="hero-heading text-6xl md:text-7xl lg:text-8xl font-['Gibson'] font-bold leading-none tracking-tight mb-6">
              <span className="bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent">
                CAMERA
              </span>
              <br />
              <span className="text-white">RENTAL</span>
            </h1>

            <p className="hero-tagline text-lg md:text-xl font-['Gibson'] text-white/65 leading-relaxed max-w-md mb-8">
              {tagline}
            </p>

            <div className="hero-cta flex flex-wrap gap-4">
              <a
                href="#equipment"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#00e92c] to-[#00ffff] text-black font-['Gibson'] font-bold text-sm hover:opacity-90 transition-opacity"
              >
                View Full Package
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-['Gibson'] font-bold text-sm hover:bg-white/10 transition-colors"
              >
                Inquire Now
              </a>
            </div>
          </div>

          {/* Right: Camera image with floating glow + zoom magnifier */}
          <div className="hero-image-wrap relative flex items-center justify-center lg:scale-[1.15] lg:origin-center">
            {/* Glow layers behind image */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,255,255,0.18) 0%, transparent 70%)`,
                filter: 'blur(24px)',
              }}
            />
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 50% 50% at 60% 40%, rgba(0,233,44,0.08) 0%, transparent 70%)`,
                filter: 'blur(16px)',
              }}
            />

            {/* Image container with zoom magnifier */}
            <div
              ref={imgContainerRef}
              className="relative w-full aspect-[4/3] cursor-crosshair select-none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={heroImage}
                alt="ARRI Alexa 35 Camera"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Magnifier lens */}
              {magnifier.visible && (
                <div
                  className="absolute rounded-full border-2 border-white/20 pointer-events-none overflow-hidden shadow-2xl"
                  style={{
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    left: lensLeft,
                    top: lensTop,
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: `${containerW * ZOOM}px ${containerH * ZOOM}px`,
                    backgroundPosition: `${bgX}px ${bgY}px`,
                    backgroundRepeat: 'no-repeat',
                    boxShadow: `0 0 0 1px rgba(0,255,255,0.3), 0 8px 32px rgba(0,0,0,0.6)`,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Highlight stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {highlights.map((highlight) => (
            <div
              key={highlight}
              className="hero-stat backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-center"
            >
              <span className="text-sm md:text-base font-['Gibson'] font-bold text-white/75">
                {highlight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
