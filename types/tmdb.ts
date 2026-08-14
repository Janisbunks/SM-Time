export interface TMDbShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  genre_ids: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  seasons?: TMDbSeason[];
}

export interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  runtime?: number;
}

export interface TMDbSeason {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  air_date: string;
  episode_count: number;
  poster_path: string | null;
  episodes?: TMDbEpisode[];
}

export interface TMDbEpisode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  air_date: string;
  still_path: string | null;
  vote_average: number;
  runtime?: number;
}

export interface TMDbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDbCredits {
  cast: TMDbCastMember[];
  crew: Array<{
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }>;
}

export interface TMDbSearchResult {
  page: number;
  results: Array<TMDbShow | TMDbMovie | { id: number; media_type: string }>;
  total_pages: number;
  total_results: number;
}

export type MediaType = 'tv' | 'movie' | 'person';
