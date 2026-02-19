'use client';

import ServicesSection from '@/components/dom/ServicesSection';

export default function ServicesPage() {
  const handleBack = () => {
    window.location.href = '/';
  };

  return <ServicesSection onBack={handleBack} />;
}
