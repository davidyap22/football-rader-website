import { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import HomeClient from './HomeClient';

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://www.oddsflow.ai';

  const titles: Record<string, string> = {
    en: "OddsFlow - Most Accurate AI Football Predictor | European Football AI Tips",
    es: "OddsFlow - Pronósticos de Fútbol IA | La Liga, Premier League y Más",
    pt: "OddsFlow - Palpites de Futebol IA | Brasileirão, Premier League e Mais",
    de: "OddsFlow - Genauester KI-Fußball-Vorhersager | Europäische Fußball-KI-Tipps",
    fr: "OddsFlow - Pronostics Foot IA | Paris Sportifs, Ligue 1, Premier League",
    ja: "OddsFlow - AIサッカー勝敗予想サイト | ブックメーカー投資 & オッズ分析",
    ko: "OddsFlow - AI 축구 분석 & 프로토 예측 | 빅데이터 기반 스포츠토토 분석",
    zh: "OddsFlow - 大数据AI足球盘口分析 | 实时赔率走势 & 预测",
    tw: "OddsFlow - AI 運彩分析與足球預測 | 讓分盤大數據分析",
    id: "OddsFlow - Prediksi Bola AI Akurat | Mix Parlay & Analisis Over Under",
  };

  const descriptions: Record<string, string> = {
    en: "Most accurate AI football predictor for Premier League, Bundesliga, Serie A, La Liga & Ligue 1. Get 1x2 predictions, handicap betting tips, over/under analysis.",
    es: "Domina las apuestas de fútbol con OddsFlow. Nuestra IA analiza millones de datos en tiempo real para ofrecerte pronósticos precisos, análisis de cuotas y value bets para La Liga, Premier League y más.",
    pt: "Domine as apostas com palpites de futebol IA. Nossa IA analisa milhões de dados para oferecer palpites precisos, análise de odds e value bets para Brasileirão, Premier League, La Liga e mais.",
    de: "Genauester KI-Fußball-Vorhersager für Premier League, Bundesliga, Serie A, La Liga & Ligue 1. Erhalten Sie 1x2-Vorhersagen, Handicap-Tipps, Over/Under-Analyse.",
    fr: "Pronostics foot gratuits par IA. Notre intelligence artificielle analyse des millions de données pour vos paris sportifs sur Ligue 1, Premier League, La Liga et plus. Pronostics 1x2, handicap, over/under.",
    ja: "ブックメーカー投資に最適なAIサッカー予想サイト。プレミアリーグ、ブンデスリーガ、Jリーグなど100以上のリーグをカバー。勝敗予想、オッズ分析、データに基づく投資判断をサポート。",
    ko: "빅데이터 기반 AI 축구 분석 사이트. 프로토, 스포츠토토 분석에 최적화. 프리미어리그, K리그, 라리가 등 100개 이상 리그의 승무패 예측, 핸디캡, 언오버 분석 제공.",
    zh: "大数据+AI驱动的足球盘口分析平台。实时追踪英超、西甲、德甲等100+联赛的盘口变化，提供亚盘分析、大小球预测、赔率走势。用数据战胜庄家。",
    tw: "台灣運彩分析首選！大數據 AI 預測英超、西甲、德甲等100+聯賽。提供讓分盤、大小分、勝和負預測，助您提升運彩勝率。",
    id: "Prediksi bola AI paling akurat untuk Mix Parlay! Analisis Liga Inggris, Liga 1, La Liga & 100+ liga. Pola gacor untuk handicap, over/under, dan prediksi skor.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: locale === 'en' ? baseUrl : `${baseUrl}/${locale}`,
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      type: 'website',
      url: locale === 'en' ? baseUrl : `${baseUrl}/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
    },
  };
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

// Server Component
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    return <LoadingFallback />;
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeClient />
    </Suspense>
  );
}
