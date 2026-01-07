-- News Comments Schema for OddsFlow
-- Run this SQL in Supabase SQL Editor to create the news comments tables

-- ============================================
-- NEWS COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS news_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id INTEGER NOT NULL,  -- References football_news.id
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 1000),
  parent_id UUID REFERENCES news_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEWS COMMENT REACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS news_comment_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES news_comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('👍', '❤️', '😂', '😮', '😢', '😡')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)  -- One reaction per user per comment
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_news_comments_news_id ON news_comments(news_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_parent_id ON news_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_user_id ON news_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_created_at ON news_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_comment_reactions_comment_id ON news_comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_news_comment_reactions_user_id ON news_comment_reactions(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comment_reactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running)
DROP POLICY IF EXISTS "Anyone can view news comments" ON news_comments;
DROP POLICY IF EXISTS "Users can insert own news comments" ON news_comments;
DROP POLICY IF EXISTS "Users can delete own news comments" ON news_comments;
DROP POLICY IF EXISTS "Anyone can view news comment reactions" ON news_comment_reactions;
DROP POLICY IF EXISTS "Users can insert own reactions" ON news_comment_reactions;
DROP POLICY IF EXISTS "Users can update own reactions" ON news_comment_reactions;
DROP POLICY IF EXISTS "Users can delete own reactions" ON news_comment_reactions;

-- NEWS COMMENTS POLICIES
-- Everyone can read comments (public)
CREATE POLICY "Anyone can view news comments"
  ON news_comments FOR SELECT
  USING (true);

-- Authenticated users can insert their own comments
CREATE POLICY "Users can insert own news comments"
  ON news_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own comments
CREATE POLICY "Users can delete own news comments"
  ON news_comments FOR DELETE
  USING (auth.uid() = user_id);

-- NEWS COMMENT REACTIONS POLICIES
-- Everyone can read reactions
CREATE POLICY "Anyone can view news comment reactions"
  ON news_comment_reactions FOR SELECT
  USING (true);

-- Users can insert their own reactions
CREATE POLICY "Users can insert own reactions"
  ON news_comment_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reactions
CREATE POLICY "Users can update own reactions"
  ON news_comment_reactions FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reactions
CREATE POLICY "Users can delete own reactions"
  ON news_comment_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_news_comment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_news_comment_timestamp ON news_comments;
CREATE TRIGGER trigger_update_news_comment_timestamp
  BEFORE UPDATE ON news_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_news_comment_updated_at();
