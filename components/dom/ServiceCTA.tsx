'use client';

import Link from 'next/link';

interface ServiceCTAProps {
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  accentColor: string;
}

export default function ServiceCTA({
  heading,
  description,
  buttonText,
  buttonLink,
  accentColor,
}: ServiceCTAProps) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-['Gibson'] font-bold text-gray-900 mb-6">
        {heading}
      </h2>

      {/* Description */}
      <p className="text-lg md:text-xl font-['Gibson'] text-gray-600 mb-10 leading-relaxed">
        {description}
      </p>

      {/* CTA Button */}
      <Link
        href={buttonLink}
        className="
          inline-flex items-center gap-3
          px-6 sm:px-8 md:px-10 py-4 sm:py-5
          bg-gray-900 text-white
          font-['Gibson'] font-bold text-lg
          rounded-full
          hover:scale-105 hover:bg-gray-800
          transition-all duration-300
          shadow-2xl
        "
        style={{
          boxShadow: `0 20px 60px ${accentColor}30`,
        }}
      >
        <span>{buttonText}</span>
        <span className="text-2xl transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>

      {/* Supporting text */}
      <p className="mt-8 text-sm font-['Gibson'] text-gray-500">
        No commitment required • Free consultation • Response within 24 hours
      </p>
    </div>
  );
}
