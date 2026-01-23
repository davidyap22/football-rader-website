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
    title: "Über Uns - KI-Fußballvorhersagen & Sportwetten-Analyse | OddsFlow",
    description: "Erfahren Sie mehr über OddsFlow, die führende KI-Fußballvorhersage-Plattform mit datengesteuerten Wett-Insights.",
    keywords: ["über OddsFlow", "KI Fußballvorhersagen", "Sportwetten Analyse", "Fußball Prognosen"],
  },
  fr: {
    title: "À Propos - Plateforme de Prédictions Football IA | OddsFlow",
    description: "Découvrez OddsFlow, la plateforme leader de prédictions football avec IA et analyses de paris sportifs basées sur les données.",
    keywords: ["à propos OddsFlow", "prédictions football IA", "paris sportifs", "analyse football"],
  },
  ja: {
    title: "会社概要 - AIサッカー予測・スポーツベッティング分析 | OddsFlow",
    description: "OddsFlowについて。AIと機械学習を活用したサッカー予測プラットフォーム。データドリブンなベッティングインサイトを提供。",
    keywords: ["OddsFlowについて", "AIサッカー予測", "スポーツベッティング", "サッカー分析"],
  },
  ko: {
    title: "회사 소개 - AI 축구 예측 & 스포츠 베팅 분석 | OddsFlow",
    description: "OddsFlow 소개. AI와 머신러닝을 활용한 축구 예측 플랫폼으로 데이터 기반 베팅 인사이트를 제공합니다.",
    keywords: ["OddsFlow 소개", "AI 축구 예측", "스포츠 베팅", "축구 분석"],
  },
  zh: {
    title: "关于我们 - AI足球预测与体育博彩分析平台 | OddsFlow",
    description: "了解OddsFlow，领先的AI足球预测平台。我们的使命是利用先进的机器学习技术提供透明、数据驱动的投注分析。",
    keywords: ["关于OddsFlow", "AI足球预测", "体育博彩分析", "足球分析"],
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
