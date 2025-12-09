'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, Twitter, Facebook, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SocialLink {
  name: string;
  href: string;
  icon: typeof Instagram;
}

const socialLinks: SocialLink[] = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/agenz',
    icon: Instagram,
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/agenz',
    icon: Linkedin,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/agenz',
    icon: Twitter,
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/agenz',
    icon: Facebook,
  },
];

const quickLinks = [
  { name: 'About', href: '/about' },
  { name: 'Works', href: '/works' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

const serviceLinks = [
  { name: 'Advertising & Social Media', href: '/services/advertising' },
  { name: 'Video Production & Music', href: '/services/video' },
  { name: 'Print & Graphic Design', href: '/services/design' },
  { name: 'Strategic Media Services', href: '/services/strategy' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Main footer entrance animation
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );

      // Staggered columns animation (left to right wave effect)
      const columns = footerRef.current?.querySelectorAll('.footer-column');
      if (columns && columns.length > 0) {
        gsap.fromTo(
          columns,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // Parallax effect on background
      const background = footerRef.current?.querySelector('.footer-background');
      if (background && footerRef.current) {
        gsap.to(background, {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-black border-t border-white/10 overflow-hidden"
    >
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="footer-background absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-green-500/10 blur-3xl animate-gradient" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float-slower" />
      </div>

      {/* Glass overlay */}
      <div className="relative bg-white/5 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          {/* Top: Brand Banner */}
          <div className="text-center space-y-4 mb-12">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/Agenz-logo-white.svg"
                alt="Agenz Logo"
                width={150}
                height={50}
                className="h-10 w-auto transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Tagline with gradient */}
            <p className="text-lg font-medium bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              Creative Excellence. Digital Innovation.
            </p>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
              agency specializing in advertising, video production, design, and strategic media services that drive measurable results.
            </p>
          </div>

          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Column 1: Quick Links */}
            <div className="footer-column space-y-6 text-center md:text-left">
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="relative text-gray-400 text-sm transition-all duration-300 hover:text-white inline-flex items-center gap-2 group"
                      >
                        <span className="relative">
                          {link.name}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-green-400 group-hover:w-full transition-all duration-300" />
                        </span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 2: Services */}
            <div className="footer-column space-y-6 text-center md:text-left">
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  Services
                </h3>
                <ul className="space-y-3">
                  {serviceLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="relative text-gray-400 text-sm transition-all duration-300 hover:text-white inline-flex items-center gap-2 group"
                      >
                        <span className="relative">
                          {link.name}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-green-400 group-hover:w-full transition-all duration-300" />
                        </span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 3: Connect */}
            <div className="footer-column space-y-6 text-center md:text-left">
              {/* Contact Info */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  Get in Touch
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="mailto:hello@agenz.com"
                      className="text-gray-400 text-sm hover:text-cyan-400 transition-colors duration-300 inline-block"
                    >
                      hello@agenz.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+1234567890"
                      className="text-gray-400 text-sm hover:text-cyan-400 transition-colors duration-300 inline-block"
                    >
                      +1 (234) 567-890
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                  Follow Us
                </h3>
                <div className="flex gap-4 justify-center md:justify-start">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative w-12 h-12 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/30 md:hover:scale-110 md:hover:-translate-y-1"
                        aria-label={social.name}
                      >
                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-all duration-300 group-hover:scale-110" />

                        {/* Enhanced glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-green-500/0 group-hover:from-cyan-500/20 group-hover:to-green-500/20 rounded-xl transition-all duration-500 pointer-events-none blur-sm" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
              <p className="text-center md:text-left">
                © {new Date().getFullYear()} Agenz. All rights reserved.
              </p>

              {/* Legal Links */}
              <div className="flex gap-6">
                {legalLinks.map((link) => (
                  <span
                    key={link.name}
                    className="text-gray-500 cursor-not-allowed"
                  >
                    {link.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
