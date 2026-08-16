import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EpisodeRowProps {
  number: number;
  title: string;
  airDate?: string;
  watched?: boolean;
  onToggle?: () => void;
  stillPath?: string | null;
  runtime?: number;
  overview?: string;
  voteAverage?: number;
}

export default function EpisodeRow({
  number,
  title,
  airDate,
  watched = false,
  onToggle,
  stillPath,
  runtime,
  overview,
  voteAverage,
}: EpisodeRowProps) {
  const [expanded, setExpanded] = useState(false);
  const hasExtendedInfo = stillPath || runtime || overview || voteAverage;

  const stillUrl = stillPath ? `https://image.tmdb.org/t/p/w300${stillPath}` : null;

  return (
    <View className="border-b border-surface-border">
      <View className="flex-row items-center py-3">
        {/* Episode thumbnail (if available) */}
        {stillUrl ? (
          <TouchableOpacity
            onPress={() => hasExtendedInfo && setExpanded(!expanded)}
            activeOpacity={hasExtendedInfo ? 0.7 : 1}
          >
            <Image
              source={{ uri: stillUrl }}
              className="w-16 h-9 rounded bg-surface-card mr-3"
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : (
          <View className="w-8 mr-3">
            <Text className="text-gray-500 text-sm">{number}</Text>
          </View>
        )}

        {/* Episode info */}
        <TouchableOpacity
          onPress={() => hasExtendedInfo && setExpanded(!expanded)}
          className="flex-1"
          activeOpacity={hasExtendedInfo ? 0.7 : 1}
        >
          <View className="flex-row items-center">
            {stillUrl && (
              <Text className="text-gray-500 text-sm mr-2">{number}.</Text>
            )}
            <Text className="text-white font-medium flex-1" numberOfLines={expanded ? undefined : 1}>
              {title}
            </Text>
          </View>

          <View className="flex-row items-center mt-0.5 flex-wrap">
            {airDate && (
              <Text className="text-gray-500 text-xs mr-2">
                {new Date(airDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            )}
            {runtime && (
              <Text className="text-gray-500 text-xs mr-2">• {runtime}m</Text>
            )}
            {voteAverage !== undefined && voteAverage > 0 && (
              <Text className="text-yellow-500 text-xs">★ {voteAverage.toFixed(1)}</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Watched toggle */}
        <TouchableOpacity onPress={onToggle} className="p-1 ml-2">
          <Ionicons
            name={watched ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={24}
            color={watched ? '#0ea5e9' : '#6b7280'}
          />
        </TouchableOpacity>

        {/* Expand indicator */}
        {hasExtendedInfo && overview && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)} className="p-1 ml-1">
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#6b7280"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Expanded overview */}
      {expanded && overview && (
        <View className="pb-3 pr-3 pl-3">
          <Text className="text-gray-400 text-sm leading-5">{overview}</Text>
        </View>
      )}
    </View>
  );
}
