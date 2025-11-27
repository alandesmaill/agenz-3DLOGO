'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface CaseStudy {
  clientName: string;
  clientLogo: string;
  industry: string;
  challenge: string;
  solution: string;
  results: Array<{
    metric: string;
    value: string;
    label: string;
  }>;
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
}

interface CaseStudyCarouselProps {
  caseStudies: CaseStudy[];
  accentColor: string;
}

export default function CaseStudyCarousel({
  caseStudies,
  accentColor,
}: CaseStudyCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const activeCase = caseStudies[activeIndex];

  // Auto-play carousel (8 seconds per slide)
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % caseStudies.length);
      }, 8000);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [caseStudies.length]);

  // Animate slide transitions
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const currentSlide = slideRefs.current[activeIndex];
    if (!currentSlide) return;

    // Reset all slides
    slideRefs.current.forEach((slide, index) => {
      if (slide && index !== activeIndex) {
        gsap.set(slide, { opacity: 0, x: 50 });
      }
    });

    // Animate current slide in
    timelineRef.current = gsap.timeline();
    timelineRef.current.fromTo(
      currentSlide,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
    );

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);

    // Reset auto-play timer
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % caseStudies.length);
      }, 8000);
    }
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % caseStudies.length);

    // Reset auto-play timer
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % caseStudies.length);
      }, 8000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Section heading */}
      <h2 className="text-3xl md:text-4xl font-['Gibson'] font-bold text-gray-900 mb-8 text-center">
        Case Studies
      </h2>

      {/* Carousel container */}
      <div className="relative">
        {/* Slides */}
        <div className="relative min-h-[600px] md:min-h-[500px]">
          {caseStudies.map((caseStudy, index) => (
            <div
              key={index}
              ref={(el) => (slideRefs.current[index] = el)}
              className="absolute inset-0 w-full"
              style={{
                opacity: index === activeIndex ? 1 : 0,
                pointerEvents: index === activeIndex ? 'auto' : 'none',
              }}
            >
              <div className="p-8 md:p-12 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl">
                {/* Client info */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                      border: `2px solid ${accentColor}40`,
                    }}
                  >
                    <img
                      src={caseStudy.clientLogo}
                      alt={caseStudy.clientName}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-['Gibson'] font-bold text-gray-900">
                      {caseStudy.clientName}
                    </h3>
                    <p className="text-sm font-['Gibson'] text-gray-600">
                      {caseStudy.industry}
                    </p>
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4
                      className="text-lg font-['Gibson'] font-bold mb-3"
                      style={{ color: accentColor }}
                    >
                      Challenge
                    </h4>
                    <p className="font-['Gibson'] text-gray-700 leading-relaxed">
                      {caseStudy.challenge}
                    </p>
                  </div>
                  <div>
                    <h4
                      className="text-lg font-['Gibson'] font-bold mb-3"
                      style={{ color: accentColor }}
                    >
                      Solution
                    </h4>
                    <p className="font-['Gibson'] text-gray-700 leading-relaxed">
                      {caseStudy.solution}
                    </p>
                  </div>
                </div>

                {/* Results grid */}
                <div className="mb-8">
                  <h4
                    className="text-lg font-['Gibson'] font-bold mb-4"
                    style={{ color: accentColor }}
                  >
                    Results
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {caseStudy.results.map((result, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-gradient-to-br from-white/50 to-white/30 border border-white/40"
                      >
                        <div
                          className="text-3xl font-['Gibson'] font-bold mb-1"
                          style={{ color: accentColor }}
                        >
                          {result.value}
                        </div>
                        <div className="text-sm font-['Gibson'] font-medium text-gray-600">
                          {result.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                <div className="border-l-4 pl-6" style={{ borderColor: accentColor }}>
                  <p className="text-lg font-['Gibson'] italic text-gray-700 mb-4 leading-relaxed">
                    "{caseStudy.testimonial.quote}"
                  </p>
                  <div>
                    <div className="font-['Gibson'] font-bold text-gray-900">
                      {caseStudy.testimonial.author}
                    </div>
                    <div className="text-sm font-['Gibson'] text-gray-600">
                      {caseStudy.testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {/* Previous button */}
          <button
            onClick={handlePrev}
            className="
              w-12 h-12
              rounded-full
              flex items-center justify-center
              bg-white/80 backdrop-blur-xl
              border border-white/30
              shadow-lg hover:shadow-2xl
              transition-all duration-300
              hover:scale-110
              group
            "
            aria-label="Previous case study"
          >
            <span
              className="text-2xl font-bold transition-transform group-hover:-translate-x-1"
              style={{ color: accentColor }}
            >
              ←
            </span>
          </button>

          {/* Dots indicator */}
          <div className="flex gap-2">
            {caseStudies.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  // Reset auto-play timer
                  if (autoPlayRef.current) {
                    clearInterval(autoPlayRef.current);
                    autoPlayRef.current = setInterval(() => {
                      setActiveIndex((prev) => (prev + 1) % caseStudies.length);
                    }, 8000);
                  }
                }}
                className="
                  w-3 h-3
                  rounded-full
                  transition-all duration-300
                "
                style={{
                  backgroundColor:
                    index === activeIndex ? accentColor : `${accentColor}30`,
                  transform: index === activeIndex ? 'scale(1.2)' : 'scale(1)',
                }}
                aria-label={`Go to case study ${index + 1}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="
              w-12 h-12
              rounded-full
              flex items-center justify-center
              bg-white/80 backdrop-blur-xl
              border border-white/30
              shadow-lg hover:shadow-2xl
              transition-all duration-300
              hover:scale-110
              group
            "
            aria-label="Next case study"
          >
            <span
              className="text-2xl font-bold transition-transform group-hover:translate-x-1"
              style={{ color: accentColor }}
            >
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
