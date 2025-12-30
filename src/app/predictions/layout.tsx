import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Football Predictions Today - 1x2, Handicap & Over/Under | OddsFlow",
  description: "Get today's most accurate AI football predictions. Premier League 1x2 predictions, over 2.5 goals stats, handicap draw prediction & English Premier League draw predictions. Best AI for handicap betting.",
  keywords: [
    "Premier League 1x2 predictions today",
    "Premier League over 2.5 goals stats",
    "English Premier League draw predictions",
    "handicap draw prediction",
    "AI football predictions today",
    "best AI for handicap betting",
    "over under predictions",
  ],
  openGraph: {
    title: "AI Football Predictions Today | OddsFlow",
    description: "Premier League, Bundesliga, Serie A predictions. 1x2, handicap & over/under AI analysis.",
  },
};

export default function PredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
