import { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n/config';
import SolutionClient from './SolutionClient';

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = 'https://www.oddsflow.ai';

  const titles: Record<string, string> = {
    en: "Enterprise Solutions - AI Football Prediction API | OddsFlow",
    es: "Soluciones Empresariales - API de Predicción de Fútbol IA | OddsFlow",
    pt: "Soluções Empresariais - API de Previsão de Futebol IA | OddsFlow",
    de: "Unternehmenslösungen - KI-Fußball-Vorhersage-API | OddsFlow",
    fr: "Solutions Entreprise - API de Prédiction de Football IA | OddsFlow",
    ja: "エンタープライズソリューション - AI サッカー予測 API | OddsFlow",
    ko: "기업 솔루션 - AI 축구 예측 API | OddsFlow",
    zh: "企业解决方案 - AI 足球预测 API | OddsFlow",
    tw: "企業解決方案 - AI 足球預測 API | OddsFlow",
    id: "Solusi Enterprise - API Prediksi Sepak Bola AI | OddsFlow",
  };

  const descriptions: Record<string, string> = {
    en: "Power your platform with OddsFlow's AI-driven football prediction technology. Signal API, white label solutions, and native advertising for your sports betting platform.",
    es: "Potencia tu plataforma con la tecnología de predicción de fútbol impulsada por IA de OddsFlow. API de señales, soluciones white label y publicidad nativa para tu plataforma de apuestas deportivas.",
    pt: "Potencialize sua plataforma com a tecnologia de previsão de futebol impulsionada por IA da OddsFlow. API de sinais, soluções white label e publicidade nativa para sua plataforma de apostas esportivas.",
    de: "Stärken Sie Ihre Plattform mit OddsFlows KI-gestützter Fußballvorhersagetechnologie. Signal-API, White-Label-Lösungen und native Werbung für Ihre Sportwetten-Plattform.",
    fr: "Alimentez votre plateforme avec la technologie de prédiction de football basée sur l'IA d'OddsFlow. API de signaux, solutions en marque blanche et publicité native pour votre plateforme de paris sportifs.",
    ja: "OddsFlow の AI 駆動サッカー予測テクノロジーでプラットフォームを強化。シグナル API、ホワイトラベルソリューション、スポーツベッティングプラットフォーム向けネイティブ広告。",
    ko: "OddsFlow의 AI 기반 축구 예측 기술로 플랫폼을 강화하세요. 시그널 API, 화이트 라벨 솔루션, 스포츠 베팅 플랫폼을 위한 네이티브 광고.",
    zh: "通过 OddsFlow 的 AI 驱动足球预测技术为您的平台赋能。信号 API、白标解决方案和体育博彩平台的原生广告。",
    tw: "透過 OddsFlow 的 AI 驅動足球預測技術為您的平台賦能。訊號 API、白標解決方案和體育博彩平台的原生廣告。",
    id: "Berdayakan platform Anda dengan teknologi prediksi sepak bola berbasis AI dari OddsFlow. Signal API, solusi white label, dan iklan native untuk platform taruhan olahraga Anda.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: locale === 'en' ? `${baseUrl}/solution` : `${baseUrl}/${locale}/solution`,
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      type: 'website',
      url: locale === 'en' ? `${baseUrl}/solution` : `${baseUrl}/${locale}/solution`,
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
export default async function SolutionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    return <LoadingFallback />;
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <SolutionClient />
    </Suspense>
  );
}
