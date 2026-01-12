import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch",
  description: "Contact OddsFlow for support, partnerships, or feedback. We're here to help with your AI football prediction questions. Reach out via email or our contact form.",
  keywords: [
    "contact OddsFlow",
    "football prediction support",
    "betting tips help",
    "OddsFlow support",
    "AI prediction assistance",
  ],
  openGraph: {
    title: "Contact Us | OddsFlow",
    description: "Get in touch with the OddsFlow team. We're here to help!",
  },
  alternates: {
    canonical: "https://oddsflow.ai/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
