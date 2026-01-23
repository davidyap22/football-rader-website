import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { TeamStatistics } from './supabase';

// Server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServer = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// League configuration - same as client side
export const LEAGUES_CONFIG = [
  { name: 'Premier League', country: 'England', logo: 'https://media.api-sports.io/football/leagues/39.png', slug: 'premier-league', dbName: 'Premier League' },
  { name: 'Bundesliga', country: 'Germany', logo: 'https://media.api-sports.io/football/leagues/78.png', slug: 'bundesliga', dbName: 'Bundesliga' },
  { name: 'Serie A', country: 'Italy', logo: 'https://media.api-sports.io/football/leagues/135.png', slug: 'serie-a', dbName: 'Serie A' },
  { name: 'La Liga', country: 'Spain', logo: 'https://media.api-sports.io/football/leagues/140.png', slug: 'la-liga', dbName: 'La Liga' },
  { name: 'Ligue 1', country: 'France', logo: 'https://media.api-sports.io/football/leagues/61.png', slug: 'ligue-1', dbName: 'Ligue 1' },
  { name: 'Champions League', country: 'UEFA', logo: 'https://media.api-sports.io/football/leagues/2.png', slug: 'champions-league', dbName: 'UEFA Champions League' },
];

// Localized league names
export const LEAGUE_NAMES_LOCALIZED: Record<string, Record<string, { name: string; country: string }>> = {
  'premier-league': {
    en: { name: 'Premier League', country: 'England' },
    es: { name: 'Premier League', country: 'Inglaterra' },
    pt: { name: 'Premier League', country: 'Inglaterra' },
    de: { name: 'Premier League', country: 'England' },
    fr: { name: 'Premier League', country: 'Angleterre' },
    ja: { name: 'プレミアリーグ', country: 'イングランド' },
    ko: { name: '프리미어리그', country: '잉글랜드' },
    zh: { name: '英超', country: '英格兰' },
    tw: { name: '英超', country: '英格蘭' },
    id: { name: 'Liga Inggris', country: 'Inggris' },
  },
  'bundesliga': {
    en: { name: 'Bundesliga', country: 'Germany' },
    es: { name: 'Bundesliga', country: 'Alemania' },
    pt: { name: 'Bundesliga', country: 'Alemanha' },
    de: { name: 'Bundesliga', country: 'Deutschland' },
    fr: { name: 'Bundesliga', country: 'Allemagne' },
    ja: { name: 'ブンデスリーガ', country: 'ドイツ' },
    ko: { name: '분데스리가', country: '독일' },
    zh: { name: '德甲', country: '德国' },
    tw: { name: '德甲', country: '德國' },
    id: { name: 'Bundesliga', country: 'Jerman' },
  },
  'serie-a': {
    en: { name: 'Serie A', country: 'Italy' },
    es: { name: 'Serie A', country: 'Italia' },
    pt: { name: 'Serie A', country: 'Itália' },
    de: { name: 'Serie A', country: 'Italien' },
    fr: { name: 'Serie A', country: 'Italie' },
    ja: { name: 'セリエA', country: 'イタリア' },
    ko: { name: '세리에 A', country: '이탈리아' },
    zh: { name: '意甲', country: '意大利' },
    tw: { name: '義甲', country: '義大利' },
    id: { name: 'Serie A', country: 'Italia' },
  },
  'la-liga': {
    en: { name: 'La Liga', country: 'Spain' },
    es: { name: 'La Liga', country: 'España' },
    pt: { name: 'La Liga', country: 'Espanha' },
    de: { name: 'La Liga', country: 'Spanien' },
    fr: { name: 'La Liga', country: 'Espagne' },
    ja: { name: 'ラ・リーガ', country: 'スペイン' },
    ko: { name: '라리가', country: '스페인' },
    zh: { name: '西甲', country: '西班牙' },
    tw: { name: '西甲', country: '西班牙' },
    id: { name: 'La Liga', country: 'Spanyol' },
  },
  'ligue-1': {
    en: { name: 'Ligue 1', country: 'France' },
    es: { name: 'Ligue 1', country: 'Francia' },
    pt: { name: 'Ligue 1', country: 'França' },
    de: { name: 'Ligue 1', country: 'Frankreich' },
    fr: { name: 'Ligue 1', country: 'France' },
    ja: { name: 'リーグ・アン', country: 'フランス' },
    ko: { name: '리그 1', country: '프랑스' },
    zh: { name: '法甲', country: '法国' },
    tw: { name: '法甲', country: '法國' },
    id: { name: 'Ligue 1', country: 'Prancis' },
  },
  'champions-league': {
    en: { name: 'Champions League', country: 'UEFA' },
    es: { name: 'Liga de Campeones', country: 'UEFA' },
    pt: { name: 'Liga dos Campeões', country: 'UEFA' },
    de: { name: 'Champions League', country: 'UEFA' },
    fr: { name: 'Ligue des Champions', country: 'UEFA' },
    ja: { name: 'チャンピオンズリーグ', country: 'UEFA' },
    ko: { name: '챔피언스리그', country: 'UEFA' },
    zh: { name: '欧冠', country: 'UEFA' },
    tw: { name: '歐冠', country: 'UEFA' },
    id: { name: 'Liga Champions', country: 'UEFA' },
  },
};

