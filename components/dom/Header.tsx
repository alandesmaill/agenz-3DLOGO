'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-10 md:py-6 flex items-center justify-between pointer-events-none">
      {/* Logo - Top Left */}
      <div className="pointer-events-auto">
        <Image
          src="/Agenz-logo-black.svg"
          alt="Agenz Logo"
          width={120}
          height={40}
          className="h-8 md:h-10 w-auto"
          priority
        />
      </div>

      {/* Buttons - Top Right */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* GET IN TOUCH Button - Outline Style */}
        <button
          className="px-5 py-2.5 text-sm font-bold text-black bg-transparent border border-gray-300 rounded-full hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
          onClick={() => console.log('Get in touch clicked')}
        >
          GET IN TOUCH
        </button>

        {/* MENU Button - Filled Black Style */}
        <button
          className="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-full hover:bg-gray-800 transition-all duration-200"
          onClick={() => console.log('Menu clicked')}
        >
          MENU
        </button>
      </div>
    </header>
  );
}
