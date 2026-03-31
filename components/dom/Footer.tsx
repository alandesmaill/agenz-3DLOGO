'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Linkedin, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    href: 'https://www.instagram.com/agenz.iq/',
    icon: Instagram,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/agenz-iq/posts/?feedView=all',
    icon: Linkedin,
  },
];

const quickLinks = [
  { name: 'About', href: '/about' },
  { name: 'Works', href: '/works' },
  { name: 'Services', href: '/services' },
  { name: 'Contact', href: '/contact' },
];

const serviceLinks = [
  { name: 'Camera Rental', href: '/services/camera-rental' },
  { name: 'Advertising & Social Media', href: '/services/advertising' },
  { name: 'Video Production', href: '/services/video' },
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

    const scrollContainer = document.getElementById('section-scroll-container');
    const scrollerOverride = scrollContainer ? { scroller: scrollContainer } : {};

    const ctx = gsap.context(() => {
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
            ...scrollerOverride,
          },
        }
      );

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
              ...scrollerOverride,
            },
          }
        );
      }

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
            ...scrollerOverride,
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="footer-background absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-green-500/10 blur-3xl animate-gradient" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float-slower" />
      </div>

      <div className="relative bg-white/8 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16">
          <div className="footer-column flex justify-center lg:hidden mb-8">
            <Link href="/">
              <Image
                src="/agenz creative hub.svg"
                alt="Agenz Creative Hub"
                width={160}
                height={54}
                className="h-12 w-auto transition-all duration-300 hover:scale-105"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:hidden mb-8">
            <div className="footer-column text-center">
              <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-white transition-colors duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column text-center">
              <h3 className="mb-3 text-xs uppercase tracking-wider">
                <Link
                  href="/services"
                  className="text-white font-semibold hover:text-cyan-400 transition-colors duration-300"
                >
                  Services
                </Link>
              </h3>
              <ul className="space-y-2">
                {serviceLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-[13px] hover:text-white transition-colors duration-300 inline-block leading-snug"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-column lg:hidden text-center mb-2">
            <h3 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="space-y-2 mb-4">
              <a
                href="mailto:agenz@agenz-iq.com"
                className="text-gray-400 text-sm hover:text-cyan-400 transition-colors duration-300 block"
              >
                agenz@agenz-iq.com
              </a>
              <a
                href="tel:+9647715568080"
                className="text-gray-400 text-sm hover:text-cyan-400 transition-colors duration-300 block"
              >
                +964 771 556 8080
              </a>
            </div>
            <div className="flex gap-3 justify-center">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 rounded-xl bg-white/8 backdrop-blur-xl border border-white/14 flex items-center justify-center transition-all duration-300 hover:bg-white/14 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/30"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-all duration-300" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-4 gap-12">
            <div className="footer-column">
              <Link href="/">
                <Image
                  src="/agenz creative hub.svg"
                  alt="Agenz Creative Hub"
                  width={180}
                  height={60}
                  className="h-14 w-auto transition-all duration-300 hover:scale-105"
                />
              </Link>
            </div>

            <div className="footer-column">
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

            <div className="footer-column">
              <h3 className="mb-4 text-sm uppercase tracking-wider">
                <Link
                  href="/services"
                  className="text-white font-semibold hover:text-cyan-400 transition-colors duration-300"
                >
                  Services
                </Link>
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

            <div className="footer-column">
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Get in Touch
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:agenz@agenz-iq.com"
                    className="text-gray-400 text-sm hover:text-cyan-400 transition-colors duration-300 inline-block"
                  >
                    agenz@agenz-iq.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+9647715568080"
                    className="text-gray-400 text-sm hover:text-cyan-400 transition-colors duration-300 inline-block"
                  >
                    +964 771 556 8080
                  </a>
                </li>
              </ul>

              <div className="flex gap-3 mt-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-10 h-10 rounded-xl bg-white/8 backdrop-blur-xl border border-white/14 flex items-center justify-center transition-all duration-300 hover:bg-white/14 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-110 hover:-translate-y-1"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-all duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-green-500/0 group-hover:from-cyan-500/20 group-hover:to-green-500/20 rounded-xl transition-all duration-500 pointer-events-none blur-sm" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
              <p className="text-center md:text-left">
                © {new Date().getFullYear()} Agenz. All rights reserved.
              </p>

              <div className="flex gap-6">
                {legalLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-500 hover:text-gray-300 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
