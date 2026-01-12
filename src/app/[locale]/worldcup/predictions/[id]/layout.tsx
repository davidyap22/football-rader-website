import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'World Cup 2026 Match Prediction & Odds Analysis | OddsFlow',
  description: 'Detailed AI prediction and odds analysis for FIFA World Cup 2026 match. Get betting tips, head-to-head stats, team comparison, and expert insights for this World Cup fixture.',
  keywords: [
    'World Cup match prediction',
    'FIFA 2026 betting tips',
    'World Cup odds analysis',
    'World Cup team comparison',
    'World Cup head to head',
    'AI match prediction',
    'World Cup betting odds',
    'World Cup fixture analysis',
    'World Cup match preview',
    'football prediction tips',
    'World Cup game prediction',
    'World Cup expert tips',
  ],
  openGraph: {
    title: 'World Cup 2026 Match Prediction & Odds Analysis',
    description: 'Detailed AI prediction and odds analysis for this FIFA World Cup 2026 match. Get betting tips and expert insights.',
    type: 'website',
    locale: 'en_US',
    siteName: 'OddsFlow',
    images: [
      {
        url: '/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png',
        width: 800,
        height: 600,
        alt: 'World Cup 2026 Match Prediction',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 Match Prediction | OddsFlow',
    description: 'Detailed AI prediction and odds analysis for this FIFA World Cup 2026 match.',
    images: ['/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function WorldCupMatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
