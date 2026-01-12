import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Chat - Live Football Betting Discussion",
  description: "Join the OddsFlow global chat to discuss live football matches, share betting tips, and connect with bettors worldwide. Real-time conversation about Premier League, Bundesliga and more.",
  keywords: [
    "football betting chat",
    "live betting discussion",
    "football prediction forum",
    "betting community chat",
    "sports betting chat room",
    "Premier League chat",
  ],
  openGraph: {
    title: "Global Chat | OddsFlow Community",
    description: "Live chat with football bettors worldwide. Share tips and discuss predictions.",
  },
  alternates: {
    canonical: "https://oddsflow.ai/community/global-chat",
  },
};

export default function GlobalChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
