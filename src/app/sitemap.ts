import { MetadataRoute } from 'next';

const locales = ['en', 'es', 'pt', 'de', 'fr', 'ja', 'ko', 'zh', 'tw', 'id'] as const;
const baseUrl = 'https://www.oddsflow.ai';

// Helper to generate alternates for a path
function generateAlternates(path: string) {
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = locale === 'en' ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`;
  });
  languages['x-default'] = `${baseUrl}${path}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Static pages with their configurations
  const staticPagesConfig = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/predictions', changeFrequency: 'hourly' as const, priority: 0.95 },
    { path: '/leagues', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/performance', changeFrequency: 'daily' as const, priority: 0.85 },
    { path: '/community', changeFrequency: 'hourly' as const, priority: 0.8 },
    { path: '/community/global-chat', changeFrequency: 'always' as const, priority: 0.7 },
    { path: '/community/user-predictions', changeFrequency: 'hourly' as const, priority: 0.7 },
    { path: '/news', changeFrequency: 'hourly' as const, priority: 0.85 },
    { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/pricing', changeFrequency: 'monthly' as const, priority: 0.75 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/solution', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/get-started', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/terms-of-service', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/privacy-policy', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/responsible-gaming', changeFrequency: 'yearly' as const, priority: 0.4 },
    // World Cup pages
    { path: '/worldcup', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/worldcup/predictions', changeFrequency: 'hourly' as const, priority: 0.9 },
    { path: '/worldcup/leagues', changeFrequency: 'daily' as const, priority: 0.8 },
    { path: '/worldcup/ai_performance', changeFrequency: 'daily' as const, priority: 0.8 },
  ];

  // Generate sitemap entries for all locales
  const staticPages: MetadataRoute.Sitemap = [];

  staticPagesConfig.forEach((page) => {
    // Add entry for each locale
    locales.forEach((locale) => {
      const url = locale === 'en' ? `${baseUrl}${page.path || '/'}` : `${baseUrl}/${locale}${page.path}`;
      staticPages.push({
        url,
        lastModified: currentDate,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: generateAlternates(page.path || '/'),
      });
    });
  });

  // Blog posts - must match actual blog post IDs in /blog/[id]/page.tsx
  const blogSlugs = [
    'how-to-interpret-football-odds',
    'what-are-football-odds',
    'decimal-vs-fractional-vs-american-odds',
    'implied-probability-explained',
    'how-bookmakers-calculate-margins',
    'asian-handicap-betting-guide',
    'over-under-totals-betting-guide',
    'match-result-1x2-betting-explained',
    'why-football-odds-move',
    'sharp-vs-public-money-betting',
    'steam-moves-in-football-betting',
    'how-ai-predicts-football-matches',
    'evaluating-ai-football-prediction-models',
    'ai-vs-human-tipsters-comparison',
    'how-to-use-oddsflow-ai-predictions',
    'responsible-football-betting-guide',
    'asian-handicap-explained',
    'over-under-goals-explained',
    'btts-odds-explained',
    'opening-vs-closing-odds',
    'odds-movement-drift-steam',
    'bookmaker-consensus-odds',
    'oddsflow-odds-to-features',
    'accuracy-vs-calibration-football-predictions',
    'backtesting-football-models',
    'beyond-odds-football-features',
    'responsible-use-of-predictions',
  ];

  const blogPosts: MetadataRoute.Sitemap = [];
  blogSlugs.forEach((slug) => {
    locales.forEach((locale) => {
      const path = `/blog/${slug}`;
      const url = locale === 'en' ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`;
      blogPosts.push({
        url,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: generateAlternates(path),
      });
    });
  });

  // League pages
  const leagueSlugs = [
    'premier-league',
    'la-liga',
    'bundesliga',
    'serie-a',
    'ligue-1',
    'champions-league',
  ];

  const leagues: MetadataRoute.Sitemap = [];
  leagueSlugs.forEach((league) => {
    locales.forEach((locale) => {
      const path = `/leagues/${encodeURIComponent(league)}`;
      const url = locale === 'en' ? `${baseUrl}${path}` : `${baseUrl}/${locale}${path}`;
      leagues.push({
        url,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 0.85,
        alternates: generateAlternates(path),
      });
    });
  });

  return [...staticPages, ...blogPosts, ...leagues];
}
