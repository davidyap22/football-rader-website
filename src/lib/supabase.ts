import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client even if env vars are missing (for development without Supabase)
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null as any;

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
}

export interface League {
  league_name: string;
  league_logo: string;
  count: number;
}

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

// Submit contact form message
export const submitContactMessage = async (contactData: Omit<ContactMessage, 'id' | 'created_at'>) => {
  // Check if supabase client is available
  if (!supabase) {
    return { data: null, error: { message: 'Supabase client not initialized' } };
  }

  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        message: contactData.message,
      })
      .select();

    if (error) {
      return { data: null, error };
    }

    return { data: data?.[0] || null, error: null };
  } catch (err) {
    return { data: null, error: { message: 'Failed to submit message' } };
  }
};
