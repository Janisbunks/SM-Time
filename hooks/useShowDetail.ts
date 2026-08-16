import { useQuery, useQueries } from '@tanstack/react-query';
import { getShow, getShowCredits, getShowVideos, getShowSeason } from '@/services/tmdb';

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

export function useShowSeason(showId: number, seasonNumber: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['show', showId, 'season', seasonNumber],
    queryFn: () => getShowSeason(showId, seasonNumber),
    enabled: enabled && !!showId && seasonNumber >= 0,
  });
}

export function useShowSeasons(showId: number, seasonNumbers: number[]) {
  return useQueries({
    queries: seasonNumbers.map((seasonNumber) => ({
      queryKey: ['show', showId, 'season', seasonNumber],
      queryFn: () => getShowSeason(showId, seasonNumber),
      enabled: !!showId && seasonNumber >= 0,
    })),
  });
}
