'use client';

import { useEffect, useState } from 'react';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

const NAV_ITEMS = [
  { label: 'Home', section: 'home', isHome: true },
  { label: 'About', section: 'about' },
  { label: 'Services', section: 'services' },
  { label: 'Contact', section: 'contact' },
  // Note: 'Works' removed - route doesn't exist
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'Twitter', href: 'https://twitter.com' },
  { label: 'Dribbble', href: 'https://dribbble.com' },
];

export default function MenuOverlay({ isOpen, onClose, onNavigate }: MenuOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>('home');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleNavClick = (item: typeof NAV_ITEMS[0]) => {
    setActiveItem(item.section);
    onClose();

    if (item.isHome) {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      setTimeout(() => {
        onNavigate(item.section);
      }, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop - click to close */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-[#0a0a0f] transition-transform duration-500 ease-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Gradient glow effect on left edge */}
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent pointer-events-none" />

        {/* Decorative gradient orb */}
        <div className="absolute top-20 right-10 w-48 h-48 bg-gradient-to-br from-cyan-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Close Button - Circle X */}
        <button
          onClick={onClose}
          className={`absolute top-8 right-8 w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:border-cyan-400/60 hover:bg-cyan-400/10 transition-all duration-300 z-10 group ${
            isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ transitionDelay: isAnimating ? '200ms' : '0ms' }}
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/70 group-hover:text-cyan-400 transition-colors">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Content - Top aligned */}
        <div className="relative h-full flex flex-col justify-start pt-28 sm:pt-32 px-8 sm:px-12">
          {/* Sitemap Section */}
          <div
            className={`mb-12 sm:mb-16 transition-all duration-500 ${
              isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: isAnimating ? '150ms' : '0ms' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-6 sm:mb-8">
              Sitemap
            </h3>
            <nav className="flex flex-col gap-3 sm:gap-4">
              {NAV_ITEMS.map((item, index) => (
                <button
                  key={item.section}
                  onClick={() => handleNavClick(item)}
                  onMouseEnter={() => setHoveredItem(item.section)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`text-left transition-all duration-300 group flex items-center gap-4 ${
                    isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: isAnimating ? `${200 + index * 60}ms` : '0ms' }}
                >
                  {/* Dash indicator */}
                  <span className={`text-2xl font-bold transition-colors duration-300 ${
                    activeItem === item.section || hoveredItem === item.section
                      ? 'text-cyan-400'
                      : 'text-gray-600'
                  }`}>
                    —
                  </span>

                  {/* Label */}
                  <span className={`text-3xl sm:text-4xl font-bold tracking-tight transition-all duration-300 ${
                    activeItem === item.section
                      ? 'text-white'
                      : hoveredItem === item.section
                        ? 'text-white translate-x-2'
                        : 'text-gray-400'
                  }`}>
                    {item.label}
                  </span>

                  {/* Animated line for active item */}
                  {activeItem === item.section && (
                    <span className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent ml-2" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Follow Us Section */}
          <div
            className={`transition-all duration-500 ${
              isAnimating ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: isAnimating ? '500ms' : '0ms' }}
          >
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 mb-5 sm:mb-6">
              Follow Us
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {SOCIAL_LINKS.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-base font-bold text-gray-500 hover:text-cyan-400 transition-all duration-300 ${
                    isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{ transitionDelay: isAnimating ? `${550 + index * 50}ms` : '0ms' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom copyright */}
          <div
            className={`pb-8 sm:pb-10 transition-all duration-500 ${
              isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: isAnimating ? '650ms' : '0ms' }}
          >
            <p className="text-xs text-gray-600 tracking-wide">
              &copy; 2025 Agenz. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
