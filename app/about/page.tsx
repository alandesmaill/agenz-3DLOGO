'use client';

import AboutSection from '@/components/dom/AboutSection';

export default function AboutPage() {
  const handleBack = () => {
    window.location.href = '/';
  };

  return <AboutSection onBack={handleBack} />;
}
