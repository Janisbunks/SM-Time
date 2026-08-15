import { useQuery } from '@tanstack/react-query';
import { getMovieReviews, getShowReviews } from '@/services/tmdb';

export function useMovieReviews(id: number) {
  return useQuery({
    queryKey: ['movie', id, 'reviews'],
    queryFn: () => getMovieReviews(id),
    enabled: !!id,
  });
}

export function useShowReviews(id: number) {
  return useQuery({
    queryKey: ['show', id, 'reviews'],
    queryFn: () => getShowReviews(id),
    enabled: !!id,
  });
}
