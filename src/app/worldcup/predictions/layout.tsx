import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'World Cup 2026 Match Predictions | AI Betting Tips by Group | OddsFlow',
  description: 'Browse FIFA World Cup 2026 predictions by group. AI-powered betting tips for Group A to L matches. Get accurate predictions for Argentina, Brazil, Germany, France, England and all 48 teams.',
  keywords: [
    'World Cup 2026 predictions',
    'World Cup group predictions',
    'FIFA 2026 match tips',
    'World Cup Group A predictions',
    'World Cup Group B predictions',
    'Argentina World Cup predictions',
    'Brazil World Cup 2026',
    'Germany World Cup tips',
    'France World Cup predictions',
    'England World Cup betting',
    'World Cup winner odds',
    'AI World Cup predictions',
    'free World Cup betting tips',
    'World Cup match predictions',
    'World Cup 2026 USA',
    'World Cup group stage betting',
  ],
  openGraph: {
    title: 'World Cup 2026 Match Predictions by Group | AI Betting Tips',
    description: 'Browse FIFA World Cup 2026 predictions by group. AI-powered betting tips for all 48 teams from Group A to L.',
    type: 'website',
    locale: 'en_US',
    siteName: 'OddsFlow',
    images: [
      {
        url: '/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png',
        width: 800,
        height: 600,
        alt: 'World Cup 2026 Match Predictions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 Match Predictions by Group | OddsFlow',
    description: 'Browse FIFA World Cup 2026 predictions by group. AI-powered betting tips for all 48 teams.',
    images: ['/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://oddsflow.ai/worldcup/predictions',
  },
};

export default function WorldCupPredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
