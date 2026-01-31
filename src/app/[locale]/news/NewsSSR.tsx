/**
 * NewsSSR - Server-Side Rendered Content for SEO
 *
 * This component renders news articles as static HTML that crawlers can read.
 * It's invisible to users (sr-only) but fully visible to Googlebot and LLMs.
 */

import { buildLocalePath, buildNewsUrl, getLocalizedNewsContent } from '@/lib/supabase';

interface NewsArticle {
  id: string;
  title: string | Record<string, string>;
  summary: string | Record<string, string>;
  content?: string | Record<string, string>;
  image_url?: string;
  created_at: string;
  category?: string;
}

interface NewsSSRProps {
  locale: string;
  articles: NewsArticle[];
  totalCount: number;
}

// Translations for SSR content
const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'Football News & AI Betting Insights',
    subtitle: 'Latest news, match analysis, and AI-powered betting predictions',
    latestArticles: 'Latest Articles',
    readMore: 'Read More',
    publishedOn: 'Published on',
    totalArticles: 'Total articles available',
  },
  zh: {
    title: '足球新闻与 AI 投注洞察',
    subtitle: '最新新闻、比赛分析和 AI 驱动的投注预测',
    latestArticles: '最新文章',
    readMore: '阅读更多',
    publishedOn: '发布于',
    totalArticles: '文章总数',
  },
  // Fallback to English for other locales
};

function getTranslation(locale: string, key: string): string {
  return translations[locale]?.[key] || translations.en[key] || key;
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getLocalizedText(field: string | Record<string, string>, locale: string): string {
  if (typeof field === 'string') {
    return field;
  }
  return getLocalizedNewsContent(field, locale) || '';
}

export default function NewsSSR({
  locale,
  articles,
  totalCount,
}: NewsSSRProps) {
  const t = (key: string) => getTranslation(locale, key);

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <>
      {/*
        SSR Content for Search Engines and LLMs
        This content is hidden from users (sr-only) but fully visible to crawlers.
        The visible UI is rendered by NewsClient.
      */}
      <div className="sr-only" aria-hidden="true" data-ssr-content="true">
        <main itemScope itemType="https://schema.org/CollectionPage">
          {/* Header */}
          <header>
            <h1 itemProp="name">{t('title')}</h1>
            <p itemProp="description">{t('subtitle')}</p>
            <meta itemProp="url" content={`https://www.oddsflow.ai${buildLocalePath('/news', locale)}`} />
          </header>

          {/* Articles List */}
          <section>
            <h2>{t('latestArticles')}</h2>
            <p>{t('totalArticles')}: {totalCount}</p>

            <div itemScope itemType="https://schema.org/ItemList">
              <meta itemProp="numberOfItems" content={String(totalCount)} />

              {articles.map((article, index) => {
                const title = getLocalizedText(article.title, locale);
                const summary = getLocalizedText(article.summary, locale);

                return (
                  <article
                    key={article.id}
                    itemScope
                    itemType="https://schema.org/NewsArticle"
                    itemProp="itemListElement"
                  >
                    <meta itemProp="position" content={String(index + 1)} />

                    <header>
                      <h3 itemProp="headline">{title}</h3>
                      <time
                        itemProp="datePublished"
                        dateTime={article.created_at}
                      >
                        {t('publishedOn')}: {formatDate(article.created_at, locale)}
                      </time>
                      {article.category && (
                        <span itemProp="articleSection">{article.category}</span>
                      )}
                    </header>

                    <p itemProp="description">{summary}</p>

                    {article.image_url && (
                      <meta itemProp="image" content={article.image_url} />
                    )}

                    <meta
                      itemProp="url"
                      content={`https://www.oddsflow.ai${buildNewsUrl(article as any, locale)}`}
                    />

                    <span itemProp="author" itemScope itemType="https://schema.org/Organization">
                      <meta itemProp="name" content="OddsFlow" />
                    </span>

                    <span itemProp="publisher" itemScope itemType="https://schema.org/Organization">
                      <meta itemProp="name" content="OddsFlow" />
                      <meta itemProp="url" content="https://www.oddsflow.ai" />
                    </span>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Footer */}
          <footer>
            <p>
              OddsFlow News - Football news and AI betting insights.
              Showing {articles.length} of {totalCount} articles.
            </p>
          </footer>
        </main>
      </div>

      {/*
        Structured Data Summary for LLMs
        This text block helps AI search engines understand the page content.
      */}
      <div className="sr-only" data-llm-summary="true">
        <pre>
{`ODDSFLOW FOOTBALL NEWS
======================
Total Articles: ${totalCount}
Latest ${articles.length} articles:

${articles.slice(0, 10).map((article, i) => {
  const title = getLocalizedText(article.title, locale);
  const summary = getLocalizedText(article.summary, locale);
  return `${i + 1}. ${title}
   Published: ${formatDate(article.created_at, locale)}
   Summary: ${summary.substring(0, 200)}...
`;
}).join('\n')}

Source: https://www.oddsflow.ai/news
Updated: ${new Date().toISOString()}`}
        </pre>
      </div>
    </>
  );
}
