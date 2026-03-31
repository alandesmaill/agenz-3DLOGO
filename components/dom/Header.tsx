'use client';

import Image from 'next/image';
import Link from 'next/link';

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

  const getInTouchClasses = 'flex items-center justify-center whitespace-nowrap h-10 md:h-11 px-4 md:px-5 text-xs md:text-sm font-bold text-white bg-transparent border border-white/30 rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-200';

  const menuClasses = 'flex items-center justify-center w-10 h-10 md:w-11 md:h-11 text-black bg-white rounded-full hover:bg-gray-200 transition-all duration-200';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-5 py-3 md:px-10 md:py-6 flex items-center justify-between pointer-events-none ${headerBg}`}>
      <div className="flex items-center pointer-events-auto">
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
              className="h-6 md:h-10 w-auto"
              priority
            />
          </button>
        ) : (
          <Image
            src={logoSrc}
            alt="Agenz Logo"
            width={120}
            height={40}
            className="h-6 md:h-10 w-auto"
            priority
          />
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
        {onGetInTouch ? (
          <button className={getInTouchClasses} onClick={onGetInTouch}>
            CAMERA RENTAL
          </button>
        ) : (
          <Link href="/services/camera-rental" className={getInTouchClasses}>
            CAMERA RENTAL
          </Link>
        )}

        <button
          className={menuClasses}
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="18" height="2" rx="1" fill="currentColor"/>
            <rect y="5.5" width="18" height="2" rx="1" fill="currentColor"/>
            <rect y="11" width="18" height="2" rx="1" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
