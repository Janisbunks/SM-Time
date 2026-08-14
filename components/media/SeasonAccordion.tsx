import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EpisodeRow from './EpisodeRow';

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  air_date?: string;
}

interface SeasonAccordionProps {
  seasonNumber: number;
  episodeCount: number;
  episodes?: Episode[];
  watchedEpisodeIds?: Set<number>;
  onToggleEpisode?: (episodeId: number) => void;
}

export default function SeasonAccordion({
  seasonNumber,
  episodeCount,
  episodes = [],
  watchedEpisodeIds = new Set(),
  onToggleEpisode,
}: SeasonAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="mb-2">
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
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

      {expanded && episodes.length > 0 && (
        <View className="px-4">
          {episodes.map((ep) => (
            <EpisodeRow
              key={ep.id}
              number={ep.episode_number}
              title={ep.name}
              airDate={ep.air_date}
              watched={watchedEpisodeIds.has(ep.id)}
              onToggle={() => onToggleEpisode?.(ep.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
