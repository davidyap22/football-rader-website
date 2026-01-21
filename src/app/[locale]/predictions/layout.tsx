import type { Metadata } from "next";

// Get current year for SEO
const currentYear = new Date().getFullYear();

// SEO-optimized titles for all 10 languages (without "| OddsFlow" - parent template adds it)
const titles: Record<string, string> = {
  en: `Football Predictions Today & AI Betting Tips (${currentYear}) - 1x2, Asian Handicap, Over/Under`,
  es: `Predicciones de Fútbol Hoy y Tips de Apuestas IA (${currentYear}) - 1x2, Hándicap Asiático, Over/Under`,
  pt: `Previsões de Futebol Hoje e Dicas de Apostas IA (${currentYear}) - 1x2, Handicap Asiático, Over/Under`,
  de: `Fußball Vorhersagen Heute & KI-Wetttipps (${currentYear}) - 1x2, Asian Handicap, Over/Under`,
  fr: `Pronostics Football Aujourd'hui & Conseils Paris IA (${currentYear}) - 1x2, Handicap Asiatique, Over/Under`,
  ja: `本日のサッカー予測とAIベッティングヒント (${currentYear}) - 1x2、アジアンハンディキャップ、オーバー/アンダー`,
  ko: `오늘의 축구 예측 및 AI 베팅 팁 (${currentYear}) - 1x2, 아시안 핸디캡, 오버/언더`,
  zh: `今日足球预测与AI投注技巧 (${currentYear}) - 1x2、亚洲盘、大小球`,
  tw: `今日足球預測與AI投注技巧 (${currentYear}) - 1x2、亞洲盤、大小球`,
  id: `Prediksi Sepak Bola Hari Ini & Tips Taruhan AI (${currentYear}) - 1x2, Asian Handicap, Over/Under`,
};

// SEO-optimized descriptions for all 10 languages
const descriptions: Record<string, string> = {
  en: "Get today's most accurate AI football predictions. Premier League 1x2 predictions, over 2.5 goals stats, Asian handicap tips & draw predictions. Best AI for football betting analysis.",
  es: "Obtén las predicciones de fútbol IA más precisas de hoy. Predicciones 1x2 de Premier League, estadísticas over 2.5 goles, tips de hándicap asiático. El mejor IA para análisis de apuestas.",
  pt: "Obtenha as previsões de futebol IA mais precisas de hoje. Previsões 1x2 da Premier League, estatísticas over 2.5 gols, dicas de handicap asiático. A melhor IA para análise de apostas.",
  de: "Erhalten Sie die genauesten KI-Fußballvorhersagen von heute. Premier League 1x2-Vorhersagen, Over 2.5 Tore Statistiken, Asian Handicap Tipps. Beste KI für Wettanalyse.",
  fr: "Obtenez les pronostics football IA les plus précis d'aujourd'hui. Pronostics 1x2 Premier League, stats over 2.5 buts, conseils handicap asiatique. Meilleure IA pour l'analyse des paris.",
  ja: "今日の最も正確なAIサッカー予測を入手。プレミアリーグ1x2予測、2.5ゴール以上の統計、アジアンハンディキャップのヒント。サッカーベッティング分析に最適なAI。",
  ko: "오늘 가장 정확한 AI 축구 예측을 받으세요. 프리미어리그 1x2 예측, 2.5골 이상 통계, 아시안 핸디캡 팁. 축구 베팅 분석을 위한 최고의 AI.",
  zh: "获取今日最准确的AI足球预测。英超1x2预测、大于2.5球统计、亚洲盘技巧与平局预测。足球投注分析最佳AI。",
  tw: "獲取今日最準確的AI足球預測。英超1x2預測、大於2.5球統計、亞洲盤技巧與平局預測。足球投注分析最佳AI。",
  id: "Dapatkan prediksi sepak bola AI paling akurat hari ini. Prediksi 1x2 Premier League, statistik over 2.5 gol, tips Asian handicap. AI terbaik untuk analisis taruhan sepak bola.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://www.oddsflow.ai';

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    keywords: [
      "Premier League 1x2 predictions today",
      "Premier League over 2.5 goals stats",
      "English Premier League draw predictions",
      "Asian handicap prediction",
      "AI football predictions today",
      "best AI for handicap betting",
      "over under predictions",
      "football betting tips",
      "soccer predictions",
    ],
    // Note: alternates.canonical and robots are handled dynamically in page.tsx
    // based on the date parameter (noindex for past dates)
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      type: 'website',
      url: locale === 'en' ? `${baseUrl}/predictions` : `${baseUrl}/${locale}/predictions`,
      images: [
        {
          url: '/homepage/OddsFlow Logo2.png',
          width: 1200,
          height: 630,
          alt: 'OddsFlow AI Football Predictions',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      images: ['/homepage/OddsFlow Logo2.png'],
    },
  };
}

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
