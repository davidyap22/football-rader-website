import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { LoadingProvider } from "@/components/LoadingProvider";
import { OrganizationJsonLd, WebsiteJsonLd, SoftwareApplicationJsonLd } from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://oddsflow.ai'),
  title: {
    default: "OddsFlow - Most Accurate AI Football Predictor | European Football AI Tips",
    template: "%s | OddsFlow",
  },
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
    "football betting tips",
    "soccer predictions",
    "football odds analysis",
    "sports betting AI",
    "machine learning football",
  ],
  authors: [{ name: "OddsFlow Team" }],
  creator: "OddsFlow",
  publisher: "OddsFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "OddsFlow - Most Accurate AI Football Predictor",
    description: "European football AI tips with transparent, verified records. Premier League, Bundesliga, Serie A, La Liga & Ligue 1 predictions.",
    type: "website",
    locale: "en_US",
    siteName: "OddsFlow",
    url: "https://oddsflow.ai",
    images: [
      {
        url: "/homepage/OddsFlow Logo2.png",
        width: 1200,
        height: 630,
        alt: "OddsFlow - AI Football Predictions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OddsFlow - AI Football Predictions",
    description: "Most accurate AI football predictor. Get 1x2, handicap & over/under predictions for all European leagues.",
    images: ["/homepage/OddsFlow Logo2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: "https://oddsflow.ai",
    languages: {
      'en': 'https://oddsflow.ai',
      'zh-CN': 'https://oddsflow.ai',
      'zh-TW': 'https://oddsflow.ai',
      'ja': 'https://oddsflow.ai',
      'ko': 'https://oddsflow.ai',
      'es': 'https://oddsflow.ai',
      'pt': 'https://oddsflow.ai',
      'de': 'https://oddsflow.ai',
      'fr': 'https://oddsflow.ai',
      'id': 'https://oddsflow.ai',
    },
  },
  category: 'sports betting',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <SoftwareApplicationJsonLd />
      </head>
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
