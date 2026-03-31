import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { serviceSchema } from '@/lib/validations/services';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { features: { orderBy: { sortOrder: 'asc' } } },
    });
    return NextResponse.json(services);
  } catch (err) {
    console.error('Failed to fetch services:', err);
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
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const existing = await prisma.service.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) {
      return NextResponse.json({ error: 'A service with this slug already exists' }, { status: 409 });
    }

    // PrismaPg adapter drops String[] fields during create —
    const { overviewParagraphs, overviewBenefits, metaKeywords, ...rest } = parsed.data;
    const created = await prisma.service.create({
      data: rest,
    });
    const service = await prisma.service.update({
      where: { id: created.id },
      data: {
        overviewParagraphs: overviewParagraphs ?? [],
        overviewBenefits: overviewBenefits ?? [],
        metaKeywords: metaKeywords ?? [],
      },
      include: { features: true },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (err) {
    console.error('Failed to create service:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}
