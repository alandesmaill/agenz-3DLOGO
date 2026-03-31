'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import SmoothScrolling from '@/components/dom/SmoothScrolling';
import ServiceDetailHero from '@/components/dom/ServiceDetailHero';
import ServiceOverview from '@/components/dom/ServiceOverview';
import ServiceFeatureGrid from '@/components/dom/ServiceFeatureGrid';
import ServiceCTA from '@/components/dom/ServiceCTA';
import Footer from '@/components/dom/Footer';
import Header from '@/components/dom/Header';
import MenuOverlay from '@/components/dom/MenuOverlay';
import { getIconComponent } from '@/lib/icon-map';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServiceData {
  slug: string;
  number: string;
  title: string;
  accentColor: string;
  heroTagline: string;
  heroDescription: string;
  heroStats: { value: string; label: string }[];
  overviewHeading: string;
  overviewParagraphs: string[];
  overviewBenefits: string[];
  features: { iconName: string; title: string; description: string }[];
  ctaHeading: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/content/services/${slug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setService(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  // ScrollTrigger refresh after content loads
  useEffect(() => {
    if (!service) return;
    window.scrollTo(0, 0);

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    setTimeout(() => {
      ScrollTrigger.update();
    }, 800);
  }, [service]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <Loader2 size={40} className="text-[#00e92c] animate-spin" />
      </div>
    );
  }

  if (error || !service) {
    notFound();
  }

  const resolvedFeatures: { icon: LucideIcon; title: string; description: string }[] =
    service.features.map((f) => ({
      icon: getIconComponent(f.iconName),
      title: f.title,
      description: f.description,
    }));

  const bgStyle = {
    background: `radial-gradient(ellipse 70% 60% at 20% 50%, ${service.accentColor}14 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 60% 85%, ${service.accentColor}0F 0%, transparent 55%), #0d0d0d`,
  };

  return (
    <>
      <Header
        variant="dark"
        onLogoClick={() => (window.location.href = '/')}
        onMenuClick={() => setMenuOpen(true)}
      />
      <SmoothScrolling>
        <main className="scrollable-page relative min-h-screen" style={bgStyle}>
          <section className="relative py-20 md:py-32 px-6 md:px-12 overflow-hidden">
            <ServiceDetailHero
              number={service.number}
              title={service.title}
              tagline={service.heroTagline}
              description={service.heroDescription}
              accentColor={service.accentColor}
            />
          </section>

          <section className="relative py-16 md:py-24 px-6 md:px-12">
            <ServiceOverview
              heading={service.overviewHeading}
              paragraphs={service.overviewParagraphs}
              benefits={service.overviewBenefits}
              accentColor={service.accentColor}
            />
          </section>

          <section className="relative py-16 md:py-24 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-['Gibson'] font-bold text-white mb-12 text-center">
                What We Offer
              </h2>
              <ServiceFeatureGrid
                features={resolvedFeatures}
                accentColor={service.accentColor}
              />
            </div>
          </section>

          <section className="relative py-16 md:py-24 px-6 md:px-12">
            <ServiceCTA
              heading={service.ctaHeading}
              description={service.ctaDescription}
              buttonText={service.ctaButtonText}
              buttonLink={service.ctaButtonLink}
              accentColor={service.accentColor}
            />
          </section>

          <Footer />
        </main>
      </SmoothScrolling>

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
