import { createClient } from '@supabase/supabase-js';
import DOMPurify from 'dompurify';
import validator from 'validator';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// ============ SECURITY UTILITIES ============

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(input.trim(), {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: [],
    });
  }
  // Server-side fallback: basic sanitization
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// Validate and sanitize email
export const sanitizeEmail = (email: string): string | null => {
  const trimmed = email.trim().toLowerCase();
  if (!validator.isEmail(trimmed)) {
    return null;
  }
  return validator.normalizeEmail(trimmed) || null;
};

// Rate limiting helper
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 1000; // 1 second

export const checkRateLimit = (key: string, maxPerSecond: number = 5): boolean => {
  const now = Date.now();
  const lastCall = rateLimitMap.get(key) || 0;

  if (now - lastCall < RATE_LIMIT_WINDOW / maxPerSecond) {
    return false; // Rate limited
  }

  rateLimitMap.set(key, now);
  return true; // Allowed
};

// Password validation
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain a lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  }

  return { valid: errors.length === 0, errors };
};

// Sanitize error messages to prevent information leakage
export const getSafeErrorMessage = (error: any): string => {
  const message = error?.message?.toLowerCase() || '';

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (message.includes('user already') || message.includes('duplicate')) {
    return 'An account with this email already exists';
  }
  if (message.includes('invalid email')) {
    return 'Please enter a valid email address';
  }
  if (message.includes('password')) {
    return 'Password does not meet requirements';
  }
  if (message.includes('rate') || message.includes('limit')) {
    return 'Too many requests. Please try again later.';
  }

  // Log original error for debugging (server-side only)
  if (typeof window === 'undefined') {
    console.error('Supabase error:', error);
  }

  return 'An error occurred. Please try again.';
};

// Create client even if env vars are missing (for development without Supabase)
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null as any;

// ============ SEPARATE CHAT SUPABASE CLIENT ============
// Chat functionality uses a different Supabase instance (for global chat only)
const chatSupabaseUrl = 'https://rlvmlnwnaejhotlnhbpi.supabase.co';
const chatSupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsdm1sbnduYWVqaG90bG5oYnBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDkxNzYsImV4cCI6MjA4MTIyNTE3Nn0.5VUchXN2-P3-jcfZXyL37RN9A9DCXonFYqpjDOl3YJY';

export const chatSupabase = createClient(chatSupabaseUrl, chatSupabaseKey);

// Auth helper functions
export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Create free trial subscription for new user
export const createFreeTrialSubscription = async (userId: string, email: string) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7); // 7 days free trial

  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: userId,
      email: email,
      package_type: 'free_trial',
      package_name: 'Free Trial',
      price: 0,
      leagues_allowed: 1,
      betting_styles_allowed: 1,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: 'active',
    })
    .select()
    .single();

  return { data, error };
};

// Get user subscription
export const getUserSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
};

// User subscription interface
export interface UserSubscription {
  id: number;
  user_id: string;
  email: string;
  package_type: string;
  package_name: string;
  price: number;
  leagues_allowed: number;
  betting_styles_allowed: number;
  selected_leagues: string[] | null;
  selected_betting_styles: string[] | null;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

export interface Prematch {
  id: number;
  fixture_id: number;
  start_date_msia: string;
  venue_name: string;
  venue_city: string;
  status_short: string;
  status_elapsed: number | null;
  league_name: string;
  league_logo: string;
  home_name: string;
  home_logo: string;
  away_name: string;
  away_logo: string;
  type: string;
  goals_home: number | null;
  goals_away: number | null;
  group_cup: string | null;
}

export interface League {
  league_name: string;
  league_logo: string;
  count: number;
}

export interface TeamStatistics {
  id: number;
  team_id: number | null;
  team_name: string | null;
  logo: string;
  team_country: string;
  team_founded: number | null;
  league_id: number | null;
  league_name: string | null;
  season: number | null;
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
  most_used_formation: string | null;
  all_formations: string | null;
  venue_id: number;
  venue_name: string;
  venue_image: string | null;
  created_at: string | null;
}

// Get team statistics by league name
export const getTeamStatisticsByLeague = async (leagueName: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    const { data, error } = await supabase
      .from('team_statistics')
      .select('*')
      .eq('league_name', leagueName)
      .order('total_wins', { ascending: false });

    if (error) {
      return { data: null, error };
    }

    // Calculate points and sort by points, then goal difference
    const teamsWithPoints: (TeamStatistics & { points: number; goal_difference: number })[] = (data || []).map((team: TeamStatistics) => ({
      ...team,
      points: ((team.total_wins || 0) * 3) + (team.total_draws || 0),
      goal_difference: (team.goals_for_total || 0) - (team.goals_against_total || 0),
    }));

    // Sort by points, then goal difference, then goals scored
    teamsWithPoints.sort((a: TeamStatistics & { points: number; goal_difference: number }, b: TeamStatistics & { points: number; goal_difference: number }) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
      return (b.goals_for_total || 0) - (a.goals_for_total || 0);
    });

