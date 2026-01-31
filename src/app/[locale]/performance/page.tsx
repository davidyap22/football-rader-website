import { Suspense } from 'react';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getInitialPerformanceData } from '@/lib/performance-data';
import PerformanceClient from './PerformanceClient';
import PerformanceSSR from './PerformanceSSR';
import { locales, type Locale } from '@/i18n/config';
import { PerformanceDatasetJsonLd } from '@/components/JsonLd';
import VerificationMetadata from './VerificationMetadata';

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// SEO Metadata - Optimized for transparency and trust signals
const currentYear = new Date().getFullYear();

const titles: Record<string, string> = {
  en: `AI Football Prediction Performance & Verified ROI Records | OddsFlow`,
  es: `Rendimiento de Predicciones IA & Registros ROI Verificados | OddsFlow`,
  pt: `Performance de Previsões IA & Registros ROI Verificados | OddsFlow`,
  de: `KI-Fußballvorhersage Leistung & Verifizierte ROI-Aufzeichnungen | OddsFlow`,
  fr: `Performance des Prédictions IA & Historique ROI Vérifié | OddsFlow`,
  ja: `AI サッカー予測パフォーマンス & 検証済み ROI 記録 | OddsFlow`,
  ko: `AI 축구 예측 성능 & 검증된 ROI 기록 | OddsFlow`,
  zh: `AI 足球预测历史战绩与 ROI 分析（真实可查）| OddsFlow`,
  tw: `AI 足球預測歷史戰績與 ROI 分析（真實可查）| OddsFlow`,
  id: `Performa Prediksi Sepak Bola AI & Catatan ROI Terverifikasi | OddsFlow`,
};

// Descriptions emphasizing transparency, verification, and data volume
const baseDescriptions: Record<string, string> = {
  en: "Real-time verification of AI betting model performance. Track 11,000+ analyzed matches with transparent profit history, win rates, and cumulative ROI charts. Data-driven football predictions with full accountability.",
  es: "Verificación en tiempo real del rendimiento de modelos IA de apuestas. Seguimiento de 11,000+ partidos analizados con historial de ganancias transparente, tasas de victoria y gráficos ROI acumulativos. Predicciones basadas en datos con responsabilidad total.",
  pt: "Verificação em tempo real do desempenho de modelos IA de apostas. Acompanhamento de 11,000+ partidas analisadas com histórico de lucros transparente, taxas de vitória e gráficos ROI cumulativos. Previsões baseadas em dados com total responsabilidade.",
  de: "Echtzeit-Verifizierung der KI-Wettmodell-Leistung. Verfolgung von 11,000+ analysierten Spielen mit transparentem Gewinnverlauf, Gewinnraten und kumulativen ROI-Diagrammen. Datengesteuerte Fußballvorhersagen mit voller Rechenschaftspflicht.",
  fr: "Vérification en temps réel de la performance des modèles IA de paris. Suivi de 11,000+ matchs analysés avec historique de profits transparent, taux de victoire et graphiques ROI cumulatifs. Prédictions basées sur les données avec responsabilité totale.",
  ja: "AI ベッティングモデルのパフォーマンスをリアルタイム検証。11,000+ 試合の分析データ、透明な利益履歴、勝率、累積 ROI チャートを追跡。完全な説明責任を持つデータ駆動型サッカー予測。",
  ko: "AI 베팅 모델 성능의 실시간 검증. 11,000+ 분석된 경기, 투명한 수익 이력, 승률 및 누적 ROI 차트 추적. 완전한 책임성을 갖춘 데이터 기반 축구 예측.",
  zh: "AI 投注模型实时验证。追踪 11,000+ 场比赛分析数据，透明盈利记录、胜率和累计 ROI 曲线图。基于数据的足球预测，完全可追溯。",
  tw: "AI 投注模型即時驗證。追蹤 11,000+ 場比賽分析數據，透明盈利記錄、勝率和累計 ROI 曲線圖。基於數據的足球預測，完全可追溯。",
  id: "Verifikasi real-time performa model taruhan AI. Lacak 11,000+ pertandingan yang dianalisis dengan riwayat profit transparan, win rate, dan grafik ROI kumulatif. Prediksi sepak bola berbasis data dengan akuntabilitas penuh.",
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
      'betting data analytics',
      'sports prediction algorithm',
      'AI model performance tracking',
      'cumulative profit analysis',
    ],
    alternates: {
      canonical: locale === 'en' ? `${baseUrl}/performance` : `${baseUrl}/${locale}/performance`,
      languages: {
        'en': `${baseUrl}/en/performance`,
        'es': `${baseUrl}/es/performance`,
        'pt': `${baseUrl}/pt/performance`,
        'de': `${baseUrl}/de/performance`,
        'fr': `${baseUrl}/fr/performance`,
        'ja': `${baseUrl}/ja/performance`,
        'ko': `${baseUrl}/ko/performance`,
        'zh-CN': `${baseUrl}/zh/performance`,
        'zh-TW': `${baseUrl}/tw/performance`,
        'id': `${baseUrl}/id/performance`,
        'x-default': `${baseUrl}/performance`,
      }
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
      {/* Official Verification Hub - Schema and visible text for AI crawlers */}
      <VerificationMetadata />

      {/* Dataset Schema for SEO - helps Google Dataset Search */}
      {initialData.stats && (
        <PerformanceDatasetJsonLd
          totalProfit={initialData.stats.total_profit}
          winRate={initialData.stats.win_rate}
          totalBets={initialData.stats.total_bets}
          roi={initialData.stats.roi}
        />
      )}

      {/* SSR Content - Rendered on server, visible to crawlers but hidden from users */}
      <PerformanceSSR
        locale={locale}
        stats={initialData.stats}
        matches={initialMatches}
        totalMatchCount={initialData.totalMatchCount}
      />

      {/* Client Component - Interactive UI for users */}
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
