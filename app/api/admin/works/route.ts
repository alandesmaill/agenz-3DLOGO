import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db/prisma';
import { portfolioProjectSchema } from '@/lib/validations/works';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        heroStats: { orderBy: { sortOrder: 'asc' } },
        galleryItems: { orderBy: { sortOrder: 'asc' } },
        results: { orderBy: { sortOrder: 'asc' } },
      },
    });
    return NextResponse.json(projects);
  } catch (err) {
    console.error('Failed to fetch projects:', err);
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
  const parsed = portfolioProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const existing = await prisma.portfolioProject.findUnique({ where: { slug: parsed.data.slug } });
    if (existing) {
      return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 409 });
    }

    const project = await prisma.portfolioProject.create({
      data: parsed.data,
      include: {
        heroStats: true,
        galleryItems: true,
        results: true,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error('Failed to create project:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    );
  }
}