    return { data: teamsWithPoints, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch team statistics' } };
  }
};

// Player Statistics interface
export interface PlayerStats {
  id: number;
  player_id: number | null;
  player_name: string | null;
  firstname: string | null;
  lastname: string | null;
  photo: string | null;
  age: number | null;
  birth_date: string | null;
  birth_country: string | null;
  nationality: string | null;
  height: string | null;
  weight: string | null;
  injured: boolean | null;
  position: string | null;
  number: number | null;
  captain: boolean | null;
  rating: number | null;
  team_id: number | null;
  team_name: string | null;
  team_logo: string | null;
  league_id: number | null;
  league_name: string | null;
  league_logo: string | null;
  season: number | null;
  appearances: number | null;
  lineups: number | null;
  minutes: number | null;
  goals_total: number | null;
  conceded: number | null;
  assists: number | null;
  shots_total: number | null;
  shots_on: number | null;
  passes_total: number | null;
  passes_key: number | null;
  tackles_total: number | null;
  interceptions: number | null;
  duels_total: number | null;
  duels_won: number | null;
  fouls_drawn: number | null;
  fouls_committed: number | null;
  cards_yellow: number | null;
  cards_red: number | null;
  penalty_scored: number | null;
  penalty_missed: number | null;
  created_at: string | null;
}

// Get player stats by team ID
export const getPlayerStatsByTeam = async (teamId: number) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('team_id', teamId)
      .order('rating', { ascending: false, nullsFirst: false });

    if (error) {
      return { data: null, error };
    }

    return { data: data as PlayerStats[], error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch player stats' } };
  }
};

// Get team statistics by team name (for team profile page)
export const getTeamStatsByName = async (teamName: string, leagueName: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    // Convert slug back to team name (e.g., "manchester-city" -> "Manchester City")
    const normalizedName = teamName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const { data, error } = await supabase
      .from('team_statistics')
      .select('*')
      .eq('league_name', leagueName)
      .ilike('team_name', normalizedName)
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as TeamStatistics, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch team stats' } };
  }
};

// Get all player stats by league name
export const getPlayerStatsByLeague = async (leagueName: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .ilike('league_name', leagueName)
      .order('rating', { ascending: false, nullsFirst: false });

    if (error) {
      return { data: null, error };
    }

    return { data: data as PlayerStats[], error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch player stats' } };
  }
};

// Get player stats by row ID
export const getPlayerStatsById = async (id: number) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as PlayerStats, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch player stats' } };
  }
};

export interface OddsHistory {
  id: number;
  fixture_id: number;
  created_at: string;
  bookmaker: string | null;
  league_name: string | null;
  home_name: string | null;
  away_name: string | null;
  moneyline_1x2_home: number | null;
  moneyline_1x2_draw: number | null;
  moneyline_1x2_away: number | null;
  handicap_main_line: number | null;
  handicap_home: number | null;
  handicap_away: number | null;
  totalpoints_main_line: number | null;
  totalpoints_over: number | null;
  totalpoints_under: number | null;
  type: string | null;
}

