import { Suspense } from 'react';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getInitialPerformanceData } from '@/lib/performance-data';
import PerformanceClient from './PerformanceClient';
import { locales, type Locale } from '@/i18n/config';
import { PerformanceDatasetJsonLd } from '@/components/JsonLd';

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// SEO Metadata - Optimized with year, keywords, and compelling copy
const currentYear = new Date().getFullYear();

const titles: Record<string, string> = {
  en: `AI Football Prediction Performance & Track Record (${currentYear}) | OddsFlow`,
  es: `Rendimiento de Predicciones de Fútbol IA y Historial (${currentYear}) | OddsFlow`,
  pt: `Desempenho de Previsões de Futebol IA e Histórico (${currentYear}) | OddsFlow`,
  de: `KI-Fußballvorhersage Leistung & Erfolgsbilanz (${currentYear}) | OddsFlow`,
  fr: `Performance des Prédictions Football IA & Historique (${currentYear}) | OddsFlow`,
  ja: `AIサッカー予測の実績とトラックレコード (${currentYear}) | OddsFlow`,
  ko: `AI 축구 예측 성과 및 실적 (${currentYear}) | OddsFlow`,
  zh: `AI足球预测表现与业绩记录 (${currentYear}) | OddsFlow`,
  tw: `AI足球預測表現與業績記錄 (${currentYear}) | OddsFlow`,
  id: `Performa Prediksi Sepak Bola AI & Rekam Jejak (${currentYear}) | OddsFlow`,
};

// Dynamic descriptions will be generated in generateMetadata with actual stats
const baseDescriptions: Record<string, string> = {
  en: "View OddsFlow's verified AI football betting performance. Real-time track record with detailed ROI analysis for Premier League, La Liga, Bundesliga, Serie A, and Ligue 1.",
  es: "Ve el rendimiento verificado de apuestas de fútbol IA de OddsFlow. Historial en tiempo real con análisis detallado de ROI para La Liga, Premier League, Bundesliga y más.",
  pt: "Veja o desempenho verificado de apostas de futebol IA do OddsFlow. Histórico em tempo real com análise detalhada de ROI para Premier League, La Liga, Bundesliga e mais.",
  de: "Sehen Sie die verifizierte KI-Fußballwetten-Leistung von OddsFlow. Echtzeit-Erfolgsbilanz mit detaillierter ROI-Analyse für Bundesliga, Premier League, La Liga und mehr.",
  fr: "Consultez les performances vérifiées des paris football IA d'OddsFlow. Historique en temps réel avec analyse ROI détaillée pour Ligue 1, Premier League, La Liga et plus.",
  ja: "OddsFlowの検証済みAIサッカーベッティング実績をご覧ください。プレミアリーグ、ラ・リーガ、ブンデスリーガなどの詳細なROI分析付きリアルタイムトラックレコード。",
  ko: "OddsFlow의 검증된 AI 축구 베팅 성과를 확인하세요. 프리미어리그, 라리가, 분데스리가 등의 상세 ROI 분석이 포함된 실시간 실적.",
  zh: "查看OddsFlow经过验证的AI足球投注表现。包含英超、西甲、德甲、意甲、法甲详细ROI分析的实时业绩记录。",
  tw: "查看OddsFlow經過驗證的AI足球投注表現。包含英超、西甲、德甲、意甲、法甲詳細ROI分析的實時業績記錄。",
  id: "Lihat performa taruhan sepak bola AI OddsFlow yang terverifikasi. Rekam jejak real-time dengan analisis ROI terperinci untuk Premier League, La Liga, Bundesliga, dan lainnya.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://www.oddsflow.ai';

  // Fetch stats for dynamic description (cached)
  const { getPerformanceStats } = await import('@/lib/performance-data');
  const stats = await getPerformanceStats(null);

  // Generate dynamic description with actual stats
  let description = baseDescriptions[locale] || baseDescriptions.en;
  if (stats && stats.win_rate > 0) {
    const winRateStr = stats.win_rate.toFixed(1);
    const profitStr = stats.total_profit > 0 ? `+$${stats.total_profit.toFixed(0)}` : `$${stats.total_profit.toFixed(0)}`;

    // Prepend stats to description for English
    if (locale === 'en') {
      description = `${winRateStr}% win rate, ${profitStr} profit. ${description}`;
    } else {
      description = `${winRateStr}% | ${profitStr} | ${description}`;
    }
  }

  return {
    title: titles[locale] || titles.en,
    description,
    keywords: [
      'AI football predictions',
      'football betting performance',
      'AI betting track record',
      'football prediction accuracy',
      'betting ROI analysis',
      'Premier League predictions',
      'La Liga predictions',
      'Bundesliga predictions',
      'Serie A predictions',
      'Ligue 1 predictions',
      'verified betting results',
      'AI sports betting',
    ],
    alternates: {
      canonical: locale === 'en' ? `${baseUrl}/performance` : `${baseUrl}/${locale}/performance`,
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description,
      type: 'website',
      url: locale === 'en' ? `${baseUrl}/performance` : `${baseUrl}/${locale}/performance`,
      images: [
        {
          url: '/homepage/OddsFlow Logo2.png',
          width: 1200,
          height: 630,
          alt: 'OddsFlow AI Football Prediction Performance',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.en,
      description,
      images: ['/homepage/OddsFlow Logo2.png'],
    },
  };
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading performance data...</p>
      </div>
    </div>
  );
}

export default async function PerformancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    return <LoadingFallback />;
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch initial data server-side with caching
  const initialData = await getInitialPerformanceData(null);

  // Convert matches to the expected format
  const initialMatches = initialData.matches.map(m => ({
    fixture_id: m.fixture_id,
    league_name: m.league_name,
    league_logo: m.league_logo,
    home_name: m.home_name,
    home_logo: m.home_logo,
    away_name: m.away_name,
    away_logo: m.away_logo,
    home_score: m.home_score,
    away_score: m.away_score,
    total_profit: m.total_profit,
    total_invested: m.total_invested,
    roi_percentage: m.roi_percentage,
    total_bets: m.total_bets,
    profit_moneyline: m.profit_moneyline,
    profit_handicap: m.profit_handicap,
    profit_ou: m.profit_ou,
    match_date: m.match_date,
  }));

  return (
    <>
      {/* Dataset Schema for SEO - helps Google Dataset Search */}
      {initialData.stats && (
        <PerformanceDatasetJsonLd
          totalProfit={initialData.stats.total_profit}
          winRate={initialData.stats.win_rate}
          totalBets={initialData.stats.total_bets}
          roi={initialData.stats.roi}
        />
      )}
      <Suspense fallback={<LoadingFallback />}>
        <PerformanceClient
          locale={locale}
          initialStats={initialData.stats}
          initialChartData={initialData.chartData}
          initialMatches={initialMatches}
          initialTotalMatchCount={initialData.totalMatchCount}
        />
      </Suspense>
    </>
  );
}
