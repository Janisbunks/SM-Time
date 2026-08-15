import { View, Text, ScrollView } from "react-native";

interface GenreBadgesProps {
  genres: Array<{ id: number; name: string }>;
}

// Map genre IDs to colors
const genreColors: Record<number, string> = {
  // Movies
  28: "bg-red-500", // Action
  12: "bg-orange-500", // Adventure
  16: "bg-pink-500", // Animation
  35: "bg-yellow-500", // Comedy
  80: "bg-gray-700", // Crime
  99: "bg-teal-500", // Documentary
  18: "bg-purple-500", // Drama
  10751: "bg-green-500", // Family
  14: "bg-indigo-500", // Fantasy
  36: "bg-amber-600", // History
  27: "bg-red-800", // Horror
  10402: "bg-fuchsia-500", // Music
  9648: "bg-slate-600", // Mystery
  10749: "bg-rose-500", // Romance
  878: "bg-blue-500", // Science Fiction
  10770: "bg-cyan-500", // TV Movie
  53: "bg-orange-700", // Thriller
  10752: "bg-stone-600", // War
  37: "bg-yellow-700", // Western

  // TV Shows
  10759: "bg-red-600", // Action & Adventure
  10762: "bg-lime-500", // Kids
  10763: "bg-sky-500", // News
  10764: "bg-emerald-500", // Reality
  10765: "bg-violet-500", // Sci-Fi & Fantasy
  10766: "bg-amber-500", // Soap
  10767: "bg-blue-600", // Talk
  10768: "bg-green-600", // War & Politics
};

export default function GenreBadges({ genres }: GenreBadgesProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
      className="mb-4"
    >
      {genres.map((genre) => {
        const colorClass = genreColors[genre.id] || "bg-gray-600";
        return (
          <View
            key={genre.id}
            className={`${colorClass} px-3 py-1.5 rounded-full`}
          >
            <Text className="text-white text-xs font-semibold">
              {genre.name}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
