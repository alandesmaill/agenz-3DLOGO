'use client';

import ContactSection from '@/components/dom/ContactSection';

export default function ContactPage() {
  const handleBack = () => {
    window.location.href = '/';
  };

  return <ContactSection onBack={handleBack} />;
}
