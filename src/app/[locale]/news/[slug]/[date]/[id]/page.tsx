import { Metadata } from 'next';
import { Suspense } from 'react';
import { supabase, getLocalizedNewsContent } from '@/lib/supabase';
import NewsArticleClient from './NewsArticleClient';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
    date: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;

  // Fetch news article for SEO
  const { data: newsArticle } = await supabase
    .from('football_news')
    .select('title, summary, image_url, created_at')
    .eq('id', id)
    .single();

  if (!newsArticle) {
    return {
      title: 'News Article | OddsFlow',
      description: 'Football news and insights',
    };
  }

  const baseUrl = 'https://www.oddsflow.ai';
  const canonicalPath = locale === 'en'
    ? `/news/${id}`
    : `/${locale}/news/${id}`;

  // Extract localized content (title and summary might be JSONB objects)
  const localizedTitle = getLocalizedNewsContent(newsArticle.title, locale) || 'News Article | OddsFlow';
  const localizedSummary = getLocalizedNewsContent(newsArticle.summary, locale) || 'Football news and AI betting insights';

  return {
    title: localizedTitle,
    description: localizedSummary,
    openGraph: {
      title: localizedTitle,
      description: localizedSummary,
      type: 'article',
      publishedTime: newsArticle.created_at,
      images: newsArticle.image_url ? [newsArticle.image_url] : [],
      url: `${baseUrl}${canonicalPath}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedTitle,
      description: localizedSummary,
      images: newsArticle.image_url ? [newsArticle.image_url] : [],
    },
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
    },
  };
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading news article...</p>
      </div>
    </div>
  );
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { locale, slug, date, id } = await params;

  // Fetch article data server-side for SEO
  const { data: newsArticle } = await supabase
    .from('football_news')
    .select('*')
    .eq('id', id)
    .single();

  // SEO-friendly server-rendered content (hidden from users but visible to crawlers)
  // Note: title, summary, content might be JSONB objects, so use getLocalizedNewsContent
  const seoTitle = newsArticle ? getLocalizedNewsContent(newsArticle.title, locale) : '';
  const seoSummary = newsArticle ? getLocalizedNewsContent(newsArticle.summary, locale) : '';
  const seoContentText = newsArticle ? getLocalizedNewsContent(newsArticle.content, locale) : '';
  const contentPreview = seoContentText ? seoContentText.substring(0, 500) + '...' : '';

  const seoContent = newsArticle ? (
    <div className="sr-only" aria-hidden="true">
      <article>
        <h1>{seoTitle}</h1>
        <p>{seoSummary}</p>
        <time dateTime={newsArticle.created_at}>{newsArticle.created_at}</time>
        {contentPreview && (
          <div dangerouslySetInnerHTML={{ __html: contentPreview }} />
        )}
      </article>
    </div>
  ) : null;

  return (
    <>
      {/* SEO content for crawlers */}
      {seoContent}

      {/* Client component for interactive UI */}
      <Suspense fallback={<LoadingFallback />}>
        <NewsArticleClient />
      </Suspense>
    </>
  );
}
