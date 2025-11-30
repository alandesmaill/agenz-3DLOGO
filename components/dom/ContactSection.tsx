'use client';

import { useState, useCallback } from 'react';
import MenuOverlay from './MenuOverlay';
import ContactForm from './ContactForm';
import SubmissionSuccess from './SubmissionSuccess';
import Footer from './Footer';

interface ContactSectionProps {
  onBack?: () => void;
}

export default function ContactSection({ onBack }: ContactSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleMenuNavigate = useCallback((section: string) => {
    if (section === 'home') {
      window.location.reload();
    } else {
      console.log(`Navigate to: ${section}`);
    }
  }, []);

  const handleSuccess = useCallback(() => {
    console.log('[ContactSection] Form submitted successfully');
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
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-6 bg-gray-100/80 backdrop-blur-md z-50">
        {/* Logo - Left */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <img
            src="/Agenz-logo-black.svg"
            alt="Agenz logo"
            className="h-8 w-auto"
          />
        </button>

        {/* Right buttons */}
        <div className="flex items-center gap-3">
          <a
            href="mailto:contact@agenz.com"
            className="hidden md:flex px-5 py-2.5 text-sm font-bold text-black bg-transparent border border-gray-300 rounded-full hover:bg-gray-100 hover:border-gray-400 transition-all duration-200"
          >
            GET IN TOUCH
          </a>
          <button
            onClick={() => setMenuOpen(true)}
            className="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-full hover:bg-gray-800 transition-all duration-200"
          >
            MENU
          </button>
        </div>
      </header>

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
