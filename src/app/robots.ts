import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://oddsflow.ai';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/checkout',
          '/auth/',
          '/api/',
          '/_next/',
          '/login',
          '/admin/',
          '/user/',
          '/private/',
        ],
      },
      // Googlebot specific rules
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/checkout',
          '/auth/',
          '/api/',
        ],
      },
      // AI crawlers for Generative Engine Optimization (GEO)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/auth/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/auth/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/auth/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/auth/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/auth/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
