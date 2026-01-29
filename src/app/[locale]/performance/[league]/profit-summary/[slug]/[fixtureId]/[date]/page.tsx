import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProfitSummaryClient from './ProfitSummaryClient';
import VerificationMetadata from '../../../../../VerificationMetadata';

interface PageProps {
  params: Promise<{
    locale: string;
    league: string;
    slug: string;
    fixtureId: string;
    date: string;
  }>;
}

// SEO translations for all locales
const SEO_TEMPLATES: Record<string, {
  titleTemplate: (home: string, away: string, homeScore: number | null, awayScore: number | null, league: string) => string;
  descriptionTemplate: (home: string, away: string, homeScore: number | null, awayScore: number | null, league: string, date: string) => string;
}> = {
  en: {
    titleTemplate: (home, away, homeScore, awayScore, league) =>
      `${home} ${homeScore ?? ''}-${awayScore ?? ''} ${away} Betting Analysis | Odds Movement & Predictions | ${league}`,
    descriptionTemplate: (home, away, homeScore, awayScore, league, date) =>
      `Complete betting analysis of ${home} vs ${away} (${homeScore ?? '?'}-${awayScore ?? '?'}). Track live odds movement, Asian Handicap trends, and AI prediction performance. ${league} ${date}.`
  },
  es: {
    titleTemplate: (home, away, homeScore, awayScore, league) =>
      `${home} ${homeScore ?? ''}-${awayScore ?? ''} ${away} Análisis de Cuotas | Pronósticos | ${league}`,
    descriptionTemplate: (home, away, homeScore, awayScore, league, date) =>
      `Análisis completo de apuestas ${home} vs ${away} (${homeScore ?? '?'}-${awayScore ?? '?'}). Movimiento de cuotas en vivo, Hándicap Asiático y predicciones IA. ${league} ${date}.`
  },
  pt: {
    titleTemplate: (home, away, homeScore, awayScore, league) =>
      `${home} ${homeScore ?? ''}-${awayScore ?? ''} ${away} Análise de Odds | Previsões | ${league}`,
    descriptionTemplate: (home, away, homeScore, awayScore, league, date) =>
      `Análise completa de apostas ${home} vs ${away} (${homeScore ?? '?'}-${awayScore ?? '?'}). Movimento de odds ao vivo, Handicap Asiático e previsões IA. ${league} ${date}.`
  },
  de: {
    titleTemplate: (home, away, homeScore, awayScore, league) =>
      `${home} ${homeScore ?? ''}-${awayScore ?? ''} ${away} Wettanalyse | Quotenbewegung | ${league}`,
    descriptionTemplate: (home, away, homeScore, awayScore, league, date) =>
      `Vollständige Wettanalyse ${home} vs ${away} (${homeScore ?? '?'}-${awayScore ?? '?'}). Live-Quotenbewegungen, Asian Handicap und KI-Vorhersagen. ${league} ${date}.`
  },
  fr: {
    titleTemplate: (home, away, homeScore, awayScore, league) =>
      `${home} ${homeScore ?? ''}-${awayScore ?? ''} ${away} Analyse des Cotes | Prédictions | ${league}`,
    descriptionTemplate: (home, away, homeScore, awayScore, league, date) =>
      `Analyse complète des paris ${home} vs ${away} (${homeScore ?? '?'}-${awayScore ?? '?'}). Mouvement des cotes en direct, Handicap Asiatique et prédictions IA. ${league} ${date}.`
  },
  ja: {
    titleTemplate: (home, away, homeScore, awayScore, league) =>
      `${home} ${homeScore ?? ''}-${awayScore ?? ''} ${away} オッズ分析｜賭け予想｜${league}`,
    descriptionTemplate: (home, away, homeScore, awayScore, league, date) =>
      `${home} vs ${away}（${homeScore ?? '?'}-${awayScore ?? '?'}）の完全なベッティング分析。ライブオッズ変動、アジアンハンディキャップ、AI予測。${league} ${date}。`
  },
  ko: {
    titleTemplate: (home, away, homeScore, awayScore, league) =>
      `${home} ${homeScore ?? ''}-${awayScore ?? ''} ${away} 배당 분석｜예측｜${league}`,
    descriptionTemplate: (home, away, homeScore, awayScore, league, date) =>
      `${home} vs ${away}(${homeScore ?? '?'}-${awayScore ?? '?'}) 완전한 베팅 분석. 라이브 배당 변동, 아시안 핸디캡, AI 예측. ${league} ${date}.`
  },
  zh: {
    titleTemplate: (home, away, homeScore, awayScore, league) =>
      `${home} ${homeScore ?? ''}-${awayScore ?? ''} ${away} 赔率分析｜AI预测｜${league}`,
    descriptionTemplate: (home, away, homeScore, awayScore, league, date) =>
      `${home} vs ${away}（${homeScore ?? '?'}-${awayScore ?? '?'}）完整投注分析。实时赔率变动、亚盘走势、AI预测。${league} ${date}。`
  },
  tw: {
    titleTemplate: (home, away, homeScore, awayScore, league) =>
      `${home} ${homeScore ?? ''}-${awayScore ?? ''} ${away} 賠率分析｜AI預測｜${league}`,
    descriptionTemplate: (home, away, homeScore, awayScore, league, date) =>
      `${home} vs ${away}（${homeScore ?? '?'}-${awayScore ?? '?'}）完整投注分析。即時賠率變動、亞盤走勢、AI預測。${league} ${date}。`
  },
  id: {
    titleTemplate: (home, away, homeScore, awayScore, league) =>
      `${home} ${homeScore ?? ''}-${awayScore ?? ''} ${away} Analisis Odds | Prediksi | ${league}`,
    descriptionTemplate: (home, away, homeScore, awayScore, league, date) =>
      `Analisis lengkap taruhan ${home} vs ${away} (${homeScore ?? '?'}-${awayScore ?? '?'}). Pergerakan odds live, Asian Handicap, prediksi AI. ${league} ${date}.`
  }
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, league, slug, fixtureId, date } = await params;

  // Fetch real match data from database
  const { data: fixtureData } = await supabase
    .from('prematches')
    .select('home_name, away_name, goals_home, goals_away, league_name')
    .eq('fixture_id', parseInt(fixtureId))
    .single();

  // Fallback to slug if no data
  const teamNames = slug.replace(/-vs-/g, ' vs ').split(' vs ').map(name =>
    name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  );

  const homeTeam = fixtureData?.home_name || teamNames[0] || 'Home';
  const awayTeam = fixtureData?.away_name || teamNames[1] || 'Away';
  const homeScore = fixtureData?.goals_home ?? null;
  const awayScore = fixtureData?.goals_away ?? null;
  const leagueName = fixtureData?.league_name || league.replace(/-/g, ' ');

  // Get locale-specific SEO template
  const template = SEO_TEMPLATES[locale] || SEO_TEMPLATES.en;
  const title = template.titleTemplate(homeTeam, awayTeam, homeScore, awayScore, leagueName);
  const description = template.descriptionTemplate(homeTeam, awayTeam, homeScore, awayScore, leagueName, date);

  return {
    title,
    description,
    keywords: [
      `${homeTeam} ${awayTeam}`,
      'betting analysis',
      'odds movement',
      'Asian Handicap',
      leagueName,
      'AI predictions',
      'ROI'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'OddsFlow',
      url: `https://oddsflow.ai/${locale}/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://oddsflow.ai/${locale}/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
      languages: {
        'en': `https://oddsflow.ai/en/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
        'es': `https://oddsflow.ai/es/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
        'pt': `https://oddsflow.ai/pt/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
        'de': `https://oddsflow.ai/de/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
        'fr': `https://oddsflow.ai/fr/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
        'ja': `https://oddsflow.ai/ja/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
        'ko': `https://oddsflow.ai/ko/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
        'zh-CN': `https://oddsflow.ai/zh/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
        'zh-TW': `https://oddsflow.ai/tw/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
        'id': `https://oddsflow.ai/id/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
        'x-default': `https://oddsflow.ai/performance/${league}/profit-summary/${slug}/${fixtureId}/${date}`,
      }
    }
  };
}

