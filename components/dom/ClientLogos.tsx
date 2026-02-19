'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedText from './AnimatedText';

gsap.registerPlugin(ScrollTrigger);

// Real client logos
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

      {/* Logo Grid - 2 columns on mobile, 3x3 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {clientLogos.map((client, index) => (
          <div
            key={client.id}
            ref={(el) => {
              logoRefs.current[index] = el;
            }}
            className="group relative aspect-square rounded-xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
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
