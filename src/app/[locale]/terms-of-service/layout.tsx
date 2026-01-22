import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | OddsFlow - User Agreement",
  description: "OddsFlow Terms of Service and User Agreement. Read our terms and conditions for using our AI-powered football analytics and odds prediction platform. Last updated January 2026.",
  keywords: [
    "OddsFlow terms of service",
    "OddsFlow user agreement",
    "sports analytics terms",
    "AI prediction platform terms",
    "football betting analysis terms",
  ],
  openGraph: {
    title: "Terms of Service | OddsFlow - User Agreement",
    description: "Read OddsFlow's Terms of Service and User Agreement for our AI football analytics platform.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.oddsflow.ai/terms-of-service",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
