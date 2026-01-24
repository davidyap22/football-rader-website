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
    title: "OddsFlow Blog: Wett-Guides, Strategie & Datenanalyse",
    description: "Lernen Sie, Fußball-Quoten zu interpretieren, implizite Wahrscheinlichkeiten zu berechnen und Wettmärkte zu verstehen. Experten-Guides zu Asiatischen Handicaps, Over/Under, 1X2-Wetten und KI-Fußballvorhersagen.",
    ogTitle: "Fußball-Quoten Guide | OddsFlow Blog",
    keywords: [
      "Fußball Quoten interpretieren",
      "Wettquoten erklärt",
      "implizite Wahrscheinlichkeit Wetten",
      "Asiatisches Handicap Guide",
      "Over Under Wetten erklärt",
      "KI Fußball Vorhersagen",
      "Wett-Tutorials",
      "Quotenbewegung Analyse",
      "Bundesliga Quoten",
      "Premier League Tipps",
    ],
  },
  fr: {
    title: "Blog OddsFlow: Guides de Paris, Stratégie et Analyse de Données",
    description: "Apprenez à interpréter les cotes de football, calculer les probabilités implicites et comprendre les marchés de paris. Guides experts sur le handicap asiatique, over/under, paris 1X2 et pronostics foot IA.",
    ogTitle: "Guide des Cotes de Football | Blog OddsFlow",
    keywords: [
      "interpréter cotes football",
      "cotes paris expliquées",
      "probabilité implicite paris",
      "guide handicap asiatique",
      "paris over under expliqués",
      "pronostics foot IA",
      "tutoriels paris football",
      "analyse mouvement cotes",
      "cotes Ligue 1",
      "pronostics Premier League",
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
    title: "OddsFlow 블로그: 베팅 가이드, 전략 & 데이터 분석",
    description: "축구 배당률 해석, 내재 확률 계산, 베팅 시장 이해 방법을 배우세요. 아시안 핸디캡, 오버/언더, 1X2 베팅, AI 축구 예측 전문 가이드.",
    ogTitle: "축구 배당률 가이드 | OddsFlow 블로그",
    keywords: [
      "축구 배당률 해석",
      "베팅 배당률 설명",
      "내재 확률 베팅",
      "아시안 핸디캡 가이드",
      "오버 언더 베팅",
      "AI 축구 예측",
      "베팅 튜토리얼",
      "배당률 변동 분석",
      "K리그 배당률",
      "프리미어리그 예측",
    ],
  },
  zh: {
    title: "OddsFlow博客: 投注指南、策略与数据分析",
    description: "学习如何解读足球赔率、计算隐含概率、理解投注市场。亚盘、大小球、1X2投注和AI足球预测专家指南。",
    ogTitle: "足球赔率指南 | OddsFlow博客",
    keywords: [
      "足球赔率解读",
      "投注赔率解释",
      "隐含概率投注",
      "亚盘指南",
      "大小球解释",
      "AI足球预测",
      "投注教程",
      "赔率变动分析",
      "中超赔率",
      "英超预测",
    ],
  },
  tw: {
    title: "OddsFlow部落格: 投注指南、策略與數據分析",
    description: "學習如何解讀足球賠率、計算隱含機率、理解投注市場。亞盤、大小分、1X2投注和AI足球預測專家指南。",
    ogTitle: "足球賠率指南 | OddsFlow部落格",
    keywords: [
      "足球賠率解讀",
      "運彩賠率解釋",
      "隱含機率投注",
      "亞盤指南",
      "大小分解釋",
      "AI足球預測",
      "投注教學",
      "賠率變動分析",
      "英超預測",
    ],
  },
  id: {
    title: "Blog OddsFlow: Panduan Taruhan, Strategi & Analisis Data",
    description: "Pelajari cara menginterpretasi odds sepak bola, menghitung probabilitas implisit, dan memahami pasar taruhan. Panduan ahli tentang Asian Handicap, over/under, taruhan 1X2 dan prediksi bola AI.",
    ogTitle: "Panduan Odds Sepak Bola | Blog OddsFlow",
    keywords: [
      "cara baca odds sepak bola",
      "odds taruhan dijelaskan",
      "probabilitas implisit taruhan",
      "panduan Asian Handicap",
      "taruhan over under",
      "prediksi bola AI",
      "tutorial taruhan",
      "analisis pergerakan odds",
      "odds Liga Indonesia",
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
