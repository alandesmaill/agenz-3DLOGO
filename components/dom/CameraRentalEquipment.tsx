'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Eye, X } from 'lucide-react';
import type { EquipmentCategory, EquipmentItem } from '@/lib/camera-rental-data';

interface CameraRentalEquipmentProps {
  categories: EquipmentCategory[];
  accentColor: string;
}

interface ItemModalProps {
  item: EquipmentItem;
  accentColor: string;
  onClose: () => void;
}

const LENS_SIZE = 160;
const ZOOM = 1.8;

function ItemModal({ item, accentColor, onClose }: ItemModalProps) {
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [magnifier, setMagnifier] = useState({ visible: false, x: 0, y: 0 });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMagnifier({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMagnifier((m) => ({ ...m, visible: false }));
  }, []);

  const containerW = imgContainerRef.current?.offsetWidth ?? 0;
  const containerH = imgContainerRef.current?.offsetHeight ?? 0;
  const lensLeft = Math.min(Math.max(magnifier.x - LENS_SIZE / 2, 0), containerW - LENS_SIZE);
  const lensTop  = Math.min(Math.max(magnifier.y - LENS_SIZE / 2, 0), containerH - LENS_SIZE);
  const bgX = -(magnifier.x * ZOOM - LENS_SIZE / 2);
  const bgY = -(magnifier.y * ZOOM - LENS_SIZE / 2);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop — pointer-events-none so it never blocks children */}
      <div className="absolute inset-0 backdrop-blur-md pointer-events-none" style={{ background: 'rgba(0,0,0,0.80)' }} />

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Card */}
      <div
        className="relative w-full max-w-md md:max-w-5xl rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(8,8,8,0.96)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 0 60px rgba(0,255,255,0.08), 0 24px 64px rgba(0,0,0,0.7)',
          animation: 'modalIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-white/15"
          style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)' }}
          aria-label="Close"
        >
          <X size={15} className="text-white/70" />
        </button>

        {/* Image — full width, tall */}
        {item.image ? (
          <div
            ref={imgContainerRef}
            className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden cursor-crosshair select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: `radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,255,255,0.13) 0%, transparent 65%)`,
                filter: 'blur(24px)',
              }}
            />
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-contain relative z-10"
              sizes="(max-width: 768px) 100vw, 1024px"
            />
            {/* Magnifier lens — desktop only */}
            {magnifier.visible && (
              <div
                className="absolute rounded-full pointer-events-none overflow-hidden z-20 hidden md:block"
                style={{
                  width: LENS_SIZE,
                  height: LENS_SIZE,
                  left: lensLeft,
                  top: lensTop,
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: `${containerW * ZOOM}px ${containerH * ZOOM}px`,
                  backgroundPosition: `${bgX}px ${bgY}px`,
                  backgroundRepeat: 'no-repeat',
                  boxShadow: `0 0 0 1.5px rgba(0,255,255,0.35), 0 8px 32px rgba(0,0,0,0.6)`,
                }}
              />
            )}
          </div>
        ) : (
          <div
            className="w-full aspect-[4/3] md:aspect-[16/9] flex flex-col items-center justify-center gap-3"
            style={{ background: `linear-gradient(135deg, ${accentColor}08, rgba(0,233,44,0.03))` }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}22` }}
            >
              <Eye size={24} style={{ color: `${accentColor}60` }} />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: `${accentColor}40` }}>
              Image Coming Soon
            </p>
          </div>
        )}

        {/* Details bar — full width strip at bottom */}
        <div
          className="flex items-center justify-between gap-4 px-6 py-5 md:px-8 md:py-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Left: name + notes */}
          <div className="min-w-0">
            <h3 className="font-['Gibson'] font-bold text-white text-base md:text-xl leading-snug truncate">
              {item.name}
            </h3>
            {item.notes && (
              <p className="text-xs text-white/35 font-['Gibson'] mt-0.5 truncate">{item.notes}</p>
            )}
          </div>

          {/* Right: brand + qty */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap"
              style={{ color: accentColor, background: `${accentColor}12`, border: `1px solid ${accentColor}25` }}
            >
              {item.brand}
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap bg-white/5 border border-white/10 text-white/45">
              ×{item.qty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CameraRentalEquipment({
  categories,
  accentColor,
}: CameraRentalEquipmentProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? '');
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [contentVisible, setContentVisible] = useState(true);

  const currentCategory = categories.find((c) => c.id === activeCategory) ?? categories[0];

  const handleTabChange = useCallback(
    (id: string) => {
      if (id === activeCategory) return;
      // Fade out → switch → fade in
      setContentVisible(false);
      setTimeout(() => {
        setActiveCategory(id);
        setContentVisible(true);
      }, 120);
    },
    [activeCategory]
  );

  return (
    <section id="equipment" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="mb-10 md:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-3">
            Full Inventory
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Gibson'] font-bold text-white tracking-tight">
            WHAT&apos;S INCLUDED
          </h2>
        </div>

        {/* Tab bar — horizontal scroll on all screen sizes */}
        <div className="-mx-4 px-4 mb-6">
          <div className="overflow-x-auto pb-3 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleTabChange(category.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-['Gibson'] font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                    style={{
                      background: isActive ? `${accentColor}12` : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isActive ? `${accentColor}30` : 'rgba(255,255,255,0.08)'}`,
                      color: isActive ? 'white' : 'rgba(255,255,255,0.40)',
                      boxShadow: isActive ? `0 0 12px ${accentColor}14` : 'none',
                    }}
                  >
                    <Icon size={13} style={{ color: isActive ? accentColor : 'rgba(255,255,255,0.30)' }} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category content panel */}
        <div
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-opacity duration-150"
          style={{ opacity: contentVisible ? 1 : 0 }}
        >
          {currentCategory && (
            <>
              {/* Category header */}
              <div
                className="flex items-center gap-4 px-6 md:px-8 py-5 border-b border-white/[0.06]"
                style={{
                  background: `linear-gradient(to right, ${accentColor}07, transparent)`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${accentColor}12`,
                    border: `1px solid ${accentColor}22`,
                  }}
                >
                  <currentCategory.icon size={17} style={{ color: accentColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-['Gibson'] font-bold text-white text-lg md:text-xl">
                    {currentCategory.name}
                  </h3>
                  {currentCategory.description && (
                    <p className="text-xs text-white/40 mt-0.5 truncate">
                      {currentCategory.description}
                    </p>
                  )}
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                  style={{
                    color: accentColor,
                    background: `${accentColor}0e`,
                    border: `1px solid ${accentColor}20`,
                  }}
                >
                  {currentCategory.items.length}{' '}
                  {currentCategory.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[56px_1fr_auto_auto_auto] gap-4 px-6 md:px-8 py-2.5 border-b border-white/[0.04]">
                <span />
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/25">
                  Item
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/25 text-right">
                  Brand
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/25 text-right w-10">
                  Qty
                </span>
                <span className="w-14" />
              </div>

              {/* Items */}
              <div>
                {currentCategory.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="grid grid-cols-[56px_1fr_auto_auto_auto] gap-4 px-6 md:px-8 py-3 items-center"
                    style={{
                      background:
                        itemIndex % 2 === 1 ? 'rgba(255,255,255,0.018)' : 'transparent',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0"
                      style={{
                        background: item.image
                          ? `${accentColor}08`
                          : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${item.image ? `${accentColor}15` : 'rgba(255,255,255,0.06)'}`,
                      }}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Eye size={12} className="text-white/15" />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-['Gibson'] text-white/82 text-sm">
                        {item.name}
                      </span>
                      {item.notes && (
                        <p className="text-xs text-white/30 mt-0.5">{item.notes}</p>
                      )}
                    </div>
                    <span className="text-sm font-['Gibson'] text-white/40 text-right whitespace-nowrap">
                      {item.brand}
                    </span>
                    <span
                      className="text-sm font-['Gibson'] font-bold text-right w-10"
                      style={{ color: accentColor }}
                    >
                      ×{item.qty}
                    </span>
                    {/* VIEW button */}
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 w-14 justify-center"
                      style={{
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.35)',
                        background: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${accentColor}50`;
                        e.currentTarget.style.color = accentColor;
                        e.currentTarget.style.background = `${accentColor}0a`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.35)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Eye size={11} />
                      <span>VIEW</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Item modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          accentColor={accentColor}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
}
