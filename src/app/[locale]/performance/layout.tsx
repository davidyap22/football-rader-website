import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Performance - Transparent Results | OddsFlow",
  description: "Is AI betting profitable? See our AI performance and transparent results. Safest AI football tips with proven track record. Most accurate AI football predictor performance stats.",
  keywords: [
    "AI performance",
    "transparent AI betting sites",
    "safest AI football tips",
    "Is AI betting profitable",
    "Is handicap betting profitable",
    "most accurate AI football predictor",
    "AI betting performance",
    "betting track record",
  ],
  openGraph: {
    title: "AI Performance | OddsFlow",
    description: "Transparent AI betting results. See our verified track record and performance stats.",
  },
};

export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
