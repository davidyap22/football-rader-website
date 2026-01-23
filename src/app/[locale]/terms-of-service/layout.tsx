import type { Metadata } from "next";

// Locale-specific SEO metadata for Terms of Service page
const SEO_METADATA: Record<string, { title: string; description: string }> = {
  en: {
    title: "Terms of Service - User Agreement | OddsFlow",
    description: "OddsFlow Terms of Service and User Agreement. Read our terms and conditions for using our AI-powered football analytics and odds prediction platform. Last updated January 2026.",
  },
  es: {
    title: "Términos de Servicio - Acuerdo de Usuario | OddsFlow",
    description: "Términos de Servicio y Acuerdo de Usuario de OddsFlow. Lee nuestros términos y condiciones para usar nuestra plataforma de análisis de fútbol y predicción de cuotas con IA. Última actualización enero 2026.",
  },
  pt: {
    title: "Termos de Serviço - Acordo do Usuário | OddsFlow",
    description: "Termos de Serviço e Acordo do Usuário da OddsFlow. Leia nossos termos e condições para usar nossa plataforma de análise de futebol e previsão de odds com IA. Última atualização janeiro 2026.",
  },
  de: {
    title: "Nutzungsbedingungen - Benutzervereinbarung | OddsFlow",
    description: "OddsFlow Nutzungsbedingungen und Benutzervereinbarung. Lesen Sie unsere Geschäftsbedingungen für die Nutzung unserer KI-gestützten Fußball-Analyse- und Quotenvorhersage-Plattform. Letzte Aktualisierung Januar 2026.",
  },
  fr: {
    title: "Conditions d'Utilisation - Accord Utilisateur | OddsFlow",
    description: "Conditions d'Utilisation et Accord Utilisateur d'OddsFlow. Lisez nos termes et conditions pour utiliser notre plateforme d'analyse de football et de prédiction de cotes alimentée par l'IA. Dernière mise à jour janvier 2026.",
  },
  ja: {
    title: "利用規約 - ユーザー契約 | OddsFlow",
    description: "OddsFlow利用規約およびユーザー契約。AI搭載のサッカー分析およびオッズ予測プラットフォームの利用規約をお読みください。最終更新2026年1月。",
  },
  ko: {
    title: "이용약관 - 사용자 계약 | OddsFlow",
    description: "OddsFlow 이용약관 및 사용자 계약. AI 기반 축구 분석 및 배당률 예측 플랫폼 이용을 위한 약관을 읽어보세요. 최종 업데이트 2026년 1월.",
  },
  zh: {
    title: "服务条款 - 用户协议 | OddsFlow",
    description: "OddsFlow 服务条款和用户协议。阅读我们的 AI 足球分析和赔率预测平台使用条款和条件。最后更新于2026年1月。",
  },
  tw: {
    title: "服務條款 - 用戶協議 | OddsFlow",
    description: "OddsFlow 服務條款和用戶協議。閱讀我們的 AI 足球分析和賠率預測平台使用條款和條件。最後更新於2026年1月。",
  },
  id: {
    title: "Syarat Layanan - Perjanjian Pengguna | OddsFlow",
    description: "Syarat Layanan dan Perjanjian Pengguna OddsFlow. Baca syarat dan ketentuan kami untuk menggunakan platform analisis sepak bola dan prediksi odds bertenaga AI. Pembaruan terakhir Januari 2026.",
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
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.oddsflow.ai/${locale === 'en' ? '' : locale + '/'}terms-of-service`,
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
