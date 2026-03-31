import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { clientLogoSchema } from '@/lib/validations/client-logos';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const logos = await prisma.clientLogo.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(logos);
  } catch (err) {
    console.error('Failed to fetch client logos:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = clientLogoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const logo = await prisma.clientLogo.create({ data: parsed.data });
    return NextResponse.json(logo, { status: 201 });
  } catch (err) {
    console.error('Failed to create client logo:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}
