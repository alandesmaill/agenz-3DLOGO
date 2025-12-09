'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageGridProps {
  images: string[]; // Array of CSS gradient strings
  captions?: string[]; // Optional captions for each image
}

export default function ImageGrid({ images, captions }: ImageGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!gridRef.current || imageRefs.current.length === 0) return;

    const animations: gsap.core.Tween[] = [];

    // Morph animation for each image
    imageRefs.current.forEach((imageRef, index) => {
      if (!imageRef) return;

      const animation = gsap.fromTo(
        imageRef,
        {
          scale: 0.9,
          opacity: 0,
          borderRadius: '100px',
        },
        {
          scale: 1,
          opacity: 1,
          borderRadius: '24px',
          duration: 1.2,
          delay: index * 0.2, // Stagger delay
          ease: 'power3.out',
          scrollTrigger: {
            trigger: imageRef,
            start: 'top 80%',
            once: true,
          },
        }
      );

      animations.push(animation);
    });

    return () => {
      animations.forEach((anim) => anim.kill());
    };
  }, []);

  // Ensure we have at least 3 images (fill with first image if needed)
  const displayImages = [...images];
  while (displayImages.length < 3) {
    displayImages.push(images[0] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
  }

  return (
    <section ref={gridRef} className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Large Left Image - Spans 2 rows on desktop */}
          <div className="md:row-span-2">
            <div
              ref={(el) => {
                imageRefs.current[0] = el;
              }}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden will-change-transform shadow-2xl"
              style={{ background: displayImages[0] }}
            >
              {/* Placeholder overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/10 text-4xl md:text-6xl font-bold">01</div>
              </div>
            </div>
            {captions?.[0] && (
              <p className="text-gray-600 mt-4 text-sm md:text-base leading-relaxed">
                {captions[0]}
              </p>
            )}
          </div>

          {/* Top Right Image */}
          <div>
            <div
              ref={(el) => {
                imageRefs.current[1] = el;
              }}
              className="relative aspect-square rounded-3xl overflow-hidden will-change-transform shadow-2xl"
              style={{ background: displayImages[1] }}
            >
              {/* Placeholder overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/10 text-4xl md:text-5xl font-bold">02</div>
              </div>
            </div>
            {captions?.[1] && (
              <p className="text-gray-600 mt-4 text-sm md:text-base leading-relaxed">
                {captions[1]}
              </p>
            )}
          </div>

          {/* Bottom Right Image */}
          <div>
            <div
              ref={(el) => {
                imageRefs.current[2] = el;
              }}
              className="relative aspect-square rounded-3xl overflow-hidden will-change-transform shadow-2xl"
              style={{ background: displayImages[2] }}
            >
              {/* Placeholder overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/10 text-4xl md:text-5xl font-bold">03</div>
              </div>
            </div>
            {captions?.[2] && (
              <p className="text-gray-600 mt-4 text-sm md:text-base leading-relaxed">
                {captions[2]}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
