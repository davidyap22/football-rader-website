import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout - Complete Your Subscription",
  description: "Complete your OddsFlow subscription to access AI football predictions for all major European leagues.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
