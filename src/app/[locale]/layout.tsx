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
    zh: "OddsFlow - 最准确的AI足球预测 | 欧洲足球AI分析",
    id: "OddsFlow - Prediksi Sepak Bola AI Paling Akurat | Tips AI Sepak Bola Eropa",
    ms: "OddsFlow - Ramalan Bola Sepak AI Paling Tepat | Tips AI Bola Sepak Eropah",
  };

  const descriptions: Record<string, string> = {
    en: "Most accurate AI football predictor for Premier League, Bundesliga, Serie A, La Liga & Ligue 1. Get 1x2 predictions, handicap betting tips, over/under analysis.",
    zh: "最准确的AI足球预测，涵盖英超、德甲、意甲、西甲和法甲。获取1x2预测、亚盘分析、大小球预测。",
    id: "Prediksi sepak bola AI paling akurat untuk Liga Premier, Bundesliga, Serie A, La Liga & Ligue 1. Dapatkan prediksi 1x2, tips handicap, analisis over/under.",
    ms: "Ramalan bola sepak AI paling tepat untuk Liga Perdana, Bundesliga, Serie A, La Liga & Ligue 1. Dapatkan ramalan 1x2, tips handicap, analisis over/under.",
  };

  const localeMap: Record<string, string> = {
    en: 'en_US',
    zh: 'zh_CN',
    id: 'id_ID',
    ms: 'ms_MY',
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
        'zh': `${baseUrl}/zh`,
        'id': `${baseUrl}/id`,
        'ms': `${baseUrl}/ms`,
        'x-default': baseUrl,
      },
    },
    category: 'sports betting',
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
