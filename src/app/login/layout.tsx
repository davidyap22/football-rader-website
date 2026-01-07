import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Access Your Account",
  description: "Log in to OddsFlow to access AI football predictions, track your betting performance, and view personalized insights for Premier League, Bundesliga, Serie A and more.",
  keywords: [
    "OddsFlow login",
    "football prediction login",
    "betting account login",
    "AI predictions access",
  ],
  openGraph: {
    title: "Login | OddsFlow",
    description: "Access your OddsFlow account for AI football predictions.",
  },
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "https://oddsflow.ai/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
