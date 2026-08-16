import { useQuery } from '@tanstack/react-query';
import { useWatchlistWithDetails } from './useWatchlistWithDetails';
import { useWatchedMedia } from './useWatchedMedia';
import { useAuth } from './useAuth';
import { getMovie, getShow } from '@/services/tmdb';
import type { TMDbMovie, TMDbShow } from '@/types/tmdb';

interface WatchlistMovie extends TMDbMovie {
  mediaType: 'movie';
}

interface WatchlistShow extends TMDbShow {
  mediaType: 'tv';
}

interface ShowWithProgress extends WatchlistShow {
  watchedCount: number;
  totalCount: number;
  percentage: number;
}

interface CategorizedWatchlist {
  movies: {
    watchlist: WatchlistMovie[];
    watched: WatchlistMovie[];
  };
  shows: {
    notStarted: WatchlistShow[];
    inProgress: ShowWithProgress[];
    finished: WatchlistShow[];
  };
  isLoading: boolean;
}

export function useCategorizedWatchlist(): CategorizedWatchlist {
  const { user } = useAuth();
  const { movies: watchlistMovies, shows: watchlistShows, isLoading: isWatchlistLoading } = useWatchlistWithDetails();
  const { watchedMedia, isLoading: isWatchedMediaLoading } = useWatchedMedia();

  // Query to categorize items
  const { data, isLoading: isCategorizing } = useQuery({
    queryKey: ['categorized-watchlist', user?.id, watchlistMovies.length, watchlistShows.length, watchedMedia.size],
    queryFn: async () => {
      const { supabase } = await import('@/services/supabase');

      // Watchlist movies (only movies in watchlist, not watched)
      const moviesInWatchlist: WatchlistMovie[] = watchlistMovies;

      // Fetch watched movies from watched_media table
      const { data: watchedMovieRecords, error: watchedError } = await supabase
        .from('watched_media')
        .select('media_id')
        .eq('user_id', user!.id)
        .eq('media_type', 'movie');

      if (watchedError) {
        console.error('Error fetching watched movies:', watchedError);
      }

      const watchedMovieIds = watchedMovieRecords?.map(r => r.media_id) || [];

      // Fetch TMDB details for watched movies
      const watchedMoviesData: WatchlistMovie[] = await Promise.all(
        watchedMovieIds.map(async (id) => {
          const movie = await getMovie(id);
          return { ...movie, mediaType: 'movie' as const };
        })
      );

      // Categorize shows - need to fetch episode tracking data for each show
      const notStartedShows: WatchlistShow[] = [];
      const inProgressShows: ShowWithProgress[] = [];
      const finishedShows: WatchlistShow[] = [];

      for (const show of watchlistShows) {
        const totalEpisodes = show.number_of_episodes || 0;

        if (totalEpisodes === 0) {
          // If we don't know the total episodes, treat as not started
          notStartedShows.push(show);
          continue;
        }

        // Fetch watched episodes for this show
        const { data: watchedEpisodes, error } = await supabase
          .from('watched_episodes')
          .select('episode_id')
          .eq('user_id', user!.id)
          .eq('show_id', show.id);

        if (error) {
          console.error('Error fetching watched episodes:', error);
          notStartedShows.push(show);
          continue;
        }

        const watchedCount = watchedEpisodes?.length || 0;

        if (watchedCount === 0) {
          // Not started
          notStartedShows.push(show);
        } else if (watchedCount >= totalEpisodes) {
          // Finished
          finishedShows.push(show);
        } else {
          // In progress
          inProgressShows.push({
            ...show,
            watchedCount,
            totalCount: totalEpisodes,
            percentage: (watchedCount / totalEpisodes) * 100,
          });
        }
      }

      return {
        movies: {
          watchlist: moviesInWatchlist,
          watched: watchedMoviesData,
        },
        shows: {
          notStarted: notStartedShows,
          inProgress: inProgressShows,
          finished: finishedShows,
        },
      };
    },
    enabled: !!user && !isWatchlistLoading && !isWatchedMediaLoading,
  });

  return {
    movies: data?.movies ?? { watchlist: [], watched: [] },
    shows: data?.shows ?? { notStarted: [], inProgress: [], finished: [] },
    isLoading: isWatchlistLoading || isWatchedMediaLoading || isCategorizing,
  };
}
