import type { Metadata } from "next";

const baseUrl = 'https://www.oddsflow.ai';

export const metadata: Metadata = {
  title: "Football Odds Guide | How to Interpret Betting Odds - OddsFlow Blog",
  description: "Learn how to interpret football odds, calculate implied probability, and understand betting markets. Expert guides on Asian handicap, over/under, 1X2 betting, and AI football predictions.",
  keywords: [
    "how to interpret football odds",
    "football betting odds explained",
    "implied probability betting",
    "Asian handicap betting guide",
    "over under betting explained",
    "decimal odds vs fractional odds",
    "bookmaker margin calculator",
    "AI football predictions",
    "football betting tutorials",
    "odds movement analysis",
    "sharp money betting",
    "responsible gambling guide",
    "Premier League odds",
    "Bundesliga betting tips",
    "Serie A predictions",
  ],
  openGraph: {
    title: "Football Odds Guide | OddsFlow Blog",
    description: "Learn how to interpret football odds, calculate implied probability, and make smarter betting decisions with AI-powered insights.",
    type: "website",
    siteName: "OddsFlow",
    images: [
      {
        url: "/homepage/OddsFlow Logo2.png",
        width: 1200,
        height: 630,
        alt: "OddsFlow Football Odds Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Football Odds Guide | OddsFlow Blog",
    description: "Learn how to interpret football odds, calculate implied probability, and make smarter betting decisions.",
    images: ["/homepage/OddsFlow Logo2.png"],
  },
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
