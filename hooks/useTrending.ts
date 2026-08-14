import { useQuery } from '@tanstack/react-query';
import { getTrendingAll } from '@/services/tmdb';

export function useTrending(timeWindow: 'day' | 'week' = 'week') {
  return useQuery({
    queryKey: ['trending', timeWindow],
    queryFn: () => getTrendingAll(timeWindow),
  });
}
