// JSON-LD Structured Data Components for SEO

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OddsFlow',
    url: 'https://oddsflow.ai',
    logo: 'https://oddsflow.ai/homepage/OddsFlow Logo2.png',
    description: 'AI-powered football prediction platform providing accurate betting tips for Premier League, Bundesliga, Serie A, La Liga and more.',
    foundingDate: '2024',
    sameAs: [
      // Add social media URLs when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: 'https://oddsflow.ai/contact',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OddsFlow',
    url: 'https://oddsflow.ai',
    description: 'Most accurate AI football predictor for European leagues.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://oddsflow.ai/leagues?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function SoftwareApplicationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'OddsFlow',
    applicationCategory: 'SportsApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free trial available',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  author,
  datePublished,
  dateModified,
  url,
  image,
}: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'OddsFlow',
      logo: {
        '@type': 'ImageObject',
        url: 'https://oddsflow.ai/homepage/OddsFlow Logo2.png',
      },
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: image || 'https://oddsflow.ai/homepage/OddsFlow Logo2.png',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function SportsEventJsonLd({
  name,
  homeTeam,
  awayTeam,
  startDate,
  location,
  url,
}: {
  name: string;
  homeTeam: string;
  awayTeam: string;
  startDate: string;
  location?: string;
  url: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: name,
    startDate: startDate,
    location: location
      ? {
          '@type': 'Place',
          name: location,
        }
      : undefined,
    homeTeam: {
      '@type': 'SportsTeam',
      name: homeTeam,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: awayTeam,
    },
    url: url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function PerformanceDatasetJsonLd({
  totalProfit,
  winRate,
  totalBets,
  roi,
  dateModified,
}: {
  totalProfit: number;
  winRate: number;
  totalBets: number;
  roi: number;
  dateModified?: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'OddsFlow AI Football Prediction Performance Data',
    description: `Historical performance data for AI football predictions including win rate (${winRate.toFixed(1)}%), total profit ($${totalProfit.toFixed(0)}), ROI (${roi.toFixed(1)}%), and ${totalBets} total bets across Premier League, La Liga, Bundesliga, Serie A, and Ligue 1.`,
    url: 'https://www.oddsflow.ai/performance',
    keywords: [
      'AI football predictions',
      'betting performance',
      'prediction accuracy',
      'ROI analysis',
      'win rate statistics',
    ],
    creator: {
      '@type': 'Organization',
      name: 'OddsFlow',
      url: 'https://www.oddsflow.ai',
    },
    publisher: {
      '@type': 'Organization',
      name: 'OddsFlow',
      url: 'https://www.oddsflow.ai',
    },
    dateModified: dateModified || new Date().toISOString(),
    license: 'https://www.oddsflow.ai/terms-of-service',
    temporalCoverage: '2024/..',
    spatialCoverage: 'Europe',
    variableMeasured: [
      {
        '@type': 'PropertyValue',
        name: 'Win Rate',
        value: `${winRate.toFixed(1)}%`,
        description: 'Percentage of winning predictions',
      },
      {
        '@type': 'PropertyValue',
        name: 'Total Profit',
        value: `$${totalProfit.toFixed(0)}`,
        description: 'Total profit in USD',
      },
      {
        '@type': 'PropertyValue',
        name: 'ROI',
        value: `${roi.toFixed(1)}%`,
        description: 'Return on Investment percentage',
      },
      {
        '@type': 'PropertyValue',
        name: 'Total Bets',
        value: totalBets,
        description: 'Total number of predictions made',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
