import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';

const DEFAULTS = {
  tagline: 'Cinema-Grade Production Packages',
  heroImage: '/images/camera-rental/arri-alexa-35-hero.webp',
  highlights: ['ARRI Alexa 35', 'Signature Primes', '19mm Studio', 'Full Package'],
  accentColor: '#00ffff',
};

async function getOrCreateHero() {
  let hero = await prisma.cameraRentalHeroConfig.findFirst();
  if (!hero) {
    hero = await prisma.cameraRentalHeroConfig.create({ data: DEFAULTS });
  }
  return hero;
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const hero = await getOrCreateHero();
    return NextResponse.json(hero);
  } catch (err) {
    console.error('Failed to fetch hero config:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  try {
    const existing = await getOrCreateHero();
    const updated = await prisma.cameraRentalHeroConfig.update({
      where: { id: existing.id },
      data: {
        tagline: body.tagline ?? existing.tagline,
        heroImage: body.heroImage ?? existing.heroImage,
        highlights: body.highlights ?? existing.highlights,
        accentColor: body.accentColor ?? existing.accentColor,
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Failed to update hero config:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}
