import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Solution - AI-Powered Football Prediction Technology",
  description: "Discover how OddsFlow's AI technology analyzes 50+ data points per match to deliver accurate football predictions. Machine learning models for Premier League, Bundesliga, Serie A betting.",
  keywords: [
    "AI football prediction technology",
    "machine learning betting",
    "football analytics solution",
    "sports prediction AI",
    "betting algorithm",
    "xG predictions",
    "football data analysis",
    "predictive analytics sports",
  ],
  openGraph: {
    title: "Our AI Solution | OddsFlow",
    description: "Advanced AI technology for accurate football predictions. Learn how our machine learning works.",
  },
  alternates: {
    canonical: "https://oddsflow.ai/solution",
  },
};

export default function SolutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
