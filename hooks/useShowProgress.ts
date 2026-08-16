import { useEpisodeTracker } from './useEpisodeTracker';

interface ShowProgress {
  watchedCount: number;
  totalCount: number;
  percentage: number;
  isComplete: boolean;
  isStarted: boolean;
}

export function useShowProgress(showId: number, totalEpisodes: number): ShowProgress {
  const { watchedEpisodeIds } = useEpisodeTracker(showId);

  const watchedCount = watchedEpisodeIds.size;
  const totalCount = totalEpisodes;
  const percentage = totalCount > 0 ? (watchedCount / totalCount) * 100 : 0;
  const isComplete = totalCount > 0 && watchedCount >= totalCount;
  const isStarted = watchedCount > 0;

  return {
    watchedCount,
    totalCount,
    percentage,
    isComplete,
    isStarted,
  };
}