// AI Prediction tables
export interface Moneyline1x2Prediction {
  id: number;
  fixture_id: number;
  bookmaker: string | null;
  league_name: string | null;
  home_name: string | null;
  away_name: string | null;
  moneyline_1x2_home: number | null;
  moneyline_1x2_draw: number | null;
  moneyline_1x2_away: number | null;
  signal: string | null;
  ai_model: string | null;
  clock: number | null;
  created_at: string;
  stacking_quantity: string | null;
  stacking_plan_description: string | null;
  result_status: boolean | null;
  score_home: number | null;
  score_away: number | null;
  selection: string | null;
  market_analysis_trend_direction: string | null;
  market_analysis_odds_check: string | null;
  market_analysis_vig_status: string | null;
  commentary_malaysia: string | null;
  market_game: string | null;
}

export interface OverUnderPrediction {
  id: number;
  fixture_id: number;
  bookmaker: string | null;
  league_name: string | null;
  home_name: string | null;
  away_name: string | null;
  line: number | null;
  over: number | null;
  under: number | null;
  signal: string | null;
  ai_model: string | null;
  clock: number | null;
  created_at: string;
  stacking_quantity: string | null;
  stacking_plan_description: string | null;
  selection: string | null;
  market_analysis_trend_direction: string | null;
  market_analysis_odds_check: string | null;
  market_analysis_vig_status: string | null;
  commentary_malaysia: string | null;
  score_home: number | null;
  score_away: number | null;
  result_status: boolean | null;
  market_game: string | null;
}

export interface HandicapPrediction {
  id: number;
  fixture_id: number;
  bookmaker: string | null;
  league_name: string | null;
  home_name: string | null;
  away_name: string | null;
  line: number | null;
  home_odds: number | null;
  away_odds: number | null;
  signal: string | null;
  ai_model: string | null;
  clock: number | null;
  created_at: string;
  stacking_quantity: string | null;
  stacking_plan_description: string | null;
  result_status: boolean | null;
  score_home: number | null;
  score_away: number | null;
  selection: string | null;
  market_analysis_trend_direction: string | null;
  market_analysis_odds_check: string | null;
  market_analysis_vig_status: string | null;
  commentary_malaysia: string | null;
  market_game: string | null;
}

export interface ProfitSummary {
  id: number;
  fixture_id: number;
  total_profit: number | null;
  total_invested: number | null;
  roi_percentage: number | null;
  total_bets: number | null;
  profit_moneyline: number | null;
  profit_handicap: number | null;
  profit_ou: number | null;
  created_at: string;
}

export interface FootballNews {
  id: number;
  title: string;
  summary: string;
  content: string;
  source: string;
  source_url: string;
  image_url?: string;
  published_at?: string;
}

// Contact message interface
export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
}

// Match Prediction interface (AI predictions)
export interface MatchPrediction {
  id: number;
  fixture_id: number;
  home_team: string;
  away_team: string;
  winner_id: number | null;
  winner_name: string | null;
  win_or_draw: boolean | null;
  advice: string | null;
  under_over: string | null;
  goals_home: string | null;
  goals_away: string | null;
  prob_home: number | null;
  prob_draw: number | null;
  prob_away: number | null;
  strength_home: number | null;
  strength_away: number | null;
  attacking_home: number | null;
  attacking_away: number | null;
  defensive_home: number | null;
  defensive_away: number | null;
  poisson_home: number | null;
  poisson_away: number | null;
  h2h_strength_home: number | null;
  h2h_strength_away: number | null;
  h2h_goals_home: number | null;
  h2h_goals_away: number | null;
}

// Get match prediction by fixture_id
export const getMatchPrediction = async (fixtureId: number) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    const { data, error } = await supabase
      .from('predictions_match')
      .select('*')
      .eq('fixture_id', fixtureId)
      .single();

    if (error) {
      // No prediction found is not an error
      if (error.code === 'PGRST116') {
        return { data: null, error: null };
      }
      return { data: null, error };
    }

    return { data: data as MatchPrediction, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch prediction' } };
  }
};

