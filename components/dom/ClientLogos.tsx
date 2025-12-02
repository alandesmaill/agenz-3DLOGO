'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from './AnimatedText';

gsap.registerPlugin(ScrollTrigger);

// Placeholder client data (user will replace with real logos)
const clientLogos = [
  { id: 1, name: 'Client 1', image: '/images/clients/client-1.svg' },
  { id: 2, name: 'Client 2', image: '/images/clients/client-2.svg' },
  { id: 3, name: 'Client 3', image: '/images/clients/client-3.svg' },
  { id: 4, name: 'Client 4', image: '/images/clients/client-4.svg' },
  { id: 5, name: 'Client 5', image: '/images/clients/client-5.svg' },
  { id: 6, name: 'Client 6', image: '/images/clients/client-6.svg' },
  { id: 7, name: 'Client 7', image: '/images/clients/client-7.svg' },
  { id: 8, name: 'Client 8', image: '/images/clients/client-8.svg' },
];

export default function ClientLogos() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || logoRefs.current.length === 0) return;

    // GSAP stagger animation when section enters viewport
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRefs.current.filter(Boolean),
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-6">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <AnimatedText
          className="text-3xl md:text-4xl lg:text-5xl font-['Gibson'] font-bold text-gray-900 tracking-tight"
          splitBy="chars"
          stagger={0.02}
          duration={0.5}
          y={20}
        >
          Trusted By
        </AnimatedText>
      </div>

      {/* Logo Grid - 2x2 on mobile, 2x4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {clientLogos.map((client, index) => (
          <div
            key={client.id}
            ref={(el) => {
              logoRefs.current[index] = el;
            }}
            className="group relative aspect-square rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Logo Image */}
            <div className="relative w-full h-full p-6 flex items-center justify-center">
              <Image
                src={client.image}
                alt={client.name}
                fill
                className="object-contain p-6 grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-green-500/0 group-hover:from-cyan-500/5 group-hover:to-green-500/5 transition-all duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
}
