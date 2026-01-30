import { Metadata } from 'next';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
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

  return {
    title: newsArticle.title || 'News Article | OddsFlow',
    description: newsArticle.summary || 'Football news and AI betting insights',
    openGraph: {
      title: newsArticle.title || 'News Article',
      description: newsArticle.summary || 'Football news and insights',
      type: 'article',
      publishedTime: newsArticle.created_at,
      images: newsArticle.image_url ? [newsArticle.image_url] : [],
      url: `${baseUrl}${canonicalPath}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: newsArticle.title || 'News Article',
      description: newsArticle.summary || 'Football news and insights',
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
  // Note: content might be JSONB, so check if it's a string before using substring
  const contentPreview = newsArticle?.content
    ? (typeof newsArticle.content === 'string'
        ? newsArticle.content.substring(0, 500) + '...'
        : '')
    : '';

  const seoContent = newsArticle ? (
    <div className="sr-only" aria-hidden="true">
      <article>
        <h1>{newsArticle.title}</h1>
        <p>{newsArticle.summary}</p>
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
