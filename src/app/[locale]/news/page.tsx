import { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import { supabase } from '@/lib/supabase';
import NewsClient from './NewsClient';
import NewsSSR from './NewsSSR';

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Server-side data fetching for SEO
async function getInitialNewsData() {
  try {
    // Get total count
    const { count } = await supabase
      .from('football_news')
      .select('*', { count: 'exact', head: true });

    // Fetch first page of articles for SSR
    const { data: articles, error } = await supabase
      .from('football_news')
      .select('id, title, summary, image_url, created_at, category')
      .order('created_at', { ascending: false, nullsFirst: false })
      .range(0, 19); // First 20 articles

    if (error) {
      console.error('Error fetching news for SSR:', error);
      return { articles: [], totalCount: 0 };
    }

    return {
      articles: articles || [],
      totalCount: count || 0,
    };
  } catch (error) {
    console.error('Error in getInitialNewsData:', error);
    return { articles: [], totalCount: 0 };
  }
}

// SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://www.oddsflow.ai';

  // Fetch article count for dynamic metadata
  const { totalCount } = await getInitialNewsData();

  const titles: Record<string, string> = {
    en: "Football News & AI Betting Insights | OddsFlow",
    es: "Noticias de Fútbol e Insights de Apuestas IA | OddsFlow",
    pt: "Notícias de Futebol e Insights de Apostas IA | OddsFlow",
    de: "Fußball-Nachrichten & KI-Wett-Einblicke | OddsFlow",
    fr: "Actualités Football & Insights Paris IA | OddsFlow",
    ja: "サッカーニュース & AI ベッティングインサイト | OddsFlow",
    ko: "축구 뉴스 & AI 베팅 인사이트 | OddsFlow",
    zh: "足球新闻 & AI 投注洞察 | OddsFlow",
    tw: "足球新聞 & AI 投注洞察 | OddsFlow",
    id: "Berita Sepak Bola & Wawasan Taruhan AI | OddsFlow",
  };

  const baseDescriptions: Record<string, string> = {
    en: "Stay updated with the latest football news, betting insights, and AI predictions. Expert analysis, match previews, and data-driven betting strategies.",
    es: "Mantente actualizado con las últimas noticias de fútbol, insights de apuestas y predicciones IA. Análisis experto, previas de partidos y estrategias de apuestas basadas en datos.",
    pt: "Fique atualizado com as últimas notícias de futebol, insights de apostas e previsões IA. Análise especializada, prévias de partidas e estratégias de apostas baseadas em dados.",
    de: "Bleiben Sie auf dem Laufenden mit den neuesten Fußball-Nachrichten, Wett-Einblicken und KI-Vorhersagen. Expertenanalyse, Spielvorschauen und datengestützte Wettstrategien.",
    fr: "Restez informé des dernières actualités football, insights de paris et prédictions IA. Analyses d'experts, aperçus de matchs et stratégies de paris basées sur les données.",
    ja: "最新のサッカーニュース、ベッティングインサイト、AI 予測で常に最新情報を入手。専門家分析、試合プレビュー、データ駆動型ベッティング戦略。",
    ko: "최신 축구 뉴스, 베팅 인사이트, AI 예측으로 최신 정보를 받아보세요. 전문가 분석, 경기 프리뷰, 데이터 기반 베팅 전략.",
    zh: "获取最新足球新闻、投注洞察和 AI 预测。专家分析、比赛预览和数据驱动的投注策略。",
    tw: "獲取最新足球新聞、投注洞察和 AI 預測。專家分析、比賽預覽和數據驅動的投注策略。",
    id: "Tetap update dengan berita sepak bola terbaru, wawasan taruhan, dan prediksi AI. Analisis ahli, preview pertandingan, dan strategi taruhan berbasis data.",
  };

  // Add article count to description
  const description = totalCount > 0
    ? `${totalCount}+ articles. ${baseDescriptions[locale] || baseDescriptions.en}`
    : baseDescriptions[locale] || baseDescriptions.en;

  return {
    title: titles[locale] || titles.en,
    description,
    alternates: {
      canonical: locale === 'en' ? `${baseUrl}/news` : `${baseUrl}/${locale}/news`,
      languages: {
        'en': `${baseUrl}/news`,
        'es': `${baseUrl}/es/news`,
        'pt': `${baseUrl}/pt/news`,
        'de': `${baseUrl}/de/news`,
        'fr': `${baseUrl}/fr/news`,
        'ja': `${baseUrl}/ja/news`,
        'ko': `${baseUrl}/ko/news`,
        'zh-CN': `${baseUrl}/zh/news`,
        'zh-TW': `${baseUrl}/tw/news`,
        'id': `${baseUrl}/id/news`,
        'x-default': `${baseUrl}/news`,
      }
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description,
      type: 'website',
      url: locale === 'en' ? `${baseUrl}/news` : `${baseUrl}/${locale}/news`,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.en,
      description,
    },
  };
}

// Loading fallback - still needed for client-side navigation
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading news...</p>
      </div>
    </div>
  );
}

// Server Component
export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    return <LoadingFallback />;
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Fetch initial data on server for SSR
  const { articles, totalCount } = await getInitialNewsData();

  return (
    <>
      {/* SSR Content - Rendered on server, visible to crawlers but hidden from users */}
      <NewsSSR
        locale={locale}
        articles={articles}
        totalCount={totalCount}
      />

      {/* Client Component - Interactive UI for users */}
      <Suspense fallback={<LoadingFallback />}>
        <NewsClient />
      </Suspense>
    </>
  );
}
