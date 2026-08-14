import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { useAuth } from './useAuth';

export function useWatchlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addToWatchlist = useMutation({
    mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: 'tv' | 'movie' }) => {
      const { error } = await supabase
        .from('watchlist')
        .insert({ user_id: user!.id, media_id: mediaId, media_type: mediaType });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist', user?.id] }),
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async ({ mediaId, mediaType }: { mediaId: number; mediaType: 'tv' | 'movie' }) => {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user!.id)
        .eq('media_id', mediaId)
        .eq('media_type', mediaType);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watchlist', user?.id] }),
  });

  const isInWatchlist = (mediaId: number, mediaType: 'tv' | 'movie') =>
    watchlist?.some((w) => w.media_id === mediaId && w.media_type === mediaType) ?? false;

  return { watchlist, isLoading, addToWatchlist, removeFromWatchlist, isInWatchlist };
}
