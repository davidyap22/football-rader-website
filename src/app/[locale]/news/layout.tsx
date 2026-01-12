import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football News & Betting Analysis | OddsFlow",
  description: "Latest football news, match previews, and AI betting analysis. Stay updated with Premier League, Bundesliga, Serie A, La Liga & Champions League news.",
  keywords: [
    "football news",
    "betting analysis",
    "match previews",
    "Premier League news",
    "Champions League betting analysis AI",
    "European football news",
  ],
  openGraph: {
    title: "Football News & Analysis | OddsFlow",
    description: "Latest football news and AI betting analysis for all European leagues.",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
