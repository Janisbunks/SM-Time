import { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTrending } from "@/hooks/useTrending";
import { usePopularMovies, usePopularShows } from "@/hooks/usePopular";
import MediaCard from "@/components/media/MediaCard";

export default function HomeScreen() {
  const { data: trending, isLoading: isTrendingLoading } = useTrending("week");
  const { data: popularMovies, isLoading: isMoviesLoading } =
    usePopularMovies();
  const { data: popularShows, isLoading: isShowsLoading } = usePopularShows();

  const isLoading = isTrendingLoading || isMoviesLoading || isShowsLoading;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 py-8">
          <Text className="text-white text-3xl font-bold">Discover</Text>
          <Text className="text-gray-400 text-base mt-1">
            Trending movies and shows
          </Text>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        )}

        {/* Content */}
        {!isLoading && (
          <View className="pb-8">
            {/* Trending This Week */}
            {trending?.results && trending.results.length > 0 && (
              <View className="mb-8">
                <Text className="text-white text-xl font-semibold px-6 mb-4">
                  Trending This Week ({trending.results.length})
                </Text>
                <FlatList
                  data={trending.results}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 24 }}
                  keyExtractor={(item: any) => `trending-${item.id}`}
                  renderItem={({ item }: any) => {
                    // Skip people results
                    if (item.media_type === "person") return null;

                    return (
                      <View className="mr-4">
                        <MediaCard
                          id={item.id}
                          title={
                            item.media_type === "movie" ? item.title : item.name
                          }
                          posterPath={item.poster_path}
                          rating={item.vote_average}
                          onPress={() =>
                            router.push(
                              `/${item.media_type === "movie" ? "movie" : "show"}/${item.id}`,
                            )
                          }
                        />
                      </View>
                    );
                  }}
                />
              </View>
            )}

            {/* Popular Movies */}
            {popularMovies?.results && popularMovies.results.length > 0 && (
              <View className="mb-8">
                <Text className="text-white text-xl font-semibold px-6 mb-4">
                  Popular Movies ({popularMovies.results.length})
                </Text>
                <FlatList
                  data={popularMovies.results}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 24 }}
                  keyExtractor={(item: any) => `movie-${item.id}`}
                  renderItem={({ item }: any) => (
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

            {/* Popular TV Shows */}
            {popularShows?.results && popularShows.results.length > 0 && (
              <View>
                <Text className="text-white text-xl font-semibold px-6 mb-4">
                  Popular TV Shows ({popularShows.results.length})
                </Text>
                <FlatList
                  data={popularShows.results}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 24 }}
                  keyExtractor={(item: any) => `show-${item.id}`}
                  renderItem={({ item }: any) => (
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
  );
}
