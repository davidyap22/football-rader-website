import BlogClient from './BlogClient';
import { generateBlogJsonLd, blogPostsForSEO, localeToLangCode } from './blog-data';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const jsonLd = generateBlogJsonLd(locale);
  const langCode = localeToLangCode[locale] || 'EN';
  const baseUrl = 'https://www.oddsflow.ai';

  return (
    <>
      {/* JSON-LD structured data for SEO - visible to crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hidden SEO content for crawlers that don't execute JavaScript */}
      <div className="sr-only" aria-hidden="true">
        <h1>OddsFlow Blog</h1>
        <nav aria-label="Blog posts">
          <ul>
            {blogPostsForSEO.map((post) => (
              <li key={post.id}>
                <a href={locale === 'en' ? `/blog/${post.id}` : `/${locale}/blog/${post.id}`}>
                  <h2>{post.title[langCode] || post.title['EN']}</h2>
                  <p>{post.excerpt[langCode] || post.excerpt['EN']}</p>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <BlogClient locale={locale} />
    </>
  );
}