// Helper to get localized league name
export const getLocalizedLeagueName = (slug: string, locale: string): { name: string; country: string } => {
  const localized = LEAGUE_NAMES_LOCALIZED[slug]?.[locale];
  if (localized) return localized;
  const league = LEAGUES_CONFIG.find(l => l.slug === slug);
  return LEAGUE_NAMES_LOCALIZED[slug]?.en || { name: league?.name || slug, country: league?.country || '' };
};

// League stats summary type
export interface LeagueStatsSummary {
  teams: number;
  totalGoals: number;
  avgGoalsPerMatch: number;
  cleanSheets: number;
  topTeam: string | null;
  topTeamLogo: string | null;
  season: number | null;
}

// Fetch league statistics with server-side caching
export const getLeagueStats = unstable_cache(
  async (): Promise<Record<string, LeagueStatsSummary>> => {
    if (!supabaseServer) return {};

    const statsMap: Record<string, LeagueStatsSummary> = {};

    for (const league of LEAGUES_CONFIG) {
      try {
        const { data, error } = await supabaseServer
          .from('team_statistics')
          .select('*')
          .eq('league_name', league.dbName);

        if (data && !error && data.length > 0) {
          // Calculate points for sorting
          const teamsWithPoints = data.map((team: TeamStatistics) => ({
            ...team,
            points: ((team.total_wins || 0) * 3) + (team.total_draws || 0),
          }));

          // Sort by points to find top team
          teamsWithPoints.sort((a: TeamStatistics & { points: number }, b: TeamStatistics & { points: number }) => b.points - a.points);
          const topTeam = teamsWithPoints[0];

          const totalGoals = data.reduce((sum: number, t: TeamStatistics) => sum + (t.goals_for_total || 0), 0);
          const totalMatchesPlayed = data.reduce((sum: number, t: TeamStatistics) => sum + (t.total_played || 0), 0);
          // Each match is counted twice (once for each team), so divide by 2 to get actual matches
          const actualMatches = totalMatchesPlayed / 2;

          statsMap[league.dbName] = {
            teams: data.length,
            totalGoals,
            avgGoalsPerMatch: actualMatches > 0 ? totalGoals / actualMatches : 0,
            cleanSheets: data.reduce((sum: number, t: TeamStatistics) => sum + (t.clean_sheets || 0), 0),
            topTeam: topTeam?.team_name || null,
            topTeamLogo: topTeam?.logo || null,
            season: data[0]?.season || null,
          };
        }
      } catch (err) {
        console.error(`Failed to fetch stats for ${league.name}`, err);
      }
    }

    return statsMap;
  },
  ['leagues-stats'],
  {
    revalidate: 300, // 5 minutes - league stats don't change often
    tags: ['leagues']
  }
);

// Combined function to fetch all initial data for the leagues page
export async function getInitialLeaguesData(): Promise<{
  leagueStats: Record<string, LeagueStatsSummary>;
  leagues: typeof LEAGUES_CONFIG;
}> {
  const leagueStats = await getLeagueStats();

  return {
    leagueStats,
    leagues: LEAGUES_CONFIG,
  };
}
