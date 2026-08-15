import { View, Text, ScrollView, Image, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useShowDetail, useShowCredits, useShowVideos } from '@/hooks/useShowDetail';
import { LinearGradient } from 'expo-linear-gradient';
import MediaActionButtons from '@/components/media/MediaActionButtons';

export default function ShowDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: show, isLoading, error } = useShowDetail(parseInt(id!));
  const { data: credits } = useShowCredits(parseInt(id!));
  const { data: videos } = useShowVideos(parseInt(id!));

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

  // Get official trailer
  const trailer = videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  ) || videos?.results?.[0];

  // Get top cast members
  const cast = credits?.cast?.slice(0, 10) || [];

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
        <MediaActionButtons mediaId={parseInt(id!)} mediaType="tv" />

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

        {/* Trailer Section */}
        {trailer && (
          <View className="px-4 mb-6">
            <Text className="text-white text-xl font-semibold mb-3">
              Trailer
            </Text>
            <View className="bg-surface-card rounded-lg p-4">
              <Text className="text-white text-base mb-2">{trailer.name}</Text>
              <Text className="text-sky-400 text-sm">
                Watch on YouTube →
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
