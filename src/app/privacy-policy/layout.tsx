import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "OddsFlow privacy policy. Learn how we collect, use, and protect your personal information on our AI football prediction platform.",
  keywords: [
    "OddsFlow privacy",
    "privacy policy",
    "data protection",
    "user privacy",
  ],
  openGraph: {
    title: "Privacy Policy | OddsFlow",
    description: "Read OddsFlow's privacy policy and data protection practices.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://oddsflow.ai/privacy-policy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