// Batch fetch predictions for multiple fixtures
export const getMatchPredictions = async (fixtureIds: number[]) => {
  if (!supabase || fixtureIds.length === 0) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('predictions_match')
      .select('*')
      .in('fixture_id', fixtureIds);

    if (error) {
      return { data: null, error };
    }

    // Return as a map for easy lookup by fixture_id
    const predictionsMap: Record<number, MatchPrediction> = {};
    (data as MatchPrediction[])?.forEach(p => {
      predictionsMap[p.fixture_id] = p;
    });

    return { data: predictionsMap, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch predictions' } };
  }
};

// Lineup Summary interface
export interface LineupSummary {
  id: number;
  team_id: number;
  fixture_id: string;
  team_name: string;
  formation: string | null;
  coach_name: string | null;
}

// Fixture Player interface
export interface FixturePlayer {
  id: number;
  team_id: number;
  player_id: number;
  number: number | null;
  is_starter: boolean;
  fixture_id: string;
  grid: string | null; // Position on pitch like "1:1", "2:3"
  pos: string | null; // Position: G, D, M, F
  player_name: string;
}

// Combined lineup data for a team
export interface TeamLineup {
  summary: LineupSummary;
  starters: FixturePlayer[];
  substitutes: FixturePlayer[];
}

// Get lineup data for a fixture
export const getFixtureLineups = async (fixtureId: number) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    // Fetch lineup summaries for both teams
    const { data: summaries, error: summaryError } = await supabase
      .from('lineups_summary')
      .select('*')
      .eq('fixture_id', fixtureId.toString());

    if (summaryError) {
      return { data: null, error: summaryError };
    }

    if (!summaries || summaries.length === 0) {
      return { data: null, error: null };
    }

    // Fetch all players for this fixture
    const { data: players, error: playersError } = await supabase
      .from('fixture_players')
      .select('*')
      .eq('fixture_id', fixtureId.toString());

    if (playersError) {
      return { data: null, error: playersError };
    }

    // Organize data by team
    const lineups: TeamLineup[] = summaries.map((summary: LineupSummary) => {
      const teamPlayers = (players || []).filter((p: FixturePlayer) => p.team_id === summary.team_id);
      return {
        summary,
        starters: teamPlayers.filter((p: FixturePlayer) => p.is_starter).sort((a: FixturePlayer, b: FixturePlayer) => {
          // Sort by grid position (row first, then column)
          if (!a.grid || !b.grid) return 0;
          const [aRow, aCol] = a.grid.split(':').map(Number);
          const [bRow, bCol] = b.grid.split(':').map(Number);
          if (aRow !== bRow) return aRow - bRow;
          return aCol - bCol;
        }),
        substitutes: teamPlayers.filter((p: FixturePlayer) => !p.is_starter).sort((a: FixturePlayer, b: FixturePlayer) => {
          // Sort by jersey number
          return (a.number || 0) - (b.number || 0);
        }),
      };
    });

    return { data: lineups, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch lineups' } };
  }
};

// Submit contact form message
export const submitContactMessage = async (contactData: Omit<ContactMessage, 'id' | 'created_at'>) => {
  // Check if supabase client is available
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  // Input validation
  if (!contactData.name?.trim() || contactData.name.length > 100) {
    return { data: null, error: { message: 'Invalid name (max 100 characters)' } };
  }

  const validEmail = sanitizeEmail(contactData.email);
  if (!validEmail) {
    return { data: null, error: { message: 'Invalid email address' } };
  }

  if (!contactData.subject?.trim() || contactData.subject.length > 200) {
    return { data: null, error: { message: 'Invalid subject (max 200 characters)' } };
  }

  if (!contactData.message?.trim() || contactData.message.length > 5000) {
    return { data: null, error: { message: 'Message too long (max 5000 characters)' } };
  }

  // Rate limiting - max 1 contact message per 30 seconds
  if (!checkRateLimit(`contact-${validEmail}`, 0.033)) {
    return { data: null, error: { message: 'Please wait before sending another message' } };
  }

  // Sanitize inputs
  const sanitizedData = {
    name: sanitizeInput(contactData.name),
    email: validEmail,
    subject: sanitizeInput(contactData.subject),
    message: sanitizeInput(contactData.message),
  };

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(sanitizedData)
      .select();

    if (error) {
      return { data: null, error };
    }

    return { data: data?.[0] || null, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to submit message' } };
  }
};

