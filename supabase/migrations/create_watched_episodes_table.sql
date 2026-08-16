-- Create watched_episodes table for tracking individual TV show episodes
CREATE TABLE IF NOT EXISTS watched_episodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  show_id INTEGER NOT NULL,
  episode_id INTEGER NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, episode_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_watched_episodes_user ON watched_episodes(user_id);
CREATE INDEX IF NOT EXISTS idx_watched_episodes_show ON watched_episodes(show_id);
CREATE INDEX IF NOT EXISTS idx_watched_episodes_user_show ON watched_episodes(user_id, show_id);
CREATE INDEX IF NOT EXISTS idx_watched_episodes_episode ON watched_episodes(episode_id);

-- Enable Row Level Security
ALTER TABLE watched_episodes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own watched episodes"
  ON watched_episodes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watched episodes"
  ON watched_episodes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watched episodes"
  ON watched_episodes FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE watched_episodes IS 'Tracks individual TV show episodes that users have watched';
