'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import AnimatedText from '@/components/dom/AnimatedText';

interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  thumbnail?: string;
}

interface ProjectGalleryProps {
  galleryItems: GalleryItem[];
  accentColor: string;
}

export default function ProjectGallery({
  galleryItems,
  accentColor,
}: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Filter only images for lightbox
  const imageItems = galleryItems.filter(item => item.type === 'image');

  // Convert to lightbox format
  const lightboxSlides = imageItems.map(item => ({
    src: item.src,
    alt: item.alt || '',
  }));

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Section Title */}
      <AnimatedText
        className="text-3xl md:text-4xl font-['Gibson'] font-bold text-gray-900 mb-12 text-center"
        splitBy="words"
        stagger={0.03}
        duration={0.6}
        y={30}
      >
        Project Gallery
      </AnimatedText>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item, index) => (
          <div
            key={index}
            className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100"
            onClick={() => item.type === 'image' && handleImageClick(imageItems.indexOf(item))}
          >
            {item.type === 'image' ? (
              <>
                <Image
                  src={item.src}
                  alt={item.alt || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </>
            ) : (
              // Video Thumbnail (YouTube)
              <div className="relative w-full h-full">
                <Image
                  src={item.thumbnail || '/images/video-placeholder.jpg'}
                  alt={item.alt || `Video ${index + 1}`}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <svg
                      className="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
      />
    </div>
  );
}
