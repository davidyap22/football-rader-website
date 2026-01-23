import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import {
  getPlayerData,
  extractPlayerIdFromSlug,
  playerNameToSlug,
  LEAGUES_CONFIG,
  getLocalizedPlayerDetailName,
  getLocalizedPlayerDetailTeamName
} from '@/lib/team-data';
import PlayerDetailClient from './PlayerDetailClient';

interface PageProps {
  params: Promise<{
    locale: string;
    league: string;
    id: string;
  }>;
}

const currentYear = new Date().getFullYear();

// Localized league names for SEO
const LEAGUE_NAMES_LOCALIZED: Record<string, Record<string, string>> = {
  'premier-league': {
    en: 'Premier League', es: 'Premier League', pt: 'Premier League', de: 'Premier League',
    fr: 'Premier League', ja: 'プレミアリーグ', ko: '프리미어리그', zh: '英超', tw: '英超', id: 'Liga Inggris',
  },
  'la-liga': {
    en: 'La Liga', es: 'La Liga', pt: 'La Liga', de: 'La Liga',
    fr: 'La Liga', ja: 'ラ・リーガ', ko: '라리가', zh: '西甲', tw: '西甲', id: 'La Liga',
  },
  'bundesliga': {
    en: 'Bundesliga', es: 'Bundesliga', pt: 'Bundesliga', de: 'Bundesliga',
    fr: 'Bundesliga', ja: 'ブンデスリーガ', ko: '분데스리가', zh: '德甲', tw: '德甲', id: 'Bundesliga',
  },
  'serie-a': {
    en: 'Serie A', es: 'Serie A', pt: 'Serie A', de: 'Serie A',
    fr: 'Serie A', ja: 'セリエA', ko: '세리에 A', zh: '意甲', tw: '義甲', id: 'Serie A',
  },
  'ligue-1': {
    en: 'Ligue 1', es: 'Ligue 1', pt: 'Ligue 1', de: 'Ligue 1',
    fr: 'Ligue 1', ja: 'リーグ・アン', ko: '리그 1', zh: '法甲', tw: '法甲', id: 'Ligue 1',
  },
  'champions-league': {
    en: 'Champions League', es: 'Liga de Campeones', pt: 'Liga dos Campeões', de: 'Champions League',
    fr: 'Ligue des Champions', ja: 'チャンピオンズリーグ', ko: '챔피언스리그', zh: '欧冠', tw: '歐冠', id: 'Liga Champions',
  },
  'europa-league': {
    en: 'Europa League', es: 'Liga Europa', pt: 'Liga Europa', de: 'Europa League',
    fr: 'Ligue Europa', ja: 'ヨーロッパリーグ', ko: '유로파리그', zh: '欧联', tw: '歐聯', id: 'Liga Europa',
  },
};

const getLocalizedLeagueName = (leagueSlug: string, locale: string): string => {
  return LEAGUE_NAMES_LOCALIZED[leagueSlug]?.[locale] ||
    LEAGUES_CONFIG[leagueSlug]?.name ||
    leagueSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

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

  // Get localized names for SEO
  const leagueName = getLocalizedLeagueName(league, locale);
  const playerName = getLocalizedPlayerDetailName(player, locale) || player.player_name || 'Unknown Player';
  const teamName = getLocalizedPlayerDetailTeamName(player, locale) || player.team_name || '';
  const goals = player.goals_total || 0;
  const assists = player.assists || 0;
  const rating = player.rating || 0;

  const titleFn = titleTemplates[locale] || titleTemplates['en'];
  const descFn = descriptionTemplates[locale] || descriptionTemplates['en'];

  const title = titleFn(playerName, leagueName, currentYear);
  const description = descFn(playerName, teamName, leagueName, goals, assists, rating, currentYear);

  // Generate canonical URL with player name slug (use English name for URL)
  const englishPlayerName = player.player_name || 'unknown';
  const playerSlug = playerNameToSlug(englishPlayerName);
  const baseUrl = 'https://www.oddsflow.ai';
  const pathWithoutLocale = `/leagues/${league}/player/${playerSlug}-${player.id}`;
  const canonicalUrl = locale === 'en' ? `${baseUrl}${pathWithoutLocale}` : `${baseUrl}/${locale}${pathWithoutLocale}`;

  // Build alternate language URLs
  const alternateLanguages: Record<string, string> = {
    'en': `${baseUrl}${pathWithoutLocale}`,
    'es': `${baseUrl}/es${pathWithoutLocale}`,
    'pt': `${baseUrl}/pt${pathWithoutLocale}`,
    'de': `${baseUrl}/de${pathWithoutLocale}`,
    'fr': `${baseUrl}/fr${pathWithoutLocale}`,
    'ja': `${baseUrl}/ja${pathWithoutLocale}`,
    'ko': `${baseUrl}/ko${pathWithoutLocale}`,
    'zh-CN': `${baseUrl}/zh${pathWithoutLocale}`,
    'zh-TW': `${baseUrl}/tw${pathWithoutLocale}`,
    'id': `${baseUrl}/id${pathWithoutLocale}`,
    'x-default': `${baseUrl}${pathWithoutLocale}`,
  };

  return {
    title,
    description,
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
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      type: 'profile',
      siteName: 'OddsFlow',
      url: canonicalUrl,
      locale: locale === 'zh' ? 'zh_CN' : locale === 'tw' ? 'zh_TW' : locale,
      images: player.photo ? [{ url: player.photo, width: 200, height: 200, alt: playerName }] : undefined,
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
