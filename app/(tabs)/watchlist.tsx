import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AuthGuard from '@/components/auth/AuthGuard';
import { useCategorizedWatchlist } from '@/hooks/useCategorizedWatchlist';
import WatchlistCard from '@/components/media/WatchlistCard';
import EmptyState from '@/components/common/EmptyState';
import TabNavigation from '@/components/ui/TabNavigation';

export default function WatchlistScreen() {
  const [activeTab, setActiveTab] = useState<'shows' | 'movies'>('shows');
  const { movies, shows, isLoading } = useCategorizedWatchlist();

  const tabs = [
    { id: 'shows', label: 'Shows' },
    { id: 'movies', label: 'Movies' },
  ];

  const isEmpty =
    movies.watchlist.length === 0 &&
    movies.watched.length === 0 &&
    shows.notStarted.length === 0 &&
    shows.inProgress.length === 0 &&
    shows.finished.length === 0;

  return (
    <AuthGuard>
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="px-6 py-8">
            <Text className="text-white text-3xl font-bold mb-6">Watchlist</Text>

            {/* Tab Navigation */}
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as 'shows' | 'movies')}
            />
          </View>

          {/* Loading State */}
          {isLoading && (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#0ea5e9" />
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
              {/* Shows Tab */}
              {activeTab === 'shows' && (
                <View>
                  {/* Not Started Section */}
                  {shows.notStarted.length > 0 && (
                    <View className="mb-8">
                      <Text className="text-white text-xl font-semibold mb-4">
                        Not Started ({shows.notStarted.length})
                      </Text>
                      <FlatList
                        data={shows.notStarted}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => `show-not-started-${item.id}`}
                        renderItem={({ item }) => (
                          <WatchlistCard
                            id={item.id}
                            title={item.name}
                            posterPath={item.poster_path}
                            rating={item.vote_average}
                            onPress={() => router.push(`/show/${item.id}`)}
                          />
                        )}
                      />
                    </View>
                  )}

                  {/* In Progress Section */}
                  {shows.inProgress.length > 0 && (
                    <View className="mb-8">
                      <Text className="text-white text-xl font-semibold mb-4">
                        In Progress ({shows.inProgress.length})
                      </Text>
                      <FlatList
                        data={shows.inProgress}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => `show-in-progress-${item.id}`}
                        renderItem={({ item }) => (
                          <WatchlistCard
                            id={item.id}
                            title={item.name}
                            posterPath={item.poster_path}
                            rating={item.vote_average}
                            showProgress={true}
                            watchedCount={item.watchedCount}
                            totalCount={item.totalCount}
                            onPress={() => router.push(`/show/${item.id}`)}
                          />
                        )}
                      />
                    </View>
                  )}

                  {/* Finished Section */}
                  {shows.finished.length > 0 && (
                    <View className="mb-8">
                      <Text className="text-white text-xl font-semibold mb-4">
                        Finished ({shows.finished.length})
                      </Text>
                      <FlatList
                        data={shows.finished}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => `show-finished-${item.id}`}
                        renderItem={({ item }) => (
                          <WatchlistCard
                            id={item.id}
                            title={item.name}
                            posterPath={item.poster_path}
                            rating={item.vote_average}
                            showWatchedBadge={true}
                            onPress={() => router.push(`/show/${item.id}`)}
                          />
                        )}
                      />
                    </View>
                  )}

                  {/* Empty State for Shows Tab */}
                  {shows.notStarted.length === 0 &&
                    shows.inProgress.length === 0 &&
                    shows.finished.length === 0 && (
                      <View className="py-12">
                        <EmptyState
                          icon="tv-outline"
                          title="No shows in watchlist"
                          description="Add TV shows to your watchlist to see them here"
                        />
                      </View>
                    )}
                </View>
              )}

              {/* Movies Tab */}
              {activeTab === 'movies' && (
                <View>
                  {/* Watchlist Section */}
                  {movies.watchlist.length > 0 && (
                    <View className="mb-8">
                      <Text className="text-white text-xl font-semibold mb-4">
                        Watchlist ({movies.watchlist.length})
                      </Text>
                      <FlatList
                        data={movies.watchlist}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => `movie-watchlist-${item.id}`}
                        renderItem={({ item }) => (
                          <WatchlistCard
                            id={item.id}
                            title={item.title}
                            posterPath={item.poster_path}
                            rating={item.vote_average}
                            onPress={() => router.push(`/movie/${item.id}`)}
                          />
                        )}
                      />
                    </View>
                  )}

                  {/* Watched Section */}
                  {movies.watched.length > 0 && (
                    <View className="mb-8">
                      <Text className="text-white text-xl font-semibold mb-4">
                        Watched ({movies.watched.length})
                      </Text>
                      <FlatList
                        data={movies.watched}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => `movie-watched-${item.id}`}
                        renderItem={({ item }) => (
                          <WatchlistCard
                            id={item.id}
                            title={item.title}
                            posterPath={item.poster_path}
                            rating={item.vote_average}
                            showWatchedBadge={true}
                            onPress={() => router.push(`/movie/${item.id}`)}
                          />
                        )}
                      />
                    </View>
                  )}

                  {/* Empty State for Movies Tab */}
                  {movies.watchlist.length === 0 && movies.watched.length === 0 && (
                    <View className="py-12">
                      <EmptyState
                        icon="film-outline"
                        title="No movies in watchlist"
                        description="Add movies to your watchlist to see them here"
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </AuthGuard>
  );
}
