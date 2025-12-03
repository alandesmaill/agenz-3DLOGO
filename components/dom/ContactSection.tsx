'use client';

import { useState, useCallback } from 'react';
import MenuOverlay from './MenuOverlay';
import ContactForm from './ContactForm';
import SubmissionSuccess from './SubmissionSuccess';
import Footer from './Footer';
import Header from './Header';

interface ContactSectionProps {
  onBack?: () => void;
}

export default function ContactSection({ onBack }: ContactSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleMenuNavigate = useCallback((section: string) => {
    if (section === 'home') {
      window.location.href = '/';
    } else if (section === 'about') {
      window.location.href = '/about';
    } else if (section === 'services') {
      window.location.href = '/services';
    } else if (section === 'contact') {
      window.location.href = '/contact';
    }
    // Note: 'works' section removed - route doesn't exist
  }, []);

  const handleSuccess = useCallback(() => {
    setSubmitSuccess(true);
  }, []);

  const handleCloseSuccess = useCallback(() => {
    setSubmitSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSendAnother = useCallback(() => {
    setSubmitSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Header */}
      <Header
        onLogoClick={onBack}
        onGetInTouch={() => window.location.href = 'mailto:contact@agenz.com'}
        onMenuClick={() => setMenuOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Let&apos;s Create Something Amazing Together
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Ready to bring your vision to life? Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-6 md:px-12 pb-24">
        <ContactForm onSuccess={handleSuccess} />
      </section>

      {/* Success Screen Overlay */}
      {submitSuccess && (
        <SubmissionSuccess
          onClose={handleCloseSuccess}
          onSendAnother={handleSendAnother}
        />
      )}

      {/* Menu Overlay */}
      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleMenuNavigate}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
