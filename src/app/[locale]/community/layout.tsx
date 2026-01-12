import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football Betting Community - AI Predictions Discussion | OddsFlow",
  description: "Join the OddsFlow community to discuss AI football predictions, share betting tips, and learn from experienced bettors. European football AI tips and strategies.",
  keywords: [
    "football betting community",
    "AI predictions discussion",
    "betting tips forum",
    "European football AI tips",
    "handicap betting strategies",
  ],
  openGraph: {
    title: "Football Betting Community | OddsFlow",
    description: "Discuss AI predictions and betting strategies with fellow football enthusiasts.",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
