import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

// Server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServer = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface PerformanceStats {
  total_profit: number;
  total_invested: number;
  total_bets: number;
  total_matches: number;
  win_rate: number;
  roi: number;
  profit_moneyline: number;
  profit_handicap: number;
  profit_ou: number;
}

export interface ChartDataPoint {
  date: string;
  profit: number;
  cumulative: number;
  cumulativeMoneyline: number;
  cumulativeHandicap: number;
  cumulativeOU: number;
}

export interface MatchData {
  fixture_id: string;
  league_name: string;
  league_logo: string;
  home_name: string;
  home_logo: string;
  away_name: string;
  away_logo: string;
  home_score: number;
  away_score: number;
  total_profit: number;
  total_invested: number;
  roi_percentage: number;
  total_bets: number;
  profit_moneyline: number;
  profit_handicap: number;
  profit_ou: number;
  match_date: string;
}

export interface InitialPerformanceData {
  stats: PerformanceStats | null;
  chartData: ChartDataPoint[];
  matches: MatchData[];
  totalMatchCount: number;
}

// Fetch performance summary with server-side caching
// Revalidates every 5 minutes (300 seconds)
export const getPerformanceStats = unstable_cache(
  async (betStyle: string | null = null): Promise<PerformanceStats | null> => {
    if (!supabaseServer) return null;

    try {
      const { data, error } = await supabaseServer.rpc('get_performance_summary', {
        p_bet_style: betStyle
      });

      if (error) {
        console.error('Error fetching performance stats:', error);
        return null;
      }

      return data as PerformanceStats;
    } catch (e) {
      console.error('Exception fetching performance stats:', e);
      return null;
    }
  },
  ['performance-stats'],
  {
    revalidate: 300, // 5 minutes
    tags: ['performance']
  }
);

// Fetch chart data with server-side caching
export const getChartData = unstable_cache(
  async (betStyle: string | null = null): Promise<ChartDataPoint[]> => {
    if (!supabaseServer) return [];

    try {
      const { data, error } = await supabaseServer.rpc('get_performance_chart_data', {
        p_bet_style: betStyle
      });

      if (error) {
        console.error('Error fetching chart data:', error);
        return [];
      }

      return (data || []).map((d: any) => ({
        date: d.date,
        profit: d.profit || 0,
        cumulative: d.cumulative || 0,
        cumulativeMoneyline: d.cumulativeMoneyline || 0,
        cumulativeHandicap: d.cumulativeHandicap || 0,
        cumulativeOU: d.cumulativeOU || 0,
      }));
    } catch (e) {
      console.error('Exception fetching chart data:', e);
      return [];
    }
  },
  ['performance-chart'],
  {
    revalidate: 300, // 5 minutes
    tags: ['performance']
  }
);

// Fetch initial matches with server-side caching
export const getInitialMatches = unstable_cache(
  async (betStyle: string | null = null, pageSize: number = 20): Promise<{ matches: MatchData[], totalCount: number }> => {
    if (!supabaseServer) return { matches: [], totalCount: 0 };

    try {
      const { data, error } = await supabaseServer.rpc('get_performance_matches', {
        p_bet_style: betStyle,
        p_page: 0,
        p_page_size: pageSize
      });

      if (error) {
        console.error('Error fetching matches:', error);
        return { matches: [], totalCount: 0 };
      }

      const matches: MatchData[] = (data?.matches || []).map((m: any) => ({
        fixture_id: String(m.fixture_id),
        league_name: m.league_name || 'Unknown',
        league_logo: m.league_logo || '',
        home_name: m.home_name || 'Home Team',
        home_logo: m.home_logo || '',
        away_name: m.away_name || 'Away Team',
        away_logo: m.away_logo || '',
        home_score: m.home_score ?? 0,
        away_score: m.away_score ?? 0,
        total_profit: m.total_profit || 0,
        total_invested: m.total_invested || 0,
        roi_percentage: m.roi || 0,
        total_bets: m.bet_count || 0,
        profit_moneyline: m.profit_moneyline || 0,
        profit_handicap: m.profit_handicap || 0,
        profit_ou: m.profit_ou || 0,
        match_date: m.match_date || m.latest_bet_time || '',
      }));

      return {
        matches,
        totalCount: data?.total_count || 0
      };
    } catch (e) {
      console.error('Exception fetching matches:', e);
      return { matches: [], totalCount: 0 };
    }
  },
  ['performance-matches'],
  {
    revalidate: 300, // 5 minutes
    tags: ['performance']
  }
);

// Combined function to fetch all initial data
export async function getInitialPerformanceData(betStyle: string | null = null): Promise<InitialPerformanceData> {
  // Fetch all data in parallel
  const [stats, chartData, matchesData] = await Promise.all([
    getPerformanceStats(betStyle),
    getChartData(betStyle),
    getInitialMatches(betStyle)
  ]);

  return {
    stats,
    chartData,
    matches: matchesData.matches,
    totalMatchCount: matchesData.totalCount
  };
}
