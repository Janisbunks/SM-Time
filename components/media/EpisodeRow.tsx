import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EpisodeRowProps {
  number: number;
  title: string;
  airDate?: string;
  watched?: boolean;
  onToggle?: () => void;
}

export default function EpisodeRow({ number, title, airDate, watched = false, onToggle }: EpisodeRowProps) {
  return (
    <View className="flex-row items-center py-3 border-b border-surface-border">
      <Text className="text-gray-500 w-8 text-sm">{number}</Text>
      <View className="flex-1 mx-3">
        <Text className="text-white font-medium" numberOfLines={1}>{title}</Text>
        {airDate && <Text className="text-gray-500 text-xs mt-0.5">{airDate}</Text>}
      </View>
      <TouchableOpacity onPress={onToggle} className="p-1">
        <Ionicons
          name={watched ? 'checkmark-circle' : 'checkmark-circle-outline'}
          size={24}
          color={watched ? '#0ea5e9' : '#6b7280'}
        />
      </TouchableOpacity>
    </View>
  );
}
