'use client';

import { useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useResponsive } from '@/hooks/useResponsive';
import { getCategoryLabel, type PortfolioItem } from '@/lib/works-data';

interface WorksCardProps {
  item: PortfolioItem;
}

export default function WorksCard({ item }: WorksCardProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const panelContentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const { isMobile } = useResponsive();

  const killTweens = useCallback(() => {
    tweensRef.current.forEach(t => t.kill());
    tweensRef.current = [];
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    killTweens();

    const panel = panelRef.current;
    const content = panelContentRef.current;
    const arrow = arrowRef.current;
    const thumb = thumbRef.current;
    const card = cardRef.current;
    if (!panel || !content || !arrow || !thumb || !card) return;

    tweensRef.current.push(
      gsap.to(panel, { height: 'auto', duration: 0.2, ease: 'power2.out' }),
      gsap.to(content, { opacity: 1, duration: 0.15, delay: 0.05, ease: 'power2.out' }),
      gsap.to(arrow, { x: 4, duration: 0.2, ease: 'power2.out' }),
      gsap.to(thumb, { scale: 1.05, duration: 0.2, ease: 'power2.out' }),
      gsap.to(card, { boxShadow: '0 20px 50px rgba(0,0,0,0.1)', duration: 0.2, ease: 'power2.out' }),
    );
  }, [isMobile, killTweens]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    killTweens();

    const panel = panelRef.current;
    const content = panelContentRef.current;
    const arrow = arrowRef.current;
    const thumb = thumbRef.current;
    const card = cardRef.current;
    if (!panel || !content || !arrow || !thumb || !card) return;

    tweensRef.current.push(
      gsap.to(content, { opacity: 0, duration: 0.15, ease: 'power2.in' }),
      gsap.to(panel, { height: 0, duration: 0.2, delay: 0.05, ease: 'power2.in' }),
      gsap.to(arrow, { x: 0, duration: 0.2, ease: 'power2.in' }),
      gsap.to(thumb, { scale: 1, duration: 0.2, ease: 'power2.in' }),
      gsap.to(card, { boxShadow: '0 1px 3px rgba(0,0,0,0.05)', duration: 0.2, ease: 'power2.in' }),
    );
  }, [isMobile, killTweens]);

  const stats = item.hero.stats.slice(0, 3);
  const quoteSnippet = item.testimonial.quote.length > 100
    ? item.testimonial.quote.slice(0, 100) + '...'
    : item.testimonial.quote;
  const topDeliverables = item.overview.deliverables.slice(0, 3);

  return (
    <Link href={`/works/${item.id}`} className="block">
      <div
        ref={cardRef}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-colors duration-200"
        style={{ borderLeftColor: isMobile ? item.accentColor : undefined, borderLeftWidth: isMobile ? 4 : undefined }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main card content */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 px-5 sm:px-6 py-5">
          {/* Thumbnail */}
          <div ref={thumbRef} className="flex-shrink-0 rounded-xl overflow-hidden w-full sm:w-[160px] h-[180px] sm:h-[120px] relative">
            <Image
              src={item.thumbnail.image}
              alt={item.thumbnail.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 160px"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-xs font-['Gibson'] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${item.accentColor}15`, color: item.accentColor }}
              >
                {getCategoryLabel(item.category)}
              </span>
              <span className="text-xs font-['Gibson'] text-gray-400">{item.year}</span>
            </div>
            <h3 className="text-xl font-['Gibson'] font-bold text-gray-900 leading-tight">
              {item.projectTitle}
            </h3>
            <p className="text-lg font-['Gibson'] text-gray-500 mt-0.5">{item.clientName}</p>
            <p className="text-sm font-['Gibson'] text-gray-400 mt-1 line-clamp-1">{item.hero.tagline}</p>
          </div>

          {/* Arrow */}
          <div className="hidden sm:flex items-center flex-shrink-0">
            <svg
              ref={arrowRef}
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Hover-reveal panel (desktop: collapsed, mobile: always shown) */}
        <div
          ref={panelRef}
          className="overflow-hidden"
          style={{ height: isMobile ? 'auto' : 0 }}
        >
          <div
            ref={panelContentRef}
            className="bg-gray-50 py-4 px-5 sm:px-6 border-t border-gray-100"
            style={{ opacity: isMobile ? 1 : 0 }}
          >
            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-3">
              {stats.map((stat, i) => (
                <div key={i}>
                  <span className="text-lg font-['Gibson'] font-bold" style={{ color: item.accentColor }}>
                    {stat.value}
                  </span>
                  <span className="text-xs font-['Gibson'] text-gray-500 ml-1.5">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Quote snippet */}
            <p className="text-sm font-['Gibson'] text-gray-500 italic mb-3">
              &ldquo;{quoteSnippet}&rdquo;
            </p>

            {/* Deliverables pills */}
            <div className="flex flex-wrap gap-2">
              {topDeliverables.map((d, i) => (
                <span
                  key={i}
                  className="text-xs font-['Gibson'] px-2.5 py-1 rounded-full bg-gray-200 text-gray-600"
                >
                  {d.length > 40 ? d.slice(0, 40) + '...' : d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
