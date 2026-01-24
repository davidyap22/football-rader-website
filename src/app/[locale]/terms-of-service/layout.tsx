import type { Metadata } from "next";

const baseUrl = 'https://www.oddsflow.ai';

// Locale-specific SEO metadata for Terms of Service page
// Includes local legal terminology (AGB, CGU, RGPD, etc.)
const SEO_METADATA: Record<string, { title: string; description: string; keywords: string[] }> = {
  en: {
    title: "Terms of Service - User Agreement | OddsFlow",
    description: "OddsFlow Terms of Service and User Agreement. Read our terms and conditions for using our AI-powered football analytics and odds prediction platform. Last updated January 2026.",
    keywords: ["terms of service", "user agreement", "OddsFlow terms", "football analytics terms"],
  },
  es: {
    title: "Términos de Servicio - Condiciones de Uso | OddsFlow",
    description: "Términos de Servicio y Condiciones de Uso de OddsFlow. Lee nuestros términos para usar nuestra plataforma de análisis de fútbol y predicción de cuotas con IA. Actualizado enero 2026.",
    keywords: ["términos de servicio", "condiciones de uso", "términos OddsFlow", "apuestas deportivas"],
  },
  pt: {
    title: "Termos de Serviço - Condições de Uso | OddsFlow",
    description: "Termos de Serviço e Condições de Uso da OddsFlow. Leia nossos termos para usar nossa plataforma de análise de futebol e previsão de odds com IA. Atualizado janeiro 2026.",
    keywords: ["termos de serviço", "condições de uso", "termos OddsFlow", "apostas esportivas"],
  },
  de: {
    title: "Nutzungsbedingungen - AGB | OddsFlow",
    description: "OddsFlow Nutzungsbedingungen und AGB. Lesen Sie unsere allgemeinen Geschäftsbedingungen für die Nutzung unserer KI-Fußballanalyse-Plattform. Aktualisiert Januar 2026.",
    keywords: ["Nutzungsbedingungen", "AGB", "allgemeine Geschäftsbedingungen", "OddsFlow"],
  },
  fr: {
    title: "Conditions d'Utilisation - CGU | OddsFlow",
    description: "Conditions Générales d'Utilisation d'OddsFlow. Lisez nos CGU pour utiliser notre plateforme de pronostics foot et analyse IA. Mise à jour janvier 2026.",
    keywords: ["conditions d'utilisation", "CGU", "conditions générales", "OddsFlow"],
  },
  ja: {
    title: "利用規約 - サービス規約 | OddsFlow",
    description: "OddsFlow利用規約。AI搭載のサッカー分析およびオッズ予測プラットフォームの利用規約をお読みください。最終更新2026年1月。",
    keywords: ["利用規約", "サービス規約", "OddsFlow規約", "ブックメーカー"],
  },
  ko: {
    title: "이용약관 - 서비스 약관 | OddsFlow",
    description: "OddsFlow 이용약관 및 서비스 약관. AI 축구 분석 및 배당률 예측 플랫폼 이용 약관을 확인하세요. 최종 업데이트 2026년 1월.",
    keywords: ["이용약관", "서비스 약관", "OddsFlow 약관", "스포츠토토"],
  },
  zh: {
    title: "服务条款 - 用户协议 | OddsFlow",
    description: "OddsFlow 服务条款和用户协议。阅读我们的 AI 足球分析和赔率预测平台使用条款。最后更新于2026年1月。",
    keywords: ["服务条款", "用户协议", "OddsFlow条款", "足球预测"],
  },
  tw: {
    title: "服務條款 - 使用者協議 | OddsFlow",
    description: "OddsFlow 服務條款和使用者協議。閱讀我們的 AI 足球分析和賠率預測平台使用條款。最後更新於2026年1月。",
    keywords: ["服務條款", "使用者協議", "OddsFlow條款", "運彩"],
  },
  id: {
    title: "Syarat Layanan - Ketentuan Penggunaan | OddsFlow",
    description: "Syarat Layanan dan Ketentuan Penggunaan OddsFlow. Baca syarat dan ketentuan untuk menggunakan platform prediksi bola AI kami. Pembaruan terakhir Januari 2026.",
    keywords: ["syarat layanan", "ketentuan penggunaan", "syarat OddsFlow", "taruhan bola"],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_METADATA[locale] || SEO_METADATA.en;
  const canonicalUrl = locale === 'en' ? `${baseUrl}/terms-of-service` : `${baseUrl}/${locale}/terms-of-service`;

  // Build alternate language URLs for hreflang
  const alternateLanguages: Record<string, string> = {
    'en': `${baseUrl}/terms-of-service`,
    'es': `${baseUrl}/es/terms-of-service`,
    'pt': `${baseUrl}/pt/terms-of-service`,
    'de': `${baseUrl}/de/terms-of-service`,
    'fr': `${baseUrl}/fr/terms-of-service`,
    'ja': `${baseUrl}/ja/terms-of-service`,
    'ko': `${baseUrl}/ko/terms-of-service`,
    'zh-CN': `${baseUrl}/zh/terms-of-service`,
    'zh-TW': `${baseUrl}/tw/terms-of-service`,
    'id': `${baseUrl}/id/terms-of-service`,
    'x-default': `${baseUrl}/terms-of-service`,
  };

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      siteName: "OddsFlow",
      url: canonicalUrl,
      locale: locale === 'zh' ? 'zh_CN' : locale === 'tw' ? 'zh_TW' : locale,
    },
    twitter: {
      card: "summary",
      title: seo.title,
      description: seo.description,
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
      },
    },
  };
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
