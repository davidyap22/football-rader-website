import type { Metadata } from "next";

// Locale-specific SEO metadata for Responsible Gaming page
const SEO_METADATA: Record<string, { title: string; description: string }> = {
  en: {
    title: "Responsible Gaming Policy | OddsFlow - Play Safe & Gamble Responsibly",
    description: "OddsFlow Responsible Gaming Policy. Learn about safe gambling practices, recognize warning signs of problem gambling, and find help resources including BeGambleAware, GamCare, and Gambling Therapy. You must be 18+ to use OddsFlow.",
  },
  es: {
    title: "Politica de Juego Responsable | OddsFlow - Juega Seguro",
    description: "Politica de Juego Responsable de OddsFlow. Aprende sobre practicas de apuestas seguras, reconoce las senales de advertencia del juego problematico y encuentra recursos de ayuda. Debes tener 18+ anos para usar OddsFlow.",
  },
  pt: {
    title: "Politica de Jogo Responsavel | OddsFlow - Jogue com Seguranca",
    description: "Politica de Jogo Responsavel da OddsFlow. Aprenda sobre praticas de apostas seguras, reconheca os sinais de alerta do jogo problematico e encontre recursos de ajuda. Voce deve ter 18+ anos para usar o OddsFlow.",
  },
  de: {
    title: "Richtlinie fur Verantwortungsvolles Spielen | OddsFlow",
    description: "OddsFlow Richtlinie fur Verantwortungsvolles Spielen. Erfahren Sie mehr uber sichere Wettgewohnheiten, erkennen Sie Warnsignale fur problematisches Spielen und finden Sie Hilfsressourcen. Sie mussen 18+ Jahre alt sein.",
  },
  fr: {
    title: "Politique de Jeu Responsable | OddsFlow - Jouez en Securite",
    description: "Politique de Jeu Responsable d'OddsFlow. Decouvrez les pratiques de paris securitaires, reconnaissez les signes d'alerte du jeu problematique et trouvez des ressources d'aide. Vous devez avoir 18+ ans pour utiliser OddsFlow.",
  },
  ja: {
    title: "責任あるゲーミングポリシー | OddsFlow - 安全なギャンブル",
    description: "OddsFlow責任あるゲーミングポリシー。安全なギャンブル習慣、問題ギャンブルの警告サイン、サポートリソースについて学びましょう。OddsFlowの利用には18歳以上である必要があります。",
  },
  ko: {
    title: "책임감 있는 게임 정책 | OddsFlow - 안전한 도박",
    description: "OddsFlow 책임감 있는 게임 정책. 안전한 도박 관행, 문제 도박의 경고 신호, 도움 자원에 대해 알아보세요. OddsFlow를 사용하려면 18세 이상이어야 합니다.",
  },
  zh: {
    title: "负责任博彩政策 | OddsFlow - 安全博彩",
    description: "OddsFlow负责任博彩政策。了解安全博彩习惯、识别问题博彩的警告信号并找到帮助资源。使用OddsFlow必须年满18岁。",
  },
  tw: {
    title: "負責任博彩政策 | OddsFlow - 安全博彩",
    description: "OddsFlow負責任博彩政策。了解安全博彩習慣、識別問題博彩的警告信號並找到幫助資源。使用OddsFlow必須年滿18歲。",
  },
  id: {
    title: "Kebijakan Perjudian Bertanggung Jawab | OddsFlow - Bermain Aman",
    description: "Kebijakan Perjudian Bertanggung Jawab OddsFlow. Pelajari tentang praktik taruhan yang aman, kenali tanda-tanda peringatan perjudian bermasalah, dan temukan sumber bantuan. Anda harus berusia 18+ untuk menggunakan OddsFlow.",
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
    keywords: [
      "responsible gaming",
      "responsible gambling",
      "OddsFlow responsible gaming",
      "gambling addiction help",
      "problem gambling support",
      "safe betting practices",
      "BeGambleAware",
      "GamCare",
      "18+ gambling",
      "gambling risk awareness",
    ],
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
      canonical: `https://www.oddsflow.ai/${locale === 'en' ? '' : locale + '/'}responsible-gaming`,
    },
  };
}

export default function ResponsibleGamingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
