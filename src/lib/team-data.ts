import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

// Create a separate Supabase client for server-side use
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Team statistics type
export interface TeamStatisticsData {
  id: number;
  team_id: number | null;
  team_name: string | null;
  team_logo: string | null;
  league_name: string | null;
  season_year: string | null;
  total_played: number | null;
  total_wins: number | null;
  total_draws: number | null;
  total_loses: number | null;
  goals_for_total: number | null;
  goals_against_total: number | null;
  goals_for_average: number | null;
  goals_against_average: number | null;
  clean_sheets: number | null;
  failed_to_score: number | null;
  yellow_cards_total: number | null;
  red_cards_total: number | null;
  form: string | null;
  lineups: { formation: string; played: number }[] | null;
}

// Player stats type
export interface PlayerStatsData {
  id: number;
  team_id: number | null;
  player_name: string | null;
  player_photo: string | null;
  position: string | null;
  age: number | null;
  appearances: number | null;
  minutes: number | null;
  goals: number | null;
  assists: number | null;
  rating: number | null;
}

// Convert slug to team name (e.g., "manchester-city" -> "Manchester City")
function slugToTeamName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Get team stats by name and league
async function fetchTeamStats(teamSlug: string, leagueName: string): Promise<TeamStatisticsData | null> {
  if (!supabase) return null;

  try {
    const normalizedName = slugToTeamName(teamSlug);

    const { data, error } = await supabase
      .from('team_statistics')
      .select('*')
      .eq('league_name', leagueName)
      .ilike('team_name', normalizedName)
      .single();

    if (error || !data) return null;
    return data as TeamStatisticsData;
  } catch {
    return null;
  }
}

// Get players by team ID
async function fetchPlayerStats(teamId: number): Promise<PlayerStatsData[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('team_id', teamId)
      .order('appearances', { ascending: false })
      .limit(25);

    if (error || !data) return [];
    return data as PlayerStatsData[];
  } catch {
    return [];
  }
}

// Cached team data fetcher (5 minute cache)
export const getTeamData = unstable_cache(
  async (teamSlug: string, leagueName: string) => {
    const teamStats = await fetchTeamStats(teamSlug, leagueName);

    let players: PlayerStatsData[] = [];
    if (teamStats?.team_id) {
      players = await fetchPlayerStats(teamStats.team_id);
    }

    return {
      teamStats,
      players,
    };
  },
  ['team-data'],
  { revalidate: 300 } // 5 minutes
);

// League configuration for server use
export const LEAGUES_CONFIG: Record<string, { name: string; country: string; dbName: string }> = {
  'premier-league': { name: 'Premier League', country: 'England', dbName: 'Premier League' },
  'bundesliga': { name: 'Bundesliga', country: 'Germany', dbName: 'Bundesliga' },
  'serie-a': { name: 'Serie A', country: 'Italy', dbName: 'Serie A' },
  'la-liga': { name: 'La Liga', country: 'Spain', dbName: 'La Liga' },
  'ligue-1': { name: 'Ligue 1', country: 'France', dbName: 'Ligue 1' },
  'champions-league': { name: 'Champions League', country: 'UEFA', dbName: 'UEFA Champions League' },
};

// Convert slug to display name
export function slugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
