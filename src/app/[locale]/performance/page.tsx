import { Suspense } from 'react';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getInitialPerformanceData } from '@/lib/performance-data';
import PerformanceClient from './PerformanceClient';
import { locales, type Locale } from '@/i18n/config';

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// SEO Metadata
const titles: Record<string, string> = {
  en: "AI Betting Performance | Track Record & ROI | OddsFlow",
  es: "Rendimiento de Apuestas IA | Historial y ROI | OddsFlow",
  pt: "Desempenho de Apostas IA | Historial e ROI | OddsFlow",
  de: "KI-Wetten Leistung | Erfolgsbilanz & ROI | OddsFlow",
  fr: "Performance des Paris IA | Historique & ROI | OddsFlow",
  ja: "AIベッティング実績 | トラックレコード＆ROI | OddsFlow",
  ko: "AI 베팅 성과 | 실적 및 ROI | OddsFlow",
  zh: "AI投注表现 | 业绩记录与ROI | OddsFlow",
  tw: "AI投注表現 | 業績記錄與ROI | OddsFlow",
  id: "Performa Taruhan AI | Rekam Jejak & ROI | OddsFlow",
};

const descriptions: Record<string, string> = {
  en: "Transparent AI betting results with verified track record. See total profit, win rate, and ROI across 1x2, handicap, and over/under markets. Is AI betting profitable?",
  es: "Resultados transparentes de apuestas IA con historial verificado. Ve el beneficio total, tasa de acierto y ROI en mercados 1x2, handicap y over/under.",
  pt: "Resultados transparentes de apostas IA com historial verificado. Veja lucro total, taxa de acerto e ROI nos mercados 1x2, handicap e over/under.",
  de: "Transparente KI-Wettergebnisse mit verifizierter Erfolgsbilanz. Sehen Sie Gesamtgewinn, Gewinnrate und ROI in 1x2-, Handicap- und Over/Under-Märkten.",
  fr: "Résultats transparents des paris IA avec historique vérifié. Consultez le profit total, le taux de réussite et le ROI sur les marchés 1x2, handicap et over/under.",
  ja: "検証済みトラックレコードによる透明なAIベッティング結果。1x2、ハンディキャップ、オーバー/アンダー市場での総利益、勝率、ROIをご覧ください。",
  ko: "검증된 실적을 통한 투명한 AI 베팅 결과. 1x2, 핸디캡, 오버/언더 시장에서의 총 수익, 승률, ROI를 확인하세요.",
  zh: "透明的AI投注结果，具有经过验证的业绩记录。查看1x2、亚盘和大小球市场的总利润、胜率和ROI。",
  tw: "透明的AI投注結果，具有經過驗證的業績記錄。查看1x2、亞盤和大小球市場的總利潤、勝率和ROI。",
  id: "Hasil taruhan AI transparan dengan rekam jejak terverifikasi. Lihat total keuntungan, tingkat kemenangan, dan ROI di pasar 1x2, handicap, dan over/under.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://www.oddsflow.ai';

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: locale === 'en' ? `${baseUrl}/performance` : `${baseUrl}/${locale}/performance`,
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      type: 'website',
      url: locale === 'en' ? `${baseUrl}/performance` : `${baseUrl}/${locale}/performance`,
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
    <Suspense fallback={<LoadingFallback />}>
      <PerformanceClient
        locale={locale}
        initialStats={initialData.stats}
        initialChartData={initialData.chartData}
        initialMatches={initialMatches}
        initialTotalMatchCount={initialData.totalMatchCount}
      />
    </Suspense>
  );
}
