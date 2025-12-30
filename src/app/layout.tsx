import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { LoadingProvider } from "@/components/LoadingProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OddsFlow - Most Accurate AI Football Predictor | European Football AI Tips",
  description: "Most accurate AI football predictor for Premier League, Bundesliga, Serie A, La Liga & Ligue 1. Get 1x2 predictions, handicap betting tips, over/under analysis. Transparent AI betting with verified records.",
  keywords: [
    "AI football predictions",
    "Premier League AI predictor",
    "Bundesliga AI betting predictions",
    "Serie A artificial intelligence picks",
    "La Liga betting predictions",
    "Ligue 1 AI prediction model",
    "Champions League betting analysis AI",
    "most accurate AI football predictor",
    "best AI for handicap betting",
    "transparent AI betting sites",
    "verified AI betting records",
    "1x2 predictions today",
    "over 2.5 goals stats",
    "handicap draw prediction",
    "European football AI tips",
  ],
  openGraph: {
    title: "OddsFlow - Most Accurate AI Football Predictor",
    description: "European football AI tips with transparent, verified records. Premier League, Bundesliga, Serie A, La Liga & Ligue 1 predictions.",
    type: "website",
    locale: "en_US",
    siteName: "OddsFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "OddsFlow - AI Football Predictions",
    description: "Most accurate AI football predictor. Get 1x2, handicap & over/under predictions for all European leagues.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0f] text-white`}
      >
        <Suspense fallback={null}>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </Suspense>
      </body>
    </html>
  );
}
