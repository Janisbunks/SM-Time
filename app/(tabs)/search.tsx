import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSearch } from '@/hooks/useSearch';
import Input from '@/components/ui/Input';
import MediaCard from '@/components/media/MediaCard';
import EmptyState from '@/components/common/EmptyState';

export default function SearchScreen() {
  const { query, setQuery, results, isLoading } = useSearch();

  // Filter to only movies and shows (exclude people)
  const filteredResults = results?.results?.filter(
    (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
  ) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="flex-1">
        {/* Header & Search Input */}
        <View className="px-6 py-8">
          <Text className="text-white text-3xl font-bold mb-4">Search</Text>
          <Input
            placeholder="Search movies & shows..."
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Empty State - No Query */}
        {query.length === 0 && (
          <View className="px-6">
            <EmptyState
              icon="search-outline"
              title="Start searching"
              description="Type a movie or TV show name to find what you're looking for"
            />
          </View>
        )}

        {/* Loading State */}
        {query.length > 0 && isLoading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        )}

        {/* Empty State - No Results */}
        {query.length > 0 && !isLoading && filteredResults.length === 0 && (
          <View className="px-6">
            <EmptyState
              icon="film-outline"
              title="No results found"
              description={`We couldn't find any movies or shows matching "${query}"`}
            />
          </View>
        )}

        {/* Results */}
        {query.length > 0 && !isLoading && filteredResults.length > 0 && (
          <FlatList
            data={filteredResults}
            numColumns={2}
            columnWrapperStyle={{ gap: 16, paddingHorizontal: 24 }}
            contentContainerStyle={{ paddingBottom: 24 }}
            keyExtractor={(item: any) => `${item.media_type}-${item.id}`}
            renderItem={({ item }: any) => (
              <View className="flex-1">
                <MediaCard
                  id={item.id}
                  title={item.media_type === 'movie' ? item.title : item.name}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  onPress={() => router.push(`/${item.media_type === 'movie' ? 'movie' : 'show'}/${item.id}`)}
                />
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
