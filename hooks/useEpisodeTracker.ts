import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { useAuth } from './useAuth';

export function useEpisodeTracker(showId: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: watchedEpisodes } = useQuery({
    queryKey: ['watched_episodes', user?.id, showId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watched_episodes')
        .select('episode_id')
        .eq('user_id', user!.id)
        .eq('show_id', showId);
      if (error) throw error;
      return new Set<number>(data.map((r) => r.episode_id));
    },
    enabled: !!user,
    initialData: new Set<number>(),
  });

  const toggleEpisode = useMutation({
    mutationFn: async (episodeId: number) => {
      if (watchedEpisodes.has(episodeId)) {
        const { error } = await supabase
          .from('watched_episodes')
          .delete()
          .eq('user_id', user!.id)
          .eq('episode_id', episodeId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('watched_episodes')
          .upsert({
            user_id: user!.id,
            show_id: showId,
            episode_id: episodeId,
            watched_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,episode_id',
          });
        if (error) throw error;
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['watched_episodes', user?.id, showId] }),
  });

  const markSeasonAsWatched = useMutation({
    mutationFn: async (episodeIds: number[]) => {
      // Filter out already watched episodes
      const unwatchedEpisodes = episodeIds.filter((id) => !watchedEpisodes.has(id));

      if (unwatchedEpisodes.length === 0) return;

      // Bulk insert unwatched episodes
      const insertData = unwatchedEpisodes.map((episodeId) => ({
        user_id: user!.id,
        show_id: showId,
        episode_id: episodeId,
      }));

      const { error } = await supabase.from('watched_episodes').insert(insertData);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['watched_episodes', user?.id, showId] }),
  });

  const unmarkSeasonAsWatched = useMutation({
    mutationFn: async (episodeIds: number[]) => {
      // Filter to only watched episodes
      const watchedEpisodesToRemove = episodeIds.filter((id) => watchedEpisodes.has(id));

      if (watchedEpisodesToRemove.length === 0) return;

      // Bulk delete
      const { error } = await supabase
        .from('watched_episodes')
        .delete()
        .eq('user_id', user!.id)
        .in('episode_id', watchedEpisodesToRemove);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['watched_episodes', user?.id, showId] }),
  });

  return {
    watchedEpisodes,
    toggleEpisode,
    markSeasonAsWatched,
    unmarkSeasonAsWatched
  };
}
