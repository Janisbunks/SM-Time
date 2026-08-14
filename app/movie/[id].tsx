import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-xl">Movie #{id}</Text>
      </View>
    </SafeAreaView>
  );
}
