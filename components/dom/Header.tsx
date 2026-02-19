'use client';

import Image from 'next/image';

interface HeaderProps {
  onGetInTouch?: () => void;
  onMenuClick?: () => void;
  onLogoClick?: () => void;
  variant?: 'light' | 'dark';
}

export default function Header({ onGetInTouch, onMenuClick, onLogoClick, variant = 'light' }: HeaderProps) {
  const isDark = variant === 'dark';

  const headerBg = isDark
    ? 'bg-black/40 backdrop-blur-md'
    : 'bg-black/40 backdrop-blur-md';

  const logoSrc = '/Agenz-logo-white.svg';

  const getInTouchClasses = 'hidden md:flex px-5 py-2.5 text-sm font-bold text-white bg-transparent border border-white/30 rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-200';

  const menuClasses = 'px-6 py-2.5 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-all duration-200';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-10 md:py-6 flex items-center justify-between pointer-events-none ${headerBg}`}>
      {/* Logo - Top Left */}
      <div className="pointer-events-auto">
        {onLogoClick ? (
          <button
            onClick={onLogoClick}
            className="hover:opacity-70 transition-opacity"
            aria-label="Go back"
          >
            <Image
              src={logoSrc}
              alt="Agenz Logo"
              width={120}
              height={40}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </button>
        ) : (
          <Image
            src={logoSrc}
            alt="Agenz Logo"
            width={120}
            height={40}
            className="h-8 md:h-10 w-auto"
            priority
          />
        )}
      </div>

      {/* Buttons - Top Right */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* GET IN TOUCH Button - Desktop Only */}
        <button
          className={getInTouchClasses}
          onClick={onGetInTouch}
        >
          GET IN TOUCH
        </button>

        {/* MENU Button */}
        <button
          className={menuClasses}
          onClick={onMenuClick}
        >
          MENU
        </button>
      </div>
    </header>
  );
}
