'use client';

import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScrolling from '@/components/dom/SmoothScrolling';
import Header from '@/components/dom/Header';
import Footer from '@/components/dom/Footer';
import MenuOverlay from '@/components/dom/MenuOverlay';
import ServiceCTA from '@/components/dom/ServiceCTA';
import CameraRentalHero from '@/components/dom/CameraRentalHero';
import CameraRentalPackage from '@/components/dom/CameraRentalPackage';
import CameraRentalIndividual from '@/components/dom/CameraRentalIndividual';
import { getIconComponent } from '@/lib/icon-map';
import type { CameraPackage } from '@/lib/camera-rental-data';

gsap.registerPlugin(ScrollTrigger);

interface RentalItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  description?: string;
  image?: string;
  qty: number;
  available: boolean;
}

interface HeroConfig {
  tagline: string;
  heroImage: string;
  highlights: string[];
  accentColor: string;
}

const HERO_DEFAULTS: HeroConfig = {
  tagline: 'Cinema-Grade Production Packages',
  heroImage: '/images/camera-rental/arri-alexa-35-hero.webp',
  highlights: ['ARRI Alexa 35', 'Signature Primes', '19mm Studio', 'Full Package'],
  accentColor: '#00ffff',
};

export default function CameraRentalPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [packages, setPackages] = useState<CameraPackage[]>([]);
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(HERO_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const heroPromise = fetch('/api/content/camera-rental-hero')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.tagline) {
          setHeroConfig({
            tagline: data.tagline,
            heroImage: data.heroImage || HERO_DEFAULTS.heroImage,
            highlights: data.highlights || HERO_DEFAULTS.highlights,
            accentColor: data.accentColor || HERO_DEFAULTS.accentColor,
          });
        }
      })
      .catch(() => {});

    const pkgPromise = fetch('/api/content/camera-rental')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPackages(
            data.map((p) => ({
              id: p.slug,
              name: p.name,
              tagline: p.tagline,
              description: p.description,
              cameraBody: p.cameraBody,
              packageImage: p.packageImage,
              accentColor: p.accentColor,
              highlights: p.highlights,
              productionSetIncludes: p.productionSetIncludes,
              equipmentCategories: (p.equipmentCategories || []).map((cat: Record<string, unknown>) => ({
                id: cat.slug,
                name: cat.name,
                icon: getIconComponent(cat.iconName as string),
                description: cat.description || undefined,
                items: ((cat.items as Array<Record<string, unknown>>) || []).map((item) => ({
                  name: item.name,
                  brand: item.brand,
                  qty: item.qty,
                  notes: item.notes || undefined,
                  image: item.image || undefined,
                })),
              })),
            }))
          );
        }
      })
      .catch(() => {});

    const itemsPromise = fetch('/api/content/rental-items')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setRentalItems(data); })
      .catch(() => {});

    Promise.all([heroPromise, pkgPromise, itemsPromise]).finally(() => setLoading(false));

    setTimeout(() => { ScrollTrigger.refresh(); }, 600);
    setTimeout(() => { ScrollTrigger.update(); }, 800);
  }, []);

  const accentColor = packages[0]?.accentColor ?? '#00ffff';

  return (
    <>
      <Header
        variant="dark"
        onLogoClick={() => { window.location.href = '/'; }}
        onMenuClick={() => setMenuOpen(true)}
      />

      <SmoothScrolling>
        <main
          className="scrollable-page relative min-h-screen"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 0% 30%, rgba(0,255,255,0.06) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 100% 70%, rgba(0,233,44,0.04) 0%, transparent 55%),
              #050505
            `,
          }}
        >
          <CameraRentalHero
            tagline={heroConfig.tagline}
            heroImage={heroConfig.heroImage}
            highlights={heroConfig.highlights}
            accentColor={heroConfig.accentColor}
          />

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-[#00ffff] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <CameraRentalPackage packages={packages} />

              {rentalItems.length > 0 && (
                <CameraRentalIndividual items={rentalItems} accentColor={accentColor} />
              )}
            </>
          )}

          <section className="relative py-16 md:py-24 px-6 md:px-12">
            <ServiceCTA
              heading="Ready for Production?"
              description="Get in touch to check availability and book your package."
              buttonText="ENQUIRE NOW"
              buttonLink="/contact"
              accentColor={accentColor}
            />
          </section>

          <Footer />
        </main>
      </SmoothScrolling>

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