// ============================================
// Match Comments (Community Forum)
// ============================================

export interface MatchComment {
  id: string;
  fixture_id: number;
  user_id: string;
  content: string;
  parent_id: string | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  user_email?: string;
  user_name?: string;
  user_avatar?: string;
  replies?: MatchComment[];
  user_liked?: boolean;
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

// Get comments for a match
export const getMatchComments = async (fixtureId: number, userId?: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    // Get all comments for this fixture
    const { data: comments, error } = await supabase
      .from('match_comments')
      .select('*')
      .eq('fixture_id', fixtureId)
      .order('created_at', { ascending: true });

    if (error) {
      return { data: null, error };
    }

    // Get user likes if logged in
    let userLikes: string[] = [];
    if (userId && comments && comments.length > 0) {
      const commentIds = comments.map((c: MatchComment) => c.id);
      const { data: likes } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', userId)
        .in('comment_id', commentIds);

      userLikes = likes?.map((l: { comment_id: string }) => l.comment_id) || [];
    }

    // Mark which comments are liked by current user
    const commentsWithLikes = comments?.map((comment: MatchComment) => ({
      ...comment,
      user_liked: userLikes.includes(comment.id),
    })) || [];

    // Organize into tree structure (parent comments with replies)
    const parentComments = commentsWithLikes.filter((c: MatchComment) => !c.parent_id);
    const replies = commentsWithLikes.filter((c: MatchComment) => c.parent_id);

    const organizedComments = parentComments.map((parent: MatchComment) => ({
      ...parent,
      replies: replies.filter((r: MatchComment) => r.parent_id === parent.id),
    }));

    return { data: organizedComments, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch comments' } };
  }
};

// Add a new comment
export const addComment = async (
  fixtureId: number,
  userId: string,
  content: string,
  parentId?: string
) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  // Input validation
  if (!content || content.trim().length === 0) {
    return { data: null, error: { message: 'Comment cannot be empty' } };
  }
  if (content.length > 1000) {
    return { data: null, error: { message: 'Comment too long (max 1000 characters)' } };
  }
  if (!Number.isInteger(fixtureId) || fixtureId < 0) {
    return { data: null, error: { message: 'Invalid fixture ID' } };
  }

  // Rate limiting
  if (!checkRateLimit(`comment-${userId}`, 2)) {
    return { data: null, error: { message: 'Too many comments. Please wait.' } };
  }

  // Sanitize content to prevent XSS
  const sanitizedContent = sanitizeInput(content);

  try {
    const { data, error } = await supabase
      .from('match_comments')
      .insert({
        fixture_id: fixtureId,
        user_id: userId,
        content: sanitizedContent,
        parent_id: parentId || null,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to add comment' } };
  }
};

// Toggle like on a comment
export const toggleCommentLike = async (commentId: string, userId: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike - remove the like
      await supabase
        .from('comment_likes')
        .delete()
        .eq('id', existingLike.id);

      // Decrement likes_count
      await supabase.rpc('decrement_likes', { comment_uuid: commentId });

      return { data: { liked: false }, error: null };
    } else {
      // Like - add new like
      await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: userId,
        });

      // Increment likes_count
      await supabase.rpc('increment_likes', { comment_uuid: commentId });

      return { data: { liked: true }, error: null };
    }
  } catch (err) {
    return { data: null, error: { message: 'Failed to toggle like' } };
  }
};

// Delete a comment
export const deleteComment = async (commentId: string, userId: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    const { error } = await supabase
      .from('match_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) {
      return { data: null, error };
    }

    return { data: { deleted: true }, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to delete comment' } };
  }
};

// Get comment stats for community page
export const getCommentStats = async () => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    // Total comments
    const { count: totalComments } = await supabase
      .from('match_comments')
      .select('*', { count: 'exact', head: true });

    // Today's comments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayComments } = await supabase
      .from('match_comments')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Active users (unique users who commented in last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: activeUsers } = await supabase
      .from('match_comments')
      .select('user_id')
      .gte('created_at', weekAgo.toISOString());

    const uniqueActiveUsers = new Set(activeUsers?.map((u: { user_id: string }) => u.user_id)).size;

    return {
      data: {
        totalComments: totalComments || 0,
        todayComments: todayComments || 0,
        activeUsers: uniqueActiveUsers,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: { message: 'Failed to fetch stats' } };
  }
};

