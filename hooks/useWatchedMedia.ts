import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { useAuth } from './useAuth';

export function useWatchedMedia() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all watched media for user
  const { data: watchedMedia, isLoading } = useQuery({
    queryKey: ['watched_media', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watched_media')
        .select('media_id, media_type, watched_at')
        .eq('user_id', user!.id);

      if (error) throw error;

      // Create a Set for O(1) lookup: "movie-123" or "tv-456"
      const watchedSet = new Set<string>();
      data?.forEach(item => {
        watchedSet.add(`${item.media_type}-${item.media_id}`);
      });
      return watchedSet;
    },
    enabled: !!user,
    initialData: new Set<string>(),
  });

  // Check if specific item is watched
  const isWatched = (mediaId: number, mediaType: 'movie' | 'tv') => {
    return watchedMedia.has(`${mediaType}-${mediaId}`);
  };

  // Mark as watched
  const markAsWatched = useMutation({
    mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) => {
      const { error } = await supabase
        .from('watched_media')
        .insert({
          user_id: user!.id,
          media_id: mediaId,
          media_type: mediaType
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watched_media', user?.id] });
    },
  });

  // Unmark as watched
  const unmarkAsWatched = useMutation({
    mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: 'movie' | 'tv' }) => {
      const { error} = await supabase
        .from('watched_media')
        .delete()
        .eq('user_id', user!.id)
        .eq('media_id', mediaId)
        .eq('media_type', mediaType);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watched_media', user?.id] });
    },
  });

  return {
    watchedMedia,
    isWatched,
    markAsWatched,
    unmarkAsWatched,
    isLoading
  };
}
