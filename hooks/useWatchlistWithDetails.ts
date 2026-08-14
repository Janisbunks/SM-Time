import { useQuery } from '@tanstack/react-query';
import { useWatchlist } from './useWatchlist';
import { getMovie, getShow } from '@/services/tmdb';
import type { TMDbMovie, TMDbShow } from '@/types/tmdb';

interface WatchlistMovie extends TMDbMovie {
  mediaType: 'movie';
}

interface WatchlistShow extends TMDbShow {
  mediaType: 'tv';
}

export function useWatchlistWithDetails() {
  const { watchlist, isLoading: isWatchlistLoading } = useWatchlist();

  // Separate watchlist items by media type
  const movieIds = watchlist?.filter((w) => w.media_type === 'movie').map((w) => w.media_id) ?? [];
  const showIds = watchlist?.filter((w) => w.media_type === 'tv').map((w) => w.media_id) ?? [];

  // Fetch all movie details in parallel
  const {
    data: moviesData,
    isLoading: isMoviesLoading,
    isError: isMoviesError,
  } = useQuery({
    queryKey: ['watchlist-movies', movieIds],
    queryFn: async (): Promise<WatchlistMovie[]> => {
      if (movieIds.length === 0) return [];
      const movies = await Promise.all(movieIds.map((id) => getMovie(id)));
      return movies.map((movie): WatchlistMovie => ({ ...movie, mediaType: 'movie' }));
    },
    enabled: movieIds.length > 0,
  });

  // Fetch all show details in parallel
  const {
    data: showsData,
    isLoading: isShowsLoading,
    isError: isShowsError,
  } = useQuery({
    queryKey: ['watchlist-shows', showIds],
    queryFn: async (): Promise<WatchlistShow[]> => {
      if (showIds.length === 0) return [];
      const shows = await Promise.all(showIds.map((id) => getShow(id)));
      return shows.map((show): WatchlistShow => ({ ...show, mediaType: 'tv' }));
    },
    enabled: showIds.length > 0,
  });

  return {
    movies: (moviesData ?? []) as WatchlistMovie[],
    shows: (showsData ?? []) as WatchlistShow[],
    isLoading: isWatchlistLoading || isMoviesLoading || isShowsLoading,
    isError: isMoviesError || isShowsError,
    isEmpty: movieIds.length === 0 && showIds.length === 0,
  };
}
