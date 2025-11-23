'use client';

import { useEffect, useState } from 'react';
import AboutSection from './AboutSection';

interface TestSectionProps {
  section: string | null;
  isVisible: boolean;
  onBack: () => void;
}

export default function TestSection({
  section,
  isVisible,
  onBack,
}: TestSectionProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Delay opacity change slightly for smooth transition
      const timer = setTimeout(() => setOpacity(1), 100);
      return () => clearTimeout(timer);
    } else {
      setOpacity(0);
    }
  }, [isVisible]);

  if (!section || !isVisible) return null;

  // Render AboutSection for the "about" section
  if (section === 'about') {
    return <AboutSection onBack={onBack} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-500"
      style={{ opacity }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full mx-4 transform transition-all duration-500">
        {/* Section Title */}
        <h1 className="text-6xl font-bold text-gray-900 mb-6 uppercase tracking-tight">
          {section}
        </h1>

        {/* Section Description */}
        <div className="text-gray-600 mb-8 space-y-4">
          <p className="text-xl">
            This is a test view for the <span className="font-semibold text-gray-900">{section}</span> section.
          </p>
          <p className="text-lg">
            In the full implementation, this would display the actual content for this section.
          </p>
        </div>

        {/* Section-specific content placeholder */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {section === 'about' && '👋 About Us'}
            {section === 'works' && '🎨 Our Works'}
            {section === 'services' && '⚙️ Services We Offer'}
            {section === 'contact' && '📧 Get In Touch'}
          </h2>
          <p className="text-gray-700">
            Content specific to {section} would appear here...
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          ← BACK TO LOGO
        </button>
      </div>
    </div>
  );
}
