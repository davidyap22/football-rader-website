import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "European League Predictions - EPL, Bundesliga, Serie A, La Liga, Ligue 1 | OddsFlow",
  description: "Top 5 betting predictions for all major European leagues. EPL top 5 betting predictions, Bundesliga AI betting predictions, Serie A artificial intelligence picks, La Liga & Ligue 1 AI prediction model.",
  keywords: [
    "EPL top 5 betting predictions",
    "Bundesliga top 5 betting predictions",
    "Serie A top 5 betting predictions",
    "La Liga top 5 betting predictions",
    "Ligue 1 top 5 betting predictions",
    "Premier League AI predictor",
    "Bundesliga AI betting predictions",
    "Serie A artificial intelligence picks",
    "Ligue 1 AI prediction model",
    "Champions League betting analysis AI",
    "European football AI tips",
  ],
  openGraph: {
    title: "European League Predictions | OddsFlow",
    description: "AI predictions for Premier League, Bundesliga, Serie A, La Liga, Ligue 1 & Champions League.",
  },
};

export default function LeaguesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
