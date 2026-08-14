import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { posterUrl } from '@/services/tmdb';

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating?: number;
  onPress?: () => void;
}

export default function MediaCard({ title, posterPath, rating, onPress }: MediaCardProps) {
  return (
    <TouchableOpacity onPress={onPress} className="w-36 mr-3">
      <Image
        source={posterPath ? posterUrl(posterPath) : undefined}
        className="w-36 h-52 rounded-xl bg-surface-card"
        contentFit="cover"
      />
      <Text className="text-white text-sm mt-2 font-medium" numberOfLines={2}>{title}</Text>
      {rating !== undefined && (
        <Text className="text-brand-400 text-xs mt-0.5">{rating.toFixed(1)} ★</Text>
      )}
    </TouchableOpacity>
  );
}
