-- Create watched_media table for tracking watched movies and TV shows
CREATE TABLE IF NOT EXISTS watched_media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, media_id, media_type)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_watched_media_user ON watched_media(user_id);
CREATE INDEX IF NOT EXISTS idx_watched_media_user_type ON watched_media(user_id, media_type);
CREATE INDEX IF NOT EXISTS idx_watched_media_user_media ON watched_media(user_id, media_id, media_type);

-- Enable Row Level Security
ALTER TABLE watched_media ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own watched media"
  ON watched_media FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watched media"
  ON watched_media FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watched media"
  ON watched_media FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE watched_media IS 'Tracks movies and TV shows that users have watched';
