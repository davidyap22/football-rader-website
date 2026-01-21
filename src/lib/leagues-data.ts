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

          statsMap[league.dbName] = {
            teams: data.length,
            totalGoals: data.reduce((sum: number, t: TeamStatistics) => sum + (t.goals_for_total || 0), 0),
            avgGoalsPerMatch: data.reduce((sum: number, t: TeamStatistics) => sum + (t.goals_for_average || 0), 0) / data.length,
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
