import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started - Free Trial for AI Football Predictions",
  description: "Start your free 7-day trial with OddsFlow. Get AI-powered football predictions for Premier League, Bundesliga, Serie A, La Liga. No credit card required.",
  keywords: [
    "free football predictions",
    "AI betting free trial",
    "OddsFlow signup",
    "football prediction trial",
    "free betting tips",
    "Premier League free predictions",
    "sports betting free trial",
  ],
  openGraph: {
    title: "Get Started Free | OddsFlow",
    description: "Start your free 7-day trial. AI football predictions for all major European leagues.",
  },
  alternates: {
    canonical: "https://oddsflow.ai/get-started",
  },
};

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
