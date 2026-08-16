import { useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useShowDetail, useShowCredits, useShowVideos, useShowSeason } from '@/hooks/useShowDetail';
import { useSimilarShows, useRecommendedShows } from '@/hooks/useSimilarContent';
import { useEpisodeTracker } from '@/hooks/useEpisodeTracker';
import { LinearGradient } from 'expo-linear-gradient';
import MediaActionButtons from '@/components/media/MediaActionButtons';
import GenreBadges from '@/components/media/GenreBadges';
import TrailerCard from '@/components/media/TrailerCard';
import MediaCard from '@/components/media/MediaCard';
import EpisodeRow from '@/components/media/EpisodeRow';

export default function ShowDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const showId = parseInt(id!);

  const { data: show, isLoading, error } = useShowDetail(showId);
  const { data: credits } = useShowCredits(showId);
  const { data: videos } = useShowVideos(showId);
  const { data: similarShows } = useSimilarShows(showId);
  const { data: recommendedShows } = useRecommendedShows(showId);
  const { watchedEpisodes, toggleEpisode, markSeasonAsWatched, unmarkSeasonAsWatched } = useEpisodeTracker(showId);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Error loading show details</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!show) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Show not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Use backdrop for hero, fallback to poster
  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : null;

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : null;

  // Get multiple videos (trailers, teasers, clips)
  const videoList = videos?.results
    ?.filter((v: any) => v.site === "YouTube" && ["Trailer", "Teaser", "Clip"].includes(v.type))
    .slice(0, 5) || [];

  // Get top cast members
  const cast = credits?.cast?.slice(0, 10) || [];

  // Get crew (creators/showrunners)
  const creators = show?.created_by || [];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1">
        {/* Hero Section - Backdrop with Poster Overlay */}
        <View className="relative h-80">
          {/* Backdrop Image */}
          {backdropUrl && (
            <Image
              source={{ uri: backdropUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          )}

          {/* Gradient Overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.85)", "rgba(17,24,39,1)"]}
            className="absolute inset-0"
          />

          {/* Poster + Title Overlay */}
          <View className="absolute bottom-0 left-0 right-0 p-4 flex-row">
            {/* Poster Thumbnail */}
            {posterUrl && (
              <Image
                source={{ uri: posterUrl }}
                className="w-24 h-36 rounded-lg"
                resizeMode="cover"
              />
            )}

            {/* Title and Metadata */}
            <View className="ml-4 flex-1 justify-end pb-1">
              <Text
                className="text-white text-2xl font-bold mb-1"
                style={{ textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 }}
              >
                {show.name}
              </Text>
              <View className="flex-row items-center flex-wrap">
                {show.first_air_date && (
                  <Text
                    className="text-white text-sm mr-2"
                    style={{ textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 3 }}
                  >
                    {new Date(show.first_air_date).getFullYear()}
                  </Text>
                )}
                {show.number_of_seasons && (
                  <Text
                    className="text-white text-sm mr-2"
                    style={{ textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 3 }}
                  >
                    • {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}
                  </Text>
                )}
                {show.vote_average > 0 && (
                  <Text
                    className="text-yellow-300 text-sm font-semibold"
                    style={{ textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 3 }}
                  >
                    • ⭐ {show.vote_average.toFixed(1)}
                  </Text>
                )}
              </View>
              {show.status && (
                <Text
                  className="text-gray-100 text-xs mt-1"
                  style={{ textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 3 }}
                >
                  {show.status}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <MediaActionButtons mediaId={showId} mediaType="tv" />

        {/* Genre Badges */}
        {show.genres && show.genres.length > 0 && (
          <View className="px-4 mt-4">
            <GenreBadges genres={show.genres} />
          </View>
        )}

        {/* Overview Section */}
        <View className="px-4 py-6">
          <Text className="text-white text-base leading-6">
            {show.overview}
          </Text>
          {show.vote_count && (
            <Text className="text-gray-400 text-sm mt-2">
              Based on {show.vote_count.toLocaleString()} votes
            </Text>
          )}
        </View>

        {/* Creators Section */}
        {creators.length > 0 && (
          <View className="px-4 pb-6">
            <Text className="text-white text-xl font-semibold mb-3">
              Created By
            </Text>
            <View className="flex-row flex-wrap">
              {creators.map((creator: any) => (
                <View key={creator.id} className="mr-4 mb-2">
                  <Text className="text-white text-base">{creator.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Cast Section */}
        {cast.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-xl font-semibold px-4 mb-3">
              Cast
            </Text>
            <FlatList
              data={cast}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item: any) => item.id.toString()}
              renderItem={({ item }: any) => (
                <View className="mr-4 w-24">
                  {item.profile_path ? (
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w185${item.profile_path}`,
                      }}
                      className="w-24 h-24 rounded-full bg-surface-card"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-24 h-24 rounded-full bg-surface-card items-center justify-center">
                      <Text className="text-gray-500 text-3xl">👤</Text>
                    </View>
                  )}
                  <Text
                    className="text-white text-sm font-medium mt-2 text-center"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text
                    className="text-gray-400 text-xs text-center"
                    numberOfLines={2}
                  >
                    {item.character}
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        {/* Videos Section */}
        {videoList.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-xl font-semibold px-4 mb-3">
              Videos
            </Text>
            <FlatList
              data={videoList}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }: any) => (
                <View className="mr-3 w-80">
                  <TrailerCard video={item} />
                </View>
              )}
            />
          </View>
        )}

        {/* Seasons & Episodes */}
        {show.seasons && show.seasons.length > 0 && (
          <View className="px-4 mb-6">
            <Text className="text-white text-xl font-semibold mb-3">
              Seasons
            </Text>
            {show.seasons
              .filter((season: any) => season.season_number > 0) // Skip "Specials" (season 0)
              .map((season: any) => (
                <SeasonAccordionWrapper
                  key={season.id}
                  showId={showId}
                  season={season}
                  watchedEpisodes={watchedEpisodes}
                  onToggleEpisode={(epId) => toggleEpisode.mutate(epId)}
                  onMarkSeasonWatched={(epIds) => markSeasonAsWatched.mutate(epIds)}
                  onUnmarkSeasonWatched={(epIds) => unmarkSeasonAsWatched.mutate(epIds)}
                />
              ))}
          </View>
        )}

        {/* Similar Shows */}
        {similarShows?.results && similarShows.results.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-xl font-semibold px-4 mb-3">
              Similar Shows
            </Text>
            <FlatList
              data={similarShows.results.slice(0, 10)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item: any) => item.id.toString()}
              renderItem={({ item }: any) => (
                <MediaCard
                  id={item.id}
                  title={item.name || item.title}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  onPress={() => router.push(`/show/${item.id}`)}
                />
              )}
            />
          </View>
        )}

        {/* Recommended Shows */}
        {recommendedShows?.results && recommendedShows.results.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-xl font-semibold px-4 mb-3">
              Recommended
            </Text>
            <FlatList
              data={recommendedShows.results.slice(0, 10)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item: any) => item.id.toString()}
              renderItem={({ item }: any) => (
                <MediaCard
                  id={item.id}
                  title={item.name || item.title}
                  posterPath={item.poster_path}
                  rating={item.vote_average}
                  onPress={() => router.push(`/show/${item.id}`)}
                />
              )}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Wrapper component for lazy loading season data
// This component fetches season details only when the accordion is expanded
function SeasonAccordionWrapper({
  showId,
  season,
  watchedEpisodes,
  onToggleEpisode,
  onMarkSeasonWatched,
  onUnmarkSeasonWatched,
}: {
  showId: number;
  season: any;
  watchedEpisodes: Set<number>;
  onToggleEpisode: (epId: number) => void;
  onMarkSeasonWatched: (epIds: number[]) => void;
  onUnmarkSeasonWatched: (epIds: number[]) => void;
}) {
  const [hasBeenExpanded, setHasBeenExpanded] = useState(false);
  const { data: seasonData, isLoading } = useShowSeason(showId, season.season_number, hasBeenExpanded);

  return (
    <SeasonAccordionWithLazyLoad
      seasonNumber={season.season_number}
      episodeCount={season.episode_count}
      episodes={seasonData?.episodes || []}
      watchedEpisodeIds={watchedEpisodes}
      onToggleEpisode={onToggleEpisode}
      onMarkSeasonWatched={onMarkSeasonWatched}
      onUnmarkSeasonWatched={onUnmarkSeasonWatched}
      onExpand={() => setHasBeenExpanded(true)}
      isLoading={isLoading}
    />
  );
}

// Enhanced SeasonAccordion that handles expansion state
function SeasonAccordionWithLazyLoad({
  seasonNumber,
  episodeCount,
  episodes,
  watchedEpisodeIds,
  onToggleEpisode,
  onMarkSeasonWatched,
  onUnmarkSeasonWatched,
  onExpand,
  isLoading,
}: {
  seasonNumber: number;
  episodeCount: number;
  episodes: any[];
  watchedEpisodeIds: Set<number>;
  onToggleEpisode: (epId: number) => void;
  onMarkSeasonWatched: (epIds: number[]) => void;
  onUnmarkSeasonWatched: (epIds: number[]) => void;
  onExpand: () => void;
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    if (!expanded) {
      onExpand(); // Trigger data fetch
    }
    setExpanded(!expanded);
  };

  // Check if all episodes are watched
  const allWatched = episodes.length > 0 && episodes.every((ep: any) => watchedEpisodeIds.has(ep.id));
  const someWatched = episodes.some((ep: any) => watchedEpisodeIds.has(ep.id));

  const handleMarkAll = () => {
    const episodeIds = episodes.map((ep: any) => ep.id);
    if (allWatched) {
      onUnmarkSeasonWatched(episodeIds);
    } else {
      onMarkSeasonWatched(episodeIds);
    }
  };

  return (
    <View className="mb-2">
      <TouchableOpacity
        onPress={handleToggle}
        className="flex-row items-center justify-between bg-surface-card rounded-xl px-4 py-3"
      >
        <Text className="text-white font-semibold">Season {seasonNumber}</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-gray-500 text-sm">{episodeCount} episodes</Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#6b7280"
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View className="px-4">
          {isLoading ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : episodes.length > 0 ? (
            <>
              {/* Mark All Button */}
              <View className="py-2 border-b border-gray-700">
                <TouchableOpacity
                  onPress={handleMarkAll}
                  className="flex-row items-center justify-between py-2"
                >
                  <Text className="text-brand-400 text-sm font-semibold">
                    {allWatched ? 'Unmark All as Watched' : 'Mark All as Watched'}
                  </Text>
                  <Ionicons
                    name={allWatched ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={20}
                    color={allWatched ? '#10b981' : '#6b7280'}
                  />
                </TouchableOpacity>
              </View>

              {/* Episode List */}
              {episodes.map((ep: any) => (
                <EpisodeRow
                  key={ep.id}
                  number={ep.episode_number}
                  title={ep.name}
                  airDate={ep.air_date}
                  watched={watchedEpisodeIds.has(ep.id)}
                  onToggle={() => onToggleEpisode(ep.id)}
                  stillPath={ep.still_path}
                  runtime={ep.runtime}
                  overview={ep.overview}
                  voteAverage={ep.vote_average}
                />
              ))}
            </>
          ) : (
            <Text className="text-gray-400 text-sm py-4">No episodes available</Text>
          )}
        </View>
      )}
    </View>
  );
}
