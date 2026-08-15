import { useQuery } from '@tanstack/react-query';
import { getMovie, getMovieCredits, getMovieVideos } from '@/services/tmdb';

export function useMovieDetail(id: number) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovie(id),
    enabled: !!id,
  });
}

export function useMovieCredits(id: number) {
  return useQuery({
    queryKey: ['movie', id, 'credits'],
    queryFn: () => getMovieCredits(id),
    enabled: !!id,
  });
}

export function useMovieVideos(id: number) {
  return useQuery({
    queryKey: ['movie', id, 'videos'],
    queryFn: () => getMovieVideos(id),
    enabled: !!id,
  });
}
