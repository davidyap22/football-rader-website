import { Metadata } from 'next';
import { LEAGUES_CONFIG } from '@/lib/team-data';

const currentYear = new Date().getFullYear();

// Multi-language title templates
const titleTemplates: Record<string, (league: string, year: number) => string> = {
  en: (league, year) => `${league} Player Stats & Ratings ${year} - Top Scorers & Form | OddsFlow`,
  'zh-CN': (league, year) => `${league} 球员数据与评分 ${year} - 射手榜与状态 | OddsFlow`,
  'zh-TW': (league, year) => `${league} 球員數據與評分 ${year} - 射手榜與狀態 | OddsFlow`,
  id: (league, year) => `Statistik Pemain ${league} ${year} - Top Skor & Form | OddsFlow`,
  es: (league, year) => `Estadisticas de Jugadores ${league} ${year} - Goleadores | OddsFlow`,
  pt: (league, year) => `Estatisticas de Jogadores ${league} ${year} - Artilheiros | OddsFlow`,
  ja: (league, year) => `${league} 選手統計 ${year} - 得点王とフォーム | OddsFlow`,
  ko: (league, year) => `${league} 선수 통계 ${year} - 득점 순위 | OddsFlow`,
  de: (league, year) => `${league} Spielerstatistiken ${year} - Torjager & Form | OddsFlow`,
  fr: (league, year) => `Statistiques Joueurs ${league} ${year} - Buteurs | OddsFlow`,
};

// Multi-language descriptions
const descriptionTemplates: Record<string, (league: string, year: number) => string> = {
  en: (league, year) => `Complete ${league} player statistics ${year}. View top scorers, assists, ratings, and player form. Compare players and find the best performers in ${league}.`,
  'zh-CN': (league, year) => `${year}赛季${league}完整球员数据。查看射手榜、助攻榜、球员评分和状态。比较球员表现，找出最佳球员。`,
  'zh-TW': (league, year) => `${year}賽季${league}完整球員數據。查看射手榜、助攻榜、球員評分和狀態。比較球員表現，找出最佳球員。`,
  id: (league, year) => `Statistik pemain ${league} lengkap ${year}. Lihat top skor, assist, rating, dan form pemain.`,
  es: (league, year) => `Estadisticas completas de jugadores ${league} ${year}. Goleadores, asistencias, valoraciones y forma de los jugadores.`,
  pt: (league, year) => `Estatisticas completas de jogadores ${league} ${year}. Artilheiros, assistencias, avaliacoes e forma dos jogadores.`,
  ja: (league, year) => `${year}シーズン${league}全選手統計。得点王、アシスト、評価、フォームを確認。`,
  ko: (league, year) => `${year}시즌 ${league} 전체 선수 통계. 득점왕, 어시스트, 평점, 폼을 확인하세요.`,
  de: (league, year) => `Vollstandige ${league} Spielerstatistiken ${year}. Torjager, Vorlagen, Bewertungen und Spielerform.`,
  fr: (league, year) => `Statistiques completes des joueurs ${league} ${year}. Buteurs, passes, notes et forme des joueurs.`,
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; league: string }>
}): Promise<Metadata> {
  const { locale, league } = await params;
  const leagueConfig = LEAGUES_CONFIG[league];
  const leagueName = leagueConfig?.name || league.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const titleFn = titleTemplates[locale] || titleTemplates['en'];
  const descFn = descriptionTemplates[locale] || descriptionTemplates['en'];

  const title = titleFn(leagueName, currentYear);
  const description = descFn(leagueName, currentYear);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'OddsFlow',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function PlayersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
