import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Your AI Predictions",
  description: "Access your personalized AI football predictions dashboard. View your subscription, selected leagues, betting performance and more.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
