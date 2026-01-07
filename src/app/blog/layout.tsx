import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Football Betting Tips, Tutorials & Insights",
  description: "Expert football betting tutorials, AI prediction insights, and industry updates from OddsFlow. Learn bankroll management, odds formats, betting strategies and more.",
  keywords: [
    "football betting blog",
    "betting tutorials",
    "AI prediction insights",
    "bankroll management guide",
    "odds formats explained",
    "betting strategy tips",
    "football betting education",
    "sports betting guides",
    "Premier League betting tips",
    "handicap betting tutorial",
  ],
  openGraph: {
    title: "Blog | OddsFlow",
    description: "Football betting tutorials, AI insights, and expert tips from OddsFlow.",
  },
  alternates: {
    canonical: "https://oddsflow.ai/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
