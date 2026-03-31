import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { portfolioProjectSchema } from '@/lib/validations/works';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const project = await prisma.portfolioProject.findUnique({
    where: { id },
    include: {
      heroStats: { orderBy: { sortOrder: 'asc' } },
      galleryItems: { orderBy: { sortOrder: 'asc' } },
      results: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = portfolioProjectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const project = await prisma.portfolioProject.update({
      where: { id },
      data: parsed.data,
      include: {
        heroStats: { orderBy: { sortOrder: 'asc' } },
        galleryItems: { orderBy: { sortOrder: 'asc' } },
        results: { orderBy: { sortOrder: 'asc' } },
      },
    });
    return NextResponse.json(project);
  } catch (err) {
    console.error('Failed to update project:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.portfolioProject.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Failed to delete project:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}
