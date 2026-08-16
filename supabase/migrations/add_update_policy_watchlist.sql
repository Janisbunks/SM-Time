-- Add UPDATE policy for watchlist table to support upsert operations
-- This ensures users can update their own watchlist items if needed in the future

CREATE POLICY "Users can update their own watchlist items"
  ON watchlist FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
