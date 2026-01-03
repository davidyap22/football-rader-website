import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'World Cup 2026 AI Prediction Accuracy | Performance Stats | OddsFlow',
  description: 'Track our AI prediction accuracy for FIFA World Cup 2026. View win rate, ROI, and performance statistics for World Cup betting tips. Transparent prediction tracking with proven results.',
  keywords: [
    'World Cup prediction accuracy',
    'AI betting performance',
    'World Cup tips win rate',
    'FIFA 2026 prediction stats',
    'World Cup betting ROI',
    'AI football accuracy',
    'World Cup prediction success rate',
    'betting tips performance',
    'World Cup AI analysis',
    'prediction tracking stats',
    'World Cup betting results',
    'AI sports predictions',
    'World Cup tipster performance',
    'football prediction accuracy',
    'World Cup betting statistics',
  ],
  openGraph: {
    title: 'World Cup 2026 AI Prediction Accuracy & Performance',
    description: 'Track our AI prediction accuracy for FIFA World Cup 2026. View win rate, ROI, and performance statistics.',
    type: 'website',
    locale: 'en_US',
    siteName: 'OddsFlow',
    images: [
      {
        url: '/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png',
        width: 800,
        height: 600,
        alt: 'World Cup 2026 AI Performance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 AI Prediction Accuracy | OddsFlow',
    description: 'Track our AI prediction accuracy for FIFA World Cup 2026. View win rate, ROI, and performance stats.',
    images: ['/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://oddsflow.ai/worldcup/ai_performance',
  },
};

export default function WorldCupAIPerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
