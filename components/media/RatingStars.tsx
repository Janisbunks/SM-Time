import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingStarsProps {
  value: number;
  max?: number;
  size?: number;
  onChange?: (rating: number) => void;
}

export default function RatingStars({ value, max = 5, size = 24, onChange }: RatingStarsProps) {
  return (
    <View className="flex-row gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange?.(star)} disabled={!onChange}>
          <Ionicons
            name={star <= value ? 'star' : 'star-outline'}
            size={size}
            color={star <= value ? '#f59e0b' : '#6b7280'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
