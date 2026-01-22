import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsible Gaming | OddsFlow - Play Safe & Gamble Responsibly",
  description: "OddsFlow Responsible Gaming Policy. Learn about safe gambling practices, recognize warning signs of problem gambling, and find help resources including BeGambleAware, GamCare, and Gambling Therapy. You must be 18+ to use OddsFlow.",
  keywords: [
    "responsible gaming",
    "responsible gambling",
    "OddsFlow responsible gaming",
    "gambling addiction help",
    "problem gambling support",
    "safe betting practices",
    "BeGambleAware",
    "GamCare",
    "18+ gambling",
    "gambling risk awareness",
  ],
  openGraph: {
    title: "Responsible Gaming | OddsFlow - Play Safe & Gamble Responsibly",
    description: "Learn about responsible gaming practices and find support resources for problem gambling. OddsFlow promotes safe and informed decision-making.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.oddsflow.ai/responsible-gaming",
  },
};

export default function ResponsibleGamingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
