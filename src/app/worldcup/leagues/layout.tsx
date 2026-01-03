import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'World Cup 2026 Group Standings & Tables | FIFA Tournament Leagues | OddsFlow',
  description: 'View FIFA World Cup 2026 group standings and league tables. Track all 12 groups from Group A to L, team rankings, points, goal difference and qualification status for knockout rounds.',
  keywords: [
    'World Cup 2026 standings',
    'FIFA World Cup group tables',
    'World Cup 2026 groups',
    'World Cup league standings',
    'FIFA 2026 group rankings',
    'World Cup points table',
    'World Cup Group A standings',
    'World Cup knockout qualification',
    'World Cup 2026 teams',
    'FIFA tournament standings',
    'World Cup goal difference',
    'World Cup group stage table',
    'World Cup 2026 USA Mexico Canada',
    '48 team World Cup groups',
    'World Cup qualification standings',
  ],
  openGraph: {
    title: 'World Cup 2026 Group Standings & Tables | FIFA Tournament',
    description: 'View FIFA World Cup 2026 group standings and league tables. Track all 12 groups, team rankings and qualification status.',
    type: 'website',
    locale: 'en_US',
    siteName: 'OddsFlow',
    images: [
      {
        url: '/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png',
        width: 800,
        height: 600,
        alt: 'World Cup 2026 Group Standings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Cup 2026 Group Standings & Tables | OddsFlow',
    description: 'View FIFA World Cup 2026 group standings and league tables. Track all 12 groups and qualification status.',
    images: ['/homepage/FIFA-2026-World-Cup-Logo-removebg-preview.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://oddsflow.ai/worldcup/leagues',
  },
};

export default function WorldCupLeaguesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
