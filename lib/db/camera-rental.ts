import { prisma } from './prisma';
import { getIconComponent } from '@/lib/icon-map';
import type { CameraPackage } from '@/lib/camera-rental-data';

export async function getPublishedPackages(): Promise<CameraPackage[]> {
  const packages = await prisma.cameraPackage.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      equipmentCategories: {
        orderBy: { sortOrder: 'asc' },
        include: { items: { orderBy: { sortOrder: 'asc' } } },
      },
    },
  });

  return packages.map((pkg) => ({
    id: pkg.slug,
    name: pkg.name,
    tagline: pkg.tagline,
    description: pkg.description,
    cameraBody: pkg.cameraBody,
    packageImage: pkg.packageImage,
    accentColor: pkg.accentColor,
    highlights: pkg.highlights,
    productionSetIncludes: pkg.productionSetIncludes,
    equipmentCategories: pkg.equipmentCategories.map((cat) => ({
      id: cat.slug,
      name: cat.name,
      icon: getIconComponent(cat.iconName),
      description: cat.description || undefined,
      items: cat.items.map((item) => ({
        name: item.name,
        brand: item.brand,
        qty: item.qty,
        notes: item.notes || undefined,
        image: item.image || undefined,
      })),
    })),
  }));
}

export async function getPackageBySlug(slug: string): Promise<CameraPackage | null> {
  const packages = await getPublishedPackages();
  return packages.find((p) => p.id === slug) || null;
}
