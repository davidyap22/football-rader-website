-- =====================================================
-- Performance Page Aggregation Functions for Supabase
-- =====================================================
-- Run these in Supabase SQL Editor (Dashboard > SQL Editor)
-- =====================================================

-- 1. Function to get aggregated performance summary
-- This replaces loading all individual records and aggregating on client
CREATE OR REPLACE FUNCTION get_performance_summary(
  p_bet_style TEXT DEFAULT NULL  -- NULL means all styles
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
BEGIN
  WITH filtered_bets AS (
    SELECT
      profit,
      stake_money,
      type,
      selection,
      bet_style,
      status
    FROM profit_summary
    WHERE (p_bet_style IS NULL OR LOWER(bet_style) = LOWER(p_bet_style))
  ),
  stats AS (
    SELECT
      COALESCE(SUM(profit), 0) as total_profit,
      COALESCE(SUM(stake_money), 0) as total_invested,
      COUNT(*) as total_bets,
      COUNT(DISTINCT fixture_id) as total_matches,
      CASE
        WHEN COUNT(*) > 0 THEN
          ROUND((COUNT(*) FILTER (WHERE profit > 0)::numeric / COUNT(*)::numeric) * 100, 1)
        ELSE 0
      END as win_rate,
      CASE
        WHEN SUM(stake_money) > 0 THEN
          ROUND((SUM(profit) / SUM(stake_money)) * 100, 2)
        ELSE 0
      END as roi
    FROM filtered_bets
  ),
  market_profits AS (
    SELECT
      COALESCE(SUM(CASE
        WHEN LOWER(type) IN ('1x2', 'moneyline', 'home', 'draw', 'away')
          OR (type IS NULL AND LOWER(selection) IN ('home', 'draw', 'away'))
        THEN profit ELSE 0 END), 0) as profit_moneyline,
      COALESCE(SUM(CASE
        WHEN LOWER(type) LIKE '%handicap%' OR LOWER(type) LIKE '%hdp%' OR LOWER(type) LIKE '%ah%'
          OR (type IS NULL AND (LOWER(selection) LIKE '%hdp%' OR LOWER(selection) LIKE '%handicap%'))
        THEN profit ELSE 0 END), 0) as profit_handicap,
      COALESCE(SUM(CASE
        WHEN LOWER(type) LIKE '%over%' OR LOWER(type) LIKE '%under%' OR LOWER(type) LIKE '%o/u%' OR LOWER(type) LIKE '%goal%'
          OR (type IS NULL AND (LOWER(selection) LIKE '%over%' OR LOWER(selection) LIKE '%under%'))
        THEN profit ELSE 0 END), 0) as profit_ou
    FROM filtered_bets
  )
  SELECT json_build_object(
    'total_profit', s.total_profit,
    'total_invested', s.total_invested,
    'total_bets', s.total_bets,
    'total_matches', s.total_matches,
    'win_rate', s.win_rate,
    'roi', s.roi,
    'profit_moneyline', m.profit_moneyline,
    'profit_handicap', m.profit_handicap,
    'profit_ou', m.profit_ou
  ) INTO result
  FROM stats s, market_profits m;

  RETURN result;
END;
$$;

-- 2. Function to get daily cumulative profit data for charts
CREATE OR REPLACE FUNCTION get_performance_chart_data(
  p_bet_style TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
BEGIN
  WITH filtered_bets AS (
    SELECT
      DATE(bet_time) as bet_date,
      profit,
      type,
      selection
    FROM profit_summary
    WHERE bet_time IS NOT NULL
      AND (p_bet_style IS NULL OR LOWER(bet_style) = LOWER(p_bet_style))
    ORDER BY bet_time
  ),
  daily_profits AS (
    SELECT
      bet_date,
      SUM(profit) as daily_profit,
      SUM(CASE
        WHEN LOWER(type) IN ('1x2', 'moneyline', 'home', 'draw', 'away')
          OR (type IS NULL AND LOWER(selection) IN ('home', 'draw', 'away'))
        THEN profit ELSE 0 END) as daily_moneyline,
      SUM(CASE
        WHEN LOWER(type) LIKE '%handicap%' OR LOWER(type) LIKE '%hdp%' OR LOWER(type) LIKE '%ah%'
          OR (type IS NULL AND (LOWER(selection) LIKE '%hdp%' OR LOWER(selection) LIKE '%handicap%'))
        THEN profit ELSE 0 END) as daily_handicap,
      SUM(CASE
        WHEN LOWER(type) LIKE '%over%' OR LOWER(type) LIKE '%under%' OR LOWER(type) LIKE '%o/u%' OR LOWER(type) LIKE '%goal%'
          OR (type IS NULL AND (LOWER(selection) LIKE '%over%' OR LOWER(selection) LIKE '%under%'))
        THEN profit ELSE 0 END) as daily_ou
    FROM filtered_bets
    GROUP BY bet_date
    ORDER BY bet_date
  ),
  cumulative AS (
    SELECT
      bet_date,
      daily_profit,
      SUM(daily_profit) OVER (ORDER BY bet_date) as cumulative_total,
      SUM(daily_moneyline) OVER (ORDER BY bet_date) as cumulative_moneyline,
      SUM(daily_handicap) OVER (ORDER BY bet_date) as cumulative_handicap,
      SUM(daily_ou) OVER (ORDER BY bet_date) as cumulative_ou
    FROM daily_profits
  )
  SELECT json_agg(
    json_build_object(
      'date', bet_date,
      'profit', daily_profit,
      'cumulative', cumulative_total,
      'cumulativeMoneyline', cumulative_moneyline,
      'cumulativeHandicap', cumulative_handicap,
      'cumulativeOU', cumulative_ou
    )
  ) INTO result
  FROM cumulative;

  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- 3. Function to get paginated match list with aggregated profits
CREATE OR REPLACE FUNCTION get_performance_matches(
  p_bet_style TEXT DEFAULT NULL,
  p_page INT DEFAULT 0,
  p_page_size INT DEFAULT 20
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  result JSON;
BEGIN
  WITH match_profits AS (
    SELECT
      ps.fixture_id,
      MAX(ps.league_name) as league_name,
      MAX(ps.bet_time) as latest_bet_time,
      SUM(ps.profit) as total_profit,
      SUM(ps.stake_money) as total_invested,
      COUNT(*) as bet_count,
      SUM(CASE
        WHEN LOWER(ps.type) IN ('1x2', 'moneyline', 'home', 'draw', 'away')
          OR (ps.type IS NULL AND LOWER(ps.selection) IN ('home', 'draw', 'away'))
        THEN ps.profit ELSE 0 END) as profit_moneyline,
      SUM(CASE
        WHEN LOWER(ps.type) LIKE '%handicap%' OR LOWER(ps.type) LIKE '%hdp%' OR LOWER(ps.type) LIKE '%ah%'
          OR (ps.type IS NULL AND (LOWER(ps.selection) LIKE '%hdp%' OR LOWER(ps.selection) LIKE '%handicap%'))
        THEN ps.profit ELSE 0 END) as profit_handicap,
      SUM(CASE
        WHEN LOWER(ps.type) LIKE '%over%' OR LOWER(ps.type) LIKE '%under%' OR LOWER(ps.type) LIKE '%o/u%' OR LOWER(ps.type) LIKE '%goal%'
          OR (ps.type IS NULL AND (LOWER(ps.selection) LIKE '%over%' OR LOWER(ps.selection) LIKE '%under%'))
        THEN ps.profit ELSE 0 END) as profit_ou,
      MAX(ps.home_score) as home_score,
      MAX(ps.away_score) as away_score
    FROM profit_summary ps
    WHERE (p_bet_style IS NULL OR LOWER(ps.bet_style) = LOWER(p_bet_style))
    GROUP BY ps.fixture_id
  ),
  matches_with_details AS (
    SELECT
      mp.*,
      pm.home_name,
      pm.home_logo,
      pm.away_name,
      pm.away_logo,
      pm.league_logo,
      pm.start_date_msia as match_date,
      CASE WHEN mp.total_invested > 0
        THEN ROUND((mp.total_profit / mp.total_invested) * 100, 1)
        ELSE 0 END as roi
    FROM match_profits mp
    LEFT JOIN prematches pm ON mp.fixture_id::text = pm.fixture_id::text
    ORDER BY mp.latest_bet_time DESC
    LIMIT p_page_size
    OFFSET p_page * p_page_size
  ),
  total_count AS (
    SELECT COUNT(DISTINCT fixture_id) as count
    FROM profit_summary
    WHERE (p_bet_style IS NULL OR LOWER(bet_style) = LOWER(p_bet_style))
  )
  SELECT json_build_object(
    'matches', COALESCE((SELECT json_agg(row_to_json(m)) FROM matches_with_details m), '[]'::json),
    'total_count', (SELECT count FROM total_count),
    'page', p_page,
    'page_size', p_page_size
  ) INTO result;

  RETURN result;
END;
$$;

-- 4. Grant permissions (run these after creating the functions)
GRANT EXECUTE ON FUNCTION get_performance_summary(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_performance_chart_data(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_performance_matches(TEXT, INT, INT) TO anon, authenticated;

-- =====================================================
-- Usage Examples (from your Next.js code):
-- =====================================================
--
-- // Get summary (all styles)
-- const { data } = await supabase.rpc('get_performance_summary');
--
-- // Get summary (specific style)
-- const { data } = await supabase.rpc('get_performance_summary', { p_bet_style: 'aggressive' });
--
-- // Get chart data
-- const { data } = await supabase.rpc('get_performance_chart_data', { p_bet_style: null });
--
-- // Get matches (paginated)
-- const { data } = await supabase.rpc('get_performance_matches', {
--   p_bet_style: null,
--   p_page: 0,
--   p_page_size: 20
-- });
-- =====================================================
