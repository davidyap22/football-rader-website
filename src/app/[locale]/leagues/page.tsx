import { Suspense } from 'react';
import LeaguesClient from './LeaguesClient';
import { getInitialLeaguesData, LEAGUES_CONFIG } from '@/lib/leagues-data';

// Loading fallback component
function LeaguesLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-gray-400">Loading leagues...</p>
      </div>
    </div>
  );
}

// Schema.org ItemList component for SEO
function LeaguesListJsonLd({ locale }: { locale: string }) {
  const basePath = locale === 'en' ? '' : `/${locale}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Football League Predictions Hub",
    "description": "AI-powered predictions and statistics for all major European football leagues including Premier League, Bundesliga, Serie A, La Liga, Ligue 1, and Champions League.",
    "url": `https://www.oddsflow.ai${basePath}/leagues`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "European Football Leagues",
      "description": "Browse AI predictions for top football leagues worldwide",
      "numberOfItems": LEAGUES_CONFIG.length,
      "itemListElement": LEAGUES_CONFIG.map((league, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SportsOrganization",
          "name": league.name,
          "sport": "Football",
          "url": `https://www.oddsflow.ai${basePath}/leagues/${league.slug}`,
          "logo": league.logo,
          "location": {
            "@type": "Place",
            "name": league.country
          }
        }
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

export default async function LeaguesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch initial data on the server for SEO
  const initialData = await getInitialLeaguesData();

  return (
    <>
      {/* Schema.org structured data for SEO */}
      <LeaguesListJsonLd locale={locale} />

      <Suspense fallback={<LeaguesLoading />}>
        <LeaguesClient
          initialLeagueStats={initialData.leagueStats}
          leagues={initialData.leagues}
        />
      </Suspense>
    </>
  );
}
