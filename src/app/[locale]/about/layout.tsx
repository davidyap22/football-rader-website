import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - AI Football Prediction Platform",
  description: "Learn about OddsFlow, the leading AI football prediction platform. Our mission is to provide transparent, data-driven betting insights using advanced machine learning technology.",
  keywords: [
    "about OddsFlow",
    "AI football prediction company",
    "sports betting AI platform",
    "machine learning football",
    "football analytics company",
    "betting prediction technology",
  ],
  openGraph: {
    title: "About OddsFlow | AI Football Predictions",
    description: "Discover how OddsFlow uses AI and machine learning to deliver accurate football predictions.",
  },
  alternates: {
    canonical: "https://oddsflow.ai/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
