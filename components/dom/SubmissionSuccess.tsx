'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SubmissionSuccessProps {
  onClose: () => void;
  onSendAnother?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  opacity: number;
}

const CONFETTI_COLORS = ['#00ffff', '#00e92c', '#00d4aa', '#00b8ff'];

export default function SubmissionSuccess({ onClose, onSendAnother }: SubmissionSuccessProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const checkmarkRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        }
      );
    }
  }, []);

  useEffect(() => {
    if (checkmarkRef.current) {
      const circle = checkmarkRef.current.querySelector('.checkmark-circle');
      const check = checkmarkRef.current.querySelector('.checkmark-check');

      if (circle && check) {
        gsap.fromTo(
          circle,
          { strokeDashoffset: 283 },
          {
            strokeDashoffset: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: 0.2,
          }
        );

        gsap.fromTo(
          check,
          { strokeDashoffset: 100 },
          {
            strokeDashoffset: 0,
            duration: 0.4,
            ease: 'power2.out',
            delay: 0.6,
          }
        );
      }
    }
  }, []);

  useEffect(() => {
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;

    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * 20, // Random horizontal velocity
      vy: -Math.random() * 10 - 5, // Upward velocity
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 8 + 4,
      opacity: 1,
    }));

    setParticles(newParticles);

    let animationFrame: number;
    const animate = () => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5, // Gravity
            vx: p.vx * 0.98, // Air resistance
            rotation: p.rotation + p.rotationSpeed,
            opacity: Math.max(0, p.opacity - 0.01), // Fade out
          }))
          .filter(p => p.opacity > 0 && p.y < (typeof window !== 'undefined' ? window.innerHeight : 1000))
      );

      animationFrame = requestAnimationFrame(animate);
    };

    const startTimer = setTimeout(() => {
      animate();
    }, 800);

    const stopTimer = setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      setIsAnimating(false);
    }, 2800);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleSendAnother = () => {
    if (onSendAnother) {
      onSendAnother();
    }
    onClose();
  };

  const handleBackHome = () => {
    window.location.href = '/';
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {isAnimating && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {particles.map(p => (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  opacity: p.opacity,
                  transform: `rotate(${p.rotation}deg)`,
                  borderRadius: p.id % 2 === 0 ? '50%' : '2px',
                  pointerEvents: 'none',
                }}
              />
            ))}
          </div>
        )}

        <div
          ref={containerRef}
          className="relative max-w-md w-full p-8 md:p-12 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl text-center z-50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 via-transparent to-cyan-500/30 blur-3xl -z-10 rounded-3xl" />

          <svg
            ref={checkmarkRef}
            className="w-24 h-24 mx-auto mb-6"
            viewBox="0 0 100 100"
          >
            <circle
              className="checkmark-circle"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#00e92c"
              strokeWidth="4"
              strokeDasharray="283"
              strokeDashoffset="283"
            />

            <path
              className="checkmark-check"
              d="M25,50 L40,65 L75,30"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="100"
              strokeDashoffset="100"
            />
          </svg>

          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            Thank You!
          </h2>

          <p className="text-lg text-gray-200 mb-8 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            We&apos;ve received your message and will get back to you within 24 hours.
            Check your email for a confirmation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
            <button
              onClick={handleSendAnother}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-green-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
            >
              Send Another Message
            </button>

            <button
              onClick={handleBackHome}
              className="flex-1 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>

          <div className="sr-only" aria-live="polite" aria-atomic="true">
            Message sent successfully! We&apos;ll get back to you within 24 hours.
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </>
  );
}
