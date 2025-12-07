import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://agenz.com';

  const routes = [
    '',
    '/about',
    '/contact',
    '/works',
    '/services',
    '/services/advertising',
    '/services/video',
    '/services/design',
    '/services/strategy',
  ];

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.startsWith('/services/') ? 0.8 : 0.9,
  }));
}
