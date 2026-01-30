-- User Match Predictions Schema for OddsFlow
-- Run this SQL in Supabase SQL Editor to create the user predictions table

-- ============================================
-- USER MATCH PREDICTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_match_predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id INTEGER NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  league TEXT,
  match_date TIMESTAMPTZ,
  home_score_prediction INTEGER CHECK (home_score_prediction >= 0 AND home_score_prediction <= 20),
  away_score_prediction INTEGER CHECK (away_score_prediction >= 0 AND away_score_prediction <= 20),
  winner_prediction TEXT CHECK (winner_prediction IN ('1', 'X', '2')),
  analysis TEXT CHECK (char_length(analysis) <= 500),
  user_name TEXT,
  user_avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id)  -- One prediction per user per match
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_predictions_match_id ON user_match_predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_user_predictions_user_id ON user_match_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_predictions_created_at ON user_match_predictions(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE user_match_predictions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running)
DROP POLICY IF EXISTS "Anyone can view user predictions" ON user_match_predictions;
DROP POLICY IF EXISTS "Users can insert own predictions" ON user_match_predictions;
DROP POLICY IF EXISTS "Users can update own predictions" ON user_match_predictions;
DROP POLICY IF EXISTS "Users can delete own predictions" ON user_match_predictions;

-- Everyone can read predictions (public)
CREATE POLICY "Anyone can view user predictions"
  ON user_match_predictions FOR SELECT
  USING (true);

-- Authenticated users can insert their own predictions
CREATE POLICY "Users can insert own predictions"
  ON user_match_predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own predictions
CREATE POLICY "Users can update own predictions"
  ON user_match_predictions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own predictions
CREATE POLICY "Users can delete own predictions"
  ON user_match_predictions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_user_prediction_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_user_prediction_timestamp ON user_match_predictions;
CREATE TRIGGER trigger_update_user_prediction_timestamp
  BEFORE UPDATE ON user_match_predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_prediction_updated_at();
