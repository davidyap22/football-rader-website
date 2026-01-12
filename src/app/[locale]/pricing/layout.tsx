import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - AI Football Prediction Plans",
  description: "Choose the perfect OddsFlow plan for AI football predictions. Free trial, weekly, monthly & yearly subscriptions. Access Premier League, Bundesliga, Serie A, La Liga predictions with transparent pricing.",
  keywords: [
    "football prediction pricing",
    "AI betting subscription",
    "sports prediction plans",
    "betting tips subscription",
    "football AI pricing",
    "OddsFlow plans",
    "betting analysis subscription",
  ],
  openGraph: {
    title: "Pricing Plans | OddsFlow",
    description: "Affordable AI football prediction plans. Start with a free trial and upgrade anytime.",
  },
  alternates: {
    canonical: "https://oddsflow.ai/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
