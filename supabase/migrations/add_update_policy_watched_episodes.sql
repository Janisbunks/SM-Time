-- Add UPDATE policy for watched_episodes table to support upsert operations
-- This ensures users can update their own watched episodes if needed in the future

CREATE POLICY "Users can update their own watched episodes"
  ON watched_episodes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
