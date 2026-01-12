import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "../globals.css";
import { LoadingProvider } from "@/components/LoadingProvider";
import { OrganizationJsonLd, WebsiteJsonLd, SoftwareApplicationJsonLd } from "@/components/JsonLd";
import { locales, type Locale } from "@/i18n/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = 'https://www.oddsflow.ai';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "OddsFlow - Most Accurate AI Football Predictor | European Football AI Tips",
    es: "OddsFlow - Predictor de Fútbol IA Más Preciso | Consejos IA Fútbol Europeo",
    pt: "OddsFlow - Previsões de Futebol IA Mais Precisas | Dicas IA Futebol Europeu",
    de: "OddsFlow - Genauester KI-Fußball-Vorhersager | Europäische Fußball-KI-Tipps",
    fr: "OddsFlow - Prédicteur de Football IA le Plus Précis | Conseils IA Football Européen",
    ja: "OddsFlow - 最も正確なAIサッカー予測 | ヨーロッパサッカーAIのヒント",
    ko: "OddsFlow - 가장 정확한 AI 축구 예측 | 유럽 축구 AI 팁",
    zh: "OddsFlow - 最准确的AI足球预测 | 欧洲足球AI分析",
    tw: "OddsFlow - 最準確的AI足球預測 | 歐洲足球AI分析",
    id: "OddsFlow - Prediksi Sepak Bola AI Paling Akurat | Tips AI Sepak Bola Eropa",
  };

  const descriptions: Record<string, string> = {
    en: "Most accurate AI football predictor for Premier League, Bundesliga, Serie A, La Liga & Ligue 1. Get 1x2 predictions, handicap betting tips, over/under analysis.",
    es: "Predictor de fútbol IA más preciso para Premier League, Bundesliga, Serie A, La Liga y Ligue 1. Obtén predicciones 1x2, consejos de hándicap, análisis over/under.",
    pt: "Previsões de futebol IA mais precisas para Premier League, Bundesliga, Serie A, La Liga e Ligue 1. Obtenha previsões 1x2, dicas de handicap, análise over/under.",
    de: "Genauester KI-Fußball-Vorhersager für Premier League, Bundesliga, Serie A, La Liga & Ligue 1. Erhalten Sie 1x2-Vorhersagen, Handicap-Tipps, Over/Under-Analyse.",
    fr: "Prédicteur de football IA le plus précis pour Premier League, Bundesliga, Serie A, La Liga & Ligue 1. Obtenez des prédictions 1x2, conseils handicap, analyse over/under.",
    ja: "プレミアリーグ、ブンデスリーガ、セリエA、ラ・リーガ、リーグ1の最も正確なAIサッカー予測。1x2予測、ハンディキャップのヒント、オーバー/アンダー分析。",
    ko: "프리미어리그, 분데스리가, 세리에A, 라리가, 리그1을 위한 가장 정확한 AI 축구 예측. 1x2 예측, 핸디캡 팁, 오버/언더 분석.",
    zh: "最准确的AI足球预测，涵盖英超、德甲、意甲、西甲和法甲。获取1x2预测、亚盘分析、大小球预测。",
    tw: "最準確的AI足球預測，涵蓋英超、德甲、意甲、西甲和法甲。獲取1x2預測、亞盤分析、大小球預測。",
    id: "Prediksi sepak bola AI paling akurat untuk Liga Premier, Bundesliga, Serie A, La Liga & Ligue 1. Dapatkan prediksi 1x2, tips handicap, analisis over/under.",
  };

  const localeMap: Record<string, string> = {
    en: 'en_US',
    es: 'es_ES',
    pt: 'pt_BR',
    de: 'de_DE',
    fr: 'fr_FR',
    ja: 'ja_JP',
    ko: 'ko_KR',
    zh: 'zh_CN',
    tw: 'zh_TW',
    id: 'id_ID',
  };

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: titles[locale] || titles.en,
      template: "%s | OddsFlow",
    },
    description: descriptions[locale] || descriptions.en,
    keywords: [
      "AI football predictions",
      "Premier League AI predictor",
      "Bundesliga AI betting predictions",
      "Serie A artificial intelligence picks",
      "La Liga betting predictions",
      "Ligue 1 AI prediction model",
      "most accurate AI football predictor",
      "football betting tips",
      "soccer predictions",
    ],
    authors: [{ name: "OddsFlow Team" }],
    creator: "OddsFlow",
    publisher: "OddsFlow",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      type: "website",
      locale: localeMap[locale] || 'en_US',
      siteName: "OddsFlow",
      url: locale === 'en' ? baseUrl : `${baseUrl}/${locale}`,
      images: [
        {
          url: "/homepage/OddsFlow Logo2.png",
          width: 1200,
          height: 630,
          alt: "OddsFlow - AI Football Predictions",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      images: ["/homepage/OddsFlow Logo2.png"],
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
    alternates: {
      canonical: locale === 'en' ? baseUrl : `${baseUrl}/${locale}`,
      languages: {
        'en': baseUrl,
        'es': `${baseUrl}/es`,
        'pt': `${baseUrl}/pt`,
        'de': `${baseUrl}/de`,
        'fr': `${baseUrl}/fr`,
        'ja': `${baseUrl}/ja`,
        'ko': `${baseUrl}/ko`,
        'zh': `${baseUrl}/zh`,
        'zh-TW': `${baseUrl}/tw`,
        'id': `${baseUrl}/id`,
        'x-default': baseUrl,
      },
    },
    category: 'sports betting',
    verification: {
      google: 'kGpqnHhRuZVUTgfiOxkLfmhtYt1jDcX0FAji3Hx0edU',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate that the incoming locale is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  // Map locale to HTML lang attribute
  const htmlLang = locale === 'zh' ? 'zh-CN' : locale;

  return (
    <html lang={htmlLang} className="dark">
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <SoftwareApplicationJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0f] text-white`}
      >
        <NextIntlClientProvider messages={messages}>
          <Suspense fallback={null}>
            <LoadingProvider>
              {children}
            </LoadingProvider>
          </Suspense>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
