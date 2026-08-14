import { View, Text, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AuthGuard from '@/components/auth/AuthGuard';
import { useWatchlistWithDetails } from '@/hooks/useWatchlistWithDetails';
import MediaCard from '@/components/media/MediaCard';
import EmptyState from '@/components/common/EmptyState';
import { posterUrl } from '@/services/tmdb';

export default function WatchlistScreen() {
  const { movies, shows, isLoading, isEmpty } = useWatchlistWithDetails();

  return (
    <AuthGuard>
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="px-6 py-8">
            <Text className="text-white text-3xl font-bold">Watchlist</Text>
          </View>

          {/* Loading State */}
          {isLoading && (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          )}

          {/* Empty State */}
          {!isLoading && isEmpty && (
            <View className="px-6">
              <EmptyState
                icon="bookmark-outline"
                title="Your watchlist is empty"
                description="Start adding movies and shows to track what you want to watch"
              />
            </View>
          )}

          {/* Content */}
          {!isLoading && !isEmpty && (
            <View className="px-6 pb-8">
              {/* Movies Section */}
              {movies.length > 0 && (
                <View className="mb-8">
                  <Text className="text-white text-xl font-semibold mb-4">
                    Movies ({movies.length})
                  </Text>
                  <FlatList
                    data={movies}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => `movie-${item.id}`}
                    renderItem={({ item }) => (
                      <View className="mr-4">
                        <MediaCard
                          id={item.id}
                          title={item.title}
                          posterPath={item.poster_path}
                          rating={item.vote_average}
                          onPress={() => router.push(`/movie/${item.id}`)}
                        />
                      </View>
                    )}
                  />
                </View>
              )}

              {/* TV Shows Section */}
              {shows.length > 0 && (
                <View>
                  <Text className="text-white text-xl font-semibold mb-4">
                    TV Shows ({shows.length})
                  </Text>
                  <FlatList
                    data={shows}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => `show-${item.id}`}
                    renderItem={({ item }) => (
                      <View className="mr-4">
                        <MediaCard
                          id={item.id}
                          title={item.name}
                          posterPath={item.poster_path}
                          rating={item.vote_average}
                          onPress={() => router.push(`/show/${item.id}`)}
                        />
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </AuthGuard>
  );
}
