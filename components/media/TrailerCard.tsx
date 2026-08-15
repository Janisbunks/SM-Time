import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import type { TMDbVideo } from '@/types/tmdb';

interface TrailerCardProps {
  video: TMDbVideo;
}

export default function TrailerCard({ video }: TrailerCardProps) {
  const openYouTube = () => {
    if (video.site === 'YouTube' && video.key) {
      Linking.openURL(`https://www.youtube.com/watch?v=${video.key}`);
    }
  };

  const thumbnailUrl = video.site === 'YouTube'
    ? `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`
    : null;

  return (
    <TouchableOpacity
      onPress={openYouTube}
      className="bg-surface-card rounded-lg overflow-hidden"
      activeOpacity={0.7}
    >
      {/* YouTube Thumbnail */}
      {thumbnailUrl && (
        <View className="relative">
          <Image
            source={{ uri: thumbnailUrl }}
            className="w-full h-48"
            resizeMode="cover"
          />
          {/* Play Button Overlay */}
          <View className="absolute inset-0 items-center justify-center">
            <View className="bg-red-600 rounded-full w-16 h-16 items-center justify-center opacity-90">
              <Text className="text-white text-2xl ml-1">▶</Text>
            </View>
          </View>
          {/* Video Type Badge */}
          <View className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded">
            <Text className="text-white text-xs font-semibold">{video.type}</Text>
          </View>
        </View>
      )}

      {/* Video Info */}
      <View className="p-3">
        <Text className="text-white text-sm font-medium" numberOfLines={2}>
          {video.name}
        </Text>
        {video.official && (
          <View className="mt-1 flex-row items-center">
            <View className="bg-blue-500 px-1.5 py-0.5 rounded">
              <Text className="text-white text-[10px] font-bold">OFFICIAL</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
