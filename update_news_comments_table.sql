-- =====================================================
-- Update news_comments table for UUID support
-- =====================================================
-- This script updates the news_comments table to support
-- the new UUID-based football_news.id column
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Check current structure
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'news_comments' AND column_name = 'news_id';

-- Step 2: Backup existing data (optional but recommended)
-- CREATE TABLE news_comments_backup AS SELECT * FROM news_comments;

-- Step 3: Alter the news_id column to support both UUID and integer
-- Option A: Change to TEXT to support both UUID strings and integer strings
ALTER TABLE news_comments
ALTER COLUMN news_id TYPE TEXT USING news_id::TEXT;

-- Step 4: Update any existing integer IDs to match new UUID format
-- (Only if you have existing data that needs migration)
-- UPDATE news_comments
-- SET news_id = (SELECT id FROM football_news WHERE CAST(football_news.id AS INTEGER) = CAST(news_comments.news_id AS INTEGER))
-- WHERE news_id ~ '^[0-9]+$';

-- Step 5: Verify the change
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'news_comments' AND column_name = 'news_id';

-- =====================================================
-- Note: After running this script, the news_comments
-- table will accept both UUID strings and numeric strings
-- for the news_id column
-- =====================================================
