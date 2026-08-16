-- Add UPDATE policy for watched_media table to support upsert operations
-- This allows users to update the watched_at timestamp when re-marking media as watched

CREATE POLICY "Users can update their own watched media"
  ON watched_media FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
