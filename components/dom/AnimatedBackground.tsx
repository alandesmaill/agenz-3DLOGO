'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function AnimatedBackground() {
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const orb4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate orbs with GSAP
    const orbs = [orb1Ref.current, orb2Ref.current, orb3Ref.current, orb4Ref.current];

    orbs.forEach((orb, index) => {
      if (!orb) return;

      // Random movement animation
      const duration = 8 + index * 2; // 8-14 seconds
      const xRange = 100 + index * 50; // Different movement ranges
      const yRange = 80 + index * 40;

      gsap.to(orb, {
        x: `+=${xRange}`,
        y: `+=${yRange}`,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.5, // Stagger start times
      });

      // Rotation animation
      gsap.to(orb, {
        rotation: 360,
        duration: duration * 1.5,
        repeat: -1,
        ease: 'none',
      });

      // Scale pulsing animation
      gsap.to(orb, {
        scale: 1.2 + index * 0.1,
        duration: duration * 0.7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.3,
      });
    });

    // Cleanup function
    return () => {
      gsap.killTweensOf(orbs);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Dark background base */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Gradient mesh orbs - reduced opacity */}
      <div className="absolute inset-0 opacity-40">
        {/* Orb 1 - Cyan gradient */}
        <div
          ref={orb1Ref}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-70"
          style={{
            background: 'radial-gradient(circle, #00ffff 0%, transparent 70%)',
          }}
        />

        {/* Orb 2 - Green gradient */}
        <div
          ref={orb2Ref}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-60"
          style={{
            background: 'radial-gradient(circle, #00e92c 0%, transparent 70%)',
          }}
        />

        {/* Orb 3 - Mixed gradient (cyan to green) */}
        <div
          ref={orb3Ref}
          className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] rounded-full blur-[110px] opacity-50"
          style={{
            background: 'radial-gradient(circle, #00ffff 0%, #00e92c 50%, transparent 70%)',
          }}
        />

        {/* Orb 4 - Green with cyan accent */}
        <div
          ref={orb4Ref}
          className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-[130px] opacity-40"
          style={{
            background: 'radial-gradient(circle, #00e92c 0%, #00ffff 40%, transparent 70%)',
          }}
        />
      </div>

      {/* Subtle noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, #0a0a0a 100%)',
        }}
      />

      {/* Animated grid pattern for depth */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="rgba(0, 255, 255, 0.3)"
                strokeWidth="0.5"
              />
            </pattern>
            <linearGradient id="gridFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridFade)" />
        </svg>
      </div>

      {/* Floating particles in background - reduced for performance */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.15 + Math.random() * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
