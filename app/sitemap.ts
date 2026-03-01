import { MetadataRoute } from "next";
import { getAllPortfolio } from "@/lib/works-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://agenz-iq.com";

  const routes = [
    "",
    "/about",
    "/contact",
    "/works",
    "/services",
    "/services/advertising",
    "/services/video",
    "/services/design",
    "/services/strategy",
  ];

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : route.startsWith("/services/") ? 0.8 : 0.9,
  }));

  const workRoutes: MetadataRoute.Sitemap = getAllPortfolio().map((item) => ({
    url: `${baseUrl}/works/${item.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes];
}
