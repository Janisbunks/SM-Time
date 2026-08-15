import { useQuery } from '@tanstack/react-query';
import { getMovieWatchProviders, getShowWatchProviders } from '@/services/tmdb';

export function useMovieWatchProviders(id: number) {
  return useQuery({
    queryKey: ['movie', id, 'watch-providers'],
    queryFn: () => getMovieWatchProviders(id),
    enabled: !!id,
  });
}

export function useShowWatchProviders(id: number) {
  return useQuery({
    queryKey: ['show', id, 'watch-providers'],
    queryFn: () => getShowWatchProviders(id),
    enabled: !!id,
  });
}
