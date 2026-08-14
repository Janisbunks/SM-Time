import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  description?: string;
}

export default function EmptyState({ icon = 'sad-outline', title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons name={icon} size={64} color="#374151" />
      <Text className="text-white text-lg font-semibold mt-4 text-center">{title}</Text>
      {description && (
        <Text className="text-gray-500 text-sm mt-2 text-center">{description}</Text>
      )}
    </View>
  );
}
