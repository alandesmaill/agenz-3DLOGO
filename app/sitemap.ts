import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://agenz-iq.com";

  const routes = [
    "",
    "/about",
    "/contact",
    "/works",
    "/services",
    "/services/camera-rental",
  ];

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : route.startsWith("/services/") ? 0.8 : 0.9,
  }));

  const services = await prisma.service.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { sortOrder: "asc" },
  });

  const serviceRoutes: MetadataRoute.Sitemap = services.map((item) => ({
    url: `${baseUrl}/services/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const projects = await prisma.portfolioProject.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { sortOrder: "asc" },
  });

  const workRoutes: MetadataRoute.Sitemap = projects.map((item) => ({
    url: `${baseUrl}/works/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes, ...workRoutes];
}
