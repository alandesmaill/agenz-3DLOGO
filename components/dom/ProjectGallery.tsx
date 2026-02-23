'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  thumbnail?: string;
}

interface ProjectGalleryProps {
  items: GalleryItem[];
  accentColor: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function isYouTubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

export default function ProjectGallery({ items, accentColor }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === modalRef.current) {
      close();
    }
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight' && activeIndex !== null) navigate(1);
      if (e.key === 'ArrowLeft' && activeIndex !== null) navigate(-1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function close() {
    setActiveIndex(null);
    if (videoRef.current) videoRef.current.pause();
  }

  function navigate(dir: 1 | -1) {
    if (activeIndex === null) return;
    const next = (activeIndex + dir + items.length) % items.length;
    setActiveIndex(next);
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="relative py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-8">
          <span
            className="block w-10 h-1 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <h2 className="text-2xl md:text-3xl font-['Gibson'] font-bold text-white">
            Project Gallery
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="group relative aspect-video rounded-2xl overflow-hidden bg-white/8 focus:outline-none focus-visible:ring-2"
              style={{ '--accent': accentColor } as React.CSSProperties}
            >
              {/* Thumbnail */}
              <Image
                src={item.type === 'video' && item.thumbnail ? item.thumbnail : item.src}
                alt={item.alt ?? `Gallery item ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

              {/* Video play badge */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: accentColor }}
                  >
                    <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Image zoom icon on hover */}
              {item.type === 'image' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox / Video Modal */}
      {activeItem && (
        <div
          ref={modalRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          {items.length > 1 && (
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Content */}
          <div className="relative w-full max-w-4xl max-h-[80vh] flex items-center justify-center">
            {activeItem.type === 'image' ? (
              <div className="relative w-full max-h-[80vh]">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt ?? ''}
                  width={1200}
                  height={800}
                  className="object-contain rounded-xl max-h-[80vh] w-auto mx-auto"
                  priority
                />
              </div>
            ) : isYouTubeUrl(activeItem.src) ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeItem.src)}?autoplay=1`}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  title={activeItem.alt ?? 'Video'}
                />
              </div>
            ) : (
              <video
                ref={videoRef}
                src={activeItem.src}
                controls
                autoPlay
                className="w-full max-h-[80vh] rounded-xl"
              />
            )}
          </div>

          {/* Next */}
          {items.length > 1 && (
            <button
              onClick={() => navigate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-['Gibson']">
            {(activeIndex ?? 0) + 1} / {items.length}
          </div>
        </div>
      )}
    </section>
  );
}
