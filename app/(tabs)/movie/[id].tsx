import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import {
  useMovieDetail,
  useMovieCredits,
  useMovieVideos,
} from "@/hooks/useMovieDetail";
import {
  useSimilarMovies,
  useRecommendedMovies,
} from "@/hooks/useSimilarContent";
import { LinearGradient } from "expo-linear-gradient";
import GenreBadges from "@/components/media/GenreBadges";
import TrailerCard from "@/components/media/TrailerCard";
import MediaCard from "@/components/media/MediaCard";
import MediaActionButtons from "@/components/media/MediaActionButtons";

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  }
  return `$${amount.toLocaleString()}`;
};

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = parseInt(id!);

  // Main data
  const { data: movie, isLoading, error } = useMovieDetail(movieId);
  const { data: credits } = useMovieCredits(movieId);
  const { data: videos } = useMovieVideos(movieId);

  // Additional data (lazy loaded for performance)
  const { data: similarMovies } = useSimilarMovies(movieId);
  const { data: recommendedMovies } = useRecommendedMovies(movieId);
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
          <Text className="text-white text-lg">
            Error loading movie details
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Movie not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Use backdrop for hero, fallback to poster
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  // Get all videos, prioritize trailers
  const allVideos = videos?.results || [];
  const trailers = allVideos.filter((v) => v.type === "Trailer");
  const teasers = allVideos.filter((v) => v.type === "Teaser");
  const clips = allVideos.filter((v) => v.type === "Clip");
  const videosToShow = [...trailers, ...teasers, ...clips].slice(0, 5);

  // Get top cast members
  const cast = credits?.cast?.slice(0, 10) || [];

  // Get crew members (Director, Writer, Producer)
  const director = credits?.crew?.find((c) => c.job === "Director");
  const writers = credits?.crew
    ?.filter((c) => c.job === "Screenplay" || c.job === "Writer")
    .slice(0, 2);

  // Get similar/recommended content
  const recommended = recommendedMovies?.results?.slice(0, 10) || [];
  const similar = similarMovies?.results?.slice(0, 10) || [];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1">
        {/* Hero Section - Backdrop with Poster Overlay */}
        <View className="relative h-80">
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
                style={{
                  textShadowColor: "rgba(0,0,0,0.9)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}
              >
                {movie.title}
              </Text>
              {movie.tagline && (
                <Text
                  className="text-gray-100 text-xs italic mb-1"
                  numberOfLines={2}
                  style={{
                    textShadowColor: "rgba(0,0,0,0.8)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
                  }}
                >
                  "{movie.tagline}"
                </Text>
              )}
              <View className="flex-row items-center flex-wrap">
                {movie.release_date && (
                  <Text
                    className="text-white text-sm mr-2"
                    style={{
                      textShadowColor: "rgba(0,0,0,0.8)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 3,
                    }}
                  >
                    {new Date(movie.release_date).getFullYear()}
                  </Text>
                )}
                {movie.runtime && (
                  <Text
                    className="text-white text-sm mr-2"
                    style={{
                      textShadowColor: "rgba(0,0,0,0.8)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 3,
                    }}
                  >
                    • {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </Text>
                )}
                {movie.vote_average > 0 && (
                  <Text
                    className="text-yellow-300 text-sm font-semibold"
                    style={{
                      textShadowColor: "rgba(0,0,0,0.9)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 3,
                    }}
                  >
                    • ⭐ {movie.vote_average.toFixed(1)}
                  </Text>
                )}
                {movie.vote_count && (
                  <Text className="text-gray-400 text-[8px] ml-1">
                    ({movie.vote_count.toLocaleString()})
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <MediaActionButtons mediaId={movieId} mediaType="movie" />

        {/* Overview Section */}
        <View className="px-4 pb-4">
          {movie.genres && movie.genres.length > 0 && (
            <GenreBadges genres={movie.genres} />
          )}
          <Text className="text-white text-base leading-6">
            {movie.overview}
          </Text>
        </View>

        {/* Budget & Revenue */}
        {(movie.budget || movie.revenue) && (
          <View className="px-4 pb-4">
            <View className="flex-row gap-4">
              {movie.budget && movie.budget > 0 && (
                <View className="flex-1 bg-surface-card rounded-lg p-3">
                  <Text className="text-gray-400 text-xs mb-1">Budget</Text>
                  <Text className="text-white text-lg font-semibold">
                    {formatCurrency(movie.budget)}
                  </Text>
                </View>
              )}
              {movie.revenue && movie.revenue > 0 && (
                <View className="flex-1 bg-surface-card rounded-lg p-3">
                  <Text className="text-gray-400 text-xs mb-1">Box Office</Text>
                  <Text className="text-white text-lg font-semibold">
                    {formatCurrency(movie.revenue)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Crew Section */}
        {(director || (writers && writers.length > 0)) && (
          <View className="px-4 pb-4">
            <Text className="text-white text-xl font-semibold mb-3">Crew</Text>
            <View className="flex-row flex-wrap gap-3">
              {director && (
                <View className="bg-surface-card rounded-lg p-3 flex-1 min-w-[45%]">
                  <Text className="text-gray-400 text-xs mb-1">Director</Text>
                  <Text className="text-white text-sm font-medium">
                    {director.name}
                  </Text>
                </View>
              )}
              {writers &&
                writers.map((writer) => (
                  <View
                    key={writer.id}
                    className="bg-surface-card rounded-lg p-3 flex-1 min-w-[45%]"
                  >
                    <Text className="text-gray-400 text-xs mb-1">
                      {writer.job}
                    </Text>
                    <Text className="text-white text-sm font-medium">
                      {writer.name}
                    </Text>
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

        {/* Videos Section (Trailers, Teasers, Clips) */}
        {videosToShow.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-xl font-semibold px-4 mb-3">
              Videos
            </Text>
            <FlatList
              data={videosToShow}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="mr-4 w-72">
                  <TrailerCard video={item} />
                </View>
              )}
            />
          </View>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-xl font-semibold px-4 mb-3">
              Similar Movies
            </Text>
            <FlatList
              data={similar}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item: any) => `similar-${item.id}`}
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

        {/* Recommended Movies */}
        {recommended.length > 0 && (
          <View className="mb-6">
            <Text className="text-white text-xl font-semibold px-4 mb-3">
              You Might Also Like
            </Text>
            <FlatList
              data={recommended}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item: any) => `recommended-${item.id}`}
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
      </ScrollView>
    </SafeAreaView>
  );
}
