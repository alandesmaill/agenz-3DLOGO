'use client';

import Image from 'next/image';

interface HeaderProps {
  onGetInTouch?: () => void;
  onMenuClick?: () => void;
  onLogoClick?: () => void;
}

export default function Header({ onGetInTouch, onMenuClick, onLogoClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-10 md:py-6 flex items-center justify-between pointer-events-none bg-gray-100/80 backdrop-blur-md">
      {/* Logo - Top Left */}
      <div className="pointer-events-auto">
        {onLogoClick ? (
          <button
            onClick={onLogoClick}
            className="hover:opacity-70 transition-opacity"
            aria-label="Go back"
          >
            <Image
              src="/Agenz-logo-black.svg"
              alt="Agenz Logo"
              width={120}
              height={40}
              className="h-8 md:h-10 w-auto"
              priority
            />
          </button>
        ) : (
          <Image
            src="/Agenz-logo-black.svg"
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
        {/* GET IN TOUCH Button - Outline Style - Desktop Only */}
        <button
          className="hidden md:flex px-5 py-2.5 text-sm font-bold text-black bg-transparent border border-gray-300 rounded-full hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
          onClick={onGetInTouch}
        >
          GET IN TOUCH
        </button>

        {/* MENU Button - Filled Black Style */}
        <button
          className="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-full hover:bg-gray-800 transition-all duration-200"
          onClick={onMenuClick}
        >
          MENU
        </button>
      </div>
    </header>
  );
}
