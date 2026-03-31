'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import type { CameraPackage } from '@/lib/camera-rental-data';

interface CameraRentalPackageProps {
  packages: CameraPackage[];
}

export default function CameraRentalPackage({ packages }: CameraRentalPackageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [magnifier, setMagnifier] = useState({ visible: false, x: 0, y: 0 });

  const LENS_SIZE = 200;
  const ZOOM = 2.5;

  const handleTabChange = (index: number) => {
    if (index === selectedIndex) return;
    setContentVisible(false);
    setIsExpanded(false);
    setMagnifier({ visible: false, x: 0, y: 0 });
    setTimeout(() => {
      setSelectedIndex(index);
      setContentVisible(true);
    }, 200);
  };

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

  if (packages.length === 0) return null;

  const pkg = packages[Math.min(selectedIndex, packages.length - 1)];

  const containerW = imgContainerRef.current?.offsetWidth ?? 0;
  const containerH = imgContainerRef.current?.offsetHeight ?? 0;
  const lensLeft = Math.min(Math.max(magnifier.x - LENS_SIZE / 2, 0), containerW - LENS_SIZE);
  const lensTop = Math.min(Math.max(magnifier.y - LENS_SIZE / 2, 0), containerH - LENS_SIZE);
  const bgX = -(magnifier.x * ZOOM - LENS_SIZE / 2);
  const bgY = -(magnifier.y * ZOOM - LENS_SIZE / 2);

  return (
    <section id="packages" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-3">
            Package Overview
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Gibson'] font-bold text-white tracking-tight">
            THE PACKAGE
          </h2>
        </div>

        {packages.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-12">
            {packages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => handleTabChange(i)}
                className="px-5 py-2.5 rounded-full text-sm font-['Gibson'] font-bold transition-all duration-200"
                style={
                  i === selectedIndex
                    ? {
                        background: 'linear-gradient(to right, #00e92c, #00ffff)',
                        color: '#000',
                      }
                    : {
                        color: 'rgba(255,255,255,0.5)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                      }
                }
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        <div
          className="transition-opacity duration-200"
          style={{ opacity: contentVisible ? 1 : 0 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,255,255,0.18) 0%, transparent 70%)`,
                  filter: 'blur(24px)',
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 50% 50% at 60% 40%, rgba(0,233,44,0.08) 0%, transparent 70%)`,
                  filter: 'blur(16px)',
                }}
              />

              <div
                ref={imgContainerRef}
                className="relative w-full aspect-[4/3] cursor-crosshair select-none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {pkg.packageImage ? (
                  <Image
                    src={pkg.packageImage}
                    alt={pkg.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    style={{ objectPosition: 'center top' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-sm font-['Gibson']">
                    No image
                  </div>
                )}

                {magnifier.visible && pkg.packageImage && (
                  <div
                    className="absolute rounded-full pointer-events-none overflow-hidden"
                    style={{
                      width: LENS_SIZE,
                      height: LENS_SIZE,
                      left: lensLeft,
                      top: lensTop,
                      backgroundImage: `url(${pkg.packageImage})`,
                      backgroundSize: `${containerW * ZOOM}px ${containerH * ZOOM}px`,
                      backgroundPosition: `${bgX}px ${bgY}px`,
                      backgroundRepeat: 'no-repeat',
                      boxShadow: `0 0 0 1px rgba(0,255,255,0.3), 0 8px 32px rgba(0,0,0,0.6)`,
                    }}
                  />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-2xl md:text-3xl font-['Gibson'] font-bold mb-2">
                <span className="bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent">
                  {pkg.name}
                </span>
              </h3>
              {pkg.tagline && (
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-white/35 mb-6">
                  {pkg.tagline}
                </p>
              )}

              <p className="font-['Gibson'] text-white/65 text-base md:text-lg leading-relaxed mb-8">
                {pkg.description}
              </p>

              {pkg.highlights.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-10">
                  {pkg.highlights.map((h) => (
                    <span
                      key={h}
                      className="px-4 py-2 rounded-full text-sm font-['Gibson'] font-bold"
                      style={{
                        color: pkg.accentColor,
                        border: `1px solid ${pkg.accentColor}28`,
                        background: `${pkg.accentColor}08`,
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {pkg.productionSetIncludes.length > 0 && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.04] transition-colors duration-200"
                  >
                    <span className="font-['Gibson'] font-bold text-white text-sm uppercase tracking-[0.15em]">
                      Production Set Contents
                    </span>
                    <ChevronDown
                      className="w-5 h-5 text-white/40 transition-transform duration-300 flex-shrink-0"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{ maxHeight: isExpanded ? '600px' : '0px' }}
                  >
                    <ul className="px-5 pb-5 space-y-2.5 border-t border-white/10 pt-4">
                      {pkg.productionSetIncludes.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-['Gibson'] text-white/60">
                          <span
                            className="w-1 h-1 rounded-full flex-shrink-0"
                            style={{ background: pkg.accentColor }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
