import type { TMDbSearchResult, TMDbShow, TMDbMovie, TMDbCredits, TMDbSeason } from '@/types/tmdb';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY  = process.env.EXPO_PUBLIC_TMDB_API_KEY!;

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const posterUrl   = (path: string, size = 'w342')  => `${TMDB_IMAGE_BASE}/${size}${path}`;
export const backdropUrl = (path: string, size = 'w1280') => `${TMDB_IMAGE_BASE}/${size}${path}`;

async function request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDb ${res.status}: ${endpoint}`);
  return res.json() as Promise<T>;
}

// ── Discovery ─────────────────────────────────────────────
export const getTrendingAll   = (timeWindow: 'day' | 'week' = 'week') =>
  request<TMDbSearchResult>('/trending/all/' + timeWindow);

export const getPopularShows  = () => request<TMDbSearchResult>('/tv/popular');
export const getPopularMovies = () => request<TMDbSearchResult>('/movie/popular');

// ── Search ────────────────────────────────────────────────
export const searchMulti  = (query: string, page = '1') =>
  request<TMDbSearchResult>('/search/multi', { query, page });

export const searchShows  = (query: string, page = '1') =>
  request<TMDbSearchResult>('/search/tv', { query, page });

export const searchMovies = (query: string, page = '1') =>
  request<TMDbSearchResult>('/search/movie', { query, page });

// ── Show Detail ───────────────────────────────────────────
export const getShow        = (id: number) => request<TMDbShow>(`/tv/${id}`);
export const getShowSeason  = (id: number, season: number) =>
  request<TMDbSeason>(`/tv/${id}/season/${season}`);
export const getShowCredits = (id: number) => request<TMDbCredits>(`/tv/${id}/credits`);
export const getShowVideos  = (id: number) => request<any>(`/tv/${id}/videos`);

// ── Movie Detail ──────────────────────────────────────────
export const getMovie        = (id: number) => request<TMDbMovie>(`/movie/${id}`);
export const getMovieCredits = (id: number) => request<TMDbCredits>(`/movie/${id}/credits`);
export const getMovieVideos  = (id: number) => request<any>(`/movie/${id}/videos`);
