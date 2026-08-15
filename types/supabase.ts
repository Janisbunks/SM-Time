export interface WatchlistRow {
  id: string;
  user_id: string;
  media_id: number;
  media_type: 'tv' | 'movie';
  created_at: string;
}

export interface WatchedEpisodeRow {
  id: string;
  user_id: string;
  show_id: number;
  episode_id: number;
  watched_at: string;
}

export interface WatchedMediaRow {
  id: string;
  user_id: string;
  media_id: number;
  media_type: 'movie' | 'tv';
  watched_at: string;
  created_at: string;
}

export interface RatingRow {
  id: string;
  user_id: string;
  media_id: number;
  media_type: 'tv' | 'movie' | 'episode';
  rating: number;
  created_at: string;
}

export interface CommentRow {
  id: string;
  user_id: string;
  episode_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}
