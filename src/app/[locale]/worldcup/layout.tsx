import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Predictions | AI Football Betting Tips | OddsFlow',
  description: 'Get AI-powered predictions for FIFA World Cup 2026 matches. Expert betting tips, odds analysis, and match predictions for all 48 teams. Free football predictions with high accuracy.',
  keywords: [
    'FIFA World Cup 2026',
    'World Cup predictions',
    'World Cup betting tips',
    'FIFA 2026 odds',
    'World Cup AI predictions',
    'football betting predictions',
    'soccer World Cup tips',
    'World Cup match analysis',
    'FIFA World Cup USA Mexico Canada',
    'World Cup winner predictions',
    'World Cup group stage predictions',
    'free World Cup tips',
    'World Cup betting odds',
    'AI football predictions',
    'World Cup 2026 fixtures',
  ],
  openGraph: {
    title: 'FIFA World Cup 2026 Predictions | AI Football Betting Tips',
    description: 'Get AI-powered predictions for FIFA World Cup 2026 matches. Expert betting tips, odds analysis, and match predictions for all 48 teams.',
    type: 'website',
    locale: 'en_US',
    siteName: 'OddsFlow',
    images: [
      {
        url: '/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png',
        width: 800,
        height: 600,
        alt: 'FIFA World Cup 2026 Predictions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIFA World Cup 2026 Predictions | AI Football Betting Tips',
    description: 'Get AI-powered predictions for FIFA World Cup 2026 matches. Expert betting tips and odds analysis.',
    images: ['/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png'],
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
  alternates: {
    canonical: 'https://oddsflow.ai/worldcup',
  },
};

export default function WorldCupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
