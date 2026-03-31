import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

const DEFAULTS = {
  tagline: 'Cinema-Grade Production Packages',
  heroImage: '/images/camera-rental/arri-alexa-35-hero.webp',
  highlights: ['ARRI Alexa 35', 'Signature Primes', '19mm Studio', 'Full Package'],
  accentColor: '#00ffff',
};

export async function GET() {
  try {
    const hero = await prisma.cameraRentalHeroConfig.findFirst();
    const data = hero ?? DEFAULTS;
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('Failed to fetch hero config:', err);
    return NextResponse.json(DEFAULTS);
  }
}
