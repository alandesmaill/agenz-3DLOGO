import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const logos = await prisma.clientLogo.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json(logos);
}
