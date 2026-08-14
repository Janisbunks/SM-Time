import { useQuery } from '@tanstack/react-query';
import { getPopularMovies, getPopularShows } from '@/services/tmdb';

export function usePopularMovies() {
  return useQuery({
    queryKey: ['popular-movies'],
    queryFn: () => getPopularMovies(),
  });
}

export function usePopularShows() {
  return useQuery({
    queryKey: ['popular-shows'],
    queryFn: () => getPopularShows(),
  });
}
