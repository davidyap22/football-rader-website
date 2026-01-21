import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { Prematch, MatchPrediction } from './supabase';

// Server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServer = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper to get UTC date string in YYYY-MM-DD format
function getUTCDateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get today's date in UTC
function getUTCToday(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// Fetch matches for a specific date with server-side caching
// Revalidates every 2 minutes (120 seconds) for fresh data
export const getMatchesForDate = unstable_cache(
  async (dateStr: string): Promise<Prematch[]> => {
    if (!supabaseServer) return [];

    try {
      // Get date range for the query (full day in UTC)
      const startOfDay = `${dateStr}T00:00:00Z`;
      const endOfDay = `${dateStr}T23:59:59Z`;

      const { data, error } = await supabaseServer
        .from('prematches')
        .select('*')
        .gte('start_date_msia', startOfDay)
        .lte('start_date_msia', endOfDay)
        .order('start_date_msia', { ascending: true });

      if (error) {
        console.error('Error fetching matches:', error);
        return [];
      }

      return data || [];
    } catch (e) {
      console.error('Exception fetching matches:', e);
      return [];
    }
  },
  ['predictions-matches'],
  {
    revalidate: 120, // 2 minutes
    tags: ['predictions']
  }
);

// Fetch predictions for multiple fixtures
export const getPredictionsForFixtures = unstable_cache(
  async (fixtureIds: number[]): Promise<Record<number, MatchPrediction>> => {
    if (!supabaseServer || fixtureIds.length === 0) return {};

    try {
      const { data, error } = await supabaseServer
        .from('predictions_match')
        .select('*')
        .in('fixture_id', fixtureIds);

      if (error) {
        console.error('Error fetching predictions:', error);
        return {};
      }

      // Convert to record keyed by fixture_id
      const predictions: Record<number, MatchPrediction> = {};
      (data || []).forEach((p: MatchPrediction) => {
        predictions[p.fixture_id] = p;
      });

      return predictions;
    } catch (e) {
      console.error('Exception fetching predictions:', e);
      return {};
    }
  },
  ['predictions-probs'],
  {
    revalidate: 120, // 2 minutes
    tags: ['predictions']
  }
);

// Combined function to fetch all initial data for the predictions page
export async function getInitialPredictionsData(dateStr?: string | null): Promise<{
  matches: Prematch[];
  predictions: Record<number, MatchPrediction>;
  date: string;
}> {
  // Use provided date or today
  const date = dateStr || getUTCDateString(getUTCToday());

  // Fetch matches
  const matches = await getMatchesForDate(date);

  // Fetch predictions for all matches
  const fixtureIds = matches.map(m => m.fixture_id);
  const predictions = await getPredictionsForFixtures(fixtureIds);

  return {
    matches,
    predictions,
    date,
  };
}
