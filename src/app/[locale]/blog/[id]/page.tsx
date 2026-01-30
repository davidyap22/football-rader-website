import { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { Suspense } from 'react';
import BlogArticleClient from './BlogArticleClient';

// Valid blog article IDs (existing articles)
const VALID_ARTICLE_IDS = [
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

// 301 redirects for old/missing articles
const ARTICLE_REDIRECTS: Record<string, string> = {
  'home-advantage-myth': '/blog',
  'understanding-odds-formats': '/blog',
  'new-features-jan-2026': '/blog',
  'community-features': '/blog',
  'premier-league-analysis': '/blog',
  'ai-prediction-accuracy': '/blog',
  'getting-started-oddsflow': '/blog',
  'bankroll-management': '/blog',
};

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;

  // Handle redirects
  if (ARTICLE_REDIRECTS[id]) {
    return {
      title: 'Redirecting...',
      description: 'Redirecting to blog page',
    };
  }

  // Return basic metadata (will be replaced by client component)
  return {
    title: 'OddsFlow Blog',
    description: 'AI football prediction insights and betting guides',
  };
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading article...</p>
      </div>
    </div>
  );
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { locale, id } = await params;

  // Handle 301 redirects for missing/old articles
  if (ARTICLE_REDIRECTS[id]) {
    const redirectUrl = locale === 'en' ? ARTICLE_REDIRECTS[id] : `/${locale}${ARTICLE_REDIRECTS[id]}`;
    redirect(redirectUrl);
  }

  // Return 404 for completely unknown articles
  if (!VALID_ARTICLE_IDS.includes(id) && !ARTICLE_REDIRECTS[id]) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <BlogArticleClient />
    </Suspense>
  );
}
