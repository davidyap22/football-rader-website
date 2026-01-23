import type { Metadata } from "next";

// Locale-specific SEO metadata for Privacy Policy page
const SEO_METADATA: Record<string, { title: string; description: string }> = {
  en: {
    title: "Privacy Policy | OddsFlow",
    description: "OddsFlow privacy policy. Learn how we collect, use, and protect your personal information on our AI football prediction platform.",
  },
  es: {
    title: "Política de Privacidad | OddsFlow",
    description: "Política de privacidad de OddsFlow. Conoce cómo recopilamos, usamos y protegemos tu información personal en nuestra plataforma de predicción de fútbol con IA.",
  },
  pt: {
    title: "Política de Privacidade | OddsFlow",
    description: "Política de privacidade da OddsFlow. Saiba como coletamos, usamos e protegemos suas informações pessoais em nossa plataforma de previsão de futebol com IA.",
  },
  de: {
    title: "Datenschutzrichtlinie | OddsFlow",
    description: "OddsFlow Datenschutzrichtlinie. Erfahren Sie, wie wir Ihre persönlichen Daten auf unserer KI-Fußballvorhersage-Plattform erfassen, verwenden und schützen.",
  },
  fr: {
    title: "Politique de Confidentialité | OddsFlow",
    description: "Politique de confidentialité d'OddsFlow. Découvrez comment nous collectons, utilisons et protégeons vos informations personnelles sur notre plateforme de pronostics foot IA.",
  },
  ja: {
    title: "プライバシーポリシー | OddsFlow",
    description: "OddsFlowプライバシーポリシー。AIサッカー予測プラットフォームでの個人情報の収集、使用、保護について説明します。",
  },
  ko: {
    title: "개인정보 처리방침 | OddsFlow",
    description: "OddsFlow 개인정보 처리방침. AI 축구 예측 플랫폼에서 개인정보를 수집, 사용 및 보호하는 방법을 알아보세요.",
  },
  zh: {
    title: "隐私政策 | OddsFlow",
    description: "OddsFlow 隐私政策。了解我们如何在 AI 足球预测平台上收集、使用和保护您的个人信息。",
  },
  tw: {
    title: "隱私政策 | OddsFlow",
    description: "OddsFlow 隱私政策。了解我們如何在 AI 足球預測平台上收集、使用和保護您的個人資訊。",
  },
  id: {
    title: "Kebijakan Privasi | OddsFlow",
    description: "Kebijakan privasi OddsFlow. Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda di platform prediksi sepak bola AI kami.",
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
      canonical: `https://www.oddsflow.ai/${locale === 'en' ? '' : locale + '/'}privacy-policy`,
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
