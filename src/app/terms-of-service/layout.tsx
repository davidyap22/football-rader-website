import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "OddsFlow terms of service. Read our terms and conditions for using our AI football prediction platform.",
  keywords: [
    "OddsFlow terms",
    "terms of service",
    "betting platform terms",
    "user agreement",
  ],
  openGraph: {
    title: "Terms of Service | OddsFlow",
    description: "Read OddsFlow's terms of service and user agreement.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://oddsflow.ai/terms-of-service",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
