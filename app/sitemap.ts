import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://talingpangu.com'; // Defaulting to a likely production URL, user may need to update this

  const routes = [
    '',
    '/movies',
    '/trending',
    '/popular',
    '/top-rated',
    '/upcoming',
    '/news',
    '/web-series',
    '/serials',
    '/comedy',
    '/entertainment',
    '/adult',
    '/trailers',
    '/albums',
    '/mining',
    '/about',
    '/contact',
    '/privacy',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
