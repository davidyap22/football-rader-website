import type { Metadata } from "next";

const baseUrl = 'https://www.oddsflow.ai';

// Locale-specific SEO metadata for Blog page
const SEO_METADATA: Record<string, { title: string; description: string; keywords: string[]; ogTitle: string }> = {
  en: {
    title: "OddsFlow Blog: Football Betting Guides, Strategy & Data Analysis",
    description: "Learn how to interpret football odds, calculate implied probability, and understand betting markets. Expert guides on Asian handicap, over/under, 1X2 betting, and AI football predictions.",
    ogTitle: "Football Odds Guide | OddsFlow Blog",
    keywords: [
      "how to interpret football odds",
      "football betting odds explained",
      "implied probability betting",
      "Asian handicap betting guide",
      "over under betting explained",
      "decimal odds vs fractional odds",
      "bookmaker margin calculator",
      "AI football predictions",
      "football betting tutorials",
      "odds movement analysis",
      "sharp money betting",
      "responsible gambling guide",
      "Premier League odds",
      "Bundesliga betting tips",
      "Serie A predictions",
    ],
  },
  es: {
    title: "Blog de OddsFlow: Guías de Apuestas, Estrategia y Análisis de Datos",
    description: "Aprende a interpretar cuotas de fútbol, calcular probabilidades implícitas y entender los mercados de apuestas. Guías expertas sobre hándicap asiático, over/under, apuestas 1X2 y predicciones de fútbol con IA.",
    ogTitle: "Guía de Cuotas de Fútbol | Blog de OddsFlow",
    keywords: [
      "cómo interpretar cuotas de fútbol",
      "cuotas de apuestas explicadas",
      "probabilidad implícita apuestas",
      "guía hándicap asiático",
      "apuestas over under explicadas",
      "cuotas decimales vs fraccionarias",
      "calculadora margen casa de apuestas",
      "predicciones fútbol IA",
      "tutoriales apuestas fútbol",
      "análisis movimiento de cuotas",
      "apuestas dinero inteligente",
      "guía juego responsable",
      "cuotas La Liga",
      "pronósticos Premier League",
      "predicciones Serie A",
    ],
  },
  pt: {
    title: "Blog de Apostas e Palpites de Futebol com IA | OddsFlow",
    description: "Palpites de futebol com inteligência artificial. Aprenda a interpretar odds, calcular probabilidade implícita e entender mercados de apostas. Guias sobre handicap asiático, over/under e apostas 1X2.",
    ogTitle: "Palpites de Futebol com IA | Blog OddsFlow",
    keywords: [
      "palpites de futebol",
      "palpites futebol IA",
      "apostas esportivas",
      "como interpretar odds",
      "odds de futebol explicadas",
      "probabilidade implícita apostas",
      "guia handicap asiático",
      "apostas over under",
      "dicas de apostas",
      "odds Brasileirão",
      "palpites Premier League",
      "análise de odds",
      "cotações futebol",
    ],
  },
  de: {
    title: "Fußball-Wett-Blog: Experten-Tipps, Quoten-Guides & KI-Analysen | OddsFlow",
    description: "Lernen Sie, Fußball-Quoten zu interpretieren, implizite Wahrscheinlichkeiten zu berechnen und Wettmärkte zu verstehen. Experten-Guides zu Asiatischen Handicaps, Over/Under, 1X2-Wetten und KI-Fußballvorhersagen.",
    ogTitle: "Fußball-Wett-Blog | Experten-Tipps & KI-Analysen | OddsFlow",
    keywords: [
      "Fußball Wett-Blog",
      "Wett-Tipps",
      "Experten Tipps Fußball",
      "Fußball Quoten interpretieren",
      "Wettquoten erklärt",
      "implizite Wahrscheinlichkeit Wetten",
      "Asiatisches Handicap Guide",
      "Over Under Wetten erklärt",
      "KI Fußball Vorhersagen",
      "Wett-Tutorials",
      "Quotenbewegung Analyse",
      "Bundesliga Quoten",
      "Bundesliga Tipps",
    ],
  },
  fr: {
    title: "Blog Pronostics Foot, Conseils Paris Sportifs & Analyses IA | OddsFlow",
    description: "Pronostics foot gratuits et conseils paris sportifs. Apprenez à interpréter les cotes, calculer les probabilités implicites et trouver les value bets. Guides experts handicap asiatique, over/under et analyses IA.",
    ogTitle: "Pronostics Foot & Conseils Paris Sportifs | Blog OddsFlow",
    keywords: [
      "pronostics foot",
      "pronostics football",
      "paris sportifs",
      "conseils paris sportifs",
      "cotes football",
      "interpréter cotes football",
      "pronostics Ligue 1",
      "pronostics Premier League",
      "handicap asiatique",
      "over under paris",
      "analyses IA football",
      "value bet",
    ],
  },
  ja: {
    title: "OddsFlowブログ: ブックメーカー攻略ガイド、戦略 & データ分析",
    description: "サッカーオッズの読み方、暗黙の確率計算、ブックメーカー市場の理解方法を学びましょう。アジアンハンディキャップ、オーバー/アンダー、1X2ベッティング、AIサッカー予想のエキスパートガイド。",
    ogTitle: "サッカー予想ガイド | OddsFlowブログ",
    keywords: [
      "サッカー予想",
      "ブックメーカー攻略",
      "サッカーオッズ解説",
      "ブックメーカー投資",
      "アジアンハンディキャップガイド",
      "オーバーアンダー解説",
      "AIサッカー予想",
      "買い目予想",
      "オッズ変動分析",
      "Jリーグ予想",
      "プレミアリーグ予想",
    ],
  },
  ko: {
    title: "OddsFlow 블로그 - AI 축구 승무패 예측, 배당률 분석 & 토토 가이드",
    description: "축구 승무패 예측, 배당률 분석, 토토 분석 가이드. 아시안 핸디캡, 오버/언더, AI 축구 픽 전문 가이드. 오늘의 축구 픽과 배당률 변동 분석.",
    ogTitle: "AI 축구 승무패 예측 & 토토 분석 | OddsFlow 블로그",
    keywords: [
      "축구 승무패 예측",
      "토토 분석",
      "축구 픽",
      "오늘의 축구 픽",
      "배당률 분석",
      "축구 배당률 해석",
      "아시안 핸디캡 가이드",
      "오버 언더 분석",
      "AI 축구 예측",
      "스포츠토토",
      "K리그 분석",
      "프리미어리그 픽",
    ],
  },
  zh: {
    title: "OddsFlow博客: 足球盘口分析、亚盘水位解读与AI预测指南",
    description: "专业足球博彩分析博客。学习亚盘盘口解读、水位变化分析、大小球投注策略。AI足球预测、让球分析、赔率走势一网打尽。",
    ogTitle: "足球盘口分析 & 亚盘水位解读 | OddsFlow博客",
    keywords: [
      "足球盘口分析",
      "亚盘水位",
      "盘口解读",
      "足球博彩",
      "亚盘分析",
      "大小球投注",
      "让球分析",
      "赔率水位",
      "AI足球预测",
      "英超盘口",
      "中超分析",
      "水位变化",
    ],
  },
  tw: {
    title: "OddsFlow部落格: 運彩分析、讓分盤解讀與串關攻略 | AI足球預測",
    description: "台灣運彩分析專家指南。學習讓分盤解讀、大小分投注策略、串關技巧。AI足球預測、賠率分析、運彩下注教學一網打盡。",
    ogTitle: "運彩分析 & 讓分盤解讀 | OddsFlow部落格",
    keywords: [
      "運彩分析",
      "運彩下注教學",
      "讓分盤",
      "讓分分析",
      "大小分",
      "串關技巧",
      "串關攻略",
      "足球預測",
      "AI足球預測",
      "運彩賠率",
      "英超分析",
      "運彩報牌",
    ],
  },
  id: {
    title: "Blog Prediksi Bola Jitu & Mix Parlay Gacor | OddsFlow",
    description: "Prediksi bola jitu dan strategi mix parlay gacor. Pelajari cara baca pasaran bola, analisis kei, tips anti-rungkad. Panduan lengkap Asian Handicap, over/under, dan prediksi AI akurat.",
    ogTitle: "Prediksi Bola Jitu & Mix Parlay Gacor | OddsFlow",
    keywords: [
      "prediksi bola jitu",
      "mix parlay gacor",
      "pasaran bola",
      "prediksi bola hari ini",
      "tips anti-rungkad",
      "cara menang mix parlay",
      "analisis kei",
      "prediksi bola AI",
      "Asian Handicap",
      "over under bola",
      "Liga Indonesia",
      "prediksi Premier League",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_METADATA[locale] || SEO_METADATA.en;
  const canonicalUrl = locale === 'en' ? `${baseUrl}/blog` : `${baseUrl}/${locale}/blog`;

  // Build alternate language URLs
  const alternateLanguages: Record<string, string> = {
    'en': `${baseUrl}/blog`,
    'es': `${baseUrl}/es/blog`,
    'pt': `${baseUrl}/pt/blog`,
    'de': `${baseUrl}/de/blog`,
    'fr': `${baseUrl}/fr/blog`,
    'ja': `${baseUrl}/ja/blog`,
    'ko': `${baseUrl}/ko/blog`,
    'zh-CN': `${baseUrl}/zh/blog`,
    'zh-TW': `${baseUrl}/tw/blog`,
    'id': `${baseUrl}/id/blog`,
    'x-default': `${baseUrl}/blog`,
  };

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.ogTitle,
      description: seo.description,
      type: "website",
      siteName: "OddsFlow",
      url: canonicalUrl,
      locale: locale === 'zh' ? 'zh_CN' : locale === 'tw' ? 'zh_TW' : locale,
      images: [
        {
          url: `${baseUrl}/homepage/OddsFlow Logo2.png`,
          width: 1200,
          height: 630,
          alt: seo.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle,
      description: seo.description,
      images: [`${baseUrl}/homepage/OddsFlow Logo2.png`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
