import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { heroStatSchema } from '@/lib/validations/works';
import { z } from 'zod';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = z.array(heroStatSchema).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await prisma.heroStat.deleteMany({ where: { projectId: id } });
    const stats = await Promise.all(
      parsed.data.map((s) =>
        prisma.heroStat.create({ data: { ...s, projectId: id } })
      )
    );
    return NextResponse.json(stats);
  } catch (err) {
    console.error('Failed to update hero stats:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}
