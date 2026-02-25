'use client';

import { useState, useCallback } from 'react';
import { Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import MenuOverlay from './MenuOverlay';
import ContactForm from './ContactForm';
import SubmissionSuccess from './SubmissionSuccess';
import Header from './Header';

interface ContactSectionProps {
  onBack?: () => void;
}

export default function ContactSection({ onBack }: ContactSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `
        radial-gradient(ellipse 70% 60% at 20% 50%, rgba(0, 255, 255, 0.14) 0%, transparent 55%),
        radial-gradient(ellipse 60% 50% at 60% 85%, rgba(0, 255, 255, 0.10) 0%, transparent 55%),
        #0d0d0d
      `,
    }}>

      {/* Fixed Header */}
      <Header
        variant="dark"
        onLogoClick={onBack}
        onGetInTouch={() => window.location.href = 'mailto:hello@agenz.com'}
        onMenuClick={() => setMenuOpen(true)}
      />

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

            {/* Left Column — Heading & Contact Info */}
            <div className="lg:pt-6">
              <p className="text-[#00e92c] text-sm font-semibold tracking-widest uppercase mb-4">Contact Us</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Let&apos;s Create{' '}
                <span className="bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent">
                  Something Amazing
                </span>{' '}
                Together
              </h1>
              <p className="text-lg text-white/60 mb-12 max-w-md leading-relaxed">
                Ready to bring your vision to life? Fill out the form and we&apos;ll get back to you within 24 hours.
              </p>

              {/* Contact Details */}
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/14 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-white font-medium">hello@agenz.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/14 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="text-white font-medium">+1 (234) 567-890</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/14 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-0.5">Response Time</p>
                    <p className="text-white font-medium">Within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Follow Us</p>
                <div className="flex items-center gap-4">
                  {[
                    { name: 'Instagram', href: 'https://instagram.com/agenz', icon: Instagram },
                    { name: 'LinkedIn', href: 'https://linkedin.com/company/agenz', icon: Linkedin },
                    { name: 'Twitter', href: 'https://twitter.com/agenz', icon: Twitter },
                    { name: 'Facebook', href: 'https://facebook.com/agenz', icon: Facebook },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-12 h-12 rounded-2xl bg-white/8 border border-white/14 flex items-center justify-center hover:bg-white/14 hover:border-[#00ffff]/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300"
                    >
                      <social.icon className="w-5 h-5 text-white/60" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column — Form */}
            <div>
              <ContactForm onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      </main>

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
      />
    </div>
  );
}
