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
import CameraRentalEquipment from '@/components/dom/CameraRentalEquipment';
import { cameraPackages } from '@/lib/camera-rental-data';

gsap.registerPlugin(ScrollTrigger);

export default function CameraRentalPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pkg = cameraPackages[0];

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => { ScrollTrigger.refresh(); }, 600);
    setTimeout(() => { ScrollTrigger.update(); }, 800);
  }, []);

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
          {/* Hero */}
          <CameraRentalHero
            name={pkg.name}
            tagline={pkg.tagline}
            heroImage={pkg.heroImage}
            highlights={pkg.highlights}
            accentColor={pkg.accentColor}
          />

          {/* Package Showcase */}
          <CameraRentalPackage
            name={pkg.name}
            description={pkg.description}
            packageImage={pkg.packageImage}
            highlights={pkg.highlights}
            productionSetIncludes={pkg.productionSetIncludes}
            accentColor={pkg.accentColor}
          />

          {/* Equipment Inventory */}
          <CameraRentalEquipment
            categories={pkg.equipmentCategories}
            accentColor={pkg.accentColor}
          />

          {/* CTA */}
          <section className="relative py-16 md:py-24 px-6 md:px-12">
            <ServiceCTA
              heading="Ready for Production?"
              description="Get in touch to check availability and book your package."
              buttonText="INQUIRE NOW"
              buttonLink="/contact"
              accentColor={pkg.accentColor}
            />
          </section>

          <Footer />
        </main>
      </SmoothScrolling>

      <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
