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
      'https://www.youtube.com/channel/UCwG9DWzF87_RZcGXN5Vk9Fg',
      'https://x.com/Oddsflow_Nat',
      'https://www.facebook.com/profile.php?id=61584728786578',
      'https://www.tiktok.com/@oddsflow2',
      'https://t.me/oddsflowai',
      'https://www.reddit.com/user/Relative-Airport1274/',
      'https://www.instagram.com/oddsflow.ai/',
      'https://github.com/oddsflowai-team/oddsflow-ai-football-value-signals',
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

// ItemList of SportsEvents for predictions list page
export function SportsEventsListJsonLd({
  events,
  listName,
  listDescription,
}: {
  events: {
    name: string;
    homeTeam: string;
    awayTeam: string;
    startDate: string;
    location?: string;
    url: string;
  }[];
  listName: string;
  listDescription: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: listDescription,
    numberOfItems: events.length,
    itemListElement: events.map((event, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SportsEvent',
        name: event.name,
        startDate: event.startDate,
        location: event.location
          ? {
              '@type': 'Place',
              name: event.location,
            }
          : undefined,
        homeTeam: {
          '@type': 'SportsTeam',
          name: event.homeTeam,
        },
        awayTeam: {
          '@type': 'SportsTeam',
          name: event.awayTeam,
        },
        url: event.url,
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
    name: 'OddsFlow AI Football Prediction Historical Performance Data',
    description: `Real-time performance metrics of AI football betting models including ROI, win rate, and profit charts. Verified records from 11,000+ analyzed matches across major European leagues including Premier League, La Liga, Bundesliga, Serie A, and Ligue 1.`,
    url: 'https://www.oddsflow.ai/performance',
    keywords: [
      'AI prediction accuracy',
      'betting algorithm results',
      'model backtesting',
      'verified betting records',
      'ROI analysis',
      'handicap statistics',
      'football prediction performance',
      'transparent betting history',
      'win rate analysis',
      'prediction model verification',
    ],
    creator: {
      '@type': 'Organization',
      name: 'OddsFlow',
      url: 'https://www.oddsflow.ai',
      logo: 'https://www.oddsflow.ai/homepage/OddsFlow Logo2.png',
      description: 'AI-powered football prediction platform with transparent performance tracking',
    },
    publisher: {
      '@type': 'Organization',
      name: 'OddsFlow',
      url: 'https://www.oddsflow.ai',
    },
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/html',
        contentUrl: 'https://www.oddsflow.ai/performance',
      },
    ],
    datePublished: '2024-01-01',
    dateModified: dateModified || new Date().toISOString(),
    license: 'https://www.oddsflow.ai/terms-of-service',
    temporalCoverage: '2024/..',
    spatialCoverage: {
      '@type': 'Place',
      name: 'Global Football Leagues',
      description: 'Premier League, La Liga, Serie A, Bundesliga, Ligue 1, UEFA Champions League',
    },
    variableMeasured: [
      {
        '@type': 'PropertyValue',
        name: 'ROI (Return on Investment)',
        description: 'Percentage return on investment for each AI prediction model',
        value: `${roi.toFixed(1)}%`,
        unitText: 'Percentage',
      },
      {
        '@type': 'PropertyValue',
        name: 'Total Profit',
        description: 'Cumulative profit generated by AI models',
        value: `$${totalProfit.toFixed(0)}`,
        unitText: 'USD',
      },
      {
        '@type': 'PropertyValue',
        name: 'Win Rate',
        description: 'Percentage of successful predictions',
        value: `${winRate.toFixed(1)}%`,
        unitText: 'Percentage',
      },
      {
        '@type': 'PropertyValue',
        name: 'Total Bets',
        description: 'Number of predictions made by the model',
        value: totalBets,
        unitText: 'Count',
      },
      {
        '@type': 'PropertyValue',
        name: 'Cumulative Profit Curve',
        description: 'Time-series data showing profit accumulation over time',
        unitText: 'USD',
      },
    ],
    measurementTechnique: 'Automated tracking of AI model predictions against actual match results with transparent calculation methodology',
    isAccessibleForFree: true,
    mainEntity: {
      '@type': 'WebPage',
      name: 'AI Model Performance Dashboard',
      description: 'Interactive dashboard displaying real-time performance metrics of multiple AI betting models',
    },
    about: [
      {
        '@type': 'Thing',
        name: 'HDP Sniper Model',
        description: 'Specialized AI model for Asian Handicap predictions',
      },
      {
        '@type': 'Thing',
        name: 'Active Trader Model',
        description: 'High-frequency AI model for live betting opportunities',
      },
      {
        '@type': 'Thing',
        name: 'Oddsflow Core Strategy',
        description: 'Balanced AI prediction model with conservative risk management',
      },
      {
        '@type': 'Thing',
        name: 'Oddsflow Beta',
        description: 'Experimental AI model testing new prediction algorithms',
      },
    ],
    provider: {
      '@type': 'Organization',
      name: 'OddsFlow',
      url: 'https://www.oddsflow.ai',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