// ============================================
// Chat Messages (Real-time Chatroom)
// ============================================

export interface ChatMessage {
  id: string;
  match_id: string | null; // null = global chat, string = match-specific chat
  sender_name: string;
  content: string;
  role?: string;
  created_at: string;
}

// Get chat messages (global or match-specific) - uses chatSupabase
export const getChatMessages = async (matchId?: string | null, limit: number = 50) => {
  if (!chatSupabase) {
    console.error('chatSupabase is null');
    return { data: null, error: { message: 'Chat Supabase client not initialized' } };
  }

  try {
    console.log('Fetching from global_chat_messages...');

    const { data, error, status, statusText } = await chatSupabase
      .from('global_chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);

    console.log('Supabase response - status:', status, 'statusText:', statusText);
    console.log('Supabase data:', data);
    console.log('Supabase error:', error);

    if (error) {
      console.error('getChatMessages error details:', JSON.stringify(error, null, 2));
      return { data: null, error };
    }

    console.log('getChatMessages success:', data?.length, 'messages');
    return { data, error: null };
  } catch (err) {
    console.error('getChatMessages exception:', err);
    return { data: null, error: { message: 'Failed to fetch chat messages' } };
  }
};

// Send chat message - uses chatSupabase
export const sendChatMessage = async (senderName: string, content: string, matchId?: string | null) => {
  if (!chatSupabase) {
    return { data: null, error: { message: 'Chat Supabase client not initialized' } };
  }

  // Input validation
  if (!content || content.trim().length === 0) {
    return { data: null, error: { message: 'Message cannot be empty' } };
  }
  if (content.length > 500) {
    return { data: null, error: { message: 'Message too long (max 500 characters)' } };
  }

  // Rate limiting - max 3 messages per second
  if (!checkRateLimit(`chat-${senderName}`, 3)) {
    return { data: null, error: { message: 'Too many messages. Please wait.' } };
  }

  // Sanitize content to prevent XSS
  const sanitizedContent = sanitizeInput(content);

  try {
    const { data, error } = await chatSupabase
      .from('global_chat_messages')
      .insert({
        sender_name: senderName,
        content: sanitizedContent,
        match_id: matchId ?? null,
        role: 'user',
      })
      .select()
      .single();

    if (error) {
      console.error('sendChatMessage error:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to send message' } };
  }
};

// Subscribe to chat messages (real-time) - uses chatSupabase
export const subscribeToChatMessages = (
  matchId: string | null,
  onMessage: (message: ChatMessage) => void,
  onStatusChange?: (status: string) => void
) => {
  if (!chatSupabase) {
    return null;
  }

  // For global chat, subscribe to all messages (no filter)
  // For match-specific, filter by match_id
  const subscriptionConfig: {
    event: 'INSERT';
    schema: string;
    table: string;
    filter?: string;
  } = {
    event: 'INSERT',
    schema: 'public',
    table: 'global_chat_messages',
  };

  // Only add filter for match-specific chat
  if (matchId !== null) {
    subscriptionConfig.filter = `match_id=eq.${matchId}`;
  }

  const channel = chatSupabase
    .channel(`chat-${matchId ?? 'global'}-${Date.now()}`)
    .on('postgres_changes', subscriptionConfig, (payload: { new: ChatMessage }) => {
      onMessage(payload.new);
    })
    .subscribe((status: string) => {
      console.log('Realtime subscription status:', status);
      if (onStatusChange) {
        onStatusChange(status);
      }
    });

  return channel;
};

// Get online users count (approximate based on recent chat activity) - uses chatSupabase
export const getOnlineUsersCount = async () => {
  if (!chatSupabase) {
    return { data: 0, error: null };
  }

  try {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const { data } = await chatSupabase
      .from('global_chat_messages')
      .select('sender_name')
      .gte('created_at', fiveMinutesAgo.toISOString());

    const uniqueUsers = new Set(data?.map((m: { sender_name: string }) => m.sender_name)).size;
    return { data: uniqueUsers, error: null };
  } catch (err) {
    return { data: 0, error: null };
  }
};

// ============================================
// Chat Reactions
// ============================================

export interface ChatReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface ReactionCount {
  type: string;
  count: number;
  users: string[];
}

// Get reactions for messages - uses chatSupabase
export const getMessageReactions = async (messageIds: string[]) => {
  if (!chatSupabase || messageIds.length === 0) {
    return { data: {}, error: null };
  }

  try {
    const { data, error } = await chatSupabase
      .from('chat_reactions')
      .select('*')
      .in('message_id', messageIds);

    if (error) {
      return { data: {}, error };
    }

    // Group reactions by message_id
    const grouped: Record<string, ChatReaction[]> = {};
    data?.forEach((reaction: ChatReaction) => {
      if (!grouped[reaction.message_id]) {
        grouped[reaction.message_id] = [];
      }
      grouped[reaction.message_id].push(reaction);
    });

    return { data: grouped, error: null };
  } catch (err) {
    return { data: {}, error: { message: 'Failed to fetch reactions' } };
  }
};

// Toggle reaction on a message - uses chatSupabase
export const toggleMessageReaction = async (messageId: string, userId: string, reactionType: string) => {
  if (!chatSupabase) {
    return { data: null, error: { message: 'Chat Supabase client not initialized' } };
  }

  try {
    // Check if user already reacted
    const { data: existing } = await chatSupabase
      .from('chat_reactions')
      .select('*')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      if (existing.reaction_type === reactionType) {
        // Same reaction - remove it
        await chatSupabase
          .from('chat_reactions')
          .delete()
          .eq('id', existing.id);
        return { data: { action: 'removed' }, error: null };
      } else {
        // Different reaction - update it
        await chatSupabase
          .from('chat_reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existing.id);
        return { data: { action: 'updated', type: reactionType }, error: null };
      }
    } else {
      // No existing reaction - add new one
      await chatSupabase
        .from('chat_reactions')
        .insert({
          message_id: messageId,
          user_id: userId,
          reaction_type: reactionType,
        });
      return { data: { action: 'added', type: reactionType }, error: null };
    }
  } catch (err) {
    return { data: null, error: { message: 'Failed to toggle reaction' } };
  }
};

// Comment Reactions
export interface CommentReaction {
  id: string;
  comment_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

// Get reactions for multiple comments
export const getCommentReactions = async (commentIds: string[]) => {
  if (!supabase || commentIds.length === 0) {
    return { data: {}, error: null };
  }

  const { data, error } = await supabase
    .from('comment_reactions')
    .select('*')
    .in('comment_id', commentIds);

  if (error) {
    return { data: {}, error };
  }

  // Group reactions by comment_id
  const grouped: Record<string, CommentReaction[]> = {};
  data?.forEach((reaction: CommentReaction) => {
    if (!grouped[reaction.comment_id]) {
      grouped[reaction.comment_id] = [];
    }
    grouped[reaction.comment_id].push(reaction);
  });

  return { data: grouped, error: null };
};

// Toggle comment reaction (add/update/remove)
export const toggleCommentReaction = async (commentId: string, userId: string, reactionType: string) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    // Check if user already reacted
    const { data: existing } = await supabase
      .from('comment_reactions')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      if (existing.reaction_type === reactionType) {
        // Same reaction - remove it
        await supabase
          .from('comment_reactions')
          .delete()
          .eq('id', existing.id);
        return { data: { action: 'removed' }, error: null };
      } else {
        // Different reaction - update it
        await supabase
          .from('comment_reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existing.id);
        return { data: { action: 'updated', type: reactionType }, error: null };
      }
    } else {
      // No existing reaction - add new one
      await supabase
        .from('comment_reactions')
        .insert({
          comment_id: commentId,
          user_id: userId,
          reaction_type: reactionType,
        });
      return { data: { action: 'added', type: reactionType }, error: null };
    }
  } catch (err) {
    return { data: null, error: { message: 'Failed to toggle comment reaction' } };
  }
};
