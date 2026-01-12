import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Predictions - Community Football Tips",
  description: "View and share football predictions with the OddsFlow community. See what other bettors are predicting for Premier League, Bundesliga, Serie A and more matches.",
  keywords: [
    "user football predictions",
    "community betting tips",
    "shared predictions",
    "football tipster community",
    "betting picks community",
    "football prediction sharing",
  ],
  openGraph: {
    title: "User Predictions | OddsFlow Community",
    description: "Community football predictions and betting tips from fellow bettors.",
  },
  alternates: {
    canonical: "https://oddsflow.ai/community/user-predictions",
  },
};

export default function UserPredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
