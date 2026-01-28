-- =====================================================
-- Payment System Tables for X1PAG Integration
-- =====================================================
-- Run this in Supabase SQL Editor
-- =====================================================

-- Table to store payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id TEXT NOT NULL UNIQUE,
  order_reference TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL CHECK (status IN ('approved', 'pending', 'rejected', 'cancelled')),
  payment_method TEXT,
  plan_type TEXT NOT NULL,
  callback_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_transaction_id ON payment_transactions(transaction_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own transactions
CREATE POLICY "Users can view own transactions"
ON payment_transactions FOR SELECT
USING (auth.uid() = user_id);

-- RLS Policy: Only service role can insert/update transactions (from callback API)
CREATE POLICY "Service role can insert transactions"
ON payment_transactions FOR INSERT
WITH CHECK (true);  -- API uses service role key

CREATE POLICY "Service role can update transactions"
ON payment_transactions FOR UPDATE
USING (true);  -- API uses service role key

-- Update user_subscriptions table to add payment reference
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT REFERENCES payment_transactions(transaction_id);

-- Add index on payment_transaction_id
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_payment_id
ON user_subscriptions(payment_transaction_id);

-- Add status column to user_subscriptions if it doesn't exist
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'cancelled', 'expired'));

-- =====================================================
-- Verification Query
-- =====================================================
-- Run this to verify tables were created successfully
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('payment_transactions', 'user_subscriptions')
ORDER BY table_name, ordinal_position;
