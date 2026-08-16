import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { posterUrl } from '@/services/tmdb';
import ProgressIndicator from './ProgressIndicator';

interface WatchlistCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating?: number;
  onPress?: () => void;
  // Progress props for TV shows
  showProgress?: boolean;
  watchedCount?: number;
  totalCount?: number;
  // Badge for completed items
  showWatchedBadge?: boolean;
}

export default function WatchlistCard({
  title,
  posterPath,
  rating,
  onPress,
  showProgress = false,
  watchedCount = 0,
  totalCount = 0,
  showWatchedBadge = false,
}: WatchlistCardProps) {
  return (
    <TouchableOpacity onPress={onPress} className="w-36 mr-3">
      <View className="relative">
        <Image
          source={posterPath ? posterUrl(posterPath) : undefined}
          className="w-36 h-52 rounded-xl bg-surface-card"
          contentFit="cover"
        />
        {showWatchedBadge && (
          <View className="absolute top-2 right-2 bg-green-500 px-2 py-1 rounded-md">
            <Text className="text-white text-xs font-semibold">Watched</Text>
          </View>
        )}
      </View>

      <Text className="text-white text-sm mt-2 font-medium" numberOfLines={2}>
        {title}
      </Text>

      {rating !== undefined && (
        <Text className="text-brand-400 text-xs mt-0.5">{rating.toFixed(1)} ★</Text>
      )}

      {showProgress && totalCount > 0 && (
        <View className="mt-2">
          <ProgressIndicator
            watchedCount={watchedCount}
            totalCount={totalCount}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}
