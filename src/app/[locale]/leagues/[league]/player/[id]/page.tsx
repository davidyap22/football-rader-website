import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getPlayerData, extractPlayerIdFromSlug, playerNameToSlug, LEAGUES_CONFIG } from '@/lib/team-data';
import PlayerDetailClient from './PlayerDetailClient';

interface PageProps {
  params: Promise<{
    locale: string;
    league: string;
    id: string;
  }>;
}

const currentYear = new Date().getFullYear();

// Multi-language title templates
const titleTemplates: Record<string, (name: string, league: string, year: number) => string> = {
  en: (name, league, year) => `${name} Stats, Goals & Rating ${year} | ${league} | OddsFlow`,
  es: (name, league, year) => `${name} Estadísticas, Goles y Rating ${year} | ${league} | OddsFlow`,
  pt: (name, league, year) => `${name} Estatísticas, Gols e Rating ${year} | ${league} | OddsFlow`,
  de: (name, league, year) => `${name} Statistiken, Tore & Bewertung ${year} | ${league} | OddsFlow`,
  fr: (name, league, year) => `${name} Stats, Buts & Note ${year} | ${league} | OddsFlow`,
  ja: (name, league, year) => `${name} 統計・ゴール・評価 ${year} | ${league} | OddsFlow`,
  ko: (name, league, year) => `${name} 통계, 골 & 평점 ${year} | ${league} | OddsFlow`,
  zh: (name, league, year) => `${name} 数据统计、进球与评分 ${year} | ${league} | OddsFlow`,
  tw: (name, league, year) => `${name} 數據統計、進球與評分 ${year} | ${league} | OddsFlow`,
  id: (name, league, year) => `${name} Statistik, Gol & Rating ${year} | ${league} | OddsFlow`,
};

// Multi-language description templates
const descriptionTemplates: Record<string, (name: string, team: string, league: string, goals: number, assists: number, rating: number, year: number) => string> = {
  en: (name, team, league, goals, assists, rating, year) =>
    `${name} (${team}) ${league} ${year} season stats: ${goals} goals, ${assists} assists, ${rating.toFixed(1)} rating. Full player profile with shooting, passing, defending stats.`,
  es: (name, team, league, goals, assists, rating, year) =>
    `${name} (${team}) estadísticas ${league} ${year}: ${goals} goles, ${assists} asistencias, valoración ${rating.toFixed(1)}. Perfil completo del jugador.`,
  pt: (name, team, league, goals, assists, rating, year) =>
    `${name} (${team}) estatísticas ${league} ${year}: ${goals} gols, ${assists} assistências, nota ${rating.toFixed(1)}. Perfil completo do jogador.`,
  de: (name, team, league, goals, assists, rating, year) =>
    `${name} (${team}) ${league} ${year} Statistiken: ${goals} Tore, ${assists} Vorlagen, Bewertung ${rating.toFixed(1)}. Vollständiges Spielerprofil.`,
  fr: (name, team, league, goals, assists, rating, year) =>
    `${name} (${team}) stats ${league} ${year}: ${goals} buts, ${assists} passes, note ${rating.toFixed(1)}. Profil complet du joueur.`,
  ja: (name, team, league, goals, assists, rating, year) =>
    `${name}（${team}）${league} ${year}シーズン統計：${goals}ゴール、${assists}アシスト、評価${rating.toFixed(1)}。選手の完全プロフィール。`,
  ko: (name, team, league, goals, assists, rating, year) =>
    `${name} (${team}) ${league} ${year} 시즌 통계: ${goals}골, ${assists}도움, 평점 ${rating.toFixed(1)}. 선수 전체 프로필.`,
  zh: (name, team, league, goals, assists, rating, year) =>
    `${name}（${team}）${league} ${year}赛季数据：${goals}进球，${assists}助攻，评分${rating.toFixed(1)}。完整球员资料。`,
  tw: (name, team, league, goals, assists, rating, year) =>
    `${name}（${team}）${league} ${year}賽季數據：${goals}進球，${assists}助攻，評分${rating.toFixed(1)}。完整球員資料。`,
  id: (name, team, league, goals, assists, rating, year) =>
    `${name} (${team}) statistik ${league} ${year}: ${goals} gol, ${assists} assist, rating ${rating.toFixed(1)}. Profil pemain lengkap.`,
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, league, id } = await params;

  const playerId = extractPlayerIdFromSlug(id);
  if (!playerId) {
    return { title: 'Player Not Found | OddsFlow' };
  }

  const player = await getPlayerData(playerId);
  if (!player) {
    return { title: 'Player Not Found | OddsFlow' };
  }

  const leagueConfig = LEAGUES_CONFIG[league];
  const leagueName = leagueConfig?.name || league;
  const playerName = player.player_name || 'Unknown Player';
  const teamName = player.team_name || '';
  const goals = player.goals_total || 0;
  const assists = player.assists || 0;
  const rating = player.rating || 0;

  const titleFn = titleTemplates[locale] || titleTemplates['en'];
  const descFn = descriptionTemplates[locale] || descriptionTemplates['en'];

  const title = titleFn(playerName, leagueName, currentYear);
  const description = descFn(playerName, teamName, leagueName, goals, assists, rating, currentYear);

  // Generate canonical URL with player name slug
  const playerSlug = playerNameToSlug(playerName);
  const canonicalPath = locale === 'en'
    ? `/leagues/${league}/player/${playerSlug}-${player.id}`
    : `/${locale}/leagues/${league}/player/${playerSlug}-${player.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.oddsflow.ai${canonicalPath}`,
    },
    openGraph: {
      title,
      description,
      type: 'profile',
      images: player.photo ? [{ url: player.photo, alt: playerName }] : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: player.photo ? [player.photo] : undefined,
    },
  };
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const { locale, league, id } = await params;

  // Extract player ID from slug (supports both "3049" and "harry-kane-3049")
  const playerId = extractPlayerIdFromSlug(id);
  if (!playerId) {
    notFound();
  }

  // Fetch player data on the server
  const player = await getPlayerData(playerId);
  if (!player) {
    notFound();
  }

  // Check if URL needs to be redirected to SEO-friendly version
  const playerSlug = playerNameToSlug(player.player_name);
  const expectedSlug = `${playerSlug}-${player.id}`;

  // If URL is just the ID (e.g., /player/3049), redirect to SEO-friendly URL
  if (id !== expectedSlug && /^\d+$/.test(id)) {
    const newPath = locale === 'en'
      ? `/leagues/${league}/player/${expectedSlug}`
      : `/${locale}/leagues/${league}/player/${expectedSlug}`;
    redirect(newPath);
  }

  return (
    <PlayerDetailClient
      player={player}
      locale={locale}
      leagueSlug={league}
    />
  );
}
