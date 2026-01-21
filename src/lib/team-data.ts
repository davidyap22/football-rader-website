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
// Handles special cases like "fc" -> "FC", periods, and umlauts
function slugToTeamName(slug: string): string {
  // Decode URL-encoded characters first
  const decoded = decodeURIComponent(slug);

  let result = decoded
    .split('-')
    .map((word, index, arr) => {
      // Handle common abbreviations that should be uppercase
      const upperWords = ['fc', 'sc', 'sv', 'vfb', 'vfl', 'fsv', 'tsg', 'rb', 'bsc', 'sg', 'st'];
      if (upperWords.includes(word.toLowerCase())) {
        return word.toUpperCase();
      }
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

  // Handle patterns like "1 FC" -> "1. FC" (number followed by FC/SC etc.)
  result = result.replace(/^(\d+)\s+(FC|SC|SV|FSV)/i, '$1. $2');

  return result;
}

// Create search pattern for flexible team name matching
function createSearchPattern(slug: string): string {
  const decoded = decodeURIComponent(slug);
  // Replace hyphens with wildcards for flexible matching
  // This helps match "Bayern München" with "Bayern Munich" etc.
  const words = decoded.split('-').filter(w => w.length > 0);
  // Create a pattern that matches all words in order
  return words.map(w => `%${w}%`).join('');
}

// Get team stats by name and league
async function fetchTeamStats(teamSlug: string, leagueName: string): Promise<TeamStatisticsData | null> {
  if (!supabase) return null;

  try {
    const normalizedName = slugToTeamName(teamSlug);

    // First try exact match (case-insensitive)
    let { data, error } = await supabase
      .from('team_statistics')
      .select('*')
      .eq('league_name', leagueName)
      .ilike('team_name', normalizedName)
      .single();

    // If no exact match, try flexible pattern matching
    if (error || !data) {
      const searchPattern = createSearchPattern(teamSlug);
      const result = await supabase
        .from('team_statistics')
        .select('*')
        .eq('league_name', leagueName)
        .ilike('team_name', searchPattern)
        .single();

      data = result.data;
      error = result.error;
    }

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

// League player stats type for SSR
export interface LeaguePlayerData {
  id: number;
  player_name: string | null;
  photo: string | null;
  team_name: string | null;
  team_logo: string | null;
  position: string | null;
  nationality: string | null;
  age: number | null;
  appearances: number | null;
  minutes: number | null;
  goals_total: number | null;
  assists: number | null;
  rating: number | null;
}

// Fetch all players for a league (server-side)
async function fetchLeaguePlayers(leagueName: string): Promise<LeaguePlayerData[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .ilike('league_name', leagueName)
      .order('rating', { ascending: false, nullsFirst: false });

    if (error || !data) return [];
    return data as LeaguePlayerData[];
  } catch {
    return [];
  }
}

// Cached league players data fetcher (5 minute cache)
export const getLeaguePlayersData = unstable_cache(
  async (leagueName: string) => {
    const players = await fetchLeaguePlayers(leagueName);

    // Get top scorers
    const topScorers = [...players]
      .sort((a, b) => (b.goals_total || 0) - (a.goals_total || 0))
      .slice(0, 5);

    // Get top assists
    const topAssists = [...players]
      .sort((a, b) => (b.assists || 0) - (a.assists || 0))
      .slice(0, 5);

    // Get highest rated
    const highestRated = [...players]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    return {
      players,
      topScorers,
      topAssists,
      highestRated,
    };
  },
  ['league-players'],
  { revalidate: 300 } // 5 minutes
);
