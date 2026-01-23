import type { Metadata } from "next";

// Locale-specific SEO metadata for About page
const SEO_METADATA: Record<string, { title: string; description: string; keywords: string[] }> = {
  en: {
    title: "About OddsFlow - AI Football Prediction & Sports Betting Analytics Platform | OddsFlow",
    description: "Learn about OddsFlow, the leading AI football prediction platform. Our mission is to provide transparent, data-driven betting insights using advanced machine learning technology.",
    keywords: [
      "about OddsFlow",
      "AI football prediction company",
      "sports betting AI platform",
      "machine learning football",
      "football analytics company",
      "betting prediction technology",
    ],
  },
  es: {
    title: "Sobre Nosotros - Plataforma de Pronósticos de Fútbol con IA y Apuestas Deportivas | OddsFlow",
    description: "Conoce OddsFlow, la plataforma líder de pronósticos de fútbol con IA. Nuestra misión es proporcionar análisis de apuestas deportivas transparentes y basados en datos usando tecnología avanzada de machine learning.",
    keywords: [
      "sobre OddsFlow",
      "pronósticos de fútbol con IA",
      "predicciones de fútbol",
      "apuestas deportivas",
      "plataforma de apuestas IA",
      "análisis de fútbol",
      "handicaps asiáticos",
      "machine learning fútbol",
    ],
  },
  pt: {
    title: "Sobre OddsFlow - Plataforma de Palpites de Futebol com IA e Apostas Esportivas | OddsFlow",
    description: "Conheça a OddsFlow, a plataforma líder de palpites de futebol com Inteligência Artificial. Usamos algoritmos de Wall Street para analisar odds, handicaps asiáticos e movimentos de mercado. Apostas esportivas com dados, não intuição.",
    keywords: [
      "sobre OddsFlow",
      "palpites de futebol",
      "palpites de futebol com IA",
      "apostas esportivas",
      "previsões de futebol",
      "análise de odds",
      "handicaps asiáticos",
      "cotações de futebol",
      "inteligência artificial futebol",
      "dicas de apostas",
    ],
  },
  de: {
    title: "Über OddsFlow - KI Fußball Vorhersagen, Wett-Tipps & Sportwetten Analyse | OddsFlow",
    description: "Lernen Sie OddsFlow kennen: Die führende KI-Plattform für Fußball Vorhersagen und Sportwetten. Wir nutzen Wall-Street-Algorithmen für datengesteuerte Wett-Tipps, Quotenanalyse und Asiatische Handicaps. Keine Intuition, nur Daten.",
    keywords: [
      "über OddsFlow",
      "KI Fußball Vorhersagen",
      "Fußball Vorhersagen",
      "Wett-Tipps",
      "Sportwetten",
      "Sportwetten Analyse",
      "Fußball Prognosen",
      "Quotenanalyse",
      "Asiatische Handicaps",
      "Bundesliga Vorhersagen",
      "KI Wetten",
    ],
  },
  fr: {
    title: "À Propos d'OddsFlow - Pronostics Foot & Paris Sportifs avec IA | OddsFlow",
    description: "Découvrez OddsFlow, la plateforme leader de pronostics foot propulsée par l'Intelligence Artificielle. Nous utilisons des algorithmes de Wall Street pour analyser les cotes, les handicaps asiatiques et les mouvements de marché. Paris sportifs basés sur les données, pas sur l'intuition.",
    keywords: [
      "à propos OddsFlow",
      "pronostics foot",
      "pronostics football",
      "paris sportifs",
      "cotes football",
      "analyse de cotes",
      "handicaps asiatiques",
      "IA paris sportifs",
      "prédictions football",
      "value bet",
    ],
  },
  ja: {
    title: "OddsFlowについて - AIサッカー予測・スポーツベッティング分析プラットフォーム | OddsFlow",
    description: "OddsFlowについて。ウォール街のアルゴリズムを活用したAIサッカー予測プラットフォーム。オッズ分析、アジアンハンディキャップ、市場動向をデータドリブンで分析。スポーツベッティングを直感ではなくデータで。",
    keywords: [
      "OddsFlowについて",
      "AIサッカー予測",
      "サッカー予測",
      "スポーツベッティング",
      "サッカー分析",
      "オッズ分析",
      "アジアンハンディキャップ",
      "ブックメーカー分析",
      "AI予測",
      "Jリーグ予測",
    ],
  },
  ko: {
    title: "OddsFlow 소개 - AI 축구 승무패 예측 & 해외축구 분석 플랫폼 | OddsFlow",
    description: "OddsFlow 소개. 월스트리트 알고리즘을 활용한 AI 축구 예측 플랫폼. 해외축구 분석, 배당률 분석, 아시안 핸디캡 데이터를 제공합니다. 직감이 아닌 데이터 기반 스포츠 베팅.",
    keywords: [
      "OddsFlow 소개",
      "AI 축구 예측",
      "축구 승무패 예측",
      "해외축구 분석",
      "스포츠 베팅",
      "축구 분석",
      "배당률 분석",
      "아시안 핸디캡",
      "프리미어리그 분석",
      "축구 데이터 분석",
    ],
  },
  zh: {
    title: "关于我们 - AI足球预测与大数据赔率分析平台 | OddsFlow",
    description: "了解OddsFlow，领先的AI足球预测平台。我们运用华尔街算法解读亚盘变动、赔率走势和聪明钱流向。大数据驱动的足球分析，而非直觉。",
    keywords: [
      "关于OddsFlow",
      "AI足球预测",
      "足球预测",
      "大数据赔率分析",
      "亚盘分析",
      "亚洲盘口",
      "体育博彩分析",
      "足球数据分析",
      "赔率分析",
      "聪明钱",
    ],
  },
  tw: {
    title: "關於我們 - AI足球預測與體育博彩分析平台 | OddsFlow",
    description: "了解OddsFlow，領先的AI足球預測平台。我們的使命是利用先進的機器學習技術提供透明、數據驅動的投注分析。",
    keywords: ["關於OddsFlow", "AI足球預測", "體育博彩分析", "足球分析"],
  },
  id: {
    title: "Tentang Kami - Platform Prediksi Sepak Bola AI & Analisis Taruhan | OddsFlow",
    description: "Pelajari tentang OddsFlow, platform prediksi sepak bola AI terkemuka dengan wawasan taruhan berbasis data.",
    keywords: ["tentang OddsFlow", "prediksi sepak bola AI", "taruhan olahraga", "analisis sepak bola"],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_METADATA[locale] || SEO_METADATA.en;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
    },
    alternates: {
      canonical: `https://www.oddsflow.ai/${locale === 'en' ? '' : locale + '/'}about`,
    },
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
