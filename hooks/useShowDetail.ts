import { useQuery } from '@tanstack/react-query';
import { getShow, getShowCredits, getShowVideos } from '@/services/tmdb';

export function useShowDetail(id: number) {
  return useQuery({
    queryKey: ['show', id],
    queryFn: () => getShow(id),
    enabled: !!id,
  });
}

export function useShowCredits(id: number) {
  return useQuery({
    queryKey: ['show', id, 'credits'],
    queryFn: () => getShowCredits(id),
    enabled: !!id,
  });
}

export function useShowVideos(id: number) {
  return useQuery({
    queryKey: ['show', id, 'videos'],
    queryFn: () => getShowVideos(id),
    enabled: !!id,
  });
}
