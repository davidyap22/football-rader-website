import type { Metadata } from "next";

// Locale-specific SEO metadata for Privacy Policy page
// Optimized with local keywords for data protection/GDPR terminology
const SEO_METADATA: Record<string, { title: string; description: string }> = {
  en: {
    title: "Privacy Policy - Data Protection | OddsFlow",
    description: "OddsFlow privacy policy and data protection practices. Learn how we collect, use, and protect your personal information on our AI football prediction platform. GDPR compliant.",
  },
  es: {
    title: "Política de Privacidad - Protección de Datos | OddsFlow",
    description: "Política de privacidad y protección de datos de OddsFlow. Conoce cómo recopilamos, usamos y protegemos tu información personal en nuestra plataforma de predicción de fútbol con IA. Cumplimiento RGPD.",
  },
  pt: {
    title: "Política de Privacidade - Proteção de Dados | OddsFlow",
    description: "Política de privacidade e proteção de dados da OddsFlow. Saiba como coletamos, usamos e protegemos suas informações pessoais. Conforme LGPD e RGPD.",
  },
  de: {
    title: "Datenschutzrichtlinie - DSGVO Konform | OddsFlow",
    description: "OddsFlow Datenschutzrichtlinie und Datenschutzerklärung. Erfahren Sie, wie wir Ihre persönlichen Daten gemäß DSGVO auf unserer KI-Fußballvorhersage-Plattform erfassen und schützen.",
  },
  fr: {
    title: "Politique de Confidentialité - Protection des Données | OddsFlow",
    description: "Politique de confidentialité et protection des données personnelles d'OddsFlow. Conforme RGPD. Découvrez comment nous protégeons vos informations sur notre plateforme de pronostics foot IA.",
  },
  ja: {
    title: "プライバシーポリシー - 個人情報保護方針 | OddsFlow",
    description: "OddsFlowプライバシーポリシーと個人情報保護方針。AIサッカー予測プラットフォームでの個人情報の収集、使用、保護について詳しく説明します。",
  },
  ko: {
    title: "개인정보 처리방침 - 개인정보 보호 | OddsFlow",
    description: "OddsFlow 개인정보 처리방침 및 개인정보 보호정책. AI 축구 예측 플랫폼에서 개인정보를 어떻게 수집, 사용, 보호하는지 알아보세요.",
  },
  zh: {
    title: "隐私政策 - 数据保护声明 | OddsFlow",
    description: "OddsFlow 隐私政策与数据保护声明。了解我们如何在 AI 足球预测平台上依法收集、使用和保护您的个人信息。",
  },
  tw: {
    title: "隱私政策 - 個人資料保護 | OddsFlow",
    description: "OddsFlow 隱私政策與個人資料保護聲明。了解我們如何在 AI 足球預測平台上收集、使用和保護您的個人資訊。",
  },
  id: {
    title: "Kebijakan Privasi - Perlindungan Data | OddsFlow",
    description: "Kebijakan privasi dan perlindungan data OddsFlow. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda di platform prediksi sepak bola AI kami.",
  },
};

const baseUrl = 'https://www.oddsflow.ai';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = SEO_METADATA[locale] || SEO_METADATA.en;
  const canonicalUrl = locale === 'en' ? `${baseUrl}/privacy-policy` : `${baseUrl}/${locale}/privacy-policy`;

  // Build alternate language URLs for hreflang
  const alternateLanguages: Record<string, string> = {
    'en': `${baseUrl}/privacy-policy`,
    'es': `${baseUrl}/es/privacy-policy`,
    'pt': `${baseUrl}/pt/privacy-policy`,
    'de': `${baseUrl}/de/privacy-policy`,
    'fr': `${baseUrl}/fr/privacy-policy`,
    'ja': `${baseUrl}/ja/privacy-policy`,
    'ko': `${baseUrl}/ko/privacy-policy`,
    'zh-CN': `${baseUrl}/zh/privacy-policy`,
    'zh-TW': `${baseUrl}/tw/privacy-policy`,
    'id': `${baseUrl}/id/privacy-policy`,
    'x-default': `${baseUrl}/privacy-policy`,
  };

  return {
    title: seo.title,
    description: seo.description,
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

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
