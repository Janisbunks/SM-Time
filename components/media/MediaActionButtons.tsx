import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useWatchedMedia } from '@/hooks/useWatchedMedia';

interface MediaActionButtonsProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
}

export default function MediaActionButtons({ mediaId, mediaType }: MediaActionButtonsProps) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { isWatched, markAsWatched, unmarkAsWatched } = useWatchedMedia();

  const inWatchlist = isInWatchlist(mediaId, mediaType);
  const watched = isWatched(mediaId, mediaType);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist.mutate({ mediaId, mediaType });
    } else {
      addToWatchlist.mutate({ mediaId, mediaType });
    }
  };

  const handleWatchedToggle = () => {
    if (watched) {
      unmarkAsWatched.mutate({ mediaId, mediaType });
    } else {
      markAsWatched.mutate({ mediaId, mediaType });
    }
  };

  return (
    <View className="px-4 pb-4 flex-row gap-3">
      {/* Watchlist Button */}
      <TouchableOpacity
        onPress={handleWatchlistToggle}
        className={`flex-row items-center justify-center bg-surface-card rounded-lg px-4 py-3 ${inWatchlist ? 'flex-1' : 'flex-1'}`}
        activeOpacity={0.7}
      >
        <Ionicons
          name={inWatchlist ? 'bookmark' : 'bookmark-outline'}
          size={20}
          color={inWatchlist ? '#0ea5e9' : '#6b7280'}
        />
        <Text className={`ml-2 font-medium ${inWatchlist ? 'text-sky-400' : 'text-gray-400'}`}>
          {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        </Text>
      </TouchableOpacity>

      {/* Mark as Watched Button - ONLY shows if in watchlist */}
      {inWatchlist && (
        <TouchableOpacity
          onPress={handleWatchedToggle}
          className="flex-1 bg-surface-card rounded-lg px-4 py-3 flex-row items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons
            name={watched ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={20}
            color={watched ? '#10b981' : '#6b7280'}
          />
          <Text className={`ml-2 font-medium ${watched ? 'text-green-500' : 'text-gray-400'}`}>
            {watched ? 'Watched' : 'Mark Watched'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