export default async function ProfitSummaryPage({ params }: PageProps) {
  const { locale, league, slug, fixtureId, date } = await params;

  // Fetch match data
  let matchData = null;
  let betRecords: any[] = [];
  let oddsHistory: any[] = [];
  let teamTranslations: Record<string, any> = {};
  let leagueTranslations: Record<string, any> = {};

  try {
    // Fetch fixture info from prematches table
    const { data: fixtureData } = await supabase
      .from('prematches')
      .select('fixture_id, league_name, league_logo, home_name, home_logo, away_name, away_logo, goals_home, goals_away, start_date_msia')
      .eq('fixture_id', parseInt(fixtureId))
      .single();

    if (fixtureData) {
      matchData = fixtureData;
      console.log('Match Data:', {
        fixture_id: fixtureData.fixture_id,
        home_name: fixtureData.home_name,
        away_name: fixtureData.away_name,
        goals_home: fixtureData.goals_home,
        goals_away: fixtureData.goals_away,
      });

      // Fetch team translations
      const { data: teamData } = await supabase
        .from('team_statistics')
        .select('team_name, team_name_language')
        .in('team_name', [fixtureData.home_name, fixtureData.away_name]);

      if (teamData) {
        teamData.forEach((team: any) => {
          teamTranslations[team.team_name] = team.team_name_language;
        });
      }

      // Fetch league translation
      const { data: leagueData } = await supabase
        .from('league_statistics')
        .select('league_name, league_name_language')
        .eq('league_name', fixtureData.league_name)
        .single();

      if (leagueData) {
        leagueTranslations[leagueData.league_name] = leagueData.league_name_language;
      }
    } else {
      console.log('No fixture data found for fixture_id:', fixtureId);
    }

    // Fetch all bet records for this fixture from profit_summary
    const { data: profitData } = await supabase
      .from('profit_summary')
      .select('*')
      .eq('fixture_id', fixtureId)
      .order('clock', { ascending: true });

    // Fetch Oddsflow Beta v8 bets from live_bets_v8 table
    const { data: liveBetsV8 } = await supabase
      .from('live_bets_v8')
      .select('*')
      .eq('fixture_id', parseInt(fixtureId))
      .order('minute_at_bet', { ascending: true });

    console.log('[page.tsx] live_bets_v8 query returned', liveBetsV8?.length || 0, 'records');

    // Convert live_bets_v8 to profit_summary format
    const convertedLiveBets = (liveBetsV8 || []).map((bet: any) => ({
      fixture_id: bet.fixture_id,
      bet_style: 'Oddsflow Beta v8',
      profit: bet.profit_loss || 0,
      stake_money: bet.stake || 0,
      selection: bet.selection || '',
      type: bet.bet_type || '',
      clock: bet.minute_at_bet ? `${bet.minute_at_bet}'` : '0\'',
      odds: bet.odds || 0,
      line: bet.line || 0,
      status: bet.status || 'PENDING',
      score_home_at_bet: bet.score_home_at_bet,
      score_away_at_bet: bet.score_away_at_bet,
      signal_id: bet.signal_id,
      created_at: bet.created_at,
      settled_at: bet.settled_at,
      expected_value: bet.expected_value,
      calculated_probability: bet.calculated_probability
    }));

    console.log('[page.tsx] Converted', convertedLiveBets.length, 'live_bets_v8 to profit_summary format');

    // Merge both data sources
    betRecords = [...(profitData || []), ...convertedLiveBets];

    if (betRecords.length > 0) {
      // Debug: log unique bet_style values
      const uniqueBetStyles = [...new Set(betRecords.map((r: any) => r.bet_style))];
      console.log('[page.tsx] Total bet records:', betRecords.length);
      console.log('[page.tsx] Unique bet_style values:', uniqueBetStyles);
      console.log('[page.tsx] Breakdown:');
      uniqueBetStyles.forEach(style => {
        const count = betRecords.filter(r => r.bet_style === style).length;
        const profit = betRecords.filter(r => r.bet_style === style).reduce((sum, r) => sum + (r.profit || 0), 0);
        console.log(`  - ${style}: ${count} bets, $${profit.toFixed(2)} profit`);
      });
    } else {
      console.log('[page.tsx] No bet records found for fixture_id:', fixtureId);
    }

    // Fetch odds history for Live bookmaker
    const { data: oddsData, error: oddsError } = await supabase
      .from('odds_history')
      .select('*')
      .eq('fixture_id', parseInt(fixtureId))
      .eq('bookmaker', 'Live')
      .order('created_at', { ascending: true });

    console.log('Odds History Query:', {
      fixture_id: fixtureId,
      data_count: oddsData?.length || 0,
      error: oddsError
    });

    if (oddsData && oddsData.length > 0) {
      oddsHistory = oddsData;
      console.log('Odds History Data:', oddsData.length, 'records');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  // Convert slug to team names for display
  const teamNames = slug.replace(/-vs-/g, ' vs ').split(' vs ').map(name =>
    name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  );
  const homeTeam = matchData?.home_name || teamNames[0] || 'Home';
  const awayTeam = matchData?.away_name || teamNames[1] || 'Away';

  // Calculate best performing model ROI
  const modelPerformance: Record<string, { profit: number; invested: number }> = {};
  betRecords.forEach((record: any) => {
    const style = record.bet_style || 'Unknown';
    if (!modelPerformance[style]) {
      modelPerformance[style] = { profit: 0, invested: 0 };
    }
    modelPerformance[style].profit += record.profit || 0;
    modelPerformance[style].invested += record.stake_money || 0;
  });

  let bestModel = { name: 'AI Model', roi: 0 };
  Object.entries(modelPerformance).forEach(([name, data]) => {
    if (data.invested > 0) {
      const roi = (data.profit / data.invested) * 100;
      if (roi > bestModel.roi) {
        bestModel = { name, roi };
      }
    }
  });

  // Generate Schema Markup (JSON-LD)
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": `${homeTeam} vs ${awayTeam}`,
    "description": `${matchData?.league_name || league} match between ${homeTeam} and ${awayTeam} with complete betting odds analysis and AI prediction performance tracking`,
    "sport": "Soccer",
    "startDate": matchData?.start_date_msia || date,
    "location": {
      "@type": "Place",
      "name": "Stadium",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": homeTeam,
        "addressCountry": matchData?.league_name?.includes('Serie A') ? 'IT' :
                         matchData?.league_name?.includes('La Liga') ? 'ES' :
                         matchData?.league_name?.includes('Premier League') ? 'GB' :
                         matchData?.league_name?.includes('Bundesliga') ? 'DE' :
                         matchData?.league_name?.includes('Ligue 1') ? 'FR' : 'Unknown'
      }
    },
    "homeTeam": {
      "@type": "SportsTeam",
      "name": homeTeam,
      "sport": "Soccer"
    },
    "awayTeam": {
      "@type": "SportsTeam",
      "name": awayTeam,
      "sport": "Soccer"
    },
    "competitor": [
      { "@type": "SportsTeam", "name": homeTeam },
      { "@type": "SportsTeam", "name": awayTeam }
    ],
    "eventStatus": "https://schema.org/EventScheduled",
    "organizer": {
      "@type": "SportsOrganization",
      "name": matchData?.league_name || league.replace(/-/g, ' ')
    },
    "mentions": [
      {
        "@type": "Dataset",
        "name": "Live Betting Odds Data",
        "description": "Real-time odds movement tracking for 1X2 Moneyline, Asian Handicap, and Over/Under markets",
        "keywords": ["betting odds", "Asian Handicap", "live odds", "odds movement"],
        "temporalCoverage": date
      },
      {
        "@type": "AnalysisNewsArticle",
        "headline": "AI Prediction Model Performance Analysis",
        "description": `${bestModel.name} betting model achieved ${bestModel.roi > 0 ? '+' : ''}${bestModel.roi.toFixed(2)}% ROI on this match with detailed bet-by-bet tracking`,
        "datePublished": date,
        "author": {
          "@type": "Organization",
          "name": "OddsFlow",
          "url": "https://oddsflow.ai"
        }
      }
    ],
    "about": [
      { "@type": "Thing", "name": "Asian Handicap Betting" },
      { "@type": "Thing", "name": "1X2 Moneyline Betting" },
      { "@type": "Thing", "name": "Over/Under Betting" }
    ]
  };

  return (
    <>
      {/* Official Verification Hub - Schema and visible text for AI crawlers */}
      <VerificationMetadata />

      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaMarkup)
        }}
      />

      <ProfitSummaryClient
        locale={locale}
        league={league}
        fixtureId={fixtureId}
        date={date}
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        homeLogo={matchData?.home_logo}
        awayLogo={matchData?.away_logo}
        homeScore={matchData?.goals_home}
        awayScore={matchData?.goals_away}
        leagueName={matchData?.league_name || league.replace(/-/g, ' ')}
        leagueLogo={matchData?.league_logo}
        betRecords={betRecords}
        oddsHistory={oddsHistory}
        matchStartTime={matchData?.start_date_msia}
        teamTranslations={teamTranslations}
        leagueTranslations={leagueTranslations}
      />
    </>
  );
}
