import { useQuery } from '@tanstack/react-query';
import {
  getSimilarMovies,
  getRecommendedMovies,
  getSimilarShows,
  getRecommendedShows,
} from '@/services/tmdb';

export function useSimilarMovies(id: number) {
  return useQuery({
    queryKey: ['movie', id, 'similar'],
    queryFn: () => getSimilarMovies(id),
    enabled: !!id,
  });
}

export function useRecommendedMovies(id: number) {
  return useQuery({
    queryKey: ['movie', id, 'recommended'],
    queryFn: () => getRecommendedMovies(id),
    enabled: !!id,
  });
}

export function useSimilarShows(id: number) {
  return useQuery({
    queryKey: ['show', id, 'similar'],
    queryFn: () => getSimilarShows(id),
    enabled: !!id,
  });
}

export function useRecommendedShows(id: number) {
  return useQuery({
    queryKey: ['show', id, 'recommended'],
    queryFn: () => getRecommendedShows(id),
    enabled: !!id,
  });
}
